import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CommandPalette = ({ open, onClose, commands = [], onExecute }) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50) }
    else { setQuery(''); setSelected(0) }
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="palette-overlay" onMouseDown={onClose}>
          <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="palette-card" onMouseDown={e => e.stopPropagation()}>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Jump to... (⌘K)" className="palette-input" />

            <div className="palette-list">
              {filtered.map((c, i) => (
                <div key={c.key} className={`palette-item ${i === selected ? 'active' : ''}`} onMouseEnter={() => setSelected(i)} onClick={() => { if(onExecute) onExecute(c.key); else navigate(c.path || '/'); onClose() }}>
                  <div className="palette-title">{c.title}</div>
                  <div className="palette-sub muted">{c.subtitle}</div>
                </div>
              ))}
              {filtered.length === 0 && <div className="palette-empty muted">No results</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
