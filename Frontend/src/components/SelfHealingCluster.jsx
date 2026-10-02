import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Minus, Plus, Skull, ServerCrash, MousePointerClick } from 'lucide-react'
import '../styles/self-healing-cluster.css'

/* ══════════════════════════════════════════════════════════════════
   SELF-HEALING CLUSTER — the hero's living proof of "systems that
   self-heal". A miniature Kubernetes control loop:
     · click a pod → it crashes, the ReplicaSet notices, reschedules
     · drain a node → evictions, rescheduling onto healthy nodes
     · +/- replicas → scale up / down
     · idle for a while → chaos-monkey takes over
   ══════════════════════════════════════════════════════════════════ */

const NODES = [
  { id: 'a', name: 'node-a', zone: 'ap-south-1a', x: 14 },
  { id: 'b', name: 'node-b', zone: 'ap-south-1b', x: 148 },
  { id: 'c', name: 'node-c', zone: 'ap-south-1c', x: 282 },
]
const NODE_Y = 96
const NODE_W = 124
const NODE_H = 146
const SLOTS = [[34, 58], [90, 58], [34, 104], [90, 104]]   // 2×2 pods per node
const CAPACITY = NODES.length * SLOTS.length
const INGRESS = { x: 210, y: 34 }
const TICK = 280
const HISTORY = 54

const CRASH_REASONS = ['OOMKilled', 'CrashLoopBackOff', 'Error: exit 137', 'Liveness probe failed', 'SIGSEGV']
const APPS = ['api', 'web', 'auth', 'pay', 'cart', 'feed']
const SHARDS = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2 + 0.3)

const hex = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')

const rid = () => Math.random().toString(16).slice(2, 6)
let eventSeq = 0

const initial = {
  desired: 8,
  pods: [],
  nodeDown: {},           // nodeId -> until timestamp
  events: [{ id: eventSeq++, kind: 'info', msg: 'controller-manager: leader elected' }],
  history: Array(HISTORY).fill(100),
  healed: 0,
  debt: 0,                // failed pods not yet replaced
  incidentAt: null,       // when the current incident began (for MTTR)
  lastMttr: null,         // seconds, last measured time-to-recover
  booted: false,
  lastSchedFail: 0,
}

const log = (s, kind, msg) => ({ ...s, events: [{ id: eventSeq++, kind, msg }, ...s.events].slice(0, 5) })

