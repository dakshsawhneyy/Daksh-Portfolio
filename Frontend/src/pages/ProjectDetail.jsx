import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import projects from '../data/projects'
import { motion, AnimatePresence } from 'framer-motion'

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const MediaRenderer = ({ project }) => {
  // supports image, video, demo (iframe) gracefully
  if (!project) return null
  if (project.video) {
    return (
      <video className="pd-media" src={project.video} autoPlay muted loop playsInline />
    )
  }
  if (project.demo) {
    return (
      <iframe className="pd-media" src={project.demo} title={project.title} frameBorder="0" />
    )
  }
  return (
    <div className="pd-media" style={{ backgroundImage: `url(${project.image})` }} />
  )
}

const SystemFlow = ({ system }) => {
  const flow = system?.flow || ['INGEST','OBSERVE','DETECT','DECIDE','ACT','VERIFY']
  const [hover, setHover] = useState(null)
  const nodeInfo = (node) => {
    // prefer structured info if present
    const found = (system?.nodes || []).find(n => n.key === node || n.name === node)
    if (found) return found
    // fallback canned text
    if (node === 'DETECT') return { title: 'ANOMALY DETECTED', body: 'service: payments-api\nconfidence: 98.4%\nseverity: critical', hint: 'remediation candidate' }
    if (node === 'ACT') return { title: 'REMEDIATION EXECUTED', body: 'restart · scale · rollback · reroute' }
    return { title: node, body: system?.overview || '' }
  }

  return (
    <div className="system-flow-root">
      <div className="system-flow">
        {flow.map((n, i) => (
          <div key={n} className={`flow-node ${hover===n? 'active':''}`} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(null)}>
            <div className="node-key">{n}</div>
            {i < flow.length-1 && <div className="flow-arrow">↓</div>}
          </div>
        ))}
      </div>
      <div className="system-panel">
        {hover ? (
          <div className="panel-inner">
            <div className="panel-title">{nodeInfo(hover).title}</div>
            <pre className="panel-body">{nodeInfo(hover).body}</pre>
            {nodeInfo(hover).hint && <div className="panel-hint">↓ {nodeInfo(hover).hint}</div>}
          </div>
        ) : (
          <div className="panel-empty muted">Hover a node to inspect the system.</div>
        )}
      </div>
    </div>
  )
}

