import { useEffect, useMemo, useRef } from 'react'
import { FaAws } from 'react-icons/fa'
import { VscAzure } from 'react-icons/vsc'
import {
  SiKubernetes, SiTerraform, SiGooglecloud, SiPrometheus, SiGrafana, SiGithubactions, SiHelm,
  SiArgo, SiPython, SiDocker, SiAnsible, SiLinux, SiJenkins, SiOpentelemetry,
} from 'react-icons/si'
import '../styles/stack-marquee.css'

/* ══════════════════════════════════════════════════════════════════
   STACK MARQUEE — scroll-velocity driven, two opposing rows.
   Scroll fast → rows speed up (and reverse when scrolling up), then settle.
   One transform write per row per frame, only while on screen.
   ══════════════════════════════════════════════════════════════════ */

const TOOLS = [
  { name: 'AWS', Icon: FaAws, c: '#FF9900' },
  { name: 'Kubernetes', Icon: SiKubernetes, c: '#326CE5' },
  { name: 'Terraform', Icon: SiTerraform, c: '#844FBA' },
  { name: 'Azure', Icon: VscAzure, c: '#0078D4' },
  { name: 'GCP', Icon: SiGooglecloud, c: '#4285F4' },
  { name: 'Prometheus', Icon: SiPrometheus, c: '#E6522C' },
  { name: 'Grafana', Icon: SiGrafana, c: '#F46800' },
  { name: 'Docker', Icon: SiDocker, c: '#2496ED' },
  { name: 'Helm', Icon: SiHelm, c: '#0F1689' },
  { name: 'ArgoCD', Icon: SiArgo, c: '#EF7B4D' },
  { name: 'GitHub Actions', Icon: SiGithubactions, c: '#2088FF' },
  { name: 'Jenkins', Icon: SiJenkins, c: '#D24939' },
  { name: 'Ansible', Icon: SiAnsible, c: '#EE0000' },
  { name: 'OpenTelemetry', Icon: SiOpentelemetry, c: '#F5A800' },
  { name: 'Python', Icon: SiPython, c: '#3776AB' },
  { name: 'Linux', Icon: SiLinux, c: '#FCC624' },
]
const PRACTICES = ['Incident response', 'SLO / SLI', 'Chaos engineering', 'Root-cause analysis', 'GitOps', 'FinOps',
  'Observability', 'Multi-cloud IaC', 'On-call runbooks', 'DevSecOps', 'Autoscaling', 'Self-healing']

const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

/* One rAF drives both rows: translate-only (compositor-cheap), written straight
   to the DOM. Scroll speed is measured from scrollY deltas, no framer chain.
   (A per-frame skew forced GPU re-rasterisation of these wide text layers.) */
const useMarquee = (rootRef, rows) => {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let raf = 0, last = 0, lastY = window.scrollY, vel = 0, dir = 1, visible = false
    const pos = rows.map(() => 0)
    const tick = (now) => {
      const dt = Math.min(now - (last || now), 50) / 1000
      last = now
      const y = window.scrollY
      vel += ((y - lastY) / Math.max(dt, 0.001) - vel) * 0.12   // px/s, smoothed
      lastY = y
      if (vel < -60) dir = -1; else if (vel > 60) dir = 1
      const boost = 1 + Math.min(Math.abs(vel) / 450, 5)
      rows.forEach((r, i) => {
        const el = r.ref.current
        if (!el) return
        pos[i] = wrap(-50, 0, pos[i] + dir * r.speed * boost * dt)
        el.style.transform = `translate3d(${pos[i].toFixed(3)}%,0,0)`
      })
      raf = visible ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) { last = 0; lastY = window.scrollY; raf = requestAnimationFrame(tick) }
    }, { rootMargin: '120px 0px' })
    io.observe(rootRef.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [rootRef, rows])
}

const StackMarquee = () => {
  const ref = useRef(null)
  const toolsRef = useRef(null)
  const practicesRef = useRef(null)
  const rows = useMemo(() => [{ ref: toolsRef, speed: -2.2 }, { ref: practicesRef, speed: 1.6 }], [])
  useMarquee(ref, rows)

  return (
    <section className="sm-root" ref={ref} aria-label="Tools and practices">
      <div className="sm-head">
        <span>the stack, in production</span>
        <span className="sm-head-r">{TOOLS.length} tools · {PRACTICES.length} practices · scroll to accelerate</span>
      </div>
      <div className="sm-row sm-tools"><div className="sm-track" ref={toolsRef}>
        {[0, 1].map(k => <div className="sm-set" key={k} aria-hidden={k === 1}>
          {TOOLS.map(({ name, Icon, c }) => (
            <span key={name} className="sm-tool" style={{ '--c': c }}>
              <Icon className="sm-logo" aria-hidden="true" />
              <span>{name}</span>
            </span>
          ))}
        </div>)}
      </div></div>
      <div className="sm-row sm-practices"><div className="sm-track" ref={practicesRef}>
        {[0, 1].map(k => <div className="sm-set" key={k} aria-hidden={k === 1}>
          {PRACTICES.map(p => <span key={p} className="sm-practice">{p}<i aria-hidden="true">✦</i></span>)}
        </div>)}
      </div></div>
    </section>
  )
}

export default StackMarquee
