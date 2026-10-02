import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, RotateCcw, Sparkles, X } from 'lucide-react'
import { offlineAnswer, SUGGESTIONS } from '../data/knowledge'
import '../styles/ask-daksh.css'

/* ══════════════════════════════════════════════════════════════════
   ASK DAKSH — floating AI agent.
   Streams answers from the backend (/api/agent → Claude). If the
   backend is unreachable / not configured it answers from the local
   knowledge base (data/knowledge.js) with the same streaming feel.
   Other components can open it: window.dispatchEvent(
     new CustomEvent('dk-agent', { detail: { question } }))
   ══════════════════════════════════════════════════════════════════ */

const API = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/agent`
const STORE_KEY = 'dk-agent-chat'
const GREET_KEY = 'dk-agent-greeted'
const MAX_LEN = 600

const WELCOME = {
  role: 'assistant',
  content: "Hi! I'm Daksh's agent. Ask me anything about his **experience**, **projects**, **skills** or whether he's **open to roles**.",
}

const ss = {
  get(k) { try { return sessionStorage.getItem(k) } catch { return null } },
  set(k, v) { try { sessionStorage.setItem(k, v) } catch { /* storage blocked */ } },
}

/* ── tiny, safe markdown: paragraphs, bullets, **bold**, `code`, links ── */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g
const Inline = ({ text, onLink }) =>
  text.split(INLINE).map((part, i) => {
    if (!part) return null
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    const href = md ? md[2] : /^https?:\/\//.test(part) ? part : null
    if (href) {
      const label = md ? md[1] : part.replace(/^https?:\/\//, '')
      const internal = href.startsWith('/') && !href.endsWith('.pdf')
      return (
        <a key={i} href={href}
          {...(internal ? { onClick: e => { e.preventDefault(); onLink(href) } } : { target: '_blank', rel: 'noreferrer' })}>
          {label}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })

const Markdown = ({ text, onLink }) => {
  const blocks = text.trim().split(/\n{2,}/)
  return blocks.map((block, bi) => {
    const lines = block.split('\n')
    if (lines.every(l => /^\s*([-*]|\d+\.)\s+/.test(l))) {
      return (
        <ul key={bi}>
          {lines.map((l, li) => <li key={li}><Inline text={l.replace(/^\s*([-*]|\d+\.)\s+/, '')} onLink={onLink} /></li>)}
        </ul>
      )
    }
    return (
      <p key={bi}>
        {lines.map((l, li) => (
          <span key={li}>{li > 0 && <br />}<Inline text={l.replace(/^\s*[-*]\s+/, '• ')} onLink={onLink} /></span>
        ))}
      </p>
    )
  })
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const AskDaksh = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(ss.get(STORE_KEY)) || [WELCOME] } catch { return [WELCOME] }
  })
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [offline, setOffline] = useState(false)
  const [greet, setGreet] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { ss.set(STORE_KEY, JSON.stringify(messages.slice(-30))) }, [messages])

  // greeting bubble, once per session
  useEffect(() => {
    if (ss.get(GREET_KEY)) return
    // after the music-disc hint (3.5s–11s) so the two never overlap
    const show = setTimeout(() => setGreet(true), 12500)
    const hide = setTimeout(() => setGreet(false), 22000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, open])

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey) }
  }, [open])

  const patchLast = useCallback((fn) => setMessages(ms => {
    const copy = ms.slice()
    copy[copy.length - 1] = fn(copy[copy.length - 1])
    return copy
  }), [])

  /* type out an offline answer so it feels the same as streaming */
  const typeOut = useCallback(async (text) => {
    const chunks = text.match(/\S+\s*/g) || [text]
    for (const c of chunks) {
      patchLast(m => ({ ...m, content: m.content + c }))
      await sleep(18 + Math.random() * 22)
    }
  }, [patchLast])

  const ask = useCallback(async (raw) => {
    const question = raw.trim().slice(0, MAX_LEN)
    if (!question || busy) return
    setInput('')
    setBusy(true)
    const history = [...messages, { role: 'user', content: question }]
    setMessages([...history, { role: 'assistant', content: '', pending: true }])

    const payload = history.filter(m => m.content && m.content !== WELCOME.content).map(({ role, content }) => ({ role, content }))
    let got = false
    if (!offline) {
      const ctrl = new AbortController()
      abortRef.current = ctrl
      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload }),
          signal: ctrl.signal,
        })
        if (res.status === 429) {
          patchLast(m => ({ ...m, content: "You're asking faster than my rate limit allows, so here's what I know offline:\n\n" }))
        } else if (res.ok && res.body) {
          const reader = res.body.getReader()
          const dec = new TextDecoder()
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = dec.decode(value, { stream: true })
            if (chunk) { got = true; patchLast(m => ({ ...m, content: m.content + chunk })) }
          }
        } else {
          setOffline(true)
        }
      } catch (err) {
        if (err.name === 'AbortError') { setBusy(false); patchLast(m => ({ ...m, pending: false })); return }
        setOffline(true)
      }
    }
    if (!got) await typeOut(offlineAnswer(question))
    patchLast(m => ({ ...m, pending: false }))
    setBusy(false)
  }, [busy, messages, offline, patchLast, typeOut])

  // let other parts of the site (terminal, CTAs) open the agent
  const askRef = useRef(ask)
  askRef.current = ask
  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true)
      const q = e.detail?.question
      if (q) setTimeout(() => askRef.current(q), 300)
    }
    window.addEventListener('dk-agent', onOpen)
    return () => window.removeEventListener('dk-agent', onOpen)
  }, [])

  const reset = () => {
    abortRef.current?.abort()
    setBusy(false)
    setMessages([WELCOME])
  }

  const onLink = (href) => {
    navigate(href)
    if (window.matchMedia('(max-width: 680px)').matches) setOpen(false)
  }

  const toggle = () => {
    setGreet(false)
    ss.set(GREET_KEY, '1')
    setOpen(o => !o)
  }

  const showSuggestions = messages.length <= 1 && !busy

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            className="ask-panel"
            role="dialog"
            aria-label="Ask about Daksh"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <header className="ask-head">
              <div className="ask-avatar">
                <img src="/profile_photo/photo-removebg-preview.png" alt="" />
                <span className="ask-avatar-dot" />
              </div>
              <div className="ask-head-text">
                <strong>Daksh's agent</strong>
                <span>{offline ? 'offline mode · answers from his profile' : 'AI · knows his resume, projects & stack'}</span>
              </div>
              <button type="button" className="ask-icon-btn" onClick={reset} aria-label="New conversation" title="New conversation">
                <RotateCcw size={15} />
              </button>
              <button type="button" className="ask-icon-btn" onClick={() => setOpen(false)} aria-label="Close" title="Close">
                <X size={17} />
              </button>
            </header>

            <div className="ask-list" ref={listRef} aria-live="polite">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`ask-msg is-${m.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {m.role === 'assistant' && m.pending && !m.content ? (
                    <span className="ask-typing" aria-label="Thinking"><i /><i /><i /></span>
                  ) : m.role === 'assistant' ? (
                    <div className="ask-md">
                      <Markdown text={m.content} onLink={onLink} />
                      {m.pending && <span className="ask-caret" />}
                    </div>
                  ) : (
                    m.content
                  )}
                </motion.div>
              ))}

              {showSuggestions && (
                <div className="ask-suggest">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <form className="ask-form" onSubmit={e => { e.preventDefault(); ask(input) }}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_LEN}
                placeholder="Ask anything about Daksh…"
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input) } }}
                aria-label="Your question"
              />
              <button type="submit" className="ask-send" disabled={!input.trim() || busy} aria-label="Send">
                <ArrowUp size={17} strokeWidth={2.5} />
              </button>
            </form>
            <p className="ask-disclaimer">AI answers can be imperfect · verify on the resume</p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className={`ask-launch-wrap ${open ? 'is-open' : ''}`}>
        <AnimatePresence>
          {greet && !open && (
            <motion.button
              type="button"
              className="ask-greet"
              onClick={toggle}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
            >
              <b>Hi there 👋</b> Ask me anything about Daksh.
            </motion.button>
          )}
        </AnimatePresence>
        <button
          type="button"
          className="ask-launch"
          onClick={toggle}
          aria-expanded={open}
          aria-label={open ? 'Close Daksh agent' : 'Ask anything about Daksh'}
        >
          <span className="ask-launch-ring" aria-hidden="true" />
          <span className="ask-launch-core">
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="s" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                  <Sparkles size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          <span className="ask-launch-label">Ask about Daksh</span>
        </button>
      </div>
    </>
  )
}

export default AskDaksh
