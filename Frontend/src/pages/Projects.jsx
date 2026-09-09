import { ArrowUpRight, ExternalLink, Github, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../data/projects'
import '../projects-v2.css'

const slugify = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } }
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

/* accent colours per category */
const CATEGORY_COLOR = {
  Cloud:        '#65cfe5',
  'System Design': '#72dfac',
  DevOps:       '#f0bc62',
  Python:       '#8784d2',
  Reliability:  '#df694e',
}
const categoryColor = (cats = []) => {
  for (const c of cats) {
    const key = Object.keys(CATEGORY_COLOR).find(k => c.toLowerCase().includes(k.toLowerCase()))
    if (key) return CATEGORY_COLOR[key]
  }
  return '#8784d2'
}

const ALL_PROJECTS = projects  // full list from data/projects.js default export

const ProjectCard = ({ project, index, featured = false }) => {
  const [hovered, setHovered] = useState(false)
  const color = categoryColor(project.category)
  const cats = (project.category || []).flatMap(c => c.split(',').map(v => v.trim()))

  return (
    <motion.article
      className={`pv2-card ${featured ? 'pv2-card-featured' : ''}`}
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* image */}
      <div className="pv2-card-img">
        {project.image
          ? <img src={project.image} alt={project.title} loading="lazy" />
          : <div className="pv2-card-img-placeholder" style={{ background: color + '22' }} />
        }
        {/* hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="pv2-card-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <p className="pv2-overlay-desc">{project.description}</p>
              <div className="pv2-overlay-actions">
                {project.github && project.github !== '#' && (
                  <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                    <Github size={14} /> Source
                  </a>
                )}
                {project.live && project.live !== '#' && (
                  <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                    <ExternalLink size={14} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* index badge */}
        <div className="pv2-card-badge">{String(index + 1).padStart(2, '0')}</div>
        {/* accent bar */}
        <div className="pv2-card-accent" style={{ background: color }} />
      </div>

      {/* body */}
      <div className="pv2-card-body">
        <div className="pv2-card-meta">
          {cats.slice(0, 2).map(c => (
            <span key={c} className="pv2-cat" style={{ color, borderColor: color + '44', background: color + '11' }}>{c}</span>
          ))}
          <span className="pv2-year">{project.year || '2026'}</span>
        </div>
        <h2>{project.title}</h2>
        <div className="pv2-tags">
          {(project.tags || []).slice(0, 4).map(t => <span key={t}>{t.replace(/^#/, '')}</span>)}
        </div>
        <div className="pv2-card-footer">
          {project.github && project.github !== '#' && (
            <a href={project.github} target="_blank" rel="noreferrer" className="pv2-link">
              <Github size={13} /> Source <ArrowUpRight size={12} />
            </a>
          )}
          {project.live && project.live !== '#' && (
            <a href={project.live} target="_blank" rel="noreferrer" className="pv2-link pv2-link-live">
              <ExternalLink size={13} /> Live <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

const Projects = () => {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState('All')
  const [showSearch, setShowSearch] = useState(false)

  const list = useMemo(
    () => ALL_PROJECTS.map((p, i) => ({ ...p, _idx: i, slug: slugify(p.title) })),
    []
  )

  const catNames = p => (p.category || []).flatMap(c => c.split(',').map(v => v.trim()))
  const categories = ['All', ...new Set(list.flatMap(catNames))].slice(0, 8)

  const visible = list.filter(p => {
    const text = `${p.title} ${p.description} ${(p.tags||[]).join(' ')}`.toLowerCase()
    return (filter === 'All' || catNames(p).includes(filter)) && text.includes(query.toLowerCase())
  })

  return (
    <main className="pv2-root">

      {/* ── HERO ── */}
      <section className="pv2-hero">
        <div className="pv2-hero-bg" aria-hidden />
        <motion.div className="pv2-hero-inner" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <p className="pv2-eyebrow">Archive · {list.length} systems built</p>
            <h1 className="pv2-h1">
              <span>Systems</span>
              <span className="pv2-h1-em">that run.</span>
            </h1>
          </motion.div>
          <motion.p className="pv2-hero-sub" variants={fadeUp}>
            Multicloud infrastructure, reliability platforms, observability pipelines,
            and automation tools — built to operate in production, not just demos.
          </motion.p>
        </motion.div>
      </section>

      {/* ── TOOLBAR ── */}
      <div className="pv2-toolbar">
        <div className="pv2-filters" role="group" aria-label="Filter projects">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pv2-filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="pv2-toolbar-right">
          <AnimatePresence>
            {showSearch && (
              <motion.div
                className="pv2-search-wrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 200 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search size={14} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className={`pv2-icon-btn ${showSearch ? 'active' : ''}`}
            onClick={() => { setShowSearch(s => !s); if (showSearch) setQuery('') }}
            aria-label="Toggle search"
          >
            <Search size={16} />
          </button>
          <button className="pv2-icon-btn" aria-label="Sort" disabled style={{ opacity: 0.4 }}>
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* ── GRID ── */}
      {visible.length > 0 ? (
        <motion.div
          className="pv2-grid"
          initial="hidden"
          animate="visible"
          variants={stagger}
          key={filter + query}
        >
          {visible.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={project._idx}
              featured={i === 0 && filter === 'All' && !query}
            />
          ))}
        </motion.div>
      ) : (
        <div className="pv2-empty">
          <p>No projects match that filter.</p>
          <button onClick={() => { setFilter('All'); setQuery('') }}>Clear filters</button>
        </div>
      )}
    </main>
  )
}

export default Projects
