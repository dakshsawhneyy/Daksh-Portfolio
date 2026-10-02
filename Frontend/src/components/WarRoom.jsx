import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BellRing, Check, ExternalLink, FileText, Gauge, RotateCcw, ScrollText, Siren, X, Boxes } from 'lucide-react'
import '../styles/war-room.css'

/* ══════════════════════════════════════════════════════════════════
   WAR ROOM — Incident Zero, playable in miniature.
   page → acknowledge (timed) → clues → pick the root cause →
   mitigation → recovery wave → scorecard.
   No per-frame JS: the heartbeat is a CSS-translated SVG, the blast
   radius uses CSS transitions with staggered delays.
   ══════════════════════════════════════════════════════════════════ */

const SCENARIOS = [
  {
    id: 'dns', name: 'DNS failure', sev: 'SEV-1', svc: 'coredns',
    page: 'Service lookups timing out across the cluster',
    deps: ['api-gateway', 'checkout', 'auth', 'payments', 'search', 'cart'],
    clues: [
      { k: 'logs', Icon: ScrollText, t: 'api-gateway: dial tcp: lookup payments.svc.cluster.local: no such host' },
      { k: 'metrics', Icon: Gauge, t: 'coredns_dns_responses_total{rcode="NXDOMAIN"} ↑ 4,200% in 3 min' },
      { k: 'events', Icon: Boxes, t: 'ConfigMap/coredns updated 6 min ago by ci-bot (commit a41f9e)' },
    ],
    options: ['Node network policy blocking port 53', 'Typo in the CoreDNS ConfigMap stub-domain block', 'Payments service crashed'],
    answer: 1,
    fix: ['git revert a41f9e', 'argocd app sync coredns', 'kubectl rollout restart deploy/coredns -n kube-system'],
  },
  {
    id: 'crashloop', name: 'CrashLoopBackOff', sev: 'SEV-2', svc: 'checkout',
    page: 'checkout pods restarting · 14 restarts in 5 min',
    deps: ['api-gateway', 'cart', 'payments', 'orders', 'email', 'search'],
    clues: [
      { k: 'logs', Icon: ScrollText, t: 'Error: env DB_CONNECTION_STRING is not defined (exit 1)' },
      { k: 'metrics', Icon: Gauge, t: 'kube_pod_container_status_restarts_total ↑ steadily since 14:02' },
      { k: 'events', Icon: Boxes, t: 'Deployment/checkout rolled out v3.8.0 at 14:01 (secret ref renamed)' },
    ],
    options: ['Missing env var after a secret was renamed', 'Node ran out of disk', 'Liveness probe too aggressive'],
    answer: 0,
    fix: ['kubectl patch secret checkout-db --type merge', 'helm upgrade checkout --reuse-values', 'kubectl rollout status deploy/checkout'],
  },
  {
    id: 'oom', name: 'OOMKilled', sev: 'SEV-2', svc: 'worker',
    page: 'worker pods killed under load · exit 137',
    deps: ['queue', 'orders', 'email', 'reports', 'search', 'api-gateway'],
    clues: [
      { k: 'logs', Icon: ScrollText, t: 'cache: 1.84M entries, no eviction policy configured' },
      { k: 'metrics', Icon: Gauge, t: 'container_memory_working_set_bytes pinned at the 512Mi limit' },
      { k: 'events', Icon: Boxes, t: 'Pod/worker-7f9c OOMKilled ×6 (last 10 min)' },
    ],
    options: ['CPU throttling', 'Unbounded in-memory cache in the worker', 'Kafka consumer lag'],
    answer: 1,
    fix: ['set cache max-size=50k (LRU)', 'resources.limits.memory: 768Mi', 'kubectl rollout restart deploy/worker'],
  },
  {
    id: 'pool', name: 'DB pool exhausted', sev: 'SEV-1', svc: 'postgres',
    page: 'API 5xx spike · connection pool = 0',
    deps: ['api-gateway', 'orders', 'auth', 'payments', 'reports', 'cart'],
    clues: [
      { k: 'logs', Icon: ScrollText, t: 'FATAL: remaining connection slots are reserved (max_connections=200)' },
      { k: 'metrics', Icon: Gauge, t: 'HPA scaled api 6 → 14 pods · 20 conns per pod' },
      { k: 'events', Icon: Boxes, t: 'HorizontalPodAutoscaler/api SuccessfulRescale at 09:42' },
    ],
    options: ['Postgres disk full', 'Slow query on orders table', '14 pods × 20 conns > max_connections, no per-pod cap'],
    answer: 2,
    fix: ['DB_POOL_MAX=10 per pod', 'deploy PgBouncer (transaction pooling)', 'kubectl rollout restart deploy/api'],
  },
]

