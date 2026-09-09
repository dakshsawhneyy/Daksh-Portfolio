import { ArrowUpRight, MapPin, ShieldCheck, AlertTriangle, Search, Wrench, Activity, Terminal, Zap, GitBranch } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, animate } from 'framer-motion'
import '../home-v2.css'

/* ─── animation variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } }
}
const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
}

/* ─── animated counter ─── */
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const node = ref.current
    const ctrl = animate(0, parseFloat(to), {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: v => { if (node) node.textContent = Math.round(v) + suffix }
    })
    return () => ctrl.stop()
  }, [inView, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

/* ─── typing headline ─── */
const TypedText = ({ words }) => {
  const [idx, setIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[idx]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIdx(i => (i + 1) % words.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, idx, words])
  return <span className="typed-word">{displayed}<span className="typed-cursor">|</span></span>
}

/* ─── live incident simulator ─── */
const PHASES = ['idle', 'anomaly', 'analyzing', 'plan', 'executing', 'verifying', 'recovered']
const PHASE_LABELS = {
  idle:      { status: 'ALL SYSTEMS NOMINAL', color: '#72dfac', icon: '●' },
  anomaly:   { status: 'ANOMALY DETECTED',    color: '#f08a69', icon: '▲' },
  analyzing: { status: 'ANALYZING SIGNAL',    color: '#f0bc62', icon: '◌' },
  plan:      { status: 'BUILDING PLAN',       color: '#f0bc62', icon: '◌' },
  executing: { status: 'EXECUTING REMEDIATION', color: '#65cfe5', icon: '→' },
  verifying: { status: 'VERIFYING RECOVERY',  color: '#65cfe5', icon: '◌' },
  recovered: { status: 'SYSTEM RECOVERED',    color: '#72dfac', icon: '✓' },
}

const IncidentSim = () => {
  const [phase, setPhase] = useState('idle')
  const [health, setHealth] = useState(99.9)
  const [log, setLog]       = useState(['[00:00] System initializing...', '[00:01] All services healthy.'])
  const running = useRef(false)

  const addLog = (msg) => setLog(prev => [...prev.slice(-6), msg])

  const runSimulation = () => {
    if (running.current) return
    running.current = true
    const now = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })

    setPhase('anomaly'); setHealth(81.4)
    addLog(`[${now()}] ⚠ payment-api latency +437% detected`)

    setTimeout(() => {
      setPhase('analyzing')
      addLog(`[${now()}] Anomaly confidence: 98.4%`)
    }, 1200)

    setTimeout(() => {
      setPhase('plan')
      addLog(`[${now()}] Remediation plan: isolate → shift → restart`)
    }, 2600)

    setTimeout(() => {
      setPhase('executing')
      addLog(`[${now()}] Isolating instance...`)
    }, 4000)

    setTimeout(() => {
      addLog(`[${now()}] Traffic rerouted. Restarting worker...`)
    }, 5000)

    setTimeout(() => {
      setPhase('verifying'); setHealth(97.2)
      addLog(`[${now()}] Verification pass 1/3...`)
    }, 6200)

    setTimeout(() => {
      setPhase('recovered'); setHealth(99.9)
      addLog(`[${now()}] ✓ Recovery complete. Health 99.9%`)
      running.current = false
    }, 7800)
  }

  const reset = () => {
    running.current = false
    setPhase('idle'); setHealth(99.9)
    setLog(['[00:00] System initializing...', '[00:01] All services healthy.'])
  }

  const meta = PHASE_LABELS[phase]

  return (
    <div className="isim-root">
      {/* header */}
      <div className="isim-header">
        <div className="isim-title"><Activity size={13} /> INCIDENT SIMULATOR</div>
        <div className="isim-status" style={{ color: meta.color }}>
          <span className="isim-dot" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
          {meta.status}
        </div>
      </div>

      {/* health bar */}
      <div className="isim-health">
        <div className="isim-health-row">
          <span>SYSTEM HEALTH</span>
          <strong style={{ color: health < 90 ? '#f08a69' : '#72dfac' }}>{health.toFixed(1)}%</strong>
        </div>
        <div className="isim-bar">
          <motion.div
            className="isim-bar-fill"
            animate={{ width: `${health}%`, background: health < 90 ? '#f08a69' : '#72dfac' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* services */}
      <div className="isim-services">
        {['payment-api', 'auth-service', 'cache-layer', 'api-gateway'].map((svc, i) => (
          <div key={svc} className={`isim-service ${i === 0 && phase !== 'idle' ? 'isim-svc-alert' : ''} ${i === 0 && phase === 'recovered' ? 'isim-svc-ok' : ''}`}>
            <span className="isim-svc-dot" />
            <span className="isim-svc-name">{svc}</span>
            <span className="isim-svc-stat">
              {i === 0 && phase === 'anomaly'   ? 'ANOMALY'    :
               i === 0 && phase === 'analyzing' ? 'ANALYZING'  :
               i === 0 && phase === 'plan'      ? 'ISOLATING'  :
               i === 0 && phase === 'executing' ? 'RESTARTING' :
               i === 0 && phase === 'verifying' ? 'VERIFYING'  :
               i === 0 && phase === 'recovered' ? 'HEALTHY'    : 'HEALTHY'}
            </span>
          </div>
        ))}
      </div>

      {/* log */}
      <div className="isim-log">
        {log.map((line, i) => (
          <motion.div key={i} className="isim-log-line" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            {line}
          </motion.div>
        ))}
      </div>

      {/* actions */}
      <div className="isim-actions">
        {phase === 'idle' || phase === 'recovered' ? (
          <button className="isim-btn isim-btn-trigger" onClick={runSimulation}>
            <Zap size={13} /> {phase === 'recovered' ? 'Run again' : 'Trigger incident'}
          </button>
        ) : (
          <span className="isim-running"><span className="isim-spinner" /> Simulation running…</span>
        )}
        {phase !== 'idle' && (
          <button className="isim-btn isim-btn-reset" onClick={reset}>Reset</button>
        )}
      </div>
    </div>
  )
}

