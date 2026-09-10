import { MapPin, Github, Linkedin, FileText, Zap, Shield, GitBranch, Layers, BookOpen, Briefcase, GraduationCap, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { timeline, skillGroups } from '../data/about'
import '../pages-unified.css'
import '../about-v2.css'

const fadeUp  = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }

const tlIcon = (type) => {
  if (type === 'teaching')  return <BookOpen size={16} />
  if (type === 'education') return <GraduationCap size={16} />
  return <Briefcase size={16} />
}
const tlColor = (type) => {
  if (type === 'teaching')  return '#27ae78'
  if (type === 'education') return '#7c79ca'
  return '#2d8bbf'
}
const tlBadge = (type) => {
  if (type === 'teaching')  return 'INSTRUCTOR'
  if (type === 'education') return 'EDUCATION'
  return 'INTERNSHIP'
}

const About = () => (
  <main className="about-page-v3">

    {/* ═══════════ HERO ═══════════ */}
    <section className="ap3-hero">
      <div className="ap3-hero-grid">

        {/* left copy */}
        <motion.div className="ap3-hero-copy" initial="hidden" animate="visible" variants={stagger}>
          <motion.div className="ap3-available" variants={fadeUp}>
            <span className="ap3-available-dot" />
            Open to Cloud / SRE roles · Aug 2027
          </motion.div>

          <motion.h1 className="ap3-name" variants={fadeUp}>
            Daksh<br /><em>Sawhney.</em>
          </motion.h1>

          <motion.p className="ap3-role" variants={fadeUp}>
            Cloud &amp; DevOps Engineer · Multi-Cloud Instructor · Builder
          </motion.p>

          <motion.p className="ap3-bio ap3-bio-line" variants={fadeUp}>
            I build <strong>multicloud systems</strong> that run in production......     
            self-healing platforms, observability pipelines, and reliable infrastructure.
          </motion.p>
          <motion.p className="ap3-bio ap3-bio-line" variants={fadeUp}>
            I also <strong>teach Multi-Cloud Computing</strong>, 
            covering AWS, Azure, and GCP from networking through to production deployments.
          </motion.p>

          <motion.div className="ap3-actions" variants={fadeUp}>
            <a className="ap3-btn ap3-btn-primary" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">
              <FileText size={15} /> View Resume
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
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22,1,0.36,1] }}
        >
          <div className="ap3-photo-frame">
            <div className="ap3-corner ap3-corner-tl" />
            <div className="ap3-corner ap3-corner-tr" />
            <div className="ap3-corner ap3-corner-bl" />
            <div className="ap3-corner ap3-corner-br" />
            <div className="ap3-photo-bg" />
            <img
              className="ap3-photo"
              src="/profile_photo/photo-removebg-preview.png"
              alt="Daksh Sawhney"
              loading="eager"
            />

            {/* Multi-Cloud Instructor badge — dark glass pill */}
            <motion.div
              className="ap3-float-card ap3-badge-tr"
              initial={{ opacity: 0, y: -12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, ease: [0.22,1,0.36,1] }}
            >
              <div className="ap3-company-logo ap3-logo-selfcode">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="7" fill="#0f172a"/>
                  <path d="M8 9L5 14l3 5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 9l3 5-3 5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 8l-4 12" stroke="#e8674a" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="ap3-fc-val">Multi-Cloud Instructor</div>
                <div className="ap3-fc-sub">SelfCode Academy · 2026</div>
              </div>
            </motion.div>

            {/* AWS Intern badge */}
            <motion.div
              className="ap3-float-card ap3-badge-bl"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.85, duration: 0.5, ease: [0.22,1,0.36,1] }}
            >
              <div className="ap3-company-logo ap3-logo-aws">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="7" fill="#232f3e"/>
                  <path d="M7.5 17.5c1.8 1.6 4.2 2.5 6.5 2.5s4.7-.9 6.5-2.5" stroke="#ff9900" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M19.5 16l1.5 1.5-1.5 1" stroke="#ff9900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <text x="5.5" y="15" fontFamily="Arial, sans-serif" fontSize="7.5" fontWeight="800" fill="white" letterSpacing="0.5">aws</text>
                </svg>
              </div>
              <div>
                <div className="ap3-fc-val">AWS Cloud Intern</div>
                <div className="ap3-fc-sub">IPage UMS · 2025</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* stats bar */}
      <motion.div className="ap3-stats-bar" initial="hidden" animate="visible" variants={stagger}>
        {[
          { val: '180h+', label: 'DevOps content delivered'      },
          { val: '100h+', label: 'Multi-cloud content delivered'  },
          { val: '40%',   label: 'P95 latency cut (AWS intern)' },
          { val: '8.2',   label: 'CGPA — B.Tech CSE'          },
        ].map(({ val, label }) => (
          <motion.div key={label} className="ap3-stat-cell" variants={fadeUp}>
            <span className="ap3-stat-val">{val}</span>
            <span className="ap3-stat-lbl">{label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>

    {/* ═══════════ HOW I GOT HERE ═══════════ */}
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
          <p className="ap3-section-sub">Experience and education, chronologically.</p>
        </motion.div>

        <div className="ap3-timeline">
          {timeline.map((item, i) => {
            const color = tlColor(item.type)
            return (
              <motion.div key={i} className="ap3-tl-item" variants={fadeUp}>
                <div className="ap3-tl-gutter">
                  <div className="ap3-tl-icon-wrap" style={{ background: color + '18', border: `2px solid ${color}40`, color }}>
                    {tlIcon(item.type)}
                  </div>
                  {i < timeline.length - 1 && <div className="ap3-tl-connector" />}
                </div>
                <div className="ap3-tl-card">
                  <div className="ap3-tl-top">
                    <span className="ap3-tl-year">{item.year}</span>
                    <span className="ap3-tl-tag" style={{ color, borderColor: color + '40', background: color + '10' }}>
                      {tlBadge(item.type)}
                    </span>
                    {item.extra && (
                      <span className="ap3-tl-extra">{item.extra}</span>
                    )}
                  </div>
                  <h3>{item.title}</h3>
                  {item.role && <div className="ap3-tl-role">{item.role}</div>}
                  <p>{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>

    {/* ═══════════ TEACHING — hours + what's covered ═══════════ */}
    <motion.section
      className="ap3-section"
      style={{ background: '#f5f2ea' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={stagger}
    >
      <div className="ap3-section-inner">
        <motion.div className="ap3-section-label" variants={fadeUp}>
          <span className="ap3-section-num">02</span>
          <h2 className="ap3-section-title">Teaching &amp; instruction</h2>
          <p className="ap3-section-sub">Multi-Cloud Instructor at SelfCode Academy.</p>
        </motion.div>

        <motion.div variants={stagger} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            {
              color: '#e8674a',
              hours: '180+ hours',
              track: 'DevOps — End to End',
              bullets: [
                'Docker · Kubernetes · Terraform · CI/CD · Incident Response',
                'Promoted to multi-cloud track after completing this curriculum',
              ],
            },
            {
              color: '#2d8bbf',
              hours: '100+ hours',
              track: 'Multi-Cloud Engineering (AWS · Azure · GCP)',
              bullets: [
                'Terraform multi-cloud IaC',
                'Container orchestration: EKS, AKS, GKE · Serverless · FinOps',
              ],
            },
          ].map(({ color, hours, track, bullets }) => (
            <motion.div
              key={track}
              variants={fadeUp}
              style={{
                padding: '20px 24px',
                background: '#fff',
                border: `1px solid ${color}30`,
                borderLeft: `4px solid ${color}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: 18, color, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-.02em' }}>{hours}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--pu-ink)' }}>{track}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {bullets.map(b => (
                  <li key={b} style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--pu-muted)' }}>{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

    {/* ═══════════ WHAT I BRING ═══════════ */}
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
          <p className="ap3-section-sub">Real outcomes, not bullet-point skills.</p>
        </motion.div>

        <motion.div className="ap3-caps" variants={stagger}>
          {[
            {
              icon: <Layers size={22}/>, color: '#2d8bbf',
              title: 'Cloud & Infrastructure',
              body: 'Built serverless APIs on AWS Lambda + API Gateway + DynamoDB that cut P95 latency 40%. Designed multi-region EKS infrastructure, Route53 global routing, and CloudFront CDN for 50K concurrent-user load.',
              tags: ['AWS EKS', 'Lambda', 'Terraform', 'Route53', 'AKS'],
            },
            {
              icon: <Shield size={22}/>, color: '#27ae78',
              title: 'Reliability & Observability',
              body: 'Set up CloudWatch dashboards, alarms, and on-call runbooks that cut MTTR 30% during live incidents. Built Incident Zero — a production failure-simulation platform used for SRE training.',
              tags: ['Prometheus', 'Grafana', 'CloudWatch', 'SLO/SLI', 'RCA'],
            },
            {
              icon: <GitBranch size={22}/>, color: '#d4940a',
              title: 'CI/CD & DevSecOps',
              body: 'Automated Terraform + GitHub Actions pipelines that cut deploy time from 40 min to 12 min (70% reduction). Integrated Trivy, SonarQube, and least-privilege IAM across all pipelines.',
              tags: ['GitHub Actions', 'ArgoCD', 'Trivy', 'GitOps', 'IAM'],
            },
            {
              icon: <Zap size={22}/>, color: '#e8674a',
              title: 'Chaos & Platform Engineering',
              body: 'Built Incident Zero chaos platform with 5 reproducible failure scenarios — CrashLoopBackOff, OOMKilled, DNS failures, DB exhaustion, latency spikes — each requiring logs-to-RCA resolution.',
              tags: ['Kubernetes', 'Chaos Engineering', 'AIOps', 'FinOps', 'Helm'],
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

    {/* ═══════════ TOOLKIT ═══════════ */}
    <motion.section
      className="ap3-section"
      style={{ background: '#f5f2ea', borderBottom: 'none', paddingBottom: 'clamp(60px,8vh,100px)' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={stagger}
    >
      <div className="ap3-section-inner">
        <motion.div className="ap3-section-label" variants={fadeUp}>
          <span className="ap3-section-num">04</span>
          <h2 className="ap3-section-title">Toolkit</h2>
          <p className="ap3-section-sub">What I actually use.</p>
        </motion.div>

        <motion.div className="ap3-toolkit-compact" variants={stagger}>
          {skillGroups.map(({ label, color, items }) => (
            <motion.div key={label} className="ap3-tc-row" variants={fadeUp}>
              <span className="ap3-tc-label" style={{ color }}>{label}</span>
              <div className="ap3-tc-pills">
                {items.map(s => (
                  <span key={s} className="ap3-tc-pill">
                    {s.includes('(') ? s.slice(0, s.indexOf('(')).trim() : s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

  </main>
)

export default About
