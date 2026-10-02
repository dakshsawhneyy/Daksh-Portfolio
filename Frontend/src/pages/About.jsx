import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useSpring, animate } from 'framer-motion'
import {
  MapPin, Github, Linkedin, FileText, BookOpen, Briefcase, GraduationCap,
  Layers, Shield, GitBranch, Zap, ArrowUpRight, Sparkles,
} from 'lucide-react'
import { timeline, skillGroups } from '../data/about'
import Portrait from '../components/Portrait'
import '../styles/about.css'

/* ══════════════════════════════════════════════════════════════════
   ABOUT — hero (portrait) → role marquee → numbers → the path
   (self-drawing timeline) → classroom (280-dot matrix) → what I
   bring (bento) → toolkit (terminal tree).
   All motion is one-shot (in-view) or compositor-only.
   ══════════════════════════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1]
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }

const Count = ({ to, decimals = 0, prefix = '', suffix = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  useEffect(() => {
    if (!inView) return
    const node = ref.current
    const c = animate(0, to, {
      duration: 1.6, ease: [0.16, 1, 0.3, 1],
      onUpdate: v => { node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}` },
    })
    return () => c.stop()
  }, [inView, to, decimals, prefix, suffix])
  return <span ref={ref}>{prefix}{(0).toFixed(decimals)}{suffix}</span>
}

const NUMBERS = [
  { to: 180, suffix: 'h+', label: 'DevOps & SRE taught', sub: 'SelfCode Academy' },
  { to: 100, suffix: 'h+', label: 'Multi-cloud taught', sub: 'AWS · Azure · GCP' },
  { to: 40, prefix: '−', suffix: '%', label: 'P95 latency', sub: 'AWS internship' },
  { to: 30, prefix: '−', suffix: '%', label: 'MTTR', sub: 'alarms + runbooks' },
  { to: 8.2, decimals: 1, label: 'CGPA', sub: 'B.Tech CSE · HBTU' },
]

const TL_META = {
  teaching: { Icon: BookOpen, color: '#27ae78', badge: 'Instructor' },
  experience: { Icon: Briefcase, color: '#2d8bbf', badge: 'Internship' },
  education: { Icon: GraduationCap, color: '#7c79ca', badge: 'Education' },
}

const BRING = [
  { Icon: Layers, color: '#2d8bbf', metric: '−40%', metricLabel: 'P95 latency', title: 'Cloud & Infrastructure',
    body: 'Serverless APIs on Lambda + API Gateway + DynamoDB in production. Multi-region EKS, Route53 global routing and CloudFront, built for a 50k concurrent-user load.',
    tags: ['AWS EKS', 'Lambda', 'Terraform', 'Route53', 'AKS'], span: 'wide' },
  { Icon: Shield, color: '#27ae78', metric: '−30%', metricLabel: 'MTTR', title: 'Reliability & Observability',
    body: 'CloudWatch dashboards, alarms and on-call runbooks that shortened live incidents. Built Incident Zero for SRE training.',
    tags: ['Prometheus', 'Grafana', 'SLO/SLI', 'RCA'] },
  { Icon: GitBranch, color: '#d4940a', metric: '−70%', metricLabel: 'deploy time', title: 'CI/CD & DevSecOps',
    body: 'Terraform + GitHub Actions pipelines took deploys from 40 to 12 minutes, with Trivy, SonarQube and least-privilege IAM baked in.',
    tags: ['GitHub Actions', 'ArgoCD', 'Trivy', 'GitOps'] },
  { Icon: Zap, color: '#e8674a', metric: '5', metricLabel: 'failure scenarios', title: 'Chaos & Platform Engineering',
    body: 'Reproducible CrashLoopBackOff, OOMKilled, DNS, DB-exhaustion and latency incidents, each one solved from logs to RCA.',
    tags: ['Kubernetes', 'Chaos', 'Helm', 'FinOps'], span: 'wide' },
]

const ROLES = ['Cloud Engineer', 'DevOps', 'SRE', 'Platform', 'Multi-Cloud Instructor', 'Builder', 'Chaos Engineer']

/* ── the path: a timeline whose spine draws itself as you scroll ── */
const Path = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  return (
    <section className="ab-path" id="experience" ref={ref}>
      <div className="ab-wrap">
        <motion.header className="ab-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.span className="ab-k" variants={fadeUp}>01 · the path</motion.span>
          <motion.h2 className="ab-h2" variants={fadeUp}>How I got <em>here.</em></motion.h2>
        </motion.header>

        <div className="ab-tl">
          <div className="ab-spine" aria-hidden="true"><motion.span style={{ scaleY: fill }} /></div>
          {timeline.map((item, i) => {
            const m = TL_META[item.type] || TL_META.experience
            const startYear = (item.year.match(/\d{4}/) || [''])[0]
            return (
              <motion.article key={item.title} className={`ab-tl-item ${i % 2 ? 'is-right' : ''}`}
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, ease }}
                style={{ '--c': m.color }}>
                <span className="ab-tl-year" aria-hidden="true">{startYear}</span>
                <motion.span className="ab-tl-node" initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-120px' }} transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.2 }}>
                  <m.Icon size={16} />
                </motion.span>
                <div className="ab-tl-card">
                  <div className="ab-tl-top">
                    <span className="ab-tl-badge">{m.badge}</span>
                    <span className="ab-tl-when">{item.year}</span>
                  </div>
                  <h3>{item.title}</h3>
                  {item.role && <p className="ab-tl-role">{item.role}</p>}
                  <p className="ab-tl-desc">{item.description}</p>
                  {item.extra && <div className="ab-tl-impact">{item.extra.split('·').map(x => <span key={x}>{x.trim()}</span>)}</div>}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── classroom: one dot per hour taught ── */
const Classroom = () => {
  const [on, setOn] = useState(false)
  const dots = Array.from({ length: 280 }, (_, i) => i)
  return (
    <section className="ab-class">
      <div className="ab-wrap ab-class-grid">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.span className="ab-k" variants={fadeUp}>02 · in the classroom</motion.span>
          <motion.h2 className="ab-h2" variants={fadeUp}><em>280 hours</em> of teaching<br />cloud to engineers.</motion.h2>
          <motion.p className="ab-lead" variants={fadeUp}>
            Every dot is an hour in front of a class at SelfCode Academy. 180 hours of DevOps and SRE earned a promotion
            to the multi-cloud track, and 100+ hours across AWS, Azure and GCP followed.
          </motion.p>
          <motion.div className="ab-tracks" variants={fadeUp}>
            <div className="ab-track" style={{ '--c': '#e8674a' }}>
              <b>180+ h</b><span>DevOps · end to end</span>
              <small>Docker · Kubernetes · Terraform · CI/CD · Incident response</small>
            </div>
            <span className="ab-promo" aria-hidden="true"><ArrowUpRight size={16} /> promoted</span>
            <div className="ab-track" style={{ '--c': '#2d8bbf' }}>
              <b>100+ h</b><span>Multi-cloud engineering</span>
              <small>Terraform IaC · EKS / AKS / GKE · Serverless · FinOps · 2 capstones</small>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className={`ab-matrix ${on ? 'is-on' : ''}`} onViewportEnter={() => setOn(true)} viewport={{ once: true, margin: '-120px' }}
          aria-label="280 hours taught: 180 DevOps, 100 multi-cloud" role="img">
          {dots.map(i => <i key={i} className={i < 180 ? 'd' : 'm'} style={{ '--i': i }} />)}
          <div className="ab-matrix-legend">
            <span><i className="d" />DevOps &amp; SRE</span>
            <span><i className="m" />Multi-cloud</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const spotlight = (e) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}

const About = () => (
  <main className="ab-root">

    {/* ═════ HERO ═════ */}
    <section className="ab-hero">
      <div className="ab-hero-grid">
        <motion.div className="ab-hero-copy" initial="hidden" animate="show" variants={stagger}>
          <motion.div className="ab-avail" variants={fadeUp}>
            <span className="ap3-available-dot" /> Open to work · immediate joiner
          </motion.div>
          <h1 className="ab-name" aria-label="Daksh Sawhney">
            {['Daksh', 'Sawhney.'].map((word, wi) => (
              <span key={word} className={`ab-name-line ${wi ? 'is-em' : ''}`}>
                {[...word].map((ch, ci) => (
                  <motion.span key={ci} className="ab-ch" aria-hidden="true"
                    initial={{ y: '110%', rotate: 8 }} animate={{ y: '0%', rotate: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.15 + wi * 0.18 + ci * 0.035 }}>
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p className="ab-role" variants={fadeUp}>Cloud &amp; DevOps Engineer · Multi-Cloud Instructor · Builder</motion.p>
          <motion.p className="ab-bio" variants={fadeUp}>
            I build <strong>multicloud systems that run in production</strong>: self-healing platforms, observability
            pipelines and infrastructure that stays up. I also <strong>teach multi-cloud engineering</strong>, from VPC
            networking to production deployments on AWS, Azure and GCP.
          </motion.p>
          <motion.div className="ab-actions" variants={fadeUp}>
            <a className="ab-btn ab-btn-primary" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer"><FileText size={15} /> View resume</a>
            <a className="ab-btn" href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
            <a className="ab-btn" href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
          </motion.div>
          <motion.div className="ab-meta" variants={fadeUp}>
            <span><MapPin size={13} /> Jammu, India · open to relocation</span>
            <span><GraduationCap size={13} /> B.Tech CSE · HBTU Kanpur</span>
          </motion.div>
        </motion.div>
        <div className="pt-col"><Portrait /></div>
      </div>
    </section>

    {/* ═════ ROLE MARQUEE ═════ */}
    <section className="ab-marquee" aria-hidden="true">
      <div className="ab-marquee-track">
        {[0, 1].map(k => (
          <div key={k} className="ab-marquee-set">
            {ROLES.map(r => <span key={r}>{r}<Sparkles size={22} /></span>)}
          </div>
        ))}
      </div>
    </section>

    {/* ═════ NUMBERS ═════ */}
    <section className="ab-numbers">
      <div className="ab-wrap">
        <motion.div className="ab-num-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
          {NUMBERS.map(n => (
            <motion.div key={n.label} className="ab-num" variants={fadeUp}>
              <strong><Count to={n.to} decimals={n.decimals} prefix={n.prefix} suffix={n.suffix} /></strong>
              <span>{n.label}</span>
              <small>{n.sub}</small>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <Path />
    <Classroom />

    {/* ═════ WHAT I BRING ═════ */}
    <section className="ab-bring">
      <div className="ab-wrap">
        <motion.header className="ab-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.span className="ab-k" variants={fadeUp}>03 · what I bring</motion.span>
          <motion.h2 className="ab-h2" variants={fadeUp}>Outcomes, <em>not adjectives.</em></motion.h2>
        </motion.header>
        <motion.div className="ab-bento" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
          {BRING.map(b => (
            <motion.article key={b.title} className={`ab-tile ${b.span === 'wide' ? 'is-wide' : ''}`} variants={fadeUp}
              style={{ '--c': b.color }} onPointerMove={spotlight}>
              <div className="ab-tile-top">
                <span className="ab-tile-icon"><b.Icon size={20} /></span>
                <span className="ab-tile-metric"><strong>{b.metric}</strong><small>{b.metricLabel}</small></span>
              </div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
              <div className="ab-tile-tags">{b.tags.map(t => <span key={t}>{t}</span>)}</div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ═════ TOOLKIT ═════ */}
    <section className="ab-tools">
      <div className="ab-wrap ab-tools-grid">
        <motion.header initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.span className="ab-k" variants={fadeUp}>04 · toolkit</motion.span>
          <motion.h2 className="ab-h2" variants={fadeUp}>What's actually<br /><em>in the belt.</em></motion.h2>
          <motion.p className="ab-lead" variants={fadeUp}>Not a logo wall. These are the tools I've shipped with, taught, or debugged at 2 a.m.</motion.p>
        </motion.header>
        <motion.div className="ab-term" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease }}>
          <div className="ab-term-bar"><i /><i /><i /><span>daksh@portfolio: ~/toolkit</span></div>
          <div className="ab-term-body">
            <p className="ab-term-cmd"><b>❯</b> tree ~/toolkit --dirsfirst</p>
            {skillGroups.map((g, gi) => (
              <div key={g.label} className="ab-term-dir" style={{ '--c': g.color }}>
                <p className="ab-term-name">{gi === skillGroups.length - 1 ? '└──' : '├──'} <b>{g.label.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}/</b></p>
                <div className="ab-term-files">
                  {g.items.map(s => <span key={s}>{s.includes('(') ? s.slice(0, s.indexOf('(')).trim() : s}</span>)}
                </div>
              </div>
            ))}
            <p className="ab-term-sum">{skillGroups.length} directories, {skillGroups.reduce((a, g) => a + g.items.length, 0)} tools<span className="ab-caret" /></p>
          </div>
        </motion.div>
      </div>
    </section>
  </main>
)

export default About
