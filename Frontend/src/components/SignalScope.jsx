import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createSignal, SCENARIOS } from './signal/signalEngine'
import '../styles/signal-scope.css'

/* ══════════════════════════════════════════════════════════════════
   SIGNAL SCOPE — "Reliability is a feedback loop."
   Live p99 oscilloscope. Visitors inject a real-world failure, then
   watch the loop run on the graph: alert → RCA → fix → recovered.
   ══════════════════════════════════════════════════════════════════ */

const PHASES = [
  { key: 'observe', n: '01', title: 'Observe', idle: 'Watching p99 across 4 SLIs. No alerts.' },
  { key: 'investigate', n: '02', title: 'Investigate', idle: 'Logs, traces & K8s events, correlated.' },
  { key: 'recover', n: '03', title: 'Recover', idle: 'Runbooks, rollbacks, self-healing policy.' },
]
const ORDER = { idle: -1, observe: 0, investigate: 1, recover: 2, healthy: 3 }

const SignalScope = () => {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const lastActRef = useRef(Date.now())
  const [phase, setPhase] = useState({ key: 'idle', scenario: null, detail: '' })
  const [log, setLog] = useState({})
  const [stats, setStats] = useState({ v: 120, budget: 100, incidents: 0, mttr: null, breached: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lastKey = ''
    const engine = createSignal(canvas, {
      reduced,
      onPhase: (key, info) => {
        setPhase({ key, ...info })
        const sc = SCENARIOS[info.scenario]
        setLog(l => {
          if (key === 'observe') return { observe: `${sc.label} injected — watching p99…` }
          if (key === 'investigate') return { ...l, observe: `▲ ${info.detail}`, investigate: 'Correlating logs, traces and K8s events…' }
          if (key === 'recover') return { ...l, investigate: `◆ Root cause: ${sc.cause}`, recover: `Applying fix: ${sc.action}…` }
          return { ...l, recover: `✓ ${sc.action}`, done: `MTTR ${info.mttr.toFixed(1)}s · ${sc.label.toLowerCase()} handled` }
        })
      },
      onStats: (s) => {
        const k = `${s.v >> 3}|${s.budget.toFixed(1)}|${s.incidents}|${s.breached}`
        if (k !== lastKey) { lastKey = k; setStats(s) }
      },
    })
    engineRef.current = engine
    engine.resize()

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? engine.start() : engine.stop()), { rootMargin: '80px' })
    io.observe(canvas)
    const ro = new ResizeObserver(() => engine.resize())
    ro.observe(canvas)

    const onMove = (e) => { const r = canvas.getBoundingClientRect(); engine.setMouse({ x: e.clientX - r.left, y: e.clientY - r.top }) }
    const onLeave = () => engine.setMouse(null)
    const onClick = () => { if (engine.inject()) lastActRef.current = Date.now() }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('click', onClick)

    // scrolling = traffic: fast scrolls add jitter to the signal
    let lastY = window.scrollY
    const onScroll = () => { engine.load(window.scrollY - lastY); lastY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    // nobody playing? chaos happens anyway
    const auto = setInterval(() => {
      if (reduced || engine.busy() || Date.now() - lastActRef.current < 9000) return
      const r = rootRef.current?.getBoundingClientRect()
      if (r && r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4) engine.inject()
    }, 3000)

    return () => {
      engine.destroy(); io.disconnect(); ro.disconnect(); clearInterval(auto)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const inject = (key) => {
    lastActRef.current = Date.now()
    engineRef.current?.inject(key)
  }

  const busy = phase.key !== 'idle' && phase.key !== 'healthy'
  const activeIdx = ORDER[phase.key]

  return (
    <section className="ss-root" ref={rootRef} aria-label="Reliability feedback loop">
      <div className="ss-inner">
        <header className="ss-head">
          <div>
            <p className="ss-eyebrow">How I think</p>
            <h2 className="ss-h2">Reliability is a <em>feedback loop.</em></h2>
            <p className="ss-sub">This is a live p99 latency signal. Break something and watch the loop close itself, right on the graph.</p>
          </div>
          <div className="ss-inject">
            <span className="ss-inject-k">inject an incident</span>
            <div className="ss-chips">
              {Object.entries(SCENARIOS).map(([k, s]) => (
                <button key={k} type="button" disabled={busy} onClick={() => inject(k)}
                  className={phase.scenario === k && busy ? 'is-live' : ''}>
                  <i />{s.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className={`ss-scope ${stats.breached ? 'is-breached' : ''}`}>
          <div className="ss-scope-bar">
            <span className="ss-live"><i /> p99 latency · checkout-api · prod</span>
            <span className={`ss-now ${stats.breached ? 'bad' : ''}`}><b>{stats.v}</b>ms</span>
          </div>
          <canvas ref={canvasRef} className="ss-canvas" />
          <div className="ss-scope-foot">
            <div className="ss-budget">
              <span>error budget</span>
              <div className="ss-budget-track"><i style={{ width: `${stats.budget}%` }} className={stats.budget < 60 ? 'low' : ''} /></div>
              <b>{stats.budget.toFixed(1)}%</b>
            </div>
            <span>incidents <b>{stats.incidents}</b></span>
            <span>avg MTTR <b>{stats.mttr ? `${stats.mttr.toFixed(1)}s` : '—'}</b></span>
            <span className="ss-hint">hover to inspect · click the graph to break it</span>
          </div>
        </div>

        <ol className="ss-rail">
          <span className="ss-rail-progress" style={{ '--p': activeIdx < 0 ? 0 : Math.min(1, (activeIdx + (phase.key === 'healthy' ? 0 : 0.5)) / 3) }} />
          {PHASES.map((p, i) => {
            const state = activeIdx > i || phase.key === 'healthy' ? 'done' : activeIdx === i ? 'live' : 'wait'
            const text = (phase.key === 'idle' ? null : log[p.key]) ?? p.idle
            return (
              <li key={p.key} className={`is-${phase.key === 'idle' ? 'idle' : state}`}>
                <span className="ss-rail-n">{p.n}</span>
                <strong>{p.title}</strong>
                <AnimatePresence mode="wait">
                  <motion.p key={text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                    {text}
                  </motion.p>
                </AnimatePresence>
              </li>
            )
          })}
        </ol>
        <AnimatePresence>
          {phase.key === 'healthy' && log.done && (
            <motion.p className="ss-result" key={log.done} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✓ loop closed — {log.done}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default SignalScope
