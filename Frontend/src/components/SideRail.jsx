import React from 'react'

const SideRail = ({ modules = [], hovered, setHovered, onSelect }) => {

  return (
    <aside className="side-rail" aria-label="System modules">
      <div className="rail-top muted small">SYSTEM 01</div>
      <nav className="rail-list">
        {modules.map((m, i) => (
          <button key={m.key} data-interactive data-cursor="open" onMouseEnter={() => setHovered(m.key)} onMouseLeave={() => setHovered(null)} onClick={() => { onSelect(m.key) }} className={`rail-item ${hovered === m.key ? 'hover' : ''}`}>
            <span className="rail-index">{String(i+1).padStart(2,'0')}</span>
            <span className="rail-title">{m.title}</span>
          </button>
        ))}
      </nav>
      <div className="rail-bottom muted small" aria-label="Open command palette shortcut">⌘K</div>
    </aside>
  )
}

export default SideRail
