import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import projects from '../data/projects'
import '../styles/work.css'

const slugify = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const CATEGORY_COLOR = {
  'Cloud':         '#2d8bbf',
  'System Design': '#27ae78',
  'DevOps':        '#d4940a',
  'Python':        '#7c79ca',
  'Reliability':   '#e8674a',
}
const catColor = (cats = []) => {
  for (const c of cats) {
    const key = Object.keys(CATEGORY_COLOR).find(k => c.toLowerCase().includes(k.toLowerCase()))
    if (key) return CATEGORY_COLOR[key]
  }
  return '#71736d'
}
const hasLink = (v) => v && v !== '#'
const hostOf = (url) => { try { return new URL(url).host } catch { return '' } }

/* Browser-framed screenshot: tilts toward the cursor and shows a
   cursor-following "open" pill on desktop. */
const CaseMedia = ({ project, color, href }) => {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [4, -4]), { stiffness: 140, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 140, damping: 18 })
  const pillX = useSpring(0, { stiffness: 300, damping: 28 })
  const pillY = useSpring(0, { stiffness: 300, damping: 28 })

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    pillX.set(e.clientX - r.left)
    pillY.set(e.clientY - r.top)
  }
  const onLeave = () => { px.set(0.5); py.set(0.5) }

  const url = hasLink(project.live) ? hostOf(project.live) : `github.com/${(project.github || '').split('github.com/')[1]?.replace(/\.git$/, '') || ''}`
  const Tag = href ? 'a' : 'div'

  return (
    <div className="wk-media-wrap">
      <motion.div
        ref={ref}
        className="wk-media"
        style={{ rotateX: rx, rotateY: ry, '--accent': color }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        initial={{ clipPath: 'inset(12% 12% 12% 12% round 18px)', opacity: 0 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 14px)', opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Tag className="wk-media-link" {...(href ? { href, target: '_blank', rel: 'noreferrer', 'aria-label': `Open ${project.title}` } : {})}>
          <div className="wk-chrome">
            <span className="wk-chrome-dots"><i /><i /><i /></span>
            <span className="wk-chrome-url">{url}</span>
          </div>
          <div className="wk-shot">
            {/* ambient copy of the artwork fills the frame; the real image is shown whole */}
            <img className="wk-shot-ambient" src={project.image} alt="" aria-hidden="true" loading="lazy" />
            <img className="wk-shot-img" src={project.image} alt={`${project.title} artwork`} loading="lazy" />
          </div>
          {href && (
            <motion.span className="wk-pill" style={{ x: pillX, y: pillY }} aria-hidden="true">
              {hasLink(project.live) ? 'Open live' : 'View source'} <ArrowUpRight size={13} />
            </motion.span>
          )}
        </Tag>
      </motion.div>
      <div className="wk-media-glow" style={{ background: color }} aria-hidden="true" />
    </div>
  )
}

const CaseStudy = ({ project, index, total }) => {
  const color = catColor(project.category || [])
  const cats = (project.category || []).flatMap(c => c.split(',').map(v => v.trim()))
  const num = String(index + 1).padStart(2, '0')
  const href = hasLink(project.live) ? project.live : hasLink(project.github) ? project.github : null

  return (
    <article className={`wk-case ${index % 2 ? 'is-flipped' : ''}`} id={project.slug}>
      <CaseMedia project={project} color={color} href={href} />

      <motion.div
        className="wk-body"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
      >
        {[
          <div className="wk-index" key="i">
            <span className="wk-num" style={{ '--accent': color }}>{num}</span>
            <span className="wk-of">/ {String(total).padStart(2, '0')} · {project.year || '2026'}</span>
          </div>,
          <div className="wk-cats" key="c">
            {cats.slice(0, 3).map(c => (
              <span key={c} style={{ color, borderColor: color + '45', background: color + '10' }}>{c}</span>
            ))}
          </div>,
          <h2 className="wk-title" key="t">{project.title}</h2>,
          <p className="wk-desc" key="d">{project.description}</p>,
          <ul className="wk-tags" key="g">
            {(project.tags || []).slice(0, 8).map(t => <li key={t}>{t.replace(/^#/, '')}</li>)}
          </ul>,
          <div className="wk-links" key="l">
            {hasLink(project.live) && (
              <a className="wk-btn wk-btn-primary" href={project.live} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> Live system
              </a>
            )}
            {hasLink(project.github) && (
              <a className="wk-btn" href={project.github} target="_blank" rel="noreferrer">
                <Github size={14} /> Source
              </a>
            )}
          </div>,
        ].map((child, i) => (
          <motion.div key={i} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    </article>
  )
}

const Projects = () => {
  const list = useMemo(
    () => projects.map((p, i) => ({ ...p, _idx: i, slug: slugify(p.title) })),
    []
  )
  const live = list.filter(p => hasLink(p.live)).length
  const oss = list.filter(p => hasLink(p.github)).length

  return (
    <main className="wk-root">
      <header className="wk-header">
        <motion.div className="wk-header-inner"
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}>
          <motion.p className="wk-eyebrow" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
            Systems archive
          </motion.p>
          <motion.h1 className="wk-h1" variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}>
            Built for the<br /><em>real world.</em>
          </motion.h1>
          <motion.div className="wk-header-row" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>
            <p className="wk-sub">
              Multicloud infrastructure · SRE platforms · Observability pipelines · Chaos engineering
            </p>
            <dl className="wk-stats">
              <div><dt>systems</dt><dd>{String(list.length).padStart(2, '0')}</dd></div>
              <div><dt>live</dt><dd>{String(live).padStart(2, '0')}</dd></div>
              <div><dt>open source</dt><dd>{String(oss).padStart(2, '0')}</dd></div>
            </dl>
          </motion.div>
        </motion.div>
      </header>

      <section className="wk-list" aria-label="Projects">
        {list.map((p, i) => <CaseStudy key={p.slug} project={p} index={i} total={list.length} />)}
      </section>

      <a className="wk-more" href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer">
        <span className="wk-more-k">$ git log --all</span>
        <span className="wk-more-t">More experiments, scripts &amp; infra live in the lab</span>
        <span className="wk-more-cta">github.com/dakshsawhneyy <ArrowUpRight size={18} /></span>
      </a>
    </main>
  )
}

export default Projects
