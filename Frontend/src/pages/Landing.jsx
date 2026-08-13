import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = ({ onViewWorkProp }) => {
  const navigate = useNavigate()
  const [booting, setBooting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusLines, setStatusLines] = useState([])

  useEffect(() => {
    let iv
    if (booting) {
      setStatusLines(['INITIALIZING USER ENVIRONMENT...'])
      setProgress(6)
      iv = setInterval(() => {
        setProgress(p => {
          const next = Math.min(100, p + Math.floor(Math.random() * 12) + 6)
          if (next >= 100) {
            clearInterval(iv)
            setStatusLines(prev => [...prev, 'SYSTEM READY'])
            setTimeout(() => navigate('/system'), 400)
          } else {
            setStatusLines(prev => prev.length > 4 ? prev : [...prev, 'LOADING...'])
          }
          return next
        })
      }, 180)
    }
    return () => clearInterval(iv)
  }, [booting, navigate])

  const enterSystem = () => {
    if (booting) return
    setBooting(true)
  }

  const viewWork = () => {
    // short unlock animation then go to /projects
    setStatusLines(['ACCESSING ARCHIVE', 'PROJECTS / 07', 'OPENING...'])
    document.documentElement.classList.add('booting-view-work')
    setTimeout(() => {
      document.documentElement.classList.remove('booting-view-work')
      navigate('/projects')
    }, 900)
  }

  return (
    <div className="landing-root">
      <div className="landing-canvas">
        <div className={`terminal-box ${booting ? 'booting' : ''}`} aria-hidden={false}>
          <div className="terminal-header">SYSTEM // PERSONAL_INTERFACE</div>
          <div className="terminal-body">
            <div className="cmd">&gt; whoami</div>
            <div className="result name">ARJUN</div>
            <div className="result role">Designer / Engineer / Builder</div>

            <div className="spacer" />

            <div className="cmd">&gt; status</div>
            <div className="result">Currently building unusual things.</div>

            <div className="spacer" />

            <div className="terminal-actions">
              <button className="enter-btn" data-interactive onClick={enterSystem}>
                [ ENTER SYSTEM ]
              </button>
              <button className="viewwork-btn" data-interactive onClick={viewWork}>
                [ VIEW WORK ]
              </button>
            </div>
          </div>
          <div className="terminal-footer">
            <div className="meta">BUILD {new Date().toISOString().slice(0,10)}</div>
            <div className="meta">LOCATION: EARTH</div>
            <div className="meta">STATUS: CREATING</div>
          </div>
        </div>

        <div className="boot-panel" aria-hidden={!booting}>
          <div className="boot-lines">
            {statusLines.map((l, i) => (
              <div key={i} className="boot-line">{l}</div>
            ))}
          </div>
          <div className="progress">
            <div className="bar" style={{width: `${progress}%`}} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
