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

/* ─── multicloud architecture map ─── */

const NODES = [
  { id:'aws',  label:'AWS',        sub:'EKS · Lambda · CloudWatch', x:20, y:22, color:'#f0bc62', dot:'#FF9900' },
  { id:'az',   label:'Azure',      sub:'AKS · VMSS · Load Balancer', x:60, y:10, color:'#65cfe5', dot:'#0078D4' },
  { id:'gcp',  label:'GCP',        sub:'GKE · Cloud Functions',     x:82, y:30, color:'#72dfac', dot:'#4285F4' },
  { id:'prom', label:'Prometheus', sub:'Metrics · Alerts',          x:18, y:64, color:'#e8674a', dot:'#e8674a' },
  { id:'graf', label:'Grafana',    sub:'Dashboards · SLOs',         x:50, y:78, color:'#f0bc62', dot:'#f0b429' },
  { id:'tf',   label:'Terraform',  sub:'IaC · Multi-cloud',         x:80, y:66, color:'#8784d2', dot:'#7B42BC' },
]
const EDGES = [
  ['aws','prom'],['az','prom'],['gcp','prom'],
  ['prom','graf'],['aws','tf'],['az','tf'],['gcp','tf'],
  ['aws','az'],['az','gcp'],
]

const ArchMap = () => {
  const [active, setActive] = useState(null)
  const [pulse,  setPulse]  = useState(0)
  const [pingNode, setPingNode] = useState(null)

  // edge pulse
  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p+1) % EDGES.length), 850)
    return () => clearInterval(t)
  }, [])

  // random node "ping" to show it's live
  useEffect(() => {
    const t = setInterval(() => {
      const n = NODES[Math.floor(Math.random() * NODES.length)]
      setPingNode(n.id)
      setTimeout(() => setPingNode(null), 700)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const nodeById = id => NODES.find(n => n.id === id)

  return (
    <div className="arch-root">
      <div className="arch-bar">
        <div className="arch-bar-dots">
          <span className="arch-bd-r"/><span className="arch-bd-y"/><span className="arch-bd-g"/>
        </div>
        <span className="arch-bar-title">multicloud-topology / live</span>
        <span className="arch-bar-status"><span className="arch-status-dot"/>CONNECTED</span>
      </div>

      <div className="arch-canvas">
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="arch-svg">
          <defs>
            {/* dot grid */}
            <pattern id="ag" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="0.4" fill="rgba(255,255,255,0.07)"/>
            </pattern>
            {/* per-edge gradient */}
            {EDGES.map(([a,b],i) => {
              const na=nodeById(a), nb=nodeById(b)
              return (
                <linearGradient key={i} id={`eg-${i}`}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor={na.color} stopOpacity="0.8"/>
                  <stop offset="100%" stopColor={nb.color} stopOpacity="0.8"/>
                </linearGradient>
              )
            })}
            {/* glow filter */}
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* background */}
          <rect width="100" height="100" fill="url(#ag)"/>
          {/* subtle vignette */}
          <radialGradient id="vig" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="transparent"/>
            <stop offset="100%" stopColor="rgba(7,15,12,0.6)"/>
          </radialGradient>
          <rect width="100" height="100" fill="url(#vig)"/>

          {/* edges */}
          {EDGES.map(([a,b],i) => {
            const na=nodeById(a), nb=nodeById(b), isP = i===pulse
            return (
              <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={`url(#eg-${i})`}
                strokeWidth={isP ? 1.0 : 0.4}
                strokeDasharray={isP ? 'none' : '1 2'}
                opacity={isP ? 0.9 : 0.25}
                style={{transition:'opacity .6s, stroke-width .5s'}}
              />
            )
          })}

          {/* travelling pulse dot on active edge */}
          {(() => {
            const [a,b] = EDGES[pulse]
            const na=nodeById(a), nb=nodeById(b)
            return (
              <motion.circle r="1.5" fill={na.color}
                filter="url(#glow)"
                animate={{cx:[na.x,nb.x], cy:[na.y,nb.y]}}
                transition={{duration:0.82,ease:'linear'}}
              />
            )
          })()}

          {/* nodes */}
          {NODES.map(n => {
            const isActive = active === n.id
            const isPing   = pingNode === n.id
            return (
              <g key={n.id} style={{cursor:'pointer'}}
                onMouseEnter={()=>setActive(n.id)}
                onMouseLeave={()=>setActive(null)}>
                {/* ping ring */}
                {isPing && (
                  <motion.circle cx={n.x} cy={n.y}
                    initial={{r:4, opacity:0.7}}
                    animate={{r:8, opacity:0}}
                    transition={{duration:0.7, ease:'easeOut'}}
                    fill={n.color}
                  />
                )}
                {/* hover glow ring */}
                {isActive && (
                  <motion.circle cx={n.x} cy={n.y} r="7"
                    fill={n.color} opacity="0.1"
                    initial={{scale:0.6}} animate={{scale:1}}
                    transition={{duration:0.18}}
                  />
                )}
                {/* outer ring */}
                <circle cx={n.x} cy={n.y} r="4.2"
                  fill="#091410"
                  stroke={n.color}
                  strokeWidth={isActive ? 1.4 : 0.7}
                  filter={isActive ? 'url(#glow)' : undefined}
                  style={{transition:'stroke-width .2s'}}
                />
                {/* inner dot */}
                <circle cx={n.x} cy={n.y} r="1.8" fill={n.dot} opacity="0.95"/>
                {/* label — positioned to not overlap edges */}
                <text x={n.x} y={n.y + 7.8}
                  textAnchor="middle"
                  fontSize="2.8"
                  fontFamily="ui-monospace,monospace"
                  fontWeight="700"
                  fill={isActive ? n.color : 'rgba(200,234,214,.6)'}
                  style={{transition:'fill .2s', userSelect:'none'}}
                >{n.label}</text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* hover detail */}
      <div className="arch-detail">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div key={active} className="arch-detail-inner"
              initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
              transition={{duration:0.14}}>
              <span className="arch-detail-dot" style={{background:nodeById(active)?.dot}}/>
              <span className="arch-detail-name" style={{color:nodeById(active)?.color}}>{nodeById(active)?.label}</span>
              <span className="arch-detail-sep">·</span>
              <span className="arch-detail-sub">{nodeById(active)?.sub}</span>
            </motion.div>
          ) : (
            <motion.div key="idle" className="arch-detail-inner arch-detail-muted"
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              hover a node to inspect
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* stats */}
      <div className="arch-stats">
        {[{l:'NODES',v:'6'},{l:'CLOUDS',v:'3'},{l:'SERVICES',v:'9'},{l:'UPTIME',v:'99.97%',c:'#72dfac'}].map(({l,v,c})=>(
          <div key={l} className="arch-stat">
            <span>{l}</span><strong style={{color:c||'#fff'}}>{v}</strong>
          </div>
        ))}
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
            <span>Cloud / DevOps/ SRE roles</span>
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
          <ArchMap/>
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
        {value:180, suffix:'h+',  label:'DevOps hours delivered',      icon:<Terminal size={16}/>,    accent:'#f0bc62'},
        {value:100, suffix:'h+',  label:'Multicloud hours delivered',  icon:<ShieldCheck size={16}/>, accent:'#8784d2'},
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
          <motion.div key={label} className="hv2-stack-row" variants={fadeUp}>
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