function reducer(s, a) {
  const now = a.now
  switch (a.type) {
    case 'tick': {
      let next = { ...s, pods: [...s.pods], nodeDown: { ...s.nodeDown } }

      // nodes recovering
      for (const [id, until] of Object.entries(next.nodeDown)) {
        if (now > until) {
          delete next.nodeDown[id]
          next = log(next, 'ok', `node/${NODES.find(n => n.id === id).name} Ready — uncordoned`)
        }
      }

      // lifecycle transitions
      next.pods = next.pods.flatMap(p => {
        const age = now - p.t
        if ((p.status === 'failed' && age > 900) || (p.status === 'terminating' && age > 650)) return []
        if (p.status === 'pending' && age > 420) return [{ ...p, status: 'creating', t: now }]
        if (p.status === 'creating' && age > 700) {
          if (p.replacement) next.healed += 1
          return [{ ...p, status: 'running', t: now, healedAt: p.replacement ? now : null }]
        }
        return [p]
      })
      const justRan = s.pods.filter(p => p.status === 'creating' && now - p.t > 700)
      if (justRan.length && s.booted) next = log(next, 'ok', `pod/${justRan[0].name} Running · ready 1/1`)

      // reconcile: desired vs actual
      const live = next.pods.filter(p => p.status !== 'failed' && p.status !== 'terminating')
      if (live.length < next.desired) {
        const counts = NODES.map(n => ({
          n, used: next.pods.filter(p => p.node === n.id && p.status !== 'terminating').length,
        })).filter(c => !next.nodeDown[c.n.id] && c.used < SLOTS.length)
          .sort((x, y) => x.used - y.used)
        if (counts.length) {
          const node = counts[0].n
          const used = new Set(next.pods.filter(p => p.node === node.id).map(p => p.slot))
          const slot = SLOTS.findIndex((_, i) => !used.has(i))
          if (slot >= 0) {
            const name = `${APPS[Math.floor(Math.random() * APPS.length)]}-${rid()}`
            const replacement = next.debt > 0
            if (replacement) next.debt -= 1
            next.pods.push({ id: name, name, node: node.id, slot, status: 'pending', t: now, replacement })
            if (next.booted) next = log(next, 'info', `scheduler: pod/${name} → ${node.name}`)
          }
        } else if (now - next.lastSchedFail > 2500) {
          next.lastSchedFail = now
          next = log(next, 'warn', `FailedScheduling: 0/3 nodes available`)
        }
      } else if (live.length > next.desired) {
        const victim = [...live].sort((x, y) => y.t - x.t)[0]
        next.pods = next.pods.map(p => p.id === victim.id ? { ...p, status: 'terminating', t: now } : p)
        next = log(next, 'info', `replicaset: scaled down pod/${victim.name}`)
      }

      if (!next.booted && next.pods.filter(p => p.status === 'running').length >= next.desired) {
        next.booted = true
        next = log(next, 'ok', `deployment/web: ${next.desired}/${next.desired} replicas available`)
      }

      const running = next.pods.filter(p => p.status === 'running').length
      if (next.incidentAt && running >= next.desired && next.pods.every(p => p.status === 'running') && !Object.keys(next.nodeDown).length) {
        next.lastMttr = (now - next.incidentAt) / 1000
        next = log(next, 'ok', `incident resolved · MTTR ${next.lastMttr.toFixed(1)}s`)
        next.incidentAt = null
      }
      const avail = next.booted ? Math.min(100, (running / next.desired) * 100) : 100
      next.history = [...next.history.slice(1), avail]
      return next
    }
    case 'kill': {
      const pod = s.pods.find(p => p.id === a.id)
      if (!pod || pod.status !== 'running') return s
      const reason = CRASH_REASONS[Math.floor(Math.random() * CRASH_REASONS.length)]
      return log(
        { ...s, debt: s.debt + 1, incidentAt: s.incidentAt ?? now, pods: s.pods.map(p => p.id === a.id ? { ...p, status: 'failed', t: now, reason } : p) },
        'err', `${a.by ? 'chaos-monkey: ' : ''}pod/${pod.name} ${reason}`,
      )
    }
    case 'drain': {
      const candidates = NODES.filter(n => !s.nodeDown[n.id])
      if (candidates.length < 2) return s
      const node = a.node ? NODES.find(n => n.id === a.node) : candidates[Math.floor(Math.random() * candidates.length)]
      const evicted = s.pods.filter(p => p.node === node.id && p.status !== 'terminating' && p.status !== 'failed').length
      return log({
        ...s,
        debt: s.debt + evicted,
        incidentAt: s.incidentAt ?? now,
        nodeDown: { ...s.nodeDown, [node.id]: now + 4200 },
        pods: s.pods.map(p => p.node === node.id && p.status !== 'terminating' ? { ...p, status: 'failed', t: now, reason: 'Evicted' } : p),
      }, 'err', `node/${node.name} NotReady — evicting pods`)
    }
    case 'scale': {
      const desired = Math.max(3, Math.min(CAPACITY, s.desired + a.by))
      if (desired === s.desired) return s
      return log({ ...s, desired }, 'info', `kubectl scale --replicas=${desired}`)
    }
    default: return s
  }
}

const POD_STYLE = {
  running:     { fill: 'rgba(114,223,172,.14)', stroke: '#72dfac' },
  pending:     { fill: 'rgba(240,188,98,.08)',  stroke: '#f0bc62' },
  creating:    { fill: 'rgba(101,207,229,.12)', stroke: '#65cfe5' },
  failed:      { fill: 'rgba(232,103,74,.28)',  stroke: '#e8674a' },
  terminating: { fill: 'rgba(243,241,235,.04)', stroke: '#6b6e67' },
}

