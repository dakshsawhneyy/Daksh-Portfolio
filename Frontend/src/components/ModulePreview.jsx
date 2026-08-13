import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ModulePreview = ({ moduleKey, modulesMap, onOpen }) => {
  const info = modulesMap[moduleKey]

  return (
    <AnimatePresence>
      {moduleKey && info && (
        <motion.aside initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.36 }} className="module-preview">
          <div className="preview-header">{info.title}</div>
          <div className="preview-sub muted" style={{marginTop:6}}>{info.subtitle}</div>

          <div className="preview-body" style={{marginTop:12}}>
            <div className="preview-visual" style={{background:`url('/assets/soon.avif') center/cover no-repeat`}} />
            <div className="preview-meta muted" style={{marginTop:10}}>TYPE: {info.type || 'SYSTEM'}</div>
            <div className="preview-desc" style={{marginTop:8}}>{info.preview || 'No preview available.'}</div>

            <div style={{height:1, background:'rgba(255,255,255,0.02)', margin:'12px 0'}} />

            <div className="preview-spec muted" style={{fontSize:13, lineHeight:1.4}}>
              {info.spec || 'Operational readout • telemetry • minimal preview'}
            </div>

            <div className="preview-actions" style={{marginTop:12}}>
              <button className="open-btn" onClick={() => onOpen && onOpen(info.key)}>OPEN →</button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default ModulePreview
