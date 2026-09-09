import { ArrowUpRight, Github, Linkedin, Mail, MapPin, CheckCircle, AlertCircle, Loader, Send } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import '../pages-unified.css'

const fadeUp  = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }

const Contact = () => {
  const [form, setForm]     = useState({ name:'', email:'', message:'' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
      const res  = await fetch(`${base}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok && data.success) { setStatus('success'); setForm({ name:'', email:'', message:'' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <main className="contact-page-v3">

      {/* ── Hero ── */}
      <section className="cp3-hero">
        <div className="cp3-hero-inner">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="cp3-eyebrow" variants={fadeUp}>
              <Send size={11} /> Get in touch
            </motion.p>
            <motion.h1 className="cp3-h1" variants={fadeUp}>
              Let's build something<br /><em>worth running.</em>
            </motion.h1>
            <motion.p className="cp3-hero-sub" variants={fadeUp}>
              Platform problem, reliability question, or a project that needs a clearer shape?
              I'd like to hear about it.
            </motion.p>
          </motion.div>

          <motion.div
            className="cp3-status"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <span className="cp3-status-dot" />
            Open to work
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <motion.div
        className="cp3-body"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >

        {/* ── Left: details ── */}
        <motion.div className="cp3-details" variants={fadeUp}>

          <div className="cp3-detail-section">
            <p className="cp3-detail-label">Direct email</p>
            <a className="cp3-email-link" href="mailto:dakshsawhneyy@gmail.com">
              dakshsawhneyy@gmail.com <ArrowUpRight size={15}/>
            </a>
            <p className="cp3-reply-note">I reply within 24 hours.</p>
          </div>

          <div className="cp3-detail-section">
            <p className="cp3-detail-label">Find me online</p>
            <div className="cp3-socials">
              <a className="cp3-social-link" href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer">
                <Github size={17} className="cp3-social-icon"/>
                <span>GitHub</span>
                <ArrowUpRight size={13} className="cp3-social-arrow"/>
              </a>
              <a className="cp3-social-link" href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer">
                <Linkedin size={17} className="cp3-social-icon"/>
                <span>LinkedIn</span>
                <ArrowUpRight size={13} className="cp3-social-arrow"/>
              </a>
              <a className="cp3-social-link" href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">
                <Mail size={17} className="cp3-social-icon"/>
                <span>Hashnode Blog</span>
                <ArrowUpRight size={13} className="cp3-social-arrow"/>
              </a>
            </div>
          </div>

          <div className="cp3-detail-section">
            <p className="cp3-detail-label">Details</p>
            <div className="cp3-meta-pills">
              <span className="cp3-meta-pill"><MapPin size={13}/> Jammu, India</span>
              <span className="cp3-meta-pill"><Mail size={13}/> Available for selected full-time roles</span>
            </div>
          </div>

        </motion.div>

        {/* ── Right: form ── */}
        <motion.form className="cp3-form-card" onSubmit={handleSubmit} variants={fadeUp}>
          <div className="cp3-form-head">
            <p className="cp3-form-title">Send a message</p>
            <p className="cp3-form-sub">All fields required · replies within 24 h</p>
          </div>

          <div className="cp3-field">
            <label htmlFor="cp3-name">Your name</label>
            <input
              id="cp3-name" required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Daksh Sawhney"
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          <div className="cp3-field">
            <label htmlFor="cp3-email">Email address</label>
            <input
              id="cp3-email" required type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@company.com"
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          <div className="cp3-field">
            <label htmlFor="cp3-msg">What are you working on?</label>
            <textarea
              id="cp3-msg" required rows={5}
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              placeholder="A few words about the project or problem…"
              disabled={status === 'loading' || status === 'success'}
            />
          </div>

          {status !== 'success' && (
            <button className="cp3-submit" type="submit" disabled={status === 'loading'}>
              {status === 'loading'
                ? <><Loader size={15} className="spin-icon"/> Sending…</>
                : <>Send message <ArrowUpRight size={16}/></>
              }
            </button>
          )}

          {status === 'success' && (
            <div className="cp3-feedback cp3-success">
              <CheckCircle size={17}/>
              Message sent — I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="cp3-feedback cp3-error">
              <AlertCircle size={17}/>
              Something went wrong.{' '}
              <a href="mailto:dakshsawhneyy@gmail.com">Email me directly.</a>
            </div>
          )}
        </motion.form>

      </motion.div>
    </main>
  )
}

export default Contact
