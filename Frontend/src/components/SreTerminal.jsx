import { useEffect, useRef, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import projects from '../data/projects'

const projectSummaryLines = projects.map(project => ({ type: 'project-output', text: project.title, detail: project.description }))
const commandSuggestions = ['show commands', 'show projects', 'show portfolio', 'show about', 'show skills', 'show contact', 'show resume', 'clear', 'exit']
const commandDirectory = [
  'show commands       — view this command list',
  'show projects       — browse featured work with descriptions',
  'show portfolio      — see what this portfolio is about',
  'show about          — learn about Daksh and his work',
  'show skills         — view the working toolkit',
  'show contact        — find ways to connect',
  'show resume         — open the resume',
  'clear               — clear the explorer',
  'exit                — close the explorer'
]

const initialLines = [
  { type: 'system', text: 'PORTFOLIO EXPLORER / ready for everyone' },
  { type: 'muted', text: 'A small map of what you can explore:' },
  ...commandDirectory.map(text => ({ type: 'command-list', text }))
]

const SreTerminal = ({ open, onClose }) => {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState(initialLines)
  const inputRef = useRef(null)
  const historyRef = useRef(null)

  useEffect(() => {
    if (open) {
      setInput('')
      setLines(initialLines)
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => {
      const history = historyRef.current
      if (history) history.scrollTo({ top: history.scrollHeight, behavior: 'smooth' })
    })
  }, [lines, open])

  useEffect(() => {
    const handleKeyDown = event => {
      if (open && event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const execute = command => {
    const normalized = command.trim().toLowerCase()
    const nextLines = [...lines, { type: 'command', text: command }]

    if (!normalized) {
      setLines(nextLines)
    } else if (normalized === 'clear') {
      setLines([])
    } else if (normalized === 'help' || normalized === 'show commands') {
      setLines([...nextLines, ...commandDirectory.map(text => ({ type: 'command-list', text }))])
    } else if (normalized === 'show projects' || normalized === 'projects' || normalized === 'cat projects.txt') {
      setLines([...nextLines, ...projectSummaryLines])
    } else if (normalized === 'show portfolio' || normalized === 'portfolio') {
      setLines([...nextLines, { type: 'output', text: 'A portfolio about multicloud systems, reliability, automation, and building useful things that run.' }])
    } else if (normalized === 'show about' || normalized === 'about' || normalized === 'cat about.txt') {
      setLines([...nextLines, { type: 'output', text: 'I teach multicloud systems and build real things that run: resilient infrastructure, automation, observability, and self-healing platforms.' }])
    } else if (normalized === 'show skills' || normalized === 'skills') {
      setLines([...nextLines, { type: 'output', text: 'Multicloud architecture | AWS | Azure | Kubernetes | Terraform | DevSecOps | Observability | Automation' }])
    } else if (normalized === 'show contact' || normalized === 'contact') {
      setLines([...nextLines, { type: 'output', text: 'Email: dakshsawhneyy@gmail.com | GitHub: github.com/dakshsawhneyy | LinkedIn: linkedin.com/in/dakshsawhneyy' }])
    } else if (normalized === 'show resume' || normalized === 'resume') {
      setLines([...nextLines, { type: 'output', text: 'Resume available from the Resume button in the navigation rail.' }])
    } else if (normalized === 'ls') {
      setLines([...nextLines, { type: 'output', text: 'projects.txt  about.txt  runbooks/  telemetry/  contact.txt' }])
    } else if (normalized === 'whoami') {
      setLines([...nextLines, { type: 'output', text: 'daksh // multicloud systems builder // reliability engineer' }])
    } else if (normalized === 'uptime') {
      setLines([...nextLines, { type: 'output', text: 'portfolio uptime: operational | systems: ready | failures: useful' }])
    } else if (normalized === 'exit') {
      onClose()
    } else {
      setLines([...nextLines, { type: 'error', text: `I could not find that one. Try “show commands”.` }])
    }
    setInput('')
  }

  return <AnimatePresence>
    {open && <Motion.div className="sre-terminal-overlay" role="presentation" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Motion.section className="sre-terminal" role="dialog" aria-modal="true" aria-labelledby="sre-terminal-title" onMouseDown={event => event.stopPropagation()} initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }}>
        <header className="sre-terminal-header">
          <div><span className="sre-terminal-light" /> <span id="sre-terminal-title">PORTFOLIO EXPLORER</span><small>friendly mode / local</small></div>
          <button type="button" onClick={onClose} aria-label="Close SRE Mode" title="Close SRE Mode"><X size={17} /></button>
        </header>
        <div className="sre-terminal-body" onClick={() => inputRef.current?.focus()}>
          <div className="sre-terminal-history" ref={historyRef}>
            {lines.map((line, index) => <div className={`sre-terminal-line ${line.type}`} key={`${line.text}-${index}`}>{line.type === 'command' && <ChevronRight size={13} />}<span>{line.text}{line.detail && <small>{line.detail}</small>}</span></div>)}
          </div>
          <form className="sre-terminal-prompt" onSubmit={event => { event.preventDefault(); execute(input) }}>
            <span>dakshsawhney:~$</span><input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Tab') { event.preventDefault(); const match = commandSuggestions.find(command => command.startsWith(input.toLowerCase())) || commandSuggestions[0]; setInput(match) } }} aria-label="Portfolio Explorer command input" autoComplete="off" spellCheck="false" placeholder="try: show commands" />
          </form>
        </div>
        <footer className="sre-terminal-footer"><span>STATUS: READY</span><span>ESC TO CLOSE</span></footer>
      </Motion.section>
    </Motion.div>}
  </AnimatePresence>
}

export default SreTerminal
