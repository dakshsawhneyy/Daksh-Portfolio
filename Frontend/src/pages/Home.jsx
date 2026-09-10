import { ArrowUpRight, ShieldCheck, Search, Wrench, Activity, Terminal, Zap, GitBranch, ExternalLink } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import '../home-v2.css'

/* ─── variants ─── */
const fadeUp  = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }
const fadeIn  = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }

/* ─── animated counter ─── */
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const node = ref.current
    const ctrl = animate(0, parseFloat(to), {
      duration: 1.4, ease: 'easeOut',
      onUpdate: v => { if (node) node.textContent = Math.round(v) + suffix }
    })
    return () => ctrl.stop()
  }, [inView, to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

/* ─── typing headline ─── */
const TypedText = ({ words }) => {
  const [idx, setIdx]           = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting]   = useState(false)
  useEffect(() => {
    const word = words[idx]
    let t
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 75)
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), 2000)
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    else if (deleting && displayed.length === 0) {
      setDeleting(false); setIdx(i => (i+1) % words.length)
    }
    return () => clearTimeout(t)
  }, [displayed, deleting, idx, words])
  return <span className="typed-word">{displayed}<span className="typed-cursor">|</span></span>
}

/* ─── live monitoring dashboard ─── */
const SPARK_BASE = [28,35,32,45,38,52,48,61,44,57,53,68,62,71,65,80,74,88,76,92,85,79,95,88,82,97,91,86,99,94]

