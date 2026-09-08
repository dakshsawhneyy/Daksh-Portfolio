import React, { useEffect, useRef } from 'react'
import { motion as Motion } from 'framer-motion'

const SystemShell = ({ onEnterSystem, onViewWork }) => {
  const panelRef = useRef()
  const [booting, setBooting] = React.useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter') startBoot('system')
      if (e.key === 'v') startBoot('view')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const startBoot = (mode) => {
    if (booting) return
    setBooting(true)

    // staged timeline matching the spec
    // 0ms: freeze UI (handled by CSS class)
    // show progress updates and then call callbacks after timeline
    // shorter practical durations so UI feels responsive
    const total = mode === 'view' ? 900 : 1600

    // trigger small visual changes via data attribute
    document.documentElement.classList.add('booting')

    // call navigation a bit before full animation completes to feel responsive
    const navDelay = Math.max(300, Math.floor(total * 0.6))
    const navTimeout = setTimeout(() => {
      if (mode === 'system' && onEnterSystem) onEnterSystem()
      if (mode === 'view' && onViewWork) onViewWork()
    }, navDelay)

    // cleanup: remove boot state after full timeline
    const clearTimeoutId = setTimeout(() => {
      document.documentElement.classList.remove('booting')
      setBooting(false)
    }, total)

    return () => { clearTimeout(navTimeout); clearTimeout(clearTimeoutId) }
  }

  return (
    <div className="sys-shell min-h-screen flex items-center justify-center relative text-gray-200">
      <div className="ambient-info top-left">SYSTEM // PERSONAL_INTERFACE</div>
      <div className="ambient-info top-right">BUILD 26.08.13</div>

      <Motion.div ref={panelRef} initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className={`sys-panel glass-card max-w-3xl w-full p-8 rounded-2xl ${booting ? 'booting' : ''}`}>
        <div className="sys-inner">
          <div className="sys-line small muted">&nbsp;</div>

          <div className="sys-line title">SYSTEM &nbsp;&nbsp;//&nbsp;&nbsp; PERSONAL_INTERFACE</div>

          <div className="panel-block mt-6">
            <div className="cmd muted">&gt; whoami</div>
            <div className="result big">DAKSH</div>
            <div className="sub muted">Designer / Engineer / Builder</div>
          </div>

          <div className="panel-block mt-6">
            <div className="cmd muted">&gt; status</div>
            <div className="result">Currently building unusual things.</div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button data-interactive data-cursor="open" onClick={() => startBoot('system')} className="enter-btn" aria-label="Enter system">[ ENTER SYSTEM ]</button>
            <button data-interactive data-cursor="open" onClick={() => startBoot('view')} className="ghost-btn">[ VIEW WORK ]</button>
          </div>

          <div className="meta mt-6 muted text-xs">
            BUILD 26.08.13 &nbsp;&nbsp; LOCATION: EARTH &nbsp;&nbsp; STATUS: CREATING
          </div>
        </div>
      </Motion.div>

      <div className="bottom-left muted small">LOCATION: INDIA</div>

    </div>
  )
}

export default SystemShell