const ExperienceSim = ({ project }) => {
  const [phase, setPhase] = useState('idle')
  const [health, setHealth] = useState(99.9)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) return
    let timers = []
    if (phase === 'anomaly') {
      timers.push(setTimeout(() => setPhase('analyzing'), 900))
    }
    if (phase === 'analyzing') {
      timers.push(setTimeout(() => setPhase('plan'), 1200))
    }
    if (phase === 'plan') {
      timers.push(setTimeout(() => setPhase('executing'), 1100))
    }
    if (phase === 'executing') {
      timers.push(setTimeout(() => { setHealth(prev => Math.min(100, prev + 1.1)); setPhase('verifying') }, 1400))
    }
    if (phase === 'verifying') {
      timers.push(setTimeout(() => setPhase('recovered'), 900))
    }
    return () => timers.forEach(t => clearTimeout(t))
  }, [phase, prefersReduced])

  const trigger = () => {
    if (prefersReduced) {
      setPhase('recovered'); setHealth(99.8); return
    }
    setPhase('anomaly'); setHealth(87.3)
  }

  const services = project.system?.services || ['payment-api','auth-service','cache','gateway']

  return (
    <div className={`experience-sim cinematic-sim`} data-phase={phase}>
      <header className="es-header">
        <div className="es-title">SYSTEM HEALTH</div>
        <div className="es-value">{health.toFixed(1)}%</div>
      </header>

      <div className="es-body">
        <aside className="es-services">
          {services.map((s,i) => (
            <div key={s} className={`es-service ${phase !== 'idle' && i===0 ? 'es-active' : ''}`}>
              <div className="es-service-name">{s}</div>
              <div className="es-service-status">{phase === 'idle' ? 'HEALTHY' : (i===0 ? (phase === 'anomaly' ? 'ANOMALY' : phase === 'recovered' ? 'RECOVERED' : 'INVESTIGATING') : 'HEALTHY')}</div>
            </div>
          ))}
        </aside>

        <section className="es-event">
          {phase === 'idle' && (
            <div className="es-panel es-idle">
              <h3>All systems nominal</h3>
              <p className="muted">No alerts. Network throughput stable.</p>
              <div className="es-actions"><button className="sim-btn" onClick={trigger} data-interactive data-cursor="open">Trigger Simulation</button></div>
            </div>
          )}

          {phase === 'anomaly' && (
            <div className="es-panel es-anomaly">
              <h2>⚠ ANOMALY DETECTED</h2>
              <div className="es-lines">payment-api — latency +437%<br/>error rate +18.2%</div>
              <div className="es-meta muted">stream: prometheus • source: ingestion</div>
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="es-panel es-analyzing">
              <h2>ANALYZING</h2>
              <div className="es-lines">anomaly confidence • <strong>98.4%</strong></div>
              <div className="es-meta muted">candidates: scale-up, reroute, restart</div>
            </div>
          )}

          {phase === 'plan' && (
            <div className="es-panel es-plan">
              <h2>REMEDIATION PLAN</h2>
              <ul className="es-plan-list">
                <li>isolate instance</li>
                <li>shift traffic</li>
                <li>restart worker</li>
              </ul>
            </div>
          )}

          {phase === 'executing' && (
            <div className="es-panel es-executing">
              <h2>EXECUTING</h2>
              <div className="es-lines">→ isolating • → shifting • → restarting</div>
            </div>
          )}

          {phase === 'verifying' && (
            <div className="es-panel es-verifying">
              <h2>VERIFICATION</h2>
              <div className="es-verify-bar"><div className="fill" style={{width:'82%'}}/></div>
            </div>
          )}

          {phase === 'recovered' && (
            <div className="es-panel es-recovered">
              <h2>SYSTEM RECOVERED</h2>
              <div className="es-lines">Health • {health.toFixed(1)}%</div>
              <div className="es-meta muted">Recovery complete — automated remediation</div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

const DetailItem = ({ text }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`detail-item ${open? 'open':''}`} onClick={() => setOpen(s => !s)}>
      <div className="detail-summary">{text}</div>
      {open && <div className="detail-expanded muted">Implementation notes, animation, and micro-interactions that supported this choice.</div>}
    </div>
  )
}

const ProjectDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const idx = projects.findIndex(p => slugify(p.title) === slug)
  const project = projects[idx]
  const next = projects[(idx + 1) % projects.length]
  const heroRef = useRef()

  useEffect(() => {
    if (!project) navigate('/projects')
  }, [project, navigate])

  if (!project) return null

  return (
    <div className="project-detail-root">
      <header className="pd-hero cinematic">
        <div className="pd-hero-inner cinematic-inner">
          <div className="pd-kicker muted">PROJECT / {String(idx+1).padStart(2,'0')}</div>
          <div className="pd-hero-lines">
            <div className="hero-large"><span className="hero-word">MULTICLOUD</span></div>
            <div className="hero-large sub"><span className="hero-word">AUTO-HEALING</span></div>
            <div className="hero-large sub"><span className="hero-word">INFRASTRUCTURE</span></div>
          </div>
          <div className="pd-hero-blurb">A system that detects,<br/>decides, and repairs<br/>distributed failures.</div>
          <div className="pd-meta muted small-meta">{project.title} • {project.year || '2026'} • DESIGN / SYSTEMS / ENGINEERING</div>
        </div>
        <div className="pd-hero-media">
          <MediaRenderer project={project} />
        </div>
      </header>

      <main className="pd-main">
        <section className="pd-chapter pd-entry">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2>01 — ENTRY</h2>
            <p className="lead">{project.heroStatement || project.description}</p>
          </motion.div>
        </section>

        <section className="pd-chapter pd-context">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2>02 — CONTEXT</h2>
            <div className="context-tension">
              <div className="t-line">FAILURES DON'T WAIT.</div>
              <div className="t-line">Traffic spikes.</div>
              <div className="t-line">Services drift.</div>
              <div className="t-line">Dependencies fail.</div>
              <div className="t-line muted">And production keeps moving.</div>
            </div>
            <div className="editorial" style={{marginTop:18}}>
              {(project.context || []).map((c, i) => (
                <p key={i} className="context-line">{c}</p>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="pd-chapter pd-system">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2>03 — SYSTEM</h2>
            <p className="muted">{project.system?.overview}</p>
            <div style={{marginTop:12}}>
              <SystemFlow system={project.system || {}} />
            </div>
            <ul className="system-components" style={{marginTop:14}}>
              {(project.system?.components || []).map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </motion.div>
        </section>

        <section className="pd-chapter pd-experience">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2>04 — EXPERIENCE</h2>
            <div className="experience-viewport glass-card">
              {project.experience?.note && <div className="muted" style={{marginBottom:12}}>{project.experience.note}</div>}
              <ExperienceSim project={project} />
              {/* keep demo/video if available for playback */}
              { (project.video || project.demo) && <div style={{marginTop:12}}><MediaRenderer project={project} /></div> }
            </div>
          </motion.div>
        </section>

        <section className="pd-chapter pd-details">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2>05 — DETAILS</h2>
            <div className="detail-list">
              {(project.details || []).map((d, i) => <DetailItem key={i} text={d} />)}
            </div>
          </motion.div>
        </section>

        <section className="pd-chapter pd-outcome">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <div className="outcome-hero">
              <div className="oh-line">FROM</div>
              <div className="oh-line big">FAILURE</div>
              <div className="oh-line">TO</div>
              <div className="oh-line big">RECOVERY</div>
              <div className="oh-line small">IN SECONDS.</div>
            </div>
            <div className="outcome-grid" style={{marginTop:18}}>
              <div className="outcome-card"><strong>{project.outcome?.mttr}</strong><div className="muted">MTTR</div></div>
              <div className="outcome-card"><strong>{project.outcome?.incidentsReduced}</strong><div className="muted">INCIDENTS</div></div>
              <div className="outcome-card"><strong>{project.outcome?.uptime}</strong><div className="muted">UPTIME</div></div>
            </div>
            <div className="muted" style={{marginTop:12}}>{(project.outcome?.lessons || []).join(' • ')}</div>
            <div className="pd-next project-trailer">
              <div className="current-project">CURRENT PROJECT<br/><strong>01 / MULTICLOUD</strong><div className="muted">SYSTEM COMPLETE</div></div>
              <div className="next-project">
                <div className="muted">NEXT PROJECT</div>
                <button className="next-btn" onClick={() => navigate(`/projects/${slugify(next.title)}`)} data-interactive data-cursor="open">02 / {next.title.split(' ')[0].toUpperCase()} — OPEN →</button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="pd-footer">
        <Link to="/projects" className="muted">← Back to archive</Link>
      </footer>
    </div>
  )
}

export default ProjectDetail
