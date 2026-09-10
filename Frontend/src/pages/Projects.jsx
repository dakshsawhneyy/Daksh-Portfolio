import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../data/projects'
import '../projects-v2.css'

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

/* ─── single project row ─── */
const ProjectRow = ({ project, index }) => {
  const [hov, setHov] = useState(false)
  const color = catColor(project.category || [])
  const cats  = (project.category || []).flatMap(c => c.split(',').map(v => v.trim()))
  const num   = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      className="prj-row"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22,1,0.36,1], delay: index * 0.03 }}
    >
      {/* left accent line that fills on hover */}
      <motion.div
        className="prj-row-accent"
        animate={{ scaleY: hov ? 1 : 0 }}
        style={{ background: color, originY: 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* index */}
      <span className="prj-row-num" style={{ color: hov ? color : undefined }}>{num}</span>

      {/* main content */}
      <div className="prj-row-body">
        <div className="prj-row-top">
          <h2 className="prj-row-title">{project.title}</h2>
          <div className="prj-row-cats">
            {cats.slice(0,2).map(c => (
              <span key={c} className="prj-row-cat"
                style={{ color, borderColor: color + '40', background: color + '0d' }}>
                {c}
              </span>
            ))}
            <span className="prj-row-year">{project.year || '2026'}</span>
          </div>
        </div>

        <AnimatePresence>
          {hov && (
            <motion.p
              className="prj-row-desc"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22 }}
            >
              {project.description}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="prj-row-tags">
          {(project.tags || []).slice(0, 5).map(t => (
            <span key={t}>{t.replace(/^#/, '')}</span>
          ))}
        </div>
      </div>

      {/* image reveal on hover */}
      <AnimatePresence>
        {hov && project.image && (
          <motion.div
            className="prj-row-thumb"
            initial={{ opacity: 0, scale: 0.94, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.94, x: 12 }}
            transition={{ duration: 0.22 }}
          >
            <img src={project.image} alt={project.title} />
            <div className="prj-thumb-accent" style={{ background: color }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* links */}
      <div className="prj-row-links">
        {project.github && project.github !== '#' && (
          <a href={project.github} target="_blank" rel="noreferrer" className="prj-row-link" title="Source">
            <Github size={14} />
          </a>
        )}
        {project.live && project.live !== '#' && (
          <a href={project.live} target="_blank" rel="noreferrer" className="prj-row-link prj-row-link-live" title="Live">
            <ExternalLink size={14} />
          </a>
        )}
        {(!project.github || project.github === '#') && (!project.live || project.live === '#') && (
          <span className="prj-row-arrow"><ArrowUpRight size={16} /></span>
        )}
      </div>
    </motion.article>
  )
}

const Projects = () => {
  const list = useMemo(
    () => projects.map((p, i) => ({ ...p, _idx: i, slug: slugify(p.title) })),
    []
  )

  return (
    <main className="prj-root">

      {/* Header */}
      <motion.div
        className="prj-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="prj-header-inner">
          <p className="prj-eyebrow">Systems archive · {list.length} projects</p>
          <h1 className="prj-h1">
            Built for the<br /><em>real world.</em>
          </h1>
          <p className="prj-header-sub">
            Multicloud infrastructure · SRE platforms · Observability pipelines · Chaos engineering
          </p>
        </div>
      </motion.div>

      {/* Column headers */}
      <div className="prj-list-header">
        <span className="prj-lh-num">#</span>
        <span className="prj-lh-title">Project</span>
        <span className="prj-lh-links">Links</span>
      </div>

      {/* Project list */}
      <div className="prj-list">
        {list.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </div>

    </main>
  )
}

export default Projects