const LiveDashboard = () => {
  const [spark, setSpark]     = useState(SPARK_BASE)
  const [latency, setLatency] = useState(12)
  const [errRate, setErrRate] = useState(0.01)
  const [reqRate, setReqRate] = useState(2847)
  const [alert,   setAlert]   = useState(false)
  const [scan,    setScan]     = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setLatency(v => +(Math.max(8,  Math.min(24,  v + (Math.random()-0.48)*2.5)).toFixed(0)))
      setErrRate(v => +(Math.max(0,  Math.min(0.06,v + (Math.random()-0.5)*0.008)).toFixed(2)))
      setReqRate(v => +(Math.max(2400,Math.min(3400,v + (Math.random()-0.5)*120)).toFixed(0)))
      setSpark(p => [...p.slice(1), Math.max(20, Math.min(100, p[p.length-1] + (Math.random()-0.45)*12))])
    }, 1600)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setScan(v => (v+1)%100), 40)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setAlert(true); setLatency(68); setErrRate(0.22)
      setTimeout(() => { setAlert(false); setLatency(13); setErrRate(0.01) }, 3800)
    }, 28000)
    return () => clearInterval(t)
  }, [])

  const pts = spark.map((v,i) => `${(i/(spark.length-1))*280},${58-(v/100)*50}`).join(' ')

  return (
    <div className={`hv2-dash ${alert ? 'hv2-dash-alert' : ''}`}>
      <div className="hv2-dash-scanline" style={{ top:`${scan}%` }} aria-hidden />

      <div className="hv2-dash-bar">
        <div className="hv2-dash-dots">
          <span className="hv2-dd-red"/><span className="hv2-dd-yellow"/><span className="hv2-dd-green"/>
        </div>
        <span className="hv2-dash-title">reliability-lab — monitoring</span>
        <span className="hv2-dash-live" style={{ color: alert ? '#f08a69' : '#72dfac' }}>
          <span className="hv2-dash-live-dot" style={{ background: alert ? '#f08a69' : '#72dfac', boxShadow:`0 0 7px ${alert?'#f08a69':'#72dfac'}` }} />
          {alert ? 'ALERT FIRING' : 'LIVE'}
        </span>
      </div>

      <div className="hv2-dash-kpis">
        {[
          { label:'P95 LATENCY', val: `${latency}ms`,              cls: alert ? 'hv2-kpi-alert' : '' },
          { label:'ERROR RATE',  val: `${errRate}%`,               cls: alert ? 'hv2-kpi-alert' : '' },
          { label:'REQ / MIN',   val: reqRate.toLocaleString()+' rps', cls:'hv2-kpi-blue' },
          { label:'UPTIME',      val: '99.97%',                    cls:'hv2-kpi-green' },
        ].map(({label, val, cls}) => (
          <div key={label} className={`hv2-kpi ${cls}`}>
            <span className="hv2-kpi-label">{label}</span>
            <motion.span className="hv2-kpi-val" key={val}
              initial={{opacity:0.5,y:-4}} animate={{opacity:1,y:0}} transition={{duration:0.22}}>
              {val}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="hv2-dash-chart">
        <div className="hv2-chart-head">
          <span className="hv2-chart-label">THROUGHPUT</span>
          <span className="hv2-chart-range">30s window</span>
        </div>
        <svg viewBox="0 0 280 62" preserveAspectRatio="none" className="hv2-sparkline-svg">
          <defs>
            <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={alert?'#f08a69':'#72dfac'} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={alert?'#f08a69':'#72dfac'} stopOpacity="0.02"/>
            </linearGradient>
          </defs>
          {[20,40,60].map(y => <line key={y} x1="0" y1={58-(y/100)*50} x2="280" y2={58-(y/100)*50} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
          <polygon points={`0,58 ${pts} 280,58`} fill="url(#sg1)" />
          <polyline points={pts} fill="none" stroke={alert?'#f08a69':'#72dfac'} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
          {(() => { const last=spark[spark.length-1]; const cy=58-(last/100)*50; return <><circle cx="280" cy={cy} r="5" fill={alert?'#f08a69':'#72dfac'} opacity="0.2"/><circle cx="280" cy={cy} r="2.5" fill={alert?'#f08a69':'#72dfac'}/></> })()}
        </svg>
      </div>

      <div className="hv2-dash-services">
        {[
          {name:'payment-api', lat:'9ms', ok:!alert},
          {name:'auth-service', lat:'4ms', ok:true},
          {name:'k8s / EKS',   lat:'—',   ok:true},
          {name:'prometheus',  lat:'—',   ok:true},
        ].map(s => (
          <div key={s.name} className={`hv2-dash-svc ${!s.ok?'hv2-svc-bad':''}`}>
            <span className="hv2-dash-svc-dot" style={{background:s.ok?'#72dfac':'#f08a69',boxShadow:`0 0 5px ${s.ok?'#72dfac':'#f08a69'}`}}/>
            <span className="hv2-dash-svc-name">{s.name}</span>
            {s.lat!=='—' && <span className="hv2-dash-svc-lat">{s.lat}</span>}
            <span className="hv2-dash-svc-status" style={{color:s.ok?'#72dfac':'#f08a69'}}>{s.ok?'OK':'DEGRADED'}</span>
          </div>
        ))}
      </div>

      {alert && (
        <motion.div className="hv2-alert-banner" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}>
          ▲ SLO BREACH — payment-api P99 at 68ms · auto-remediation firing
        </motion.div>
      )}

      <div className="hv2-dash-footer">
        <span>prometheus · grafana · cloudwatch</span>
        <span className="hv2-dash-blink">● {alert ? 'INCIDENT ACTIVE' : 'ALL SYSTEMS GO'}</span>
      </div>
    </div>
  )
}

/* ─── Incident Zero simulator — with real product screenshot ─── */
const SCENARIOS = [
  { id:'crashloop', name:'CrashLoopBackOff', svc:'app-pod',    signal:'Pod restart loop',            cause:'Missing env var: DB_CONNECTION_STRING' },
  { id:'oom',       name:'OOMKilled',        svc:'worker-pod', signal:'Memory limit exceeded, SIGKILL', cause:'Heap allocation unbounded in worker' },
  { id:'dns',       name:'K8s DNS Failure',  svc:'coredns',    signal:'Service lookups timing out',   cause:'CoreDNS ConfigMap misconfiguration' },
  { id:'dbexhaust', name:'DB Pool Exhausted',svc:'postgres',   signal:'connection pool=0',            cause:'Missing connection-pool limit per pod' },
  { id:'latency',   name:'Latency Spike',    svc:'api-gateway',signal:'P99 latency 4.2s — SLO breach',cause:'HPA CPU threshold too high, undersized pods' },
]

const IncidentSim = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [phase,  setPhase]  = useState('idle')
  const [health, setHealth] = useState(99.9)
  const [log,    setLog]    = useState(['$ incident-zero --ready', '● All systems nominal.'])
  const running = useRef(false)
  const scenario = SCENARIOS[scenarioIdx]
  const addLog = msg => setLog(p => [...p.slice(-4), msg])

  const runSim = () => {
    if (running.current) return
    running.current = true
    setPhase('anomaly'); setHealth(78.4)
    addLog(`⚠ ${scenario.svc}: ${scenario.signal}`)
    setTimeout(() => { setPhase('analyzing'); addLog('↳ Correlating signals...') }, 1400)
    setTimeout(() => { setPhase('plan');      addLog(`✦ Root cause: ${scenario.cause}`) }, 2900)
    setTimeout(() => { setPhase('executing'); addLog('→ Applying remediation...') }, 4200)
    setTimeout(() => { setPhase('verifying'); setHealth(95.1); addLog('◎ Verifying recovery...') }, 5600)
    setTimeout(() => {
      setPhase('recovered'); setHealth(99.9)
      addLog('✓ System recovered. RCA filed.')
      running.current = false
    }, 7200)
  }

  const reset = () => {
    running.current = false; setPhase('idle'); setHealth(99.9)
    setLog(['$ incident-zero --ready', '● All systems nominal.'])
  }

  const PHASE = {
    idle:      { status: 'NOMINAL',             color: '#72dfac' },
    anomaly:   { status: `ANOMALY — ${scenario.svc}`, color: '#f08a69' },
    analyzing: { status: 'ANALYZING',           color: '#f0bc62' },
    plan:      { status: 'ROOT CAUSE FOUND',    color: '#f0bc62' },
    executing: { status: 'REMEDIATING',         color: '#65cfe5' },
    verifying: { status: 'VERIFYING',           color: '#65cfe5' },
    recovered: { status: 'RECOVERED',           color: '#72dfac' },
  }
  const meta = PHASE[phase]
  const healthPct = health.toFixed(1)

  return (
    <div className="isim-root">
      {/* product screenshot on top */}
      <div className="isim-screenshot">
        <img src="/projects/incident-zero.png" alt="Incident Zero platform" />
        <div className="isim-screenshot-overlay">
          <span className="isim-product-label">INCIDENT ZERO / PLATFORM</span>
          <a href="https://incidentzero.monster" target="_blank" rel="noreferrer" className="isim-product-link">
            incidentzero.monster <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* scenario tabs */}
      <div className="isim-tabs">
        {SCENARIOS.map((s,i) => (
          <button key={s.id}
            className={`isim-tab ${i===scenarioIdx?'active':''}`}
            onClick={() => { if (phase==='idle'||phase==='recovered') { setScenarioIdx(i); reset() } }}
          >{s.name}</button>
        ))}
      </div>

      {/* status + health */}
      <div className="isim-status-row">
        <div className="isim-title"><Activity size={12}/> LIVE SIM</div>
        <div className="isim-status" style={{color:meta.color}}>
          <span className="isim-dot" style={{background:meta.color,boxShadow:`0 0 6px ${meta.color}`}}/>
          {meta.status}
        </div>
        <div className="isim-health-compact">
          <span>SLO</span>
          <div className="isim-bar" style={{width:64}}>
            <motion.div className="isim-bar-fill"
              animate={{width:`${health}%`,background:health<88?'#f08a69':'#72dfac'}}
              transition={{duration:0.8}}/>
          </div>
          <strong style={{color:health<88?'#f08a69':'#72dfac'}}>{healthPct}%</strong>
        </div>
      </div>

      {/* log */}
      <div className="isim-log">
        {log.map((l,i) => (
          <motion.div key={i} className="isim-log-line"
            initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}>{l}</motion.div>
        ))}
      </div>

      {/* actions */}
      <div className="isim-actions">
        {phase==='idle'||phase==='recovered' ? (
          <button className="isim-btn isim-btn-trigger" onClick={runSim}>
            <Zap size={12}/> {phase==='recovered'?'Run again':'Trigger incident'}
          </button>
        ) : (
          <span className="isim-running"><span className="isim-spinner"/> Simulation running…</span>
        )}
        {phase!=='idle' && <button className="isim-btn isim-btn-reset" onClick={reset}>Reset</button>}
      </div>
    </div>
  )
}

