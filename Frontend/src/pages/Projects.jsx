import { ArrowUpRight, ExternalLink, Github, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projects from '../data/projects'
import '../projects-v2.css'

const slugify = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const CATEGORY_COLOR = {
  'Cloud':        '#2d8bbf',
  'System Design':'#27ae78',
  'DevOps':       '#d4940a',
  'Python':       '#7c79ca',
  'Reliability':  '#e8674a',
}
const catColor = (cats = []) => {
  for (const c of cats) {
    const key = Object.keys(CATEGORY_COLOR).find(k => c.toLowerCase().includes(k.toLowerCase()))
    if (key) return CATEGORY_COLOR[key]
  }
  return '#71736d'
}

const ProjectCard = ({ project, idx, featured }) => {
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
        <div className="pv2-tags">
          {(project.tags || []).slice(0, featured ? 5 : 4).map(t => (
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
  const [query,  setQuery]      = useState('')
  const [filter, setFilter]     = useState('All')
  const [showSearch, setShowSearch] = useState(false)

  const list = useMemo(
    () => projects.map((p, i) => ({ ...p, _idx: i, slug: slugify(p.title) })),
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

      {/* ── Light page header — no dark hero ── */}
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

      {/* ── Toolbar ── */}
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
                initial={{ opacity:0, width:0 }} animate={{ opacity:1, width:180 }}
                exit={{ opacity:0, width:0 }} transition={{ duration:0.18 }}
              >
                <Search size={13} />
                <input
                  autoFocus value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className={`pv2-icon-btn ${showSearch ? 'active' : ''}`}
            onClick={() => { setShowSearch(s => !s); if (showSearch) setQuery('') }}
            aria-label="Search"
          >
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* ── Cards ── */}
      {visible.length > 0 ? (
        <motion.div
          className="pv2-grid"
          initial="hidden"
          animate="visible"
          variants={stagger}
          key={filter + query}
        >
          {visible.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              idx={p._idx}
              featured={i === 0 && filter === 'All' && !query}
            />
          ))}
        </motion.div>
      ) : (
        <div className="pv2-empty">
          <p>No projects match.</p>
          <button onClick={() => { setFilter('All'); setQuery('') }}>Clear filters</button>
        </div>
      )}

    </main>
  )
}

export default Projects
