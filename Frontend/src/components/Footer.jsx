import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Check, Copy } from 'lucide-react'
import { createMeshField } from './footer/meshField'
import useMagnetic from './footer/useMagnetic'
import '../styles/signature-footer.css'

/* ══════════════════════════════════════════════════════════════════
   SIGNATURE FOOTER — "The Reconcile Loop"
   Kubernetes' core idea as the site's final scene: the system starts
   drifted (nodes scattered, headline letters out of place) and the
   visitor's scroll reconciles it to its desired state. The cursor is
   a probe on the infrastructure plane; clicking deploys a ripple.
   ══════════════════════════════════════════════════════════════════ */

const EMAIL = 'dakshsawhneyy@gmail.com'

const ROUTES = [
  { label: 'Home', to: '/', path: '/' },
  { label: 'Systems', to: '/projects', path: '/projects' },
  { label: 'About', to: '/about', path: '/about' },
  { label: 'Experience', to: '/about#experience', path: '/about#exp' },
  { label: 'Writing', to: '/blog', path: '/blog' },
  { label: 'Contact', to: '/contact', path: '/contact' },
]

const ENDPOINTS = [
  { label: 'GitHub', href: 'https://github.com/dakshsawhneyy', path: 'gh/dakshsawhneyy' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/dakshsawhneyy', path: 'in/dakshsawhneyy' },
  { label: 'Hashnode', href: 'https://dakshsawhneyy.hashnode.dev', path: 'hashnode.dev' },
  { label: 'Email', href: `mailto:${EMAIL}`, path: 'smtp:443' },
  { label: 'Resume', href: '/resume/Daksh-Resume.pdf', path: 'resume.pdf' },
]

const HEAD = [
  { text: 'Ideas drift.', cls: 'sig-h-line sig-h-dim' },
  { text: 'Systems converge.', cls: 'sig-h-line', accent: 'converge.' },
]

const useMedia = (q) => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

/* Headline split into characters, each with its own drift vector.
   A single CSS variable (--drift) on the parent animates all of them. */
const DriftHeadline = ({ innerRef }) => {
  const lines = useMemo(() => {
    let seed = 7
    const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280) - 0.5
    return HEAD.map(line => {
      const words = line.text.split(' ')
      return {
        ...line,
        words: words.map(w => ({
          w,
          accent: line.accent === w,
          chars: [...w].map(ch => ({ ch, rx: r() * 260, ry: r() * 160, rr: r() * 70 })),
        })),
      }
    })
  }, [])

  return (
    <h2 className="sig-headline" ref={innerRef} aria-label="Ideas drift. Systems converge.">
      {lines.map((line, li) => (
        <span key={li} className={line.cls} aria-hidden="true">
          {line.words.map(({ accent, chars }, wi) => (
            <span key={wi} className={`sig-word ${accent ? 'sig-accent' : ''}`}>
              {chars.map(({ ch, rx, ry, rr }, ci) => (
                <span key={ci} className="sig-ch" style={{ '--rx': rx, '--ry': ry, '--rr': rr }}>{ch}</span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </h2>
  )
}

const RollLink = ({ label, path, ...props }) => {
  const inner = (
    <>
      <span className="sig-roll" data-text={label}><span>{label}</span></span>
      <span className="sig-link-path">{path}</span>
    </>
  )
  return props.to
    ? <Link className="sig-link" {...props}>{inner}</Link>
    : <a className="sig-link" {...props}>{inner}</a>
}

const Footer = () => {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const headRef = useRef(null)
  const driftRef = useRef(null)
  const statusRef = useRef(null)
  const clockRef = useRef(null)
  const uptimeRef = useRef(null)
  const wordRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const mobile = useMedia('(max-width: 680px)')
  const fine = useMedia('(hover: hover) and (pointer: fine)')

  const cta = useMagnetic(0.4)
  const top = useMagnetic(0.5)

  /* ── canvas engine + scroll wiring ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    const state = { target: reduced ? 1 : 0, vel: 0, mouse: { x: 0, y: 0, active: false } }
    let lastStatus = ''
    let lastDrift = -1
    let lastDriftStr = ''
    let lastConvStr = ''
    let lastMoving = null

    const field = createMeshField(canvas, {
      state, reduced, mobile,
      onFrame: (p) => {
        const d = Math.pow(1 - p, 1.4)
        // write CSS vars only when they change: each write restyles ~30 glyphs
        const dStr = d.toFixed(3), pStr = p.toFixed(3)
        if (dStr !== lastDriftStr) { lastDriftStr = dStr; headRef.current?.style.setProperty('--drift', dStr) }
        // GPU layers for the ~30 glyphs only while they move; settled text drops them
        const moving = d > 0.002
        if (moving !== lastMoving && rootRef.current) { lastMoving = moving; rootRef.current.classList.toggle('is-moving', moving) }
        if (pStr !== lastConvStr) { lastConvStr = pStr; rootRef.current?.style.setProperty('--conv', pStr) }
        const drifted = Math.round(d * field.nodeCount)
        if (drifted !== lastDrift && driftRef.current) {
          lastDrift = drifted
          driftRef.current.textContent = String(drifted).padStart(3, '0')
        }
        const status = p > 0.97 ? 'reconciled' : p > 0.35 ? 'reconciling' : 'drift detected'
        if (status !== lastStatus && statusRef.current) {
          lastStatus = status
          statusRef.current.textContent = status
          statusRef.current.dataset.state = status.split(' ')[0]
        }
      },
    })
    field.resize()

    let lastY = window.scrollY
    let scrollQueued = false
    // one layout read per frame at most (scroll events can fire several times per frame)
    const onScroll = () => {
      if (scrollQueued) return
      scrollQueued = true
      requestAnimationFrame(measure)
    }
    const measure = () => {
      scrollQueued = false
      const r = stage.getBoundingClientRect()
      const vh = window.innerHeight
      // fully reconciled once the stage top has nearly reached the top of the viewport
      state.target = reduced ? 1 : Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.92)))
      const y = window.scrollY
      state.vel += y - lastY
      lastY = y
    }
    measure()

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) field.start()
      else field.stop()
    }, { rootMargin: '120px 0px' })
    io.observe(stage)

    const ro = new ResizeObserver(() => field.resize())
    ro.observe(stage)

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      state.mouse.x = e.clientX - r.left
      state.mouse.y = e.clientY - r.top
      state.mouse.active = e.pointerType !== 'touch'
    }
    const onLeave = () => { state.mouse.active = false }
    const onDown = (e) => {
      if (e.target.closest('a,button')) return
      const r = canvas.getBoundingClientRect()
      field.ripple(e.clientX - r.left, e.clientY - r.top)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    stage.addEventListener('pointerdown', onDown)
    return () => {
      field.destroy(); io.disconnect(); ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointerdown', onDown)
    }
  }, [reduced, mobile])

  /* ── live clock (Jammu / IST) + session uptime, written straight to DOM ── */
  useEffect(() => {
    const started = performance.now()
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const tick = () => {
      if (clockRef.current) clockRef.current.textContent = fmt.format(new Date())
      const s = Math.floor((performance.now() - started) / 1000)
      if (uptimeRef.current) {
        uptimeRef.current.textContent =
          `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
      }
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  /* ── wordmark spotlight follows the cursor ── */
  useEffect(() => {
    const el = wordRef.current
    if (!el || !fine) return
    let raf = 0
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
        el.style.setProperty('--spot', '1')
      })
    }
    const onLeave = () => el.style.setProperty('--spot', '0')
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf) }
  }, [fine])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  const reveal = {
    hidden: { opacity: 0, y: 26 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
  }

  return (
    <footer className={`sig-footer ${reduced ? 'is-reduced' : ''}`} ref={rootRef}>
      <div className="sig-aperture">

        {/* ═════ STAGE — the living system ═════ */}
        <section className="sig-stage" ref={stageRef} aria-label="Closing">
          <canvas ref={canvasRef} className="sig-canvas" aria-hidden="true" />
          <div className="sig-vignette" aria-hidden="true" />

          <div className="sig-hud" aria-hidden="true">
            <span className="sig-hud-item">
              <span className="sig-pulse" /> reconcile-loop
              <b ref={statusRef} className="sig-status" data-state="drift">drift detected</b>
            </span>
            <span className="sig-hud-item sig-hide-sm">drifted&nbsp;pods <b ref={driftRef}>000</b></span>
            <span className="sig-hud-item">jammu <b ref={clockRef}>--:--:--</b> ist</span>
          </div>

          <div className="sig-stage-inner">
            <p className="sig-eyebrow">// end of manifest — desired state</p>
            <DriftHeadline innerRef={headRef} />

            <motion.div className="sig-cta-row"
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
              <motion.p className="sig-cta-copy" variants={reveal} custom={0}>
                You declare the desired state. I build the system that keeps it there —
                across <em>AWS</em>, <em>Azure</em>, <em>GCP</em> and <em>Kubernetes</em>, with an AI
                experiment or two along the way.
              </motion.p>

              <motion.div className="sig-cta-actions" variants={reveal} custom={1}>
                <motion.a
                  href={`mailto:${EMAIL}?subject=Let's%20build%20something`}
                  className="sig-cta"
                  style={{ x: cta.x, y: cta.y }}
                  {...cta.handlers}
                >
                  <svg className="sig-cta-ring" viewBox="0 0 200 200" aria-hidden="true">
                    <defs><path id="sigRing" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
                    <text><textPath href="#sigRing" textLength="498" lengthAdjust="spacing">kubectl apply · desired state · ship it · reconcile ·</textPath></text>
                  </svg>
                  <span className="sig-cta-core">
                    <span className="sig-cta-label">Start a{' '}<br />project</span>
                    <ArrowUpRight className="sig-cta-arrow" size={22} />
                  </span>
                </motion.a>

                <button type="button" className="sig-cmd" onClick={copyEmail} aria-label={`Copy email address ${EMAIL}`}>
                  <span className="sig-cmd-prompt">$</span>
                  <span className="sig-cmd-text">
                    {copied ? <>copied → {EMAIL}</> : <>kubectl apply -f <b>collab.yaml</b></>}
                  </span>
                  <span className="sig-cmd-icon">{copied ? <Check size={13} /> : <Copy size={13} />}</span>
                </button>
              </motion.div>
            </motion.div>
          </div>

          <p className="sig-hint" aria-hidden="true">
            {fine ? 'move to probe the mesh · click to deploy' : 'tap to deploy'}
          </p>
        </section>

        {/* ═════ MANIFEST — information, second ═════ */}
        <motion.section className="sig-manifest"
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
          aria-label="Site links">
          <motion.div className="sig-col sig-col-id" variants={reveal} custom={0}>
            <p className="sig-key">metadata:</p>
            <p className="sig-name">Daksh Sawhney</p>
            <p className="sig-pos">
              Cloud, DevOps &amp; SRE engineer. I build infrastructure that heals itself,
              products that ship, and AI experiments that occasionally behave.
            </p>
            <p className="sig-loc"><span className="sig-pulse" /> Jammu, India · open to full-time roles</p>
          </motion.div>

          <motion.nav className="sig-col" variants={reveal} custom={1} aria-label="Footer navigation">
            <p className="sig-key">routes:</p>
            {ROUTES.map(r => <RollLink key={r.label} to={r.to} label={r.label} path={r.path} />)}
          </motion.nav>

          <motion.div className="sig-col" variants={reveal} custom={2}>
            <p className="sig-key">endpoints:</p>
            {ENDPOINTS.map(e => (
              <RollLink key={e.label} href={e.href} label={e.label} path={e.path}
                {...(e.href.startsWith('http') || e.href.endsWith('.pdf') ? { target: '_blank', rel: 'noreferrer' } : {})} />
            ))}
          </motion.div>

          <motion.div className="sig-col sig-col-status" variants={reveal} custom={3}>
            <p className="sig-key">status:</p>
            <dl className="sig-stats">
              <div><dt>session uptime</dt><dd ref={uptimeRef}>00:00:00</dd></div>
              <div><dt>error budget</dt><dd className="ok">99.97%</dd></div>
              <div><dt>stack</dt><dd>AWS · Azure · K8s · Terraform · Prometheus</dd></div>
            </dl>
            <motion.button
              type="button"
              className="sig-top"
              style={{ x: top.x, y: top.y }}
              {...top.handlers}
              onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
              aria-label="Back to top"
            >
              <ArrowUp size={16} /> <span>rollback to top</span>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* ═════ WORDMARK ═════ */}
        <div className="sig-wordmark" ref={wordRef} aria-hidden="true">
          <span className="sig-wm-outline">DAKSH</span>
          <span className="sig-wm-fill">DAKSH</span>
        </div>

        <div className="sig-bottom">
          <span>© {new Date().getFullYear()} Daksh Sawhney</span>
          <span className="sig-hide-sm">Built with React · shipped via Terraform to AWS &amp; Azure</span>
          <span>all systems nominal</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
