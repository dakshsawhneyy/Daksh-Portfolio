import React, { useEffect, useRef } from 'react'
import SystemGrid from './SystemGrid'
import ModulePreview from './ModulePreview'
import { motion, AnimatePresence } from 'framer-motion'

const SystemWorkspace = ({ modules, hovered, setHovered, onSelect, activeModule, transitioning }) => {
  const modulesMap = Object.fromEntries(modules.map(m => [m.key, m]))
  const rootRef = useRef(null)

  // parallax background reaction
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2
      el.style.setProperty('--mx', mx.toFixed(3))
      el.style.setProperty('--my', my.toFixed(3))
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={rootRef} className="main-with-rail system-root" style={{'--mx':0,'--my':0}}>
      <div className="status-indicator muted">
        <motion.span key={hovered || 'online'} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.28 }}>
          {hovered ? `${hovered.toUpperCase()} // 07 LOADED` : 'SYSTEM ONLINE'}
        </motion.span>
      </div>

      <div className="system-stage-wrapper" data-hovered={hovered || ''}>
        <SystemGrid modules={modules} setHovered={setHovered} onSelect={onSelect} activeModule={activeModule} hovered={hovered} />
        <ModulePreview moduleKey={hovered} modulesMap={modulesMap} onOpen={(k)=>onSelect && onSelect(k)} />
      </div>

      <AnimatePresence>
        {activeModule && (
          <motion.div layoutId={`module-${activeModule}`} className="module-overlay" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.55 }}>
            <div className="overlay-inner">
              <div className="overlay-title">{modulesMap[activeModule]?.title}</div>
              <div className="overlay-sub">{modulesMap[activeModule]?.subtitle}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SystemWorkspace
