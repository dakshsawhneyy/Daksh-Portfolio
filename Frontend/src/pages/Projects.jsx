import React, { useEffect, useMemo, useState } from 'react'
import projects from '../data/projects'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const Projects = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(0)
  const [locked, setLocked] = useState(false)
  const [reveal, setReveal] = useState(false)

  const list = useMemo(() => projects.map((p, i) => ({ ...p, index: i, slug: slugify(p.title) })), [])

  useEffect(() => {
    // keyboard navigation
    const onKey = (e) => {
      if (locked) return
      if (e.key === 'ArrowDown') setSelected(s => Math.min(list.length - 1, s + 1))
      if (e.key === 'ArrowUp') setSelected(s => Math.max(0, s - 1))
      if (e.key === 'Enter') handleOpen(selected)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, locked, list.length])

  const hoverItem = (i) => { if (!locked) setSelected(i) }

  const handleOpen = (i) => {
    if (locked) return
    setLocked(true)
    setReveal(true)
    // staged animation: initialize -> expand -> navigate
    setTimeout(() => {
      // navigate after visual expansion
      navigate(`/projects/${list[i].slug}`)
    }, 900)
  }

  const current = list[selected]

  return (
    <div className="projects-archive-root">
      <div className="projects-top">
        <div className="projects-title">PROJECTS</div>
        <div className="projects-sub muted">ARCHIVE / {list.length.toString().padStart(2,'0')}</div>
      </div>

      <div className="projects-grid">
        <aside className="project-list">
          <ul>
            {list.map((p, i) => (
              <li key={p.slug} className={`project-row ${i === selected ? 'active' : ''} ${locked && i===selected ? 'locked' : ''}`} onMouseEnter={() => hoverItem(i)} onClick={() => handleOpen(i)} data-interactive data-cursor="view">
                <span className="row-index">{String(i+1).padStart(2,'0')}</span>
                <span className="row-title">{p.title}</span>
                <span className="row-year">{p.year || '2026'}</span>
              </li>
            ))}
          </ul>
        </aside>

        <section className="project-viewport">
          <AnimatePresence>
            {current && (
              <motion.div key={current.slug} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42 }} className="viewport-inner">
                <div className="viewport-visual" style={{backgroundImage:`url(${current.image})`}} />
                <div className="viewport-meta">
                  <div className="meta-title">PROJECT / {current.title.toUpperCase()}</div>
                  <div className="meta-type muted">{current.category.join(' • ')}</div>
                  <div className="meta-desc">{current.description}</div>

                  <div className="meta-list">
                    <div><strong>ROLE</strong><div className="muted">Design / Engineering</div></div>
                    <div><strong>STACK</strong><div className="muted">{(current.tags || []).slice(0,4).join(' / ')}</div></div>
                    <div><strong>YEAR</strong><div className="muted">{current.year || '2026'}</div></div>
                  </div>

                  <div className="viewport-actions">
                    <button className="action-open" onClick={() => handleOpen(selected)} data-interactive data-cursor="open">[ OPEN PROJECT ]</button>
                    <a className="action-code" href={current.github} target="_blank" rel="noreferrer">↗ VIEW SOURCE</a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence>
        {reveal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="project-reveal-overlay">
            <div className="reveal-inner">
              <div className="reveal-line">INITIALIZING PROJECT</div>
              <div className="reveal-bar"><div className="reveal-fill" /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects