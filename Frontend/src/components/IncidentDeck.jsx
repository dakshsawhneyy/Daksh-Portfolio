import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { RotateCcw, MemoryStick, Globe2, Database, Activity, Shuffle, ArrowUpRight, Hand } from 'lucide-react'
import '../styles/incident-deck.css'

/* ══════════════════════════════════════════════════════════════════
   INCIDENT DECK — "Reliability is a feedback loop."
   Five real failure modes (Incident Zero) as playing cards, fanned
   like a hand. Pick one: it flies to the table and flips to its
   postmortem (observe → investigate → recover, MTTR stamp).
   Zero per-frame work: only one-shot layout/flip transitions and a
   CSS-var sheen on the hovered card.
   ══════════════════════════════════════════════════════════════════ */

const CARDS = [
  {
    id: 'crashloop', name: 'CrashLoopBackOff', sev: 'SEV-2', Icon: RotateCcw, color: '#e8674a',
    signal: '14 restarts / 5 min on app-pod',
    observe: 'Restart-rate alert fires from kube-state-metrics within 40s.',
    investigate: 'kubectl logs --previous → missing env var DB_CONNECTION_STRING.',
    recover: 'Secret wired through Helm values, rollout restart, alert clears.',
    mttr: '4m',
  },
  {
    id: 'oom', name: 'OOMKilled', sev: 'SEV-2', Icon: MemoryStick, color: '#f0bc62',
    signal: 'exit 137 under load on worker-pod',
    observe: 'OOMKilled events + working-set pinned at the memory limit.',
    investigate: 'Heap profile shows an unbounded in-memory cache in the worker.',
    recover: 'Cache bounded, limit 512→768Mi, VPA recommendations enabled.',
    mttr: '9m',
  },
  {
    id: 'dns', name: 'DNS Failure', sev: 'SEV-1', Icon: Globe2, color: '#65cfe5',
    signal: 'service lookups timing out cluster-wide',
    observe: 'p99 spike + NXDOMAIN storm on the CoreDNS dashboard.',
    investigate: 'Typo in the CoreDNS ConfigMap stub-domain block.',
    recover: 'ConfigMap reverted via GitOps; ArgoCD sync, lookups healthy.',
    mttr: '6m',
  },
  {
    id: 'dbpool', name: 'DB Pool Exhausted', sev: 'SEV-1', Icon: Database, color: '#8784d2',
    signal: 'connection pool = 0 on postgres',
    observe: '5xx rate + pool wait-time alert on the API.',
    investigate: '14 pods × 20 conns > max_connections; no per-pod limit.',
    recover: 'Per-pod pool limit + PgBouncer in front of Postgres.',
    mttr: '12m',
  },
  {
    id: 'latency', name: 'Latency Spike', sev: 'SEV-2', Icon: Activity, color: '#72dfac',
    signal: 'p99 4.2s — SLO breach on api-gateway',
    observe: 'Fast-burn SLO alert: 14× error-budget burn rate.',
    investigate: 'HPA target at 90% CPU scaled too late; pods undersized.',
    recover: 'HPA target 60%, requests resized, scaled 6 → 14 pods.',
    mttr: '7m',
  },
]

const sheen = (e) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--sx', `${((e.clientX - r.left) / r.width) * 100}%`)
  el.style.setProperty('--sy', `${((e.clientY - r.top) / r.height) * 100}%`)
}

const CardFace = ({ card, n }) => (
  <div className="dk-face dk-front" style={{ '--c': card.color }}>
    <span className="dk-corner dk-corner-tl"><b>{card.sev}</b><card.Icon size={14} /></span>
    <span className="dk-corner dk-corner-br"><b>{card.sev}</b><card.Icon size={14} /></span>
    <div className="dk-emblem"><card.Icon size={34} strokeWidth={1.6} /></div>
    <strong className="dk-name">{card.name}</strong>
    <span className="dk-signal">{card.signal}</span>
    <span className="dk-n">{String(n + 1).padStart(2, '0')} / {String(CARDS.length).padStart(2, '0')}</span>
    <span className="dk-sheen" aria-hidden="true" />
  </div>
)