const ANGLES = [-90, -30, 30, 90, 150, 210]
const fmt = (ms) => `${(ms / 1000).toFixed(1)}s`

const WarRoom = () => {
  const [sc, setSc] = useState(SCENARIOS[0])
  const [phase, setPhase] = useState('idle') // idle | paged | investigate | fixing | resolved
  const [clues, setClues] = useState(0)
  const [wrong, setWrong] = useState([])
  const [fixStep, setFixStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [ack, setAck] = useState(null)
  const t0 = useRef(0)
  const timers = useRef([])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clearAll, [])

  // incident clock: 10 updates/s only while an incident is open
  const open = phase === 'paged' || phase === 'investigate' || phase === 'fixing'
  useEffect(() => {
    if (!open) return
    const t = setInterval(() => setElapsed(performance.now() - t0.current), 100)
    return () => clearInterval(t)
  }, [open])

  const page = (s) => {
    clearAll()
    setSc(s); setPhase('paged'); setClues(0); setWrong([]); setFixStep(0); setAck(null); setElapsed(0)
    t0.current = performance.now()
  }
  const acknowledge = () => {
    if (phase !== 'paged') return
    setAck(performance.now() - t0.current)
    setPhase('investigate')
    ;[1, 2, 3].forEach((n, i) => later(() => setClues(n), 450 + i * 650))
  }
  const choose = (i) => {
    if (phase !== 'investigate' || clues < 3) return
    if (i !== sc.answer) { setWrong(w => (w.includes(i) ? w : [...w, i])); return }
    setPhase('fixing')
    sc.fix.forEach((_, k) => later(() => setFixStep(k + 1), 500 + k * 700))
    later(() => { setElapsed(performance.now() - t0.current); setPhase('resolved') }, 500 + sc.fix.length * 700 + 400)
  }
  const reset = () => { clearAll(); setPhase('idle'); setClues(0); setWrong([]); setFixStep(0); setAck(null); setElapsed(0) }

  const broken = phase === 'paged' || phase === 'investigate' || (phase === 'fixing' && fixStep < sc.fix.length)
  const sevClass = sc.sev === 'SEV-1' ? 'sev1' : 'sev2'

  return (
    <div className={`wr-root is-${phase} ${broken ? 'is-broken' : ''}`}>
      {/* title bar */}
      <div className="wr-bar">
        <span className="wr-dots"><i /><i /><i /></span>
        <span className="wr-title">incidentzero.monster · on-call simulator</span>
        <a className="wr-live" href="https://incidentzero.monster" target="_blank" rel="noreferrer">open the real thing <ExternalLink size={11} /></a>
      </div>

      {/* pager banner */}
      <div className="wr-banner" aria-live="assertive">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div key="idle" className="wr-banner-in is-quiet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="wr-quiet-dot" /> All quiet. Pick an incident below and put yourself on call.
            </motion.div>
          )}
          {open && (
            <motion.div key="open" className={`wr-banner-in is-alert ${sevClass}`} initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}>
              <Siren size={16} />
              <b>{sc.sev}</b>
              <span className="wr-banner-txt">{sc.svc} · {sc.page}</span>
              <span className="wr-clock">{fmt(elapsed)}</span>
            </motion.div>
          )}
          {phase === 'resolved' && (
            <motion.div key="ok" className="wr-banner-in is-ok" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Check size={16} /> <b>RESOLVED</b> <span className="wr-banner-txt">{sc.name} · postmortem filed</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="wr-main">
        {/* left: blast radius + heartbeat */}
        <div className="wr-viz">
          <svg className="wr-blast" viewBox="0 0 240 240" aria-hidden="true">
            <circle cx="120" cy="120" r="92" className="wr-orbit" />
            <circle cx="120" cy="120" r="56" className="wr-orbit wr-orbit-2" />
            <circle cx="120" cy="120" r="30" className="wr-shock" />
            {sc.deps.map((d, i) => {
              const a = (ANGLES[i] * Math.PI) / 180
              const x = 120 + Math.cos(a) * 92, y = 120 + Math.sin(a) * 92
              return (
                <g key={d} className="wr-dep" style={{ '--d': `${i * 90}ms` }}>
                  <line x1="120" y1="120" x2={x} y2={y} className="wr-edge" />
                  <circle cx={x} cy={y} r="13" className="wr-dep-dot" />
                  <text x={x} y={y + 27} className="wr-dep-label">{d}</text>
                </g>
              )
            })}
            <circle cx="120" cy="120" r="22" className="wr-core" />
            <text x="120" y="124" className="wr-core-label">{sc.svc}</text>
          </svg>

          <div className="wr-ecg" aria-hidden="true">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none">
              <path className="wr-ecg-ok" d="M0 30 H60 L70 30 L76 12 L84 48 L90 30 H160 L170 30 L176 12 L184 48 L190 30 H260 L270 30 L276 12 L284 48 L290 30 H360 L370 30 L376 12 L384 48 L390 30 H400" />
              <path className="wr-ecg-bad" d="M0 30 L20 18 L34 46 L46 8 L58 52 L70 22 L84 40 L98 6 L110 54 L126 26 L140 44 L152 14 L168 50 L182 20 L196 42 L208 4 L222 56 L236 24 L250 46 L266 10 L280 52 L294 22 L308 40 L320 8 L336 50 L350 26 L364 44 L378 12 L392 48 L400 30" />
            </svg>
            <span className="wr-ecg-label">{broken ? 'p99 · erratic' : 'p99 · steady 61ms'}</span>
          </div>
        </div>

        {/* right: the incident flow */}
        <div className="wr-flow">
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="pick" className="wr-pick" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <span className="wr-k">choose your incident</span>
                {SCENARIOS.map(s => (
                  <button key={s.id} type="button" className={`wr-scn ${s.sev === 'SEV-1' ? 'sev1' : 'sev2'}`} onClick={() => page(s)}>
                    <span className="wr-scn-sev">{s.sev}</span>
                    <span className="wr-scn-name">{s.name}</span>
                    <BellRing size={14} className="wr-scn-bell" />
                  </button>
                ))}
              </motion.div>
            )}

            {phase === 'paged' && (
              <motion.div key="ack" className="wr-ackwrap" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }}>
                <span className="wr-k">you're on call · the pager is going off</span>
                <button type="button" className="wr-ack" onClick={acknowledge} autoFocus>
                  <BellRing size={22} /> Acknowledge
                </button>
                <span className="wr-ack-hint">every second counts towards MTTR</span>
              </motion.div>
            )}

            {(phase === 'investigate' || phase === 'fixing') && (
              <motion.div key="inv" className="wr-inv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span className="wr-k">acked in {fmt(ack)} · {phase === 'fixing' ? 'mitigating' : 'investigate'}</span>
                <div className="wr-clues">
                  {sc.clues.map((c, i) => (
                    <AnimatePresence key={c.k}>
                      {clues > i && (
                        <motion.div className="wr-clue" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .35 }}>
                          <span className="wr-clue-k"><c.Icon size={12} /> {c.k}</span>
                          <code>{c.t}</code>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                  {clues < 3 && <div className="wr-gathering"><i /><i /><i /> gathering signals</div>}
                </div>

                {phase === 'investigate' && clues >= 3 && (
                  <motion.div className="wr-rca" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="wr-k">what's the root cause?</span>
                    {sc.options.map((o, i) => (
                      <motion.button key={o} type="button" className={`wr-opt ${wrong.includes(i) ? 'is-wrong' : ''}`}
                        onClick={() => choose(i)} disabled={wrong.includes(i)}
                        animate={wrong.includes(i) ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: .4 }}>
                        <span className="wr-opt-n">{String.fromCharCode(65 + i)}</span>{o}
                        {wrong.includes(i) && <X size={14} className="wr-opt-x" />}
                      </motion.button>
                    ))}
                    {wrong.length > 0 && <p className="wr-hint">Not quite. Re-read the <b>events</b> clue: what changed right before it broke?</p>}
                  </motion.div>
                )}

                {phase === 'fixing' && (
                  <div className="wr-fix">
                    {sc.fix.map((f, i) => (
                      <div key={f} className={`wr-fix-line ${fixStep > i ? 'is-done' : fixStep === i ? 'is-run' : ''}`}>
                        <span>{fixStep > i ? '✓' : fixStep === i ? '›' : '·'}</span><code>$ {f}</code>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {phase === 'resolved' && (
              <motion.div key="score" className="wr-score" initial={{ opacity: 0, scale: .92, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <span className="wr-k">postmortem · {sc.name}</span>
                <div className="wr-score-grid">
                  <div><small>acked in</small><b>{fmt(ack)}</b></div>
                  <div><small>time to resolve</small><b>{fmt(elapsed)}</b></div>
                  <div><small>diagnosis</small><b>{wrong.length === 0 ? 'first try' : `${wrong.length + 1} tries`}</b></div>
                </div>
                <p className="wr-score-rca"><FileText size={13} /> Root cause: {sc.options[sc.answer]}.</p>
                <div className="wr-score-actions">
                  <button type="button" className="wr-btn" onClick={reset}><RotateCcw size={14} /> Take another page</button>
                  <a className="wr-btn wr-btn-hot" href="https://incidentzero.monster" target="_blank" rel="noreferrer">Train on Incident Zero <ExternalLink size={13} /></a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default WarRoom