// memo: the 280ms control-loop tick re-renders the panel; unchanged pods keep the same object, so they skip
const Pod = memo(function Pod({ pod, onKill, onHover }) {
  const [sx, sy] = SLOTS[pod.slot]
  const node = NODES.find(n => n.id === pod.node)
  const cx = node.x + sx
  const cy = NODE_Y + sy
  const st = POD_STYLE[pod.status]
  const killable = pod.status === 'running'
  return (
    <motion.g
      className={`shc-pod shc-pod-${pod.status}`}
      style={{ transformOrigin: `${cx}px ${cy}px`, cursor: killable ? 'crosshair' : 'default' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={pod.status === 'failed'
        ? { scale: [1, 1.18, 0.9, 1], opacity: 1, x: [0, -2, 2, -1, 0] }
        : pod.status === 'terminating' ? { scale: 0.6, opacity: 0.3 } : { scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      onClick={() => killable && onKill(pod.id)}
      onPointerEnter={() => onHover(pod)}
      onPointerLeave={() => onHover(null)}
      role={killable ? 'button' : undefined}
      aria-label={killable ? `Kill pod ${pod.name}` : undefined}
    >
      {pod.status === 'running' && <polygon points={hex(cx, cy, 23)} className="shc-pod-halo" />}
      <polygon
        points={hex(cx, cy, 19)}
        fill={st.fill}
        stroke={st.stroke}
        strokeWidth={1.2}
        strokeDasharray={pod.status === 'pending' ? '3 3' : undefined}
        className="shc-pod-body"
      />
      {pod.status === 'failed' ? (
        <path d={`M${cx - 5},${cy - 5} L${cx + 5},${cy + 5} M${cx + 5},${cy - 5} L${cx - 5},${cy + 5}`} stroke="#e8674a" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <>
          <text x={cx} y={cy - 1} className="shc-pod-app">{pod.name.split('-')[0]}</text>
          <text x={cx} y={cy + 8} className="shc-pod-id">{pod.name.split('-')[1]}</text>
        </>
      )}
      {pod.status === 'failed' && SHARDS.map((a, i) => (
        <motion.polygon key={i}
          points={`${cx},${cy - 3} ${cx + 3},${cy + 2} ${cx - 3},${cy + 2}`}
          fill={i % 2 ? '#e8674a' : '#f0bc62'}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: Math.cos(a) * 34, y: Math.sin(a) * 34, opacity: 0, rotate: 200, scale: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      {pod.healedAt && (
        <motion.circle cx={cx} cy={cy} fill="none" stroke="#72dfac" strokeWidth="2"
          initial={{ r: 18, opacity: 0.9 }} animate={{ r: 48, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }} />
      )}
      {pod.status === 'creating' && (
        <circle cx={cx} cy={cy} r="19" fill="none" stroke="#65cfe5" strokeWidth="1.4" strokeDasharray="20 100" className="shc-spin" style={{ transformOrigin: `${cx}px ${cy}px` }} />
      )}
    </motion.g>
  )
})

const Sparkline = ({ data }) => {
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - 50) / 50) * 20}`).join(' ')
  const min = Math.min(...data)
  const color = min < 75 ? '#e8674a' : min < 99 ? '#f0bc62' : '#72dfac'
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="shc-spark" aria-hidden="true">
      <polyline points={`0,32 ${pts} 100,32`} fill={color} opacity=".07" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const SelfHealingCluster = () => {
  const [s, dispatch] = useReducer(reducer, initial)
  const [hovered, setHovered] = useState(null)
  const [touched, setTouched] = useState(false)
  const rootRef = useRef(null)
  const inView = useInView(rootRef, { margin: '-10% 0px' })
  const lastAction = useRef(Date.now())
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // control loop
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => dispatch({ type: 'tick', now: Date.now() }), TICK)
    return () => clearInterval(t)
  }, [inView])

  const act = useCallback((a, user = true) => {
    if (user) { lastAction.current = Date.now(); setTouched(true) }
    dispatch({ ...a, now: Date.now() })
  }, [])

  // chaos-monkey takes over when nobody has touched the cluster for a while
  const sRef = useRef(s)
  sRef.current = s
  useEffect(() => {
    if (!inView || reduced) return
    const t = setInterval(() => {
      const cur = sRef.current
      if (Date.now() - lastAction.current < 9000 || !cur.booted) return
      const running = cur.pods.filter(p => p.status === 'running')
      if (!running.length) return
      const victim = running[Math.floor(Math.random() * running.length)]
      dispatch({ type: 'kill', id: victim.id, by: 'chaos', now: Date.now() })
    }, 5200)
    return () => clearInterval(t)
  }, [inView, reduced])

  const killPod = useCallback((id) => act({ type: 'kill', id }), [act])

  const killRandom = () => {
    const running = s.pods.filter(p => p.status === 'running')
    if (running.length) act({ type: 'kill', id: running[Math.floor(Math.random() * running.length)].id })
  }

  const running = s.pods.filter(p => p.status === 'running').length
  const avail = s.history[s.history.length - 1]
  const anyDown = Object.keys(s.nodeDown).length > 0
  const status = !s.booted ? { t: 'BOOTSTRAPPING', c: '#65cfe5' }
    : avail < 75 || anyDown ? { t: 'DEGRADED · HEALING', c: '#e8674a' }
    : running < s.desired || s.pods.some(p => p.status !== 'running') ? { t: 'RECONCILING', c: '#f0bc62' }
    : { t: 'HEALTHY', c: '#72dfac' }

  return (
    <div ref={rootRef} className={`shc-root ${status.t.startsWith('DEGRADED') ? 'is-degraded' : ''}`}>
      <div className="shc-bar">
        <div className="shc-bar-dots"><span /><span /><span /></div>
        <span className="shc-bar-title">kubectl · prod-ap-south-1</span>
        <span className="shc-bar-status" style={{ color: status.c }}>
          <span className="shc-status-dot" style={{ background: status.c, boxShadow: `0 0 8px ${status.c}` }} />
          {status.t}
        </span>
      </div>

      <div className="shc-stage">
        <svg viewBox="0 0 420 252" className="shc-svg" role="img" aria-label="Interactive Kubernetes cluster. Click a pod to kill it and watch it self-heal.">
          <defs>
            <pattern id="shc-dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r=".6" fill="rgba(255,255,255,.06)" />
            </pattern>
            {NODES.map(n => (
              <path key={n.id} id={`shc-path-${n.id}`}
                d={`M${INGRESS.x},${INGRESS.y + 12} C${INGRESS.x},${INGRESS.y + 44} ${n.x + NODE_W / 2},${NODE_Y - 34} ${n.x + NODE_W / 2},${NODE_Y}`} />
            ))}
          </defs>
          <rect width="420" height="252" fill="url(#shc-dots)" />

          {/* traffic */}
          {NODES.map((n, i) => {
            const down = !!s.nodeDown[n.id]
            return (
              <g key={n.id}>
                <use href={`#shc-path-${n.id}`} className={`shc-route ${down ? 'is-down' : ''}`} />
                {!down && !reduced && [0, 1, 2].map(k => (
                  <circle key={k} r="1.9" className="shc-packet" style={{ fill: k === 1 ? '#72dfac' : '#e8674a' }}>
                    <animateMotion dur={`${1.5 + i * 0.15}s`} begin={`${k * 0.5 + i * 0.2}s`} repeatCount="indefinite">
                      <mpath href={`#shc-path-${n.id}`} />
                    </animateMotion>
                  </circle>
                ))}
              </g>
            )
          })}

          {/* ingress */}
          <g className="shc-ingress">
            <rect x={INGRESS.x - 58} y={INGRESS.y - 14} width="116" height="26" rx="13" />
            <circle cx={INGRESS.x - 42} cy={INGRESS.y - 1} r="4" className="shc-ingress-dot" />
            <text x={INGRESS.x + 4} y={INGRESS.y + 2.5}>ingress · lb</text>
            <text x={INGRESS.x} y={INGRESS.y - 22} className="shc-rps">{anyDown ? '↓ 1.6k rps · rerouting' : '↓ 2.4k rps'}</text>
          </g>

          {/* worker nodes */}
          {NODES.map(n => {
            const down = !!s.nodeDown[n.id]
            return (
              <g key={n.id} className={`shc-node ${down ? 'is-down' : ''}`}>
                <rect x={n.x} y={NODE_Y} width={NODE_W} height={NODE_H} rx="10" className="shc-node-box" />
                <circle cx={n.x + 12} cy={NODE_Y + 15} r="2.6" className="shc-node-led" />
                <text x={n.x + 20} y={NODE_Y + 18} className="shc-node-name">{n.name}</text>
                <text x={n.x + NODE_W - 10} y={NODE_Y + 18} className="shc-node-zone">{n.zone}</text>
                <line x1={n.x + 8} x2={n.x + NODE_W - 8} y1={NODE_Y + 28} y2={NODE_Y + 28} className="shc-node-rule" />
                {SLOTS.map(([sx, sy], i) => (
                  <polygon key={i} points={hex(n.x + sx, NODE_Y + sy, 19)} className="shc-slot" />
                ))}
                {!down && !reduced && s.pods.filter(p => p.node === n.id && p.status === 'running').map((p, k) => {
                  const [px, py] = SLOTS[p.slot]
                  return (
                    <circle key={p.id} r="1.5" className="shc-pod-packet">
                      <animateMotion dur={`${0.9 + k * 0.17}s`} repeatCount="indefinite"
                        path={`M${n.x + NODE_W / 2},${NODE_Y + 30} L${n.x + px},${NODE_Y + py - 19}`} />
                    </circle>
                  )
                })}
                {!down && (() => {
                  const load = Math.min(96, s.pods.filter(p => p.node === n.id && p.status === 'running').length * 21 + ((s.history.length * 7 + n.x) % 9))
                  return (
                    <g className="shc-cpu">
                      <text x={n.x + 10} y={NODE_Y + NODE_H - 9}>cpu</text>
                      <rect x={n.x + 28} y={NODE_Y + NODE_H - 14} width={NODE_W - 64} height="5" rx="2.5" className="shc-cpu-track" />
                      <rect x={n.x + 28} y={NODE_Y + NODE_H - 14} width={((NODE_W - 64) * load) / 100} height="5" rx="2.5"
                        className={`shc-cpu-fill ${load > 75 ? 'hot' : load > 50 ? 'warm' : ''}`} />
                      <text x={n.x + NODE_W - 10} y={NODE_Y + NODE_H - 9} className="shc-cpu-pct">{load}%</text>
                    </g>
                  )
                })()}
                {down && (
                  <g className="shc-down-tag">
                    <rect x={n.x + 10} y={NODE_Y + NODE_H - 22} width={NODE_W - 20} height="17" rx="4" />
                    <text x={n.x + NODE_W / 2} y={NODE_Y + NODE_H - 10.5}>NotReady · cordoned</text>
                  </g>
                )}
              </g>
            )
          })}

          {/* pods */}
          <AnimatePresence>
            {s.pods.map(p => (
              <Pod key={p.id} pod={p} onKill={killPod} onHover={setHovered} />
            ))}
          </AnimatePresence>
        </svg>

        <AnimatePresence>
          {!touched && s.booted && (
            <motion.div className="shc-coach"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ delay: 0.6 }}>
              <MousePointerClick size={13} /> Kill any pod. Watch it heal.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* inspector line */}
      <div className="shc-inspect">
        {hovered ? (
          <span>
            <b>pod/{hovered.name}</b> · {hovered.status === 'failed' ? hovered.reason : hovered.status}
            {hovered.status === 'running' && <> · cpu {20 + (hovered.name.charCodeAt(0) % 40)}m · <em>click to kill</em></>}
          </span>
        ) : (
          <span className="shc-muted">hover a pod to inspect · click to kill</span>
        )}
      </div>

      {/* event log */}
      <div className="shc-log" aria-live="polite">
        <AnimatePresence initial={false} mode="popLayout">
          {s.events.map(e => (
            <motion.div key={e.id} className={`shc-log-line is-${e.kind}`} layout
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <span className="shc-log-k">{e.kind === 'err' ? '✗' : e.kind === 'warn' ? '!' : e.kind === 'ok' ? '✓' : '›'}</span>
              {e.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* metrics + controls */}
      <div className="shc-foot">
        <div className="shc-metric">
          <span>replicas</span>
          <div className="shc-stepper">
            <button type="button" onClick={() => act({ type: 'scale', by: -1 })} aria-label="Scale down"><Minus size={11} /></button>
            <strong>{running}<i>/{s.desired}</i></strong>
            <button type="button" onClick={() => act({ type: 'scale', by: 1 })} aria-label="Scale up"><Plus size={11} /></button>
          </div>
        </div>
        <div className="shc-metric shc-metric-slo">
          <span>availability</span>
          <div className="shc-slo-row">
            <strong style={{ color: avail < 75 ? '#e8674a' : avail < 100 ? '#f0bc62' : '#72dfac' }}>{avail.toFixed(1)}%</strong>
            <Sparkline data={s.history} />
          </div>
        </div>
        <div className="shc-metric">
          <span>self-healed</span>
          <strong className="shc-healed">{s.healed}<i className="shc-mttr">{s.lastMttr ? ` · ${s.lastMttr.toFixed(1)}s mttr` : ''}</i></strong>
        </div>
        <div className="shc-actions">
          <button type="button" className="shc-btn" onClick={killRandom}><Skull size={12} /> Kill pod</button>
          <button type="button" className="shc-btn shc-btn-hot" onClick={() => act({ type: 'drain' })}><ServerCrash size={12} /> Drain node</button>
        </div>
      </div>
    </div>
  )
}

export default SelfHealingCluster
