import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Github, Linkedin, Rss, Play, RotateCcw, Mail } from 'lucide-react'
import useMagnetic from '../components/footer/useMagnetic'
import { apiUrl } from '../lib/api'
import '../styles/contact.css'

/* ══════════════════════════════════════════════════════════════════
   CONTACT — "Deploy a conversation."
   The form IS a Kubernetes manifest: inputs live inside YAML lines.
   Apply runs a rollout log, then POSTs to /api/message (unchanged
   backend contract: { name, email, message }).
   ══════════════════════════════════════════════════════════════════ */

const EMAIL = 'dakshsawhneyy@gmail.com'
const ease = [0.22, 1, 0.36, 1]
const INTENTS = [
  { key: 'hire', label: 'Hire me', yaml: 'FullTimeRole' },
  { key: 'project', label: 'Build something', yaml: 'Project' },
  { key: 'collab', label: 'Collaborate', yaml: 'Collaboration' },
  { key: 'hi', label: 'Just say hi', yaml: 'Hello' },
]
const slug = (s) => (s || 'you').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 24) || 'you'

const useJammuClock = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
  const h = +time.slice(0, 2)
  return { time, awake: h >= 9 && h < 23 }
}

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [intent, setIntent] = useState('hire')
  const [phase, setPhase] = useState('edit') // edit | applying | done | error
  const [logLines, setLogLines] = useState([])
  const [copied, setCopied] = useState(false)
  const clock = useJammuClock()
  const hello = useMagnetic(0.25)
  const apply = useMagnetic(0.35)
  const firstRef = useRef(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
  const it = INTENTS.find(i => i.key === intent)
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim().length > 3

  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { window.location.href = `mailto:${EMAIL}` }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!valid || phase === 'applying') return
    setPhase('applying')
    const name = slug(form.name)
    const steps = [
      `$ kubectl apply -f conversation.yaml`,
      `validating manifest… ok`,
      `conversation.daksh.dev/${name} created`,
      `routing to inbox: ${EMAIL.replace(/(.{3}).*@/, '$1•••@')}`,
    ]
    setLogLines([])
    for (const [i, l] of steps.entries()) {
      await new Promise(r => setTimeout(r, i ? 380 : 120))
      setLogLines(ls => [...ls, l])
    }
    try {
      const body = {
        name: form.name.trim(),
        email: form.email.trim(),
        message: `[${it.label}]${form.company.trim() ? ` · ${form.company.trim()}` : ''}\n\n${form.message.trim()}`,
      }
      const res = await fetch(apiUrl('/api/message'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error('send failed')
      await new Promise(r => setTimeout(r, 300))
      setLogLines(ls => [...ls, `rollout status: 1/1 delivered ✓  ·  expect a reply within 24h`])
      setPhase('done')
    } catch {
      setLogLines(ls => [...ls, `error: inbox unreachable. Email ${EMAIL} directly.`])
      setPhase('error')
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', company: '', message: '' })
    setPhase('edit'); setLogLines([])
    setTimeout(() => firstRef.current?.focus(), 50)
  }

  const locked = phase === 'applying' || phase === 'done'

  return (
    <main className="ct-root">
      <div className="ct-grid">
        {/* ═════ LEFT ═════ */}
        <section className="ct-left">
          <motion.p className="ct-k" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease }}>
            <span className="ap3-available-dot" /> Open to work · immediate joiner
          </motion.p>
          <motion.h1 className="ct-h1" style={{ x: hello.x, y: hello.y }} {...hello.handlers}>
            {['Say', 'hello.'].map((w, i) => (
              <span key={w} className="ct-h1-line">
                <motion.span className={i ? 'is-em' : ''} initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: .9, ease, delay: .1 + i * .12 }}>{w}</motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p className="ct-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }}>
            A role, a platform problem, or a system that needs to stop paging people at 3 a.m.?
            Deploy a conversation, or skip the YAML and email me.
          </motion.p>

          <motion.div className="ct-cards" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: .08, delayChildren: .5 } } }}>
            <motion.button type="button" className="ct-mail" onClick={copy} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }}>
              <span className="ct-mail-k"><Mail size={13} /> {copied ? 'copied to clipboard' : 'click to copy'}</span>
              <span className="ct-mail-v">{EMAIL}</span>
              <span className="ct-mail-icon">{copied ? <Check size={16} /> : <Copy size={16} />}</span>
            </motion.button>

            <motion.div className="ct-meta" variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }}>
              <div className="ct-clock">
                <span className={`ct-sun ${clock.awake ? 'is-day' : 'is-night'}`} aria-hidden="true" />
                <div>
                  <b>{clock.time}</b>
                  <small>Jammu, India · {clock.awake ? 'awake, probably shipping' : 'asleep, replies at sunrise'}</small>
                </div>
              </div>
              <div className="ct-slo">
                <small>reply SLO</small>
                <b>&lt; 24h</b>
                <span className="ct-slo-bar"><i /></span>
                <small>usually the same day</small>
              </div>
            </motion.div>

            <motion.div className="ct-socials" variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }}>
              {[
                { href: 'https://github.com/dakshsawhneyy', Icon: Github, label: 'GitHub', sub: '@dakshsawhneyy' },
                { href: 'https://linkedin.com/in/dakshsawhneyy', Icon: Linkedin, label: 'LinkedIn', sub: 'in/dakshsawhneyy' },
                { href: 'https://dakshsawhneyy.hashnode.dev', Icon: Rss, label: 'Hashnode', sub: 'field notes' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="ct-social">
                  <s.Icon size={18} />
                  <span><b>{s.label}</b><small>{s.sub}</small></span>
                  <ArrowUpRight size={16} className="ct-social-arrow" />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ═════ RIGHT: the manifest ═════ */}
        <motion.section className="ct-editor" initial={{ opacity: 0, y: 40, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .9, ease, delay: .2 }}>
          <div className="ct-tabs">
            <span className="ct-dots"><i /><i /><i /></span>
            <span className="ct-tab is-on">conversation.yaml</span>
            <span className="ct-tab">README.md</span>
            <span className={`ct-state is-${phase}`}>{phase === 'edit' ? (valid ? '● ready to apply' : '○ draft') : phase === 'applying' ? '◌ applying…' : phase === 'done' ? '✓ deployed' : '✗ failed'}</span>
          </div>

          <div className="ct-intents" role="radiogroup" aria-label="What is this about?">
            {INTENTS.map(i => (
              <button key={i.key} type="button" role="radio" aria-checked={intent === i.key}
                className={intent === i.key ? 'is-on' : ''} disabled={locked} onClick={() => setIntent(i.key)}>{i.label}</button>
            ))}
          </div>

          <form className="ct-yaml" onSubmit={submit} noValidate>
            <ol>
              <li><span className="y-k">apiVersion</span>: <span className="y-s">daksh.dev/v1</span></li>
              <li><span className="y-k">kind</span>: <span className="y-s">Conversation</span></li>
              <li><span className="y-k">metadata</span>:</li>
              <li className="i1"><span className="y-k">name</span>: <span className="y-v">{slug(form.name)}</span><span className="y-c">  # generated from your name</span></li>
              <li><span className="y-k">spec</span>:</li>
              <li className="i1"><span className="y-k">type</span>: <motion.span key={it.yaml} className="y-s" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{it.yaml}</motion.span></li>
              <li className="i1"><span className="y-k">from</span>:</li>
              <li className="i2 has-input">
                <label htmlFor="ct-name"><span className="y-k">name</span>: </label>
                <input id="ct-name" ref={firstRef} value={form.name} onChange={set('name')} placeholder='"Ada Lovelace"' autoComplete="name" disabled={locked} required />
              </li>
              <li className="i2 has-input">
                <label htmlFor="ct-email"><span className="y-k">email</span>: </label>
                <input id="ct-email" type="email" value={form.email} onChange={set('email')} placeholder='"ada@company.com"' autoComplete="email" disabled={locked} required />
              </li>
              <li className="i2 has-input">
                <label htmlFor="ct-company"><span className="y-k">company</span>: </label>
                <input id="ct-company" value={form.company} onChange={set('company')} placeholder='"optional"' autoComplete="organization" disabled={locked} />
              </li>
              <li className="i1"><label htmlFor="ct-msg"><span className="y-k">message</span>: <span className="y-p">|</span></label></li>
              <li className="i2 has-area">
                <textarea id="ct-msg" rows={5} value={form.message} onChange={set('message')} disabled={locked} required
                  placeholder={'Tell me about the role, the system,\nor the problem you are trying to solve…'} />
              </li>
              <li className="i1"><span className="y-k">replyWithin</span>: <span className="y-s">24h</span></li>
            </ol>

            <div className="ct-actions">
              <AnimatePresence mode="wait">
                {phase === 'done' || phase === 'error' ? (
                  <motion.button key="reset" type="button" className="ct-apply is-ghost" onClick={reset}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RotateCcw size={15} /> Deploy another
                  </motion.button>
                ) : (
                  <motion.button key="apply" type="submit" className="ct-apply" disabled={!valid || phase === 'applying'}
                    style={{ x: apply.x, y: apply.y }} {...apply.handlers}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Play size={14} /> {phase === 'applying' ? 'Applying…' : 'kubectl apply'}
                  </motion.button>
                )}
              </AnimatePresence>
              <span className="ct-hint">{valid ? 'manifest valid · ⏎ to deploy' : 'fill name, email and message'}</span>
            </div>
          </form>

          <AnimatePresence>
            {logLines.length > 0 && (
              <motion.div className={`ct-log is-${phase}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                {logLines.map((l, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>{l}</motion.p>
                ))}
                {phase === 'done' && (
                  <motion.div className="ct-done" initial={{ scale: .6, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
                    message received
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </main>
  )
}

export default Contact