/* ─── main ─── */
const Home = () => (
  <main className="home-v2">

    {/* ══ HERO — bold asymmetric typographic hero ══ */}
    <section className="hv2-hero">
      <div className="hv2-bg-grid" aria-hidden/>
      <div className="hv2-bg-glow" aria-hidden/>
      <div className="hv2-bg-orb hv2-orb-1" aria-hidden/>
      <div className="hv2-bg-orb hv2-orb-2" aria-hidden/>

      <div className="hv2-hero-inner">
        <motion.div className="hv2-hero-left" initial="hidden" animate="visible" variants={stagger}>

          {/* large kicker — different from the common "badge" approach */}
          <motion.div className="hv2-hero-kicker" variants={fadeUp}>
            <span className="hv2-kicker-line"/>
            <span>Cloud · DevOps · SRE</span>
          </motion.div>

          <motion.h1 className="hv2-h1" variants={fadeUp}>
            <span className="hv2-h1-line">Building systems</span>
            <span className="hv2-h1-line hv2-h1-em">
              <TypedText words={['that self-heal.','for resilience.','that scale.','for reliability.']}/>
            </span>
          </motion.h1>

          {/* status strip — live feel */}
          <motion.div className="hv2-status-strip" variants={fadeUp}>
            <span className="hv2-status-dot"/>
            <span>AWS · Azure · K8s · Terraform</span>
            <span className="hv2-status-sep">·</span>
            <span className="hv2-status-open">Open to work</span>
          </motion.div>

          <motion.p className="hv2-sub" variants={fadeUp}>
            Multicloud infrastructure, observability pipelines,
            and self-healing platforms — production-grade, not just demos.
          </motion.p>

          <motion.div className="hv2-actions" variants={fadeUp}>
            <Link className="hv2-btn-primary" to="/projects">
              View systems <ArrowUpRight size={16}/>
            </Link>
            <a className="hv2-btn-ghost" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">
              Resume <ArrowUpRight size={15}/>
            </a>
          </motion.div>
        </motion.div>

        <motion.div className="hv2-dashboard"
          initial={{opacity:0,x:40}} animate={{opacity:1,x:0}}
          transition={{duration:0.7,delay:0.3,ease:[0.22,1,0.36,1]}}>
          <LiveDashboard/>
        </motion.div>
      </div>
    </section>

    {/* ══ METRICS ══ */}
    <motion.section className="hv2-metrics"
      initial="hidden" whileInView="visible" viewport={{once:true,margin:'-50px'}} variants={stagger}>
      {[
        {value:40,  suffix:'%',   label:'P95 latency cut',         icon:<Zap size={16}/>,         accent:'#e8674a'},
        {value:78,  suffix:'%',   label:'MTTR reduction',           icon:<Activity size={16}/>,    accent:'#72dfac'},
        {value:70,  suffix:'%',   label:'Deploy time saved',        icon:<GitBranch size={16}/>,   accent:'#65cfe5'},
        {value:180, suffix:'h+',  label:'DevOps hours taught',      icon:<Terminal size={16}/>,    accent:'#f0bc62'},
        {value:100, suffix:'h+',  label:'Multicloud hours taught',  icon:<ShieldCheck size={16}/>, accent:'#8784d2'},
      ].map(({value,suffix,label,icon,accent}) => (
        <motion.div className="hv2-metric-card" key={label} variants={fadeUp}
          whileHover={{y:-4,transition:{duration:0.18}}}>
          <div className="hv2-mc-accent-line" style={{background:accent}}/>
          <div className="hv2-mc-icon" style={{color:accent}}>{icon}</div>
          <div className="hv2-mc-value" style={{color:accent}}>
            <Counter to={value} suffix={suffix}/>
          </div>
          <div className="hv2-mc-label">{label}</div>
        </motion.div>
      ))}
    </motion.section>

    {/* ══ INCIDENT SIMULATOR — product + live demo side by side ══ */}
    <motion.section className="hv2-section hv2-incident-section"
      initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} variants={stagger}>
      <motion.div className="hv2-section-lead" variants={fadeUp}>
        <p className="hv2-eyebrow">My own product · incidentzero.monster</p>
        <h2>What happens when<br/><em>a system breaks?</em></h2>
        <p>
          <strong>Incident Zero</strong> is a Kubernetes failure simulation platform
          I built from scratch. Five real failure scenarios — CrashLoopBackOff,
          OOMKilled, DNS failures, DB pool exhaustion, latency spikes.
          Each one walks through detection → RCA → recovery.
        </p>
        <div className="hv2-iz-badges">
          <span><ShieldCheck size={12}/> SRE Training</span>
          <span><Activity size={12}/> 5 Failure Scenarios</span>
          <span><Zap size={12}/> Live on Azure</span>
        </div>
      </motion.div>
      <motion.div variants={fadeUp}>
        <IncidentSim/>
      </motion.div>
    </motion.section>

    {/* ══ FEEDBACK LOOP ══ */}
    <motion.section className="hv2-section hv2-loop-section"
      initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} variants={stagger}>
      <motion.div className="hv2-section-lead" variants={fadeUp}>
        <p className="hv2-eyebrow">How I think</p>
        <h2>Reliability is a<br/><em>feedback loop.</em></h2>
      </motion.div>
      <motion.div className="hv2-loop-grid" variants={stagger}>
        {[
          {Icon:ShieldCheck, title:'OBSERVE',     body:'SLIs, SLOs, metrics, structured logs, and alert policies that fire before customers notice.',      accent:'#72dfac'},
          {Icon:Search,      title:'INVESTIGATE', body:'Incident response, Kubernetes event correlation, distributed tracing, and structured RCA templates.', accent:'#f0bc62'},
          {Icon:Wrench,      title:'RECOVER',     body:'Automated runbooks, canary rollbacks, self-healing policies, and CI/CD guardrails.',                 accent:'#df694e'},
        ].map(({Icon,title,body,accent}) => (
          <motion.article key={title} className="hv2-loop-card" variants={fadeUp}
            whileHover={{y:-6,transition:{duration:0.2}}}>
            <div className="hv2-lc-accent" style={{background:accent}}/>
            <div className="hv2-lc-icon" style={{color:accent}}><Icon size={24}/></div>
            <h3>{title}</h3>
            <p>{body}</p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>

    {/* ══ STACK ══ */}
    <motion.section className="hv2-section hv2-stack-section"
      initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} variants={stagger}>
      <motion.div className="hv2-section-lead" variants={fadeUp}>
        <p className="hv2-eyebrow">Reliability stack</p>
        <h2>Systems thinking,<br/><em>layer by layer.</em></h2>
      </motion.div>
      <motion.div className="hv2-stack-layers" variants={stagger}>
        {[
          {label:'OPERATIONS',    detail:'SLO · SLI · Incident Response · RCA · Runbooks · On-call', color:'#df694e'},
          {label:'OBSERVABILITY', detail:'Prometheus · Grafana · CloudWatch · Jaeger · OpenTelemetry',color:'#f0bc62'},
          {label:'ORCHESTRATION', detail:'Kubernetes · EKS · AKS · Helm · ArgoCD',                  color:'#65cfe5'},
          {label:'INFRASTRUCTURE',detail:'Terraform · AWS · Azure · GCP · Ansible',                 color:'#72dfac'},
          {label:'AUTOMATION',    detail:'Python · Bash · GitHub Actions · Jenkins · CI/CD',        color:'#8784d2'},
        ].map(({label,detail,color},i) => (
          <motion.div key={label} className="hv2-stack-row" variants={fadeUp}
            whileHover={{x:8,transition:{duration:0.18}}}>
            <div className="hv2-stack-bar" style={{background:color}}/>
            <div className="hv2-stack-content">
              <span className="hv2-stack-label">{label}</span>
              <span className="hv2-stack-detail">{detail}</span>
            </div>
            <span className="hv2-stack-index">{String(i+1).padStart(2,'0')}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>

    {/* ══ ON-CALL TICKER ══ */}
    <motion.section className="hv2-oncall"
      initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeIn}>
      <div className="hv2-oncall-track">
        {[1,2].map(n => (
          <div key={n} className="hv2-oncall-inner" aria-hidden={n===2}>
            {['ALERT','VERIFY','SCOPE','CORRELATE','ROOT CAUSE','MITIGATE','DOCUMENT','PREVENT'].map(s => (
              <span key={s}>{s} <b>→</b></span>
            ))}
          </div>
        ))}
      </div>
    </motion.section>

    {/* ══ CTA ══ */}
    <motion.section className="hv2-cta"
      initial="hidden" whileInView="visible" viewport={{once:true,margin:'-60px'}} variants={stagger}>
      <motion.p className="hv2-eyebrow" variants={fadeUp}>Ready to collaborate?</motion.p>
      <motion.h2 variants={fadeUp}>Have a platform problem<br/><em>worth solving?</em></motion.h2>
      <motion.div className="hv2-cta-actions" variants={fadeUp}>
        <Link className="hv2-btn-primary" to="/contact">Let's talk <ArrowUpRight size={16}/></Link>
        <Link className="hv2-btn-ghost"   to="/projects">Browse work <ArrowUpRight size={15}/></Link>
      </motion.div>
    </motion.section>

  </main>
)

export default Home
