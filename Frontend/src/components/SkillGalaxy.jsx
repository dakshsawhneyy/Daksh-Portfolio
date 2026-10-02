import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES, PROJECTS, TOOLS, USES } from './galaxy/galaxyData'
import { createGalaxy } from './galaxy/galaxyEngine'
import '../styles/skill-galaxy.css'

/* ══════════════════════════════════════════════════════════════════
   SKILL GALAXY — "The stack, as a system."
   Projects are hubs; every tool is wired to the real work it was used
   in. Drag & fling nodes, hover to trace connections, filter by layer.
   ══════════════════════════════════════════════════════════════════ */

const SkillGalaxy = () => {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const elRefs = useRef([])
  const [hovered, setHovered] = useState(-1)
  const [selected, setSelected] = useState(-1)
  const [cat, setCat] = useState(null)

  const { nodes, edges } = useMemo(() => {
    const nodes = [
      ...PROJECTS.map(p => ({ ...p, kind: 'project' })),
      ...TOOLS.map(t => ({ ...t, kind: 'tool' })),
    ]
    const index = Object.fromEntries(nodes.map((n, i) => [n.id, i]))
    const edges = []
    for (const [pid, tools] of Object.entries(USES)) for (const t of tools) edges.push([index[pid], index[t]])
    return { nodes, edges }
  }, [])

  const usedIn = useMemo(() => {
    const m = {}
    for (const [pid, tools] of Object.entries(USES)) for (const t of tools) (m[t] ||= []).push(PROJECTS.find(p => p.id === pid))
    return m
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    nodes.forEach((n, i) => {
      const el = elRefs.current[i]
      n.el = el
      n.w = el.offsetWidth; n.h = el.offsetHeight
      n.r = n.kind === 'project' ? n.w / 2 : Math.max(n.w, n.h) * 0.42
      n.m = n.kind === 'project' ? 5 : 1
    })
    const engine = createGalaxy({ canvas: canvasRef.current, nodes, edges, reduced })
    engineRef.current = engine
    engine.resize()

    const stage = stageRef.current
    const io = new IntersectionObserver(([e]) => {
      // node layers only while the constellation is on screen
      stage.classList.toggle('is-live', e.isIntersecting)
      if (e.isIntersecting) { engine.start(); engine.reheat(0.8) } else engine.stop()
    })
    io.observe(stage)
    const ro = new ResizeObserver(() => engine.resize())
    ro.observe(stage)

    const local = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
    const onMove = (e) => { if (e.pointerType === 'mouse') { const [x, y] = local(e); engine.setMouse({ x, y }) } }
    const onLeave = () => engine.setMouse(null)
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      engine.destroy(); io.disconnect(); ro.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [nodes, edges])

  /* focus set → engine (edges light up, others dim) */
  const active = hovered >= 0 ? hovered : selected
  const focus = useMemo(() => {
    if (active >= 0) {
      const s = new Set([active])
      edges.forEach(([a, b]) => { if (a === active) s.add(b); if (b === active) s.add(a) })
      return s
    }
    if (cat) {
      const s = new Set()
      nodes.forEach((n, i) => { if (n.cat === cat) s.add(i) })
      edges.forEach(([a, b]) => { if (s.has(b)) s.add(a) })
      return s
    }
    return null
  }, [active, cat, nodes, edges])
  useEffect(() => { engineRef.current?.setFocus(focus, !!cat && active < 0) }, [focus, cat, active])

  /* drag & click on nodes */
  const onNodeDown = (i) => (e) => {
    e.preventDefault()
    const stage = stageRef.current
    const r = stage.getBoundingClientRect()
    const start = [e.clientX, e.clientY]
    let moved = false
    engineRef.current?.grab(i, e.clientX - r.left, e.clientY - r.top)
    const move = (ev) => {
      if (!moved && Math.hypot(ev.clientX - start[0], ev.clientY - start[1]) > 4) {
        moved = true
        elRefs.current[i]?.classList.add('is-grabbed')
      }
      engineRef.current?.drag(ev.clientX - r.left, ev.clientY - r.top)
    }
    const up = () => {
      engineRef.current?.release()
      elRefs.current[i]?.classList.remove('is-grabbed')
      if (!moved) setSelected(s => (s === i ? -1 : i))
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const info = active >= 0 ? nodes[active] : null
  const toolCount = TOOLS.length
  const linkCount = edges.length

  return (
    <section className="sg-root" aria-label="Skill constellation">
      <div className="sg-head">
        <div>
          <p className="hv2-eyebrow">Reliability stack</p>
          <h2 className="sg-h2">The stack,<br /><em>as a system.</em></h2>
        </div>
        <div className="sg-head-right">
          <p className="sg-sub">Every tool is wired to the real work it shipped in. Drag the nodes, fling them, hover a project to trace what it was built with.</p>
          <div className="sg-filters" role="group" aria-label="Filter by layer">
            {Object.entries(CATEGORIES).map(([k, c]) => (
              <button key={k} type="button" className={cat === k ? 'is-on' : ''} style={{ '--c': c.color }}
                onClick={() => { setSelected(-1); setCat(v => (v === k ? null : k)) }}>
                <i />{c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sg-stage" ref={stageRef} onClick={(e) => { if (e.target === e.currentTarget || e.target === canvasRef.current) setSelected(-1) }}>
        <canvas ref={canvasRef} className="sg-canvas" aria-hidden="true" />
        {nodes.map((n, i) => {
          const dim = focus && !focus.has(i)
          const lit = focus && focus.has(i)
          return (
            <button
              key={n.id}
              type="button"
              ref={el => (elRefs.current[i] = el)}
              className={`sg-node sg-${n.kind} ${dim ? 'is-dim' : ''} ${lit ? 'is-lit' : ''} ${active === i ? 'is-active' : ''}`}
              style={{ '--c': n.cat ? CATEGORIES[n.cat].color : '#10110f' }}
              onPointerDown={onNodeDown(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(i)}
              onPointerLeave={() => setHovered(-1)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(-1)}
              aria-label={n.kind === 'project' ? `${n.label} — project` : `${n.label} — ${CATEGORIES[n.cat].label}`}
            >
              {n.kind === 'project'
                ? <><strong>{n.label}</strong><small>{n.sub}</small></>
                : <><i />{n.label}</>}
            </button>
          )
        })}

        <div className={`sg-panel ${info ? '' : 'is-idle'}`} aria-live="polite">
          <AnimatePresence mode="wait">
            {info ? (
              <motion.div key={info.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                {info.kind === 'project' ? (
                  <>
                    <span className="sg-panel-k">project · {USES[info.id].length} tools</span>
                    <strong className="sg-panel-t">{info.label}</strong>
                    <p>{info.desc}</p>
                    {info.href && (
                      <a href={info.href} target="_blank" rel="noreferrer" className="sg-panel-link">open <ArrowUpRight size={13} /></a>
                    )}
                  </>
                ) : (
                  <>
                    <span className="sg-panel-k" style={{ color: CATEGORIES[info.cat].color }}>{CATEGORIES[info.cat].label}</span>
                    <strong className="sg-panel-t">{info.label}</strong>
                    <p>Used in {usedIn[info.id]?.length || 0} {usedIn[info.id]?.length === 1 ? 'project' : 'projects'}:</p>
                    <div className="sg-panel-chips">{(usedIn[info.id] || []).map(p => <span key={p.id}>{p.label}</span>)}</div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="sg-panel-k">{PROJECTS.length} projects · {toolCount} tools · {linkCount} connections</span>
                <p className="sg-panel-idle">Hover or tap any node. The busiest tools sit in the middle, pulled by every project that depends on them.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default SkillGalaxy
