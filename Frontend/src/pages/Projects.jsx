import { ArrowUpRight, ExternalLink, Github } from 'lucide-react'
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import projects from '../data/projects'
import '../projects-v2.css'

const slugify = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }

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

const ProjectCard = ({ project, featured }) => {
  const [hov, setHov] = useState(false)
  const color = catColor(project.category || [])
  const cats  = (project.category || []).flatMap(c => c.split(',').map(v => v.trim()))
  const initials = project.title.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()

  return (
    <motion.article
      className={`pv2-card${featured ? ' pv2-card-featured' : ''}`}
      variants={fadeUp}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="pv2-card-img">
        {project.image
          ? <img src={project.image} alt={project.title} loading="lazy" />
          : <div className="pv2-card-img-placeholder">{initials}</div>
        }
        <div className="pv2-card-accent" style={{ background: color }} />

        <AnimatePresence>
          {hov && (
            <motion.div
              className="pv2-card-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <p className="pv2-overlay-desc">{project.description}</p>
              <div className="pv2-overlay-actions">
                {project.github && project.github !== '#' && (
                  <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                    <Github size={13} /> Source
                  </a>
                )}
                {project.live && project.live !== '#' && (
                  <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                    <ExternalLink size={13} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pv2-card-body">
        <div className="pv2-card-meta">
          {cats.slice(0,2).map(c => (
            <span key={c} className="pv2-cat"
              style={{ color, borderColor: color + '50', background: color + '10' }}>
              {c}
            </span>
          ))}
          <span className="pv2-year">{project.year || '2026'}</span>
        </div>
        <h2>{project.title}</h2>
        {/* Mobile description — visible on mobile since hover overlay unreachable on touch */}
        <p className="pv2-mobile-desc">{project.description}</p>
        <div className="pv2-tags">
          {(project.tags || []).slice(0, featured ? 5 : 3).map(t => (
            <span key={t}>{t.replace(/^#/, '')}</span>
          ))}
        </div>
        <div className="pv2-card-footer">
          {project.github && project.github !== '#' && (
            <a href={project.github} target="_blank" rel="noreferrer" className="pv2-link">
              <Github size={12} /> Source <ArrowUpRight size={11} />
            </a>
          )}
          {project.live && project.live !== '#' && (
            <a href={project.live} target="_blank" rel="noreferrer" className="pv2-link pv2-link-live">
              <ExternalLink size={12} /> Live <ArrowUpRight size={11} />
            </a>
          )}
        </div>
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
    <main className="pv2-root">

      {/* Page header */}
      <motion.section
        className="pv2-page-header"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="pv2-page-header-inner">
          <div>
            <motion.span className="pv2-eyebrow" variants={fadeUp}>
              Systems archive · {list.length} projects
            </motion.span>
            <motion.h1 className="pv2-h1" variants={fadeUp}>
              Built for the<br /><em>real world.</em>
            </motion.h1>
          </div>
          <motion.div className="pv2-header-right" variants={fadeUp}>
            <span className="pv2-total">
              Multicloud · SRE · Observability · Chaos
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* Cards — no filter toolbar */}
      <motion.div
        className="pv2-grid"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {list.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            featured={i === 0}
          />
        ))}
      </motion.div>

    </main>
  )
}

export default Projects
