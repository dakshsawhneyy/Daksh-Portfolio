import { ArrowUpRight, ShieldCheck, Activity, Terminal, Zap, GitBranch, ExternalLink } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import SelfHealingCluster from '../components/SelfHealingCluster'
import SkillGalaxy from '../components/SkillGalaxy'
import SignalScope from '../components/SignalScope'
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
          <SelfHealingCluster/>
        </motion.div>
      </div>
    </section>

    {/* ══ METRICS ══ */}
    <motion.section className="hv2-metrics"
      initial="hidden" whileInView="visible" viewport={{once:true,margin:'-50px'}} variants={stagger}
      onPointerMove={e => {
        const card = e.target.closest('.hv2-metric-card')
        if (!card) return
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${e.clientX - r.left}px`)
        card.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}>
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

    {/* ══ FEEDBACK LOOP — live telemetry you can break ══ */}
    <SignalScope/>

    {/* ══ STACK — physics constellation: tools wired to real work ══ */}
    <SkillGalaxy/>

    {/* ══ SKILL MARQUEE — colored pills, two-row scroll ══ */}
    <motion.div className="hv2-marquee-wrap"
      initial="hidden" whileInView="visible" viewport={{once:true}} variants={fadeIn}>

      {/* Row 1 — scrolls left */}
      <div className="hv2-marquee-row">
        <div className="hv2-marquee-track hv2-marquee-left">
          {[
            { text:'AWS',          color:'#FF9900', bg:'rgba(255,153,0,.1)',   border:'rgba(255,153,0,.25)' },
            { text:'Kubernetes',   color:'#326CE5', bg:'rgba(50,108,229,.1)',  border:'rgba(50,108,229,.25)' },
            { text:'Terraform',    color:'#7B42BC', bg:'rgba(123,66,188,.1)',  border:'rgba(123,66,188,.25)' },
            { text:'Azure',        color:'#0078D4', bg:'rgba(0,120,212,.1)',   border:'rgba(0,120,212,.25)' },
            { text:'Prometheus',   color:'#e8674a', bg:'rgba(232,103,74,.1)',  border:'rgba(232,103,74,.25)' },
            { text:'Grafana',      color:'#f0b429', bg:'rgba(240,180,41,.1)',  border:'rgba(240,180,41,.25)' },
            { text:'GitHub Actions',color:'#2ea44f',bg:'rgba(46,164,79,.1)',  border:'rgba(46,164,79,.25)' },
            { text:'EKS',          color:'#FF9900', bg:'rgba(255,153,0,.1)',   border:'rgba(255,153,0,.2)' },
            { text:'Helm',         color:'#0f1689', bg:'rgba(15,22,137,.12)',  border:'rgba(15,22,137,.3)' },
            { text:'ArgoCD',       color:'#ef7b4d', bg:'rgba(239,123,77,.1)',  border:'rgba(239,123,77,.25)' },
            { text:'Python',       color:'#3776ab', bg:'rgba(55,118,171,.1)',  border:'rgba(55,118,171,.25)' },
            { text:'Bash',         color:'#72dfac', bg:'rgba(114,223,172,.1)', border:'rgba(114,223,172,.25)' },
          ].concat([
            { text:'AWS',          color:'#FF9900', bg:'rgba(255,153,0,.1)',   border:'rgba(255,153,0,.25)' },
            { text:'Kubernetes',   color:'#326CE5', bg:'rgba(50,108,229,.1)',  border:'rgba(50,108,229,.25)' },
            { text:'Terraform',    color:'#7B42BC', bg:'rgba(123,66,188,.1)',  border:'rgba(123,66,188,.25)' },
            { text:'Azure',        color:'#0078D4', bg:'rgba(0,120,212,.1)',   border:'rgba(0,120,212,.25)' },
            { text:'Prometheus',   color:'#e8674a', bg:'rgba(232,103,74,.1)',  border:'rgba(232,103,74,.25)' },
            { text:'Grafana',      color:'#f0b429', bg:'rgba(240,180,41,.1)',  border:'rgba(240,180,41,.25)' },
            { text:'GitHub Actions',color:'#2ea44f',bg:'rgba(46,164,79,.1)',  border:'rgba(46,164,79,.25)' },
            { text:'EKS',          color:'#FF9900', bg:'rgba(255,153,0,.1)',   border:'rgba(255,153,0,.2)' },
            { text:'Helm',         color:'#0f1689', bg:'rgba(15,22,137,.12)',  border:'rgba(15,22,137,.3)' },
            { text:'ArgoCD',       color:'#ef7b4d', bg:'rgba(239,123,77,.1)',  border:'rgba(239,123,77,.25)' },
            { text:'Python',       color:'#3776ab', bg:'rgba(55,118,171,.1)',  border:'rgba(55,118,171,.25)' },
            { text:'Bash',         color:'#72dfac', bg:'rgba(114,223,172,.1)', border:'rgba(114,223,172,.25)' },
          ]).map((pill, i) => (
            <span key={i} className="hv2-pill"
              style={{ color: pill.color, background: pill.bg, borderColor: pill.border }}>
              {pill.text}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="hv2-marquee-row">
        <div className="hv2-marquee-track hv2-marquee-right">
          {[
            { text:'Incident Response', color:'#e8674a', bg:'rgba(232,103,74,.1)',  border:'rgba(232,103,74,.25)' },
            { text:'SLO / SLI',         color:'#72dfac', bg:'rgba(114,223,172,.1)', border:'rgba(114,223,172,.25)' },
            { text:'GCP',               color:'#4285F4', bg:'rgba(66,133,244,.1)',  border:'rgba(66,133,244,.25)' },
            { text:'Docker',            color:'#2496ed', bg:'rgba(36,150,237,.1)',  border:'rgba(36,150,237,.25)' },
            { text:'OpenTelemetry',     color:'#f5a800', bg:'rgba(245,168,0,.1)',   border:'rgba(245,168,0,.25)' },
            { text:'Ansible',           color:'#e00',    bg:'rgba(238,0,0,.08)',    border:'rgba(238,0,0,.2)' },
            { text:'Linux',             color:'#fcc624', bg:'rgba(252,198,36,.1)',  border:'rgba(252,198,36,.25)' },
            { text:'RCA',               color:'#8784d2', bg:'rgba(135,132,210,.1)', border:'rgba(135,132,210,.25)' },
            { text:'FinOps',            color:'#72dfac', bg:'rgba(114,223,172,.1)', border:'rgba(114,223,172,.25)' },
            { text:'AKS',               color:'#0078D4', bg:'rgba(0,120,212,.1)',   border:'rgba(0,120,212,.25)' },
            { text:'Chaos Engineering', color:'#f0bc62', bg:'rgba(240,188,98,.1)',  border:'rgba(240,188,98,.25)' },
            { text:'CloudWatch',        color:'#FF9900', bg:'rgba(255,153,0,.08)',  border:'rgba(255,153,0,.2)' },
          ].concat([
            { text:'Incident Response', color:'#e8674a', bg:'rgba(232,103,74,.1)',  border:'rgba(232,103,74,.25)' },
            { text:'SLO / SLI',         color:'#72dfac', bg:'rgba(114,223,172,.1)', border:'rgba(114,223,172,.25)' },
            { text:'GCP',               color:'#4285F4', bg:'rgba(66,133,244,.1)',  border:'rgba(66,133,244,.25)' },
            { text:'Docker',            color:'#2496ed', bg:'rgba(36,150,237,.1)',  border:'rgba(36,150,237,.25)' },
            { text:'OpenTelemetry',     color:'#f5a800', bg:'rgba(245,168,0,.1)',   border:'rgba(245,168,0,.25)' },
            { text:'Ansible',           color:'#e00',    bg:'rgba(238,0,0,.08)',    border:'rgba(238,0,0,.2)' },
            { text:'Linux',             color:'#fcc624', bg:'rgba(252,198,36,.1)',  border:'rgba(252,198,36,.25)' },
            { text:'RCA',               color:'#8784d2', bg:'rgba(135,132,210,.1)', border:'rgba(135,132,210,.25)' },
            { text:'FinOps',            color:'#72dfac', bg:'rgba(114,223,172,.1)', border:'rgba(114,223,172,.25)' },
            { text:'AKS',               color:'#0078D4', bg:'rgba(0,120,212,.1)',   border:'rgba(0,120,212,.25)' },
            { text:'Chaos Engineering', color:'#f0bc62', bg:'rgba(240,188,98,.1)',  border:'rgba(240,188,98,.25)' },
            { text:'CloudWatch',        color:'#FF9900', bg:'rgba(255,153,0,.08)',  border:'rgba(255,153,0,.2)' },
          ]).map((pill, i) => (
            <span key={i} className="hv2-pill"
              style={{ color: pill.color, background: pill.bg, borderColor: pill.border }}>
              {pill.text}
            </span>
          ))}
        </div>
      </div>

    </motion.div>

  </main>
)

export default Home
