import { ArrowUpRight, MapPin, Github, Linkedin, FileText, Zap, Shield, GitBranch, Layers, BookOpen, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { timeline } from '../data/about'
import '../pages-unified.css'

const fadeUp  = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }

const skillGroups = [
  { label: 'Cloud',          color: '#2d8bbf', items: ['AWS', 'Azure', 'GCP'] },
  { label: 'Orchestration',  color: '#27ae78', items: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD'] },
  { label: 'Infrastructure', color: '#d4940a', items: ['Terraform', 'Ansible', 'NGINX'] },
  { label: 'Observability',  color: '#e8674a', items: ['Prometheus', 'Grafana', 'SonarQube', 'Trivy'] },
  { label: 'CI/CD & Automation', color: '#7c79ca', items: ['GitHub Actions', 'Jenkins', 'GitLab', 'Python', 'Bash'] },
]

const tlClass = (item) => {
  if (item.type === 'teaching')  return 'is-teaching'
  if (item.type === 'education') return 'is-education'
  return 'is-current'
}
const tlBadge = (item) => {
  if (item.type === 'teaching')  return 'EDUCATOR'
  if (item.type === 'education') return 'EDUCATION'
  return 'ENGINEERING'
}

const About = () => (
  <main className="about-page-v3">

    {/* ═══════════ HERO ═══════════ */}
    <section className="ap3-hero">
      <div className="ap3-hero-grid">

        {/* left — copy */}
        <motion.div className="ap3-hero-copy" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="ap3-available" variants={fadeUp}>
            <span className="ap3-available-dot" />
            Open to Cloud / SRE roles
          </motion.div>

          <motion.h1 className="ap3-name" variants={fadeUp}>
            Daksh<br /><em>Sawhney.</em>
          </motion.h1>

          <motion.p className="ap3-role" variants={fadeUp}>
            Cloud &amp; SRE Engineer · Educator · Builder
          </motion.p>

          <motion.p className="ap3-bio" variants={fadeUp}>
            I build <strong>multicloud systems</strong> that run in production —
            resilient infrastructure, self-healing platforms, and observability stacks.
            Alongside that, I <strong>teach DevOps and Cloud engineering</strong>,
            turning complex systems into something learnable and actionable.
          </motion.p>

          <motion.div className="ap3-actions" variants={fadeUp}>
            <a className="ap3-btn ap3-btn-primary" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">
              <FileText size={15} /> Resume
            </a>
            <a className="ap3-btn ap3-btn-outline" href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer">
              <Github size={15} /> GitHub
            </a>
            <a className="ap3-btn ap3-btn-outline" href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer">
              <Linkedin size={15} /> LinkedIn
            </a>
          </motion.div>

          <motion.div className="ap3-meta" variants={fadeUp}>
            <span><MapPin size={13} /> Jammu, India</span>
            <span><BookOpen size={13} /> B.Tech CSE · HBTU Kanpur · 2027</span>
          </motion.div>
        </motion.div>

        {/* right — photo */}
        <motion.div
          className="ap3-hero-photo-col"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22,1,0.36,1] }}
        >
          <div className="ap3-photo-wrap">
            <div className="ap3-stat-pill ap3-pill-1">
              <strong>180h+</strong>
              <span>DevOps taught</span>
            </div>
            <div className="ap3-stat-pill ap3-pill-2">
              <strong>25+</strong>
              <span>Systems shipped</span>
            </div>
            <img
              className="ap3-photo"
              src="/profile_photo/photo-removebg-preview.png"
              alt="Daksh Sawhney — Cloud & SRE Engineer"
              loading="eager"
            />
          </div>
        </motion.div>

      </div>

      {/* stats bar — real achievements only */}
      <motion.div className="ap3-stats-bar" initial="hidden" animate="visible" variants={stagger}>
        {[
          { val: '180h+', label: 'DevOps content taught' },
          { val: '100h+', label: 'Multicloud sessions run' },
          { val: '25+',   label: 'Production systems built' },
          { val: '78%',   label: 'MTTR reduction achieved' },
        ].map(({ val, label }) => (
          <motion.div key={label} className="ap3-stat-cell" variants={fadeUp}>
            <span className="ap3-stat-val">{val}</span>
            <span className="ap3-stat-lbl">{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* ═══════════ JOURNEY — only what matters ═══════════ */}
    <motion.section
      className="ap3-section"
      style={{ background: 'var(--pu-paper)' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={stagger}
    >
      <div className="ap3-section-inner">
        <motion.div className="ap3-section-label" variants={fadeUp}>
          <span className="ap3-section-num">01</span>
          <h2 className="ap3-section-title">How I got here</h2>
          <p className="ap3-section-sub">What I've been building and teaching.</p>
        </motion.div>

        <div className="ap3-timeline">
          {timeline.map((item, i) => (
            <motion.div
              key={`${item.year}-${i}`}
              className={`ap3-tl-item ${tlClass(item)}`}
              variants={fadeUp}
            >
              <div className="ap3-tl-gutter">
                <div className="ap3-tl-dot" />
                {i < timeline.length - 1 && <div className="ap3-tl-connector" />}
              </div>
              <div className="ap3-tl-card">
                <div className="ap3-tl-top">
                  <span className="ap3-tl-year">{item.year}</span>
                  <span className="ap3-tl-tag">{tlBadge(item)}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* ═══════════ TEACHING NUMBERS ═══════════ */}
    <motion.section
      className="ap3-section"
      style={{ background: '#f0ede5' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={stagger}
    >
      <div className="ap3-section-inner">
        <motion.div className="ap3-section-label" variants={fadeUp}>
          <span className="ap3-section-num">02</span>
          <h2 className="ap3-section-title">Teaching &amp; education</h2>
          <p className="ap3-section-sub">Hours of structured content, not student counts.</p>
        </motion.div>

        <motion.div variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            {
              icon: <Clock size={20} />,
              color: '#e8674a',
              stat: '180+ hours',
              title: 'DevOps — End to End',
              body: 'Linux fundamentals → Docker → Kubernetes → CI/CD → security scanning → production deployments. Full structured curriculum with hands-on projects at every stage.',
            },
            {
              icon: <Clock size={20} />,
              color: '#2d8bbf',
              stat: '100+ hours',
              title: 'Multicloud Engineering',
              body: 'AWS and Azure from the ground up — core services, Terraform IaC, cross-cloud networking, cost management, and real-world architecture patterns.',
            },
            {
              icon: <GitBranch size={20} />,
              color: '#7c79ca',
              stat: 'Project-led',
              title: 'Every lesson tied to a working system',
              body: 'No death by slides. Every module is anchored to a real project — students deploy, break, observe, and fix actual infrastructure.',
            },
          ].map(({ icon, color, stat, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 1fr',
                gap: '14px 16px',
                padding: '20px 22px',
                background: '#fff',
                border: '1px solid var(--pu-border)',
                borderRadius: 12,
                alignItems: 'start',
              }}
            >
              <div style={{
                display: 'grid', placeItems: 'center',
                width: 44, height: 44,
                background: color + '12',
                border: `1px solid ${color}30`,
                borderRadius: 10,
                color,
                flexShrink: 0,
              }}>{icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--pu-ink)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-.02em' }}>{stat}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--pu-muted)' }}>·  {title}</span>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--pu-muted)' }}>{body}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

    {/* ═══════════ CAPABILITIES ═══════════ */}
    <motion.section
      className="ap3-section"
      style={{ background: 'var(--pu-paper)' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={stagger}
    >
      <div className="ap3-section-inner">
        <motion.div className="ap3-section-label" variants={fadeUp}>
          <span className="ap3-section-num">03</span>
          <h2 className="ap3-section-title">What I bring</h2>
          <p className="ap3-section-sub">Four areas where I build and operate.</p>
        </motion.div>

        <motion.div className="ap3-caps" variants={stagger}>
          {[
            {
              icon: <Layers size={22}/>, color:'#2d8bbf',
              title: 'Cloud Architecture',
              body: 'Designed multi-region AWS infra with Terraform, Route53 global routing, CloudFront CDN, WAF, and EKS. Scaled systems from single instances to 1M+ user load.',
              tags: ['AWS', 'Azure', 'Terraform', 'EKS', 'Route53'],
            },
            {
              icon: <Shield size={22}/>, color:'#27ae78',
              title: 'Reliability & Observability',
              body: 'Built SRE frameworks with Prometheus, Grafana, and X-Ray tracing. Reduced MTTR by 78% and SEV frequency by 65% with ML-driven AIOps and automated playbooks.',
              tags: ['Prometheus', 'Grafana', 'SLO/SLI', 'AIOps', 'RCA'],
            },
            {
              icon: <GitBranch size={22}/>, color:'#d4940a',
              title: 'DevSecOps Delivery',
              body: 'End-to-end pipelines with GitHub Actions, Jenkins, ArgoCD, Trivy, and SonarQube. Cut deployment time by 70% with zero-touch GitOps across AWS and Azure.',
              tags: ['GitHub Actions', 'Jenkins', 'Trivy', 'ArgoCD', 'GitOps'],
            },
            {
              icon: <Zap size={22}/>, color:'#e8674a',
              title: 'Platform Engineering',
              body: 'Built chaos engineering tools, FinOps platforms, log ingestion pipelines, and a custom deployment platform (DeploySphere) handling real-time traffic at scale.',
              tags: ['Kubernetes', 'Helm', 'Kafka', 'ClickHouse', 'Chaos'],
            },
          ].map(({ icon, color, title, body, tags }) => (
            <motion.div
              key={title}
              className="ap3-cap-card"
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.18 } }}
            >
              <div className="ap3-cap-bar" style={{ background: color }} />
              <div className="ap3-cap-icon" style={{ color }}>{icon}</div>
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="ap3-cap-tags">
                {tags.map(t => <span key={t}>{t}</span>)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

    {/* ═══════════ SKILLS ═══════════ */}
    <motion.section
      className="ap3-section"
      style={{ background: '#f0ede5', borderBottom: 'none', paddingBottom: 'clamp(72px,10vh,120px)' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={stagger}
    >
      <div className="ap3-section-inner">
        <motion.div className="ap3-section-label" variants={fadeUp}>
          <span className="ap3-section-num">04</span>
          <h2 className="ap3-section-title">Working toolkit</h2>
          <p className="ap3-section-sub">Technologies I use in production.</p>
        </motion.div>

        <motion.div className="ap3-skill-groups" variants={stagger}>
          {skillGroups.map(({ label, color, items }) => (
            <motion.div key={label} className="ap3-sg" variants={fadeUp}>
              <div className="ap3-sg-label" style={{ color }}>
                <span style={{ display:'inline-block', width:3, height:14, background:color, borderRadius:2, marginRight:6 }} />
                {label}
              </div>
              <div className="ap3-sg-pills">
                {items.map(s => <span key={s} className="ap3-sg-pill">{s}</span>)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

  </main>
)

export default About