/* ─── main component ─── */
const Home = () => {
  const incidents = [
    { name: 'CrashLoopBackOff', desc: 'Container crashes repeatedly after start. Check OOM limits, missing env vars, or a bad image tag.' },
    { name: 'OOMKilled',        desc: 'Process killed by kernel for exceeding memory limit. Review memory requests/limits and heap usage.' },
    { name: 'Kubernetes DNS',   desc: 'CoreDNS failing to resolve service names. Check CoreDNS pod health and network policies.' },
    { name: 'DB Exhaustion',    desc: 'Connection pool is full. Look for connection leaks, pool sizing issues, or upstream spikes.' },
    { name: 'Latency Spike',    desc: 'P95/P99 exceeds SLO threshold. Correlate with deploys, resource saturation, or downstream slowness.' },
  ]
  const [activeIncident, setActiveIncident] = useState(0)
  const [activePlaneStep, setActivePlaneStep] = useState(0)
  const planeSteps = ['SIGNAL', 'ALERT', 'INVESTIGATE', 'DECIDE', 'RECOVER']

  // animate the control plane steps in a loop
  useEffect(() => {
    const t = setInterval(() => setActivePlaneStep(s => (s + 1) % planeSteps.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="home-v2">

      {/* ════════════════ HERO ════════════════ */}
      <section className="hv2-hero">
        {/* background grid */}
        <div className="hv2-bg-grid" aria-hidden />
        <div className="hv2-bg-glow" aria-hidden />

        <div className="hv2-hero-inner">
          <motion.div className="hv2-hero-left" initial="hidden" animate="visible" variants={stagger}>

            {/* status badge */}
            <motion.div className="hv2-badge" variants={fadeUp}>
              <span className="hv2-badge-dot" />
              <span>Cloud &amp; DevOps Engineer</span>
              <span className="hv2-badge-sep">·</span>
              <span>Open to work</span>
            </motion.div>

            {/* headline */}
            <motion.h1 className="hv2-h1" variants={fadeUp}>
              <span className="hv2-h1-line">Building systems</span>
              <span className="hv2-h1-line hv2-h1-em">
                <TypedText words={['that self-heal.', 'for resilience.', 'that scale.', 'for reliability.']} />
              </span>
            </motion.h1>

            <motion.p className="hv2-sub" variants={fadeUp}>
              I design multicloud infrastructure, observability pipelines, and self-healing platforms
              that run in production — not just in demos.
            </motion.p>

            <motion.div className="hv2-actions" variants={fadeUp}>
              <Link className="hv2-btn-primary" to="/projects">
                View systems <ArrowUpRight size={16} />
              </Link>
              <a className="hv2-btn-ghost" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">
                Resume <ArrowUpRight size={15} />
              </a>
            </motion.div>

            {/* tech strip */}
            <motion.div className="hv2-tech-strip" variants={fadeUp}>
              {['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Prometheus', 'Grafana', 'CI/CD', 'Linux'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </motion.div>
          </motion.div>

          {/* control panel */}
          <motion.div
            className="hv2-control-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="hv2-panel-header">
              <span className="hv2-panel-led" />
              <span>RELIABILITY LAB</span>
              <span className="hv2-panel-sep">/</span>
              <span>READY</span>
              <span className="hv2-panel-tag">BUILD → BREAK → RECOVER</span>
            </div>

            <div className="hv2-panel-flow">
              {planeSteps.map((step, i) => (
                <motion.div
                  key={step}
                  className={`hv2-flow-step ${i === activePlaneStep ? 'active' : ''} ${i < activePlaneStep ? 'done' : ''}`}
                  animate={i === activePlaneStep ? { x: 6 } : { x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="hv2-flow-node">{String(i + 1).padStart(2, '0')}</div>
                  <div className="hv2-flow-label">{step}</div>
                  {i < activePlaneStep && <div className="hv2-flow-check">✓</div>}
                </motion.div>
              ))}
            </div>

            <div className="hv2-panel-metrics">
              <div className="hv2-pm-item">
                <span>P95 LATENCY</span>
                <strong>12ms</strong>
              </div>
              <div className="hv2-pm-item">
                <span>ERROR RATE</span>
                <strong>0.01%</strong>
              </div>
              <div className="hv2-pm-item">
                <span>UPTIME</span>
                <strong>99.99%</strong>
              </div>
            </div>

            <div className="hv2-panel-footer">
              <span>telemetry → policy → runbook</span>
              <b>SIMULATION / READY</b>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ METRICS STRIP ════════════════ */}
      <motion.section
        className="hv2-metrics"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        {[
          { value: 40,  suffix: '%', label: 'P95 latency reduction',      icon: <Zap size={18} /> },
          { value: 78,  suffix: '%', label: 'MTTR reduction (AIOps)',      icon: <Activity size={18} /> },
          { value: 70,  suffix: '%', label: 'Deploy time cut',             icon: <GitBranch size={18} /> },
          { value: 180, suffix: 'h', label: 'DevOps hours taught',         icon: <Terminal size={18} /> },
          { value: 100, suffix: 'h', label: 'Multicloud hours taught',     icon: <ShieldCheck size={18} /> },
        ].map(({ value, suffix, label, icon }) => (
          <motion.div className="hv2-metric-card" key={label} variants={fadeUp}>
            <div className="hv2-mc-icon">{icon}</div>
            <div className="hv2-mc-value">
              <Counter to={value} suffix={suffix} />
            </div>
            <div className="hv2-mc-label">{label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* ════════════════ INCIDENT SIMULATOR ════════════════ */}
      <motion.section
        className="hv2-section hv2-incident-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className="hv2-section-lead" variants={fadeUp}>
          <p className="hv2-eyebrow">My own product · Incident Zero</p>
          <h2>What happens when<br /><em>a system breaks?</em></h2>
          <p>
            <strong>Incident Zero</strong> is a failure simulation and response platform I built to practice and demonstrate SRE workflows.
            It detects anomalies in real-time, runs automated remediation playbooks, and recovers — the same way production systems should.
            Hit trigger below to see a live simulation.
          </p>

          {/* failure mode pills */}
          <div className="hv2-failure-pills">
            {incidents.map((inc, i) => (
              <button
                key={inc.name}
                className={`hv2-pill ${activeIncident === i ? 'active' : ''}`}
                onClick={() => setActiveIncident(i)}
              >
                <AlertTriangle size={11} /> {inc.name}
              </button>
            ))}
          </div>
          <motion.div
            className="hv2-failure-desc"
            key={activeIncident}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {incidents[activeIncident].desc}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <IncidentSim />
        </motion.div>
      </motion.section>

      {/* ════════════════ FEEDBACK LOOP ════════════════ */}
      <motion.section
        className="hv2-section hv2-loop-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className="hv2-section-lead" variants={fadeUp}>
          <p className="hv2-eyebrow">How I think</p>
          <h2>Reliability is a<br /><em>feedback loop.</em></h2>
        </motion.div>

        <motion.div className="hv2-loop-grid" variants={stagger}>
          {[
            { Icon: ShieldCheck, title: 'OBSERVE',     body: 'SLIs, SLOs, metrics, structured logs, and alert policies that fire before customers notice.',   accent: '#72dfac' },
            { Icon: Search,      title: 'INVESTIGATE', body: 'Incident response workflows, Kubernetes event correlation, tracing, and structured RCA templates.', accent: '#f0bc62' },
            { Icon: Wrench,      title: 'RECOVER',     body: 'Automated runbooks, canary rollbacks, self-healing policies, and CI/CD guardrails.',              accent: '#df694e' },
          ].map(({ Icon, title, body, accent }) => (
            <motion.article
              key={title}
              className="hv2-loop-card"
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="hv2-lc-accent" style={{ background: accent }} />
              <div className="hv2-lc-icon" style={{ color: accent }}><Icon size={24} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      {/* ════════════════ STACK ════════════════ */}
      <motion.section
        className="hv2-section hv2-stack-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.div className="hv2-section-lead" variants={fadeUp}>
          <p className="hv2-eyebrow">Reliability stack</p>
          <h2>Systems thinking,<br /><em>layer by layer.</em></h2>
        </motion.div>

        <motion.div className="hv2-stack-layers" variants={stagger}>
          {[
            { label: 'OPERATIONS',     detail: 'SLO · SLI · Incident Response · RCA · Runbooks · On-call',    color: '#df694e' },
            { label: 'OBSERVABILITY',  detail: 'Prometheus · Grafana · CloudWatch · Jaeger · OpenTelemetry',   color: '#f0bc62' },
            { label: 'ORCHESTRATION',  detail: 'Kubernetes · EKS · AKS · Helm · ArgoCD',                      color: '#65cfe5' },
            { label: 'INFRASTRUCTURE', detail: 'Terraform · AWS · Azure · GCP · Ansible',                     color: '#72dfac' },
            { label: 'AUTOMATION',     detail: 'Python · Bash · GitHub Actions · Jenkins · CI/CD pipelines',   color: '#8784d2' },
          ].map(({ label, detail, color }, i) => (
            <motion.div
              key={label}
              className="hv2-stack-row"
              variants={fadeUp}
              whileHover={{ x: 8, transition: { duration: 0.18 } }}
            >
              <div className="hv2-stack-bar" style={{ background: color }} />
              <div className="hv2-stack-content">
                <span className="hv2-stack-label">{label}</span>
                <span className="hv2-stack-detail">{detail}</span>
              </div>
              <span className="hv2-stack-index">{String(i + 1).padStart(2, '0')}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ════════════════ ON-CALL TICKER ════════════════ */}
      <motion.section
        className="hv2-oncall"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="hv2-oncall-track">
          {/* duplicated for seamless loop */}
          {[1, 2].map(n => (
            <div key={n} className="hv2-oncall-inner" aria-hidden={n === 2}>
              {['ALERT', 'VERIFY', 'SCOPE', 'CORRELATE', 'ROOT CAUSE', 'MITIGATE', 'DOCUMENT', 'PREVENT'].map(step => (
                <span key={step}>{step} <b>→</b></span>
              ))}
            </div>
          ))}
        </div>
      </motion.section>

      {/* ════════════════ CTA ════════════════ */}
      <motion.section
        className="hv2-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.p className="hv2-eyebrow" variants={fadeUp}>Ready to collaborate?</motion.p>
        <motion.h2 variants={fadeUp}>Have a platform problem<br /><em>worth solving?</em></motion.h2>
        <motion.div className="hv2-cta-actions" variants={fadeUp}>
          <Link className="hv2-btn-primary" to="/contact">Let's talk <ArrowUpRight size={16} /></Link>
          <Link className="hv2-btn-ghost"   to="/projects">Browse work <ArrowUpRight size={15} /></Link>
        </motion.div>
      </motion.section>

    </main>
  )
}

export default Home