const CardBack = ({ card }) => (
  <div className="dk-face dk-back" style={{ '--c': card.color }}>
    <span className="dk-back-k">postmortem · {card.sev}</span>
    <strong className="dk-back-t">{card.name}</strong>
    <ol className="dk-steps">
      <li><i className="o" /><b>Observe</b><span>{card.observe}</span></li>
      <li><i className="i" /><b>Investigate</b><span>{card.investigate}</span></li>
      <li><i className="r" /><b>Recover</b><span>{card.recover}</span></li>
    </ol>
    <span className="dk-stamp">resolved · MTTR {card.mttr}</span>
  </div>
)

const IncidentDeck = () => {
  const [order, setOrder] = useState(CARDS.map((_, i) => i))
  const [picked, setPicked] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const shuffles = useRef(0)

  const hand = order.filter(i => i !== picked)
  const avgMttr = useMemo(() => (CARDS.reduce((a, c) => a + parseInt(c.mttr, 10), 0) / CARDS.length).toFixed(1), [])

  const pick = (i) => {
    setFlipped(false)
    setPicked(i)
    setTimeout(() => setFlipped(true), 420)   // land first, then flip
  }
  const shuffle = () => {
    shuffles.current++
    setPicked(null)
    setFlipped(false)
    setOrder(o => {
      const a = [...o]
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
      return a
    })
  }

  const n = hand.length
  return (
    <section className="dk-root" aria-label="Incident deck">
      <div className="dk-inner">
        <header className="dk-head">
          <div>
            <p className="dk-eyebrow">How I think</p>
            <h2 className="dk-h2">Reliability is a <em>feedback loop.</em></h2>
          </div>
          <p className="dk-sub">
            Five real failures I rebuilt in Incident Zero. Pick a card: it lands on the table and turns over
            to show how the loop closed: observe, investigate, recover.
          </p>
        </header>

        <LayoutGroup>
          <div className="dk-stage">
            {/* the hand */}
            <div className="dk-hand" style={{ '--n': n }}>
              {hand.map((i, k) => {
                const card = CARDS[i]
                const mid = (n - 1) / 2
                const off = k - mid
                return (
                  <motion.button
                    key={card.id}
                    layoutId={`dk-${card.id}`}
                    type="button"
                    className="dk-card dk-in-hand"
                    style={{ '--rot': `${off * 7}deg`, '--lift': `${Math.abs(off) * Math.abs(off) * 6}px`, '--k': k, zIndex: k }}
                    onClick={() => pick(i)}
                    onPointerMove={sheen}
                    initial={{ opacity: 0, y: 120, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26, delay: shuffles.current ? 0 : 0.08 * k }}
                    aria-label={`Play ${card.name}`}
                  >
                    <CardFace card={card} n={i} />
                  </motion.button>
                )
              })}
              {n === 0 && <span className="dk-empty">all cards on the table</span>}
            </div>

            {/* the table */}
            <div className="dk-table">
              <span className="dk-felt" aria-hidden="true" />
              <AnimatePresence mode="popLayout">
                {picked !== null ? (
                  <motion.div
                    key={CARDS[picked].id}
                    layoutId={`dk-${CARDS[picked].id}`}
                    className="dk-card dk-on-table"
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    onClick={() => setFlipped(f => !f)}
                    onPointerMove={sheen}
                  >
                    <div className={`dk-flip ${flipped ? 'is-flipped' : ''}`}>
                      <CardFace card={CARDS[picked]} n={picked} />
                      <CardBack card={CARDS[picked]} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" className="dk-slot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Hand size={22} />
                    <span>pick a card from the hand</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>

        <footer className="dk-foot">
          <span><b>{CARDS.length}</b> failure modes</span>
          <span>avg MTTR <b>{avgMttr}m</b></span>
          <span>every one ends in a written <b>RCA</b></span>
          <button type="button" className="dk-btn" onClick={shuffle}><Shuffle size={14} /> Shuffle the deck</button>
          <a className="dk-btn dk-btn-ghost" href="https://incidentzero.monster" target="_blank" rel="noreferrer">Play them live <ArrowUpRight size={14} /></a>
        </footer>
      </div>
    </section>
  )
}

export default IncidentDeck
