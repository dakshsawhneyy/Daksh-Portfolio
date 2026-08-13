import React from 'react'
import { motion } from 'framer-motion'

const SystemGrid = ({ modules = [], setHovered, onSelect, activeModule, hovered }) => {
  return (
    <main className="system-stage">
      <div className="grid-wrap">
        {modules.map((m, idx) => (
          <motion.button key={m.key} layoutId={`module-${m.key}`} data-interactive data-cursor="open" onMouseEnter={() => setHovered && setHovered(m.key)} onMouseLeave={() => setHovered && setHovered(null)} onClick={() => { onSelect && onSelect(m.key) }} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className={`module-tile ${activeModule === m.key ? 'active' : ''} ${hovered === m.key ? 'hovered' : ''}`}>
            <div style={{display:'flex',alignItems:'baseline',gap:'12px'}}>
              <div className="module-index muted">{String(idx+1).padStart(2,'0')}</div>
              <div>
                <div className="module-title">{m.title}</div>
                <div className="module-sub muted">{m.subtitle}</div>
              </div>
            </div>
            <div className="module-label muted" style={{marginTop:6}}>{m.key.toUpperCase()}</div>
          </motion.button>
        ))}
      </div>
    </main>
  )
}

export default SystemGrid
