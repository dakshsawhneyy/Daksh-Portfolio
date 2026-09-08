import React, { useEffect, useState, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CommandPalette = ({ open, onClose, commands = [], onExecute }) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef()
  const previousFocusRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery(''); setSelected(0)
      previousFocusRef.current?.focus?.()
    }
  }, [open])

  const filtered = commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.key.includes(query.toLowerCase()))

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s+1, filtered.length-1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s-1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); if (filtered[selected]) { if(onExecute) onExecute(filtered[selected].key); else navigate(filtered[selected].path || '/'); onClose() } }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, selected, navigate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="palette-overlay" onMouseDown={onClose}>
          <Motion.div role="dialog" aria-modal="true" aria-labelledby="palette-title" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="palette-card" onMouseDown={e => e.stopPropagation()}>
            <h2 id="palette-title" className="sr-only">Command palette</h2>
            <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setSelected(0) }} placeholder="Jump to... (⌘K)" className="palette-input" aria-label="Search commands" aria-controls="palette-options" />

            <div id="palette-options" className="palette-list" role="listbox" aria-label="Commands">
              {filtered.map((c, i) => (
                <button type="button" role="option" aria-selected={i === selected} key={c.key} className={`palette-item ${i === selected ? 'active' : ''}`} onMouseEnter={() => setSelected(i)} onClick={() => { if(onExecute) onExecute(c.key); else navigate(c.path || '/'); onClose() }}>
                  <div className="palette-title">{c.title}</div>
                  <div className="palette-sub muted">{c.subtitle}</div>
                </button>
              ))}
              {filtered.length === 0 && <div className="palette-empty muted" role="status">No results</div>}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
