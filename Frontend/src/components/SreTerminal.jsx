import { useEffect, useRef, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, Terminal } from 'lucide-react'
import projects from '../data/projects'

const QUICK_COMMANDS = [
  { cmd: 'show projects',  hint: 'browse all systems' },
  { cmd: 'show about',     hint: 'who built this' },
  { cmd: 'show skills',    hint: 'tech stack' },
  { cmd: 'show contact',   hint: 'get in touch' },
  { cmd: 'show resume',    hint: 'download PDF' },
]

const projectLines = projects.map(p => ({
  type: 'project-output', text: p.title, detail: p.description,
}))

const COMMANDS = {
  'show projects':   () => projectLines,
  'projects':        () => projectLines,
  'show about':      () => [{ type:'output', text:'Daksh Sawhney — Cloud & DevOps Engineer + Multi-Cloud Instructor. AWS Intern at IPage UMS. Teaching 180h+ DevOps and 100h+ multi-cloud curriculum at SelfCode Academy.' }],
  'about':           () => [{ type:'output', text:'Daksh Sawhney — Cloud & DevOps Engineer + Multi-Cloud Instructor. AWS Intern at IPage UMS. Teaching 180h+ DevOps and 100h+ multi-cloud curriculum at SelfCode Academy.' }],
  'show skills':     () => [{ type:'output', text:'AWS · Azure · GCP · Kubernetes · Terraform · Prometheus · Grafana · GitHub Actions · Python · Bash · IAM/RBAC · FinOps · Chaos Engineering' }],
  'skills':          () => [{ type:'output', text:'AWS · Azure · GCP · Kubernetes · Terraform · Prometheus · Grafana · GitHub Actions · Python · Bash · IAM/RBAC · FinOps · Chaos Engineering' }],
  'show contact':    () => [{ type:'output', text:'dakshsawhneyy@gmail.com  ·  github.com/dakshsawhneyy  ·  linkedin.com/in/dakshsawhneyy' }],
  'contact':         () => [{ type:'output', text:'dakshsawhneyy@gmail.com  ·  github.com/dakshsawhneyy  ·  linkedin.com/in/dakshsawhneyy' }],
  'show resume':     () => [{ type:'output', text:'Opening resume… /resume/Daksh-Resume.pdf — click the Resume button in the nav sidebar.' }],
  'whoami':          () => [{ type:'output', text:'daksh · cloud-devops-engineer · multi-cloud-instructor · sre · builder' }],
  'uptime':          () => [{ type:'output', text:'portfolio: operational · systems: running · coffee: low' }],
  'ls':              () => [{ type:'output', text:'about/   projects/   blog/   contact/   resume.pdf' }],
  'help':            () => QUICK_COMMANDS.map(c => ({ type:'command-list', text:`${c.cmd.padEnd(18)}— ${c.hint}` })),
  'show commands':   () => QUICK_COMMANDS.map(c => ({ type:'command-list', text:`${c.cmd.padEnd(18)}— ${c.hint}` })),
}

const WELCOME = [
  { type: 'system',  text: 'daksh@portfolio ~ %' },
  { type: 'muted',   text: '' },
  { type: 'output',  text: 'Daksh Sawhney — Cloud & DevOps Engineer' },
  { type: 'output',  text: 'AWS · Azure · Kubernetes · Terraform · SRE' },
  { type: 'muted',   text: '' },
  { type: 'muted',   text: 'Try: show projects  ·  show about  ·  show contact' },
]

const SreTerminal = ({ open, onClose }) => {
  const [input, setInput]   = useState('')
  const [lines, setLines]   = useState(WELCOME)
  const [histIdx, setHistIdx] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState([])
  const inputRef   = useRef(null)
  const historyRef = useRef(null)

  useEffect(() => {
    if (open) {
      setInput(''); setLines(WELCOME); setHistIdx(-1)
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const el = historyRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [lines, open])

  useEffect(() => {
    const onKey = e => { if (open && e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const execute = (raw) => {
    const cmd = raw.trim().toLowerCase()
    const echo = { type: 'command', text: raw.trim() }
    if (!cmd) { setLines(l => [...l, echo]); return }

    if (cmd === 'clear') { setLines([]); setInput(''); return }
    if (cmd === 'exit')  { onClose(); return }

    const handler = COMMANDS[cmd]
    const result  = handler ? handler() : [{ type:'error', text:`Command not found: "${cmd}". Try "help" for a list.` }]
    setLines(l => [...l, echo, ...result])
    setCmdHistory(h => [raw.trim(), ...h].slice(0, 20))
    setHistIdx(-1)
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const all = Object.keys(COMMANDS)
      const match = all.find(c => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(next); setInput(cmdHistory[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(histIdx - 1, -1)
      setHistIdx(next); setInput(next === -1 ? '' : cmdHistory[next] ?? '')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="sre-terminal-overlay"
          role="presentation"
          onMouseDown={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <Motion.section
            className="sre-terminal"
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio Terminal"
            onMouseDown={e => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }}
          >
            {/* header */}
            <header className="sre-terminal-header">
              <div className="sre-th-left">
                <div className="sre-th-dots">
                  <span className="sre-dot sre-dot-red" onClick={onClose} />
                  <span className="sre-dot sre-dot-yellow" />
                  <span className="sre-dot sre-dot-green" />
                </div>
                <div className="sre-th-title">
                  <Terminal size={13} />
                  <span>portfolio — daksh@sre</span>
                </div>
              </div>
              <button className="sre-th-close" onClick={onClose} aria-label="Close terminal">
                <X size={15} />
              </button>
            </header>

            {/* quick command chips */}
            <div className="sre-quick-chips">
              {QUICK_COMMANDS.map(({ cmd, hint }) => (
                <button
                  key={cmd}
                  className="sre-chip"
                  onClick={() => execute(cmd)}
                  title={hint}
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* history */}
            <div
              className="sre-terminal-body"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="sre-terminal-history" ref={historyRef}>
                {lines.map((line, i) => (
                  <div
                    className={`sre-terminal-line ${line.type}`}
                    key={`${line.text}-${i}`}
                  >
                    {line.type === 'command' && (
                      <span className="sre-prompt-icon"><ChevronRight size={12} /></span>
                    )}
                    <span className="sre-line-text">
                      {line.text}
                      {line.detail && <small className="sre-line-detail">{line.detail}</small>}
                    </span>
                  </div>
                ))}
              </div>

              {/* prompt */}
              <form
                className="sre-terminal-prompt"
                onSubmit={e => { e.preventDefault(); execute(input) }}
              >
                <span className="sre-prompt-str">
                  <span className="sre-prompt-user">daksh</span>
                  <span className="sre-prompt-sep">@portfolio</span>
                  <span className="sre-prompt-arrow"> ❯ </span>
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Terminal input"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="type a command or click above…"
                />
              </form>
            </div>

            <footer className="sre-terminal-footer">
              <span>TAB to autocomplete</span>
              <span>↑↓ history</span>
              <span>ESC to close</span>
            </footer>
          </Motion.section>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default SreTerminal
