import { ArrowUpRight, ShieldCheck, Activity, Zap } from 'lucide-react'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SelfHealingCluster from '../components/SelfHealingCluster'
import SkillGalaxy from '../components/SkillGalaxy'
import ImpactStrip from '../components/ImpactStrip'
import StackMarquee from '../components/StackMarquee'
import WarRoom from '../components/WarRoom'
import IncidentDeck from '../components/IncidentDeck'
import '../home-v2.css'

/* ─── variants ─── */
const fadeUp  = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }

/* ─── typing headline ─── */
const TYPED_WORDS = ['that self-heal.', 'for resilience.', 'that scale.', 'for reliability.']
const TypedText = ({ words }) => {
  const boxRef = useRef(null)
  const [idx, setIdx]           = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting]   = useState(false)
  // pause typing while the hero is off-screen or the tab is hidden (it re-lays out the page each keystroke)
  const [active, setActive] = useState(true)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    let visible = true
    const update = () => setActive(visible && !document.hidden)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; update() })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])

  useEffect(() => {
    if (!active) return
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
  }, [displayed, deleting, idx, words, active])

  // Keep the phrase on ONE line: measure every phrase at the h1 size and scale
  // this line down just enough for the widest one to fit the column.
  const sizerRefs = useRef([])
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const fit = () => {
      const avail = box.parentElement.clientWidth
      const need = Math.max(...sizerRefs.current.map(el => el?.offsetWidth || 0))
      if (avail && need) setScale(Math.min(1, (avail - 4) / need))
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(box.parentElement)
    return () => ro.disconnect()
  }, [words])

  return (
    <span className="typed-fit" ref={boxRef}>
      {words.map((w, i) => (
        <span key={w} className="typed-sizer" aria-hidden="true" ref={el => (sizerRefs.current[i] = el)}>{w}|</span>
      ))}
      <span className="typed-word" style={{ fontSize: `${scale}em` }}>{displayed}<span className="typed-cursor">|</span></span>
    </span>
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
              <TypedText words={TYPED_WORDS}/>
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

    {/* ══ METRICS — one colour system ══ */}
    <ImpactStrip/>

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
        <WarRoom/>
      </motion.div>
    </motion.section>

    {/* ══ FEEDBACK LOOP — the incident deck ══ */}
    <IncidentDeck/>

    {/* ══ STACK — physics constellation: tools wired to real work ══ */}
    <SkillGalaxy/>

    {/* ══ STACK MARQUEE — scroll-velocity driven ══ */}
    <StackMarquee/>

  </main>
)

export default Home
