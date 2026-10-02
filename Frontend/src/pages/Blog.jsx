import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Clock3, Rss, GitCommitHorizontal, Pin } from 'lucide-react'
import { fetchBlogs, FALLBACK_POSTS } from '../data/blogService'
import '../styles/blog.css'

/* ══════════════════════════════════════════════════════════════════
   BLOG — "Field notes" as a git log.
   Latest post is pinned as `cat README.md`; the rest are commits on a
   branch graph. Hovering a commit floats a preview with generative
   cover art (seeded from the slug). Topic chips filter the log.
   ══════════════════════════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1]
const readTime = (text = '') => Math.max(3, Math.ceil(text.trim().split(/\s+/).length / 22))
const fmt = (d) => new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
const shortSha = (s) => hash(s).toString(16).padStart(8, '0').slice(0, 7)

const TOPICS = [
  { key: 'k8s', label: 'Kubernetes', color: '#2d8bbf', re: /kubernetes|k8s|eks|aks|helm|container|pod/i },
  { key: 'cloud', label: 'Cloud', color: '#d4940a', re: /aws|azure|gcp|cloud|hyperscale|million|multi/i },
  { key: 'sre', label: 'SRE', color: '#e8674a', re: /sre|reliab|incident|healing|monitor|health|aiops/i },
  { key: 'devsecops', label: 'DevSecOps', color: '#7c79ca', re: /devsecops|jenkins|ci\/cd|cicd|pipeline|trivy|sonar|secure|owasp/i },
  { key: 'iac', label: 'IaC', color: '#27ae78', re: /terraform|ansible|infra|iac/i },
]
const topicsOf = (p) => TOPICS.filter(t => t.re.test(`${p.title} ${p.brief}`))

/* generative cover: layered rings + grid, palette from the post's first topic */
const Cover = ({ post, big }) => {
  const h = hash(post.slug || post.title)
  const t = topicsOf(post)[0] || TOPICS[2]
  const rings = 4 + (h % 4)
  const cx = 30 + (h % 40), cy = 30 + ((h >> 5) % 40)
  return (
    <svg className={`bl-cover ${big ? 'is-big' : ''}`} viewBox="0 0 100 62" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`g${h}`} cx={`${cx}%`} cy={`${cy}%`} r="80%">
          <stop offset="0%" stopColor={t.color} stopOpacity=".9" />
          <stop offset="55%" stopColor={t.color} stopOpacity=".18" />
          <stop offset="100%" stopColor="#0c0e0c" stopOpacity="0" />
        </radialGradient>
        <pattern id={`p${h}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".35" fill="rgba(255,255,255,.18)" />
        </pattern>
      </defs>
      <rect width="100" height="62" fill="#0c0e0c" />
      <rect width="100" height="62" fill={`url(#g${h})`} />
      <rect width="100" height="62" fill={`url(#p${h})`} />
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={cx} cy={cy * 0.62} r={6 + i * (5 + (h % 3))} fill="none"
          stroke="rgba(255,255,255,.22)" strokeWidth=".3" strokeDasharray={i % 2 ? '1 1.5' : undefined} />
      ))}
      <path d={`M0 ${40 + (h % 12)} Q 30 ${20 + (h % 20)} 55 ${35 + (h % 10)} T 100 ${18 + (h % 25)}`} fill="none" stroke={t.color} strokeWidth=".8" />
      <text x="4" y="58" fill="rgba(255,255,255,.55)" fontSize="3.2" fontFamily="ui-monospace, monospace">{shortSha(post.slug || post.title)} · {t.label.toLowerCase()}</text>
    </svg>
  )
}

const Blog = () => {
  const [blogs, setBlogs] = useState(FALLBACK_POSTS)
  const [fetching, setFetching] = useState(true)
  const [topic, setTopic] = useState(null)
  const [hover, setHover] = useState(null)
  const listRef = useRef(null)

  const load = useCallback(() => {
    setFetching(true)
    fetchBlogs().then(setBlogs).finally(() => setFetching(false))
  }, [])
  useEffect(() => { load() }, [load])

  const posts = useMemo(() => [...blogs].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)), [blogs])
  const pinned = posts[0]
  const log = posts.slice(1)
  const shown = topic ? log.filter(p => topicsOf(p).some(t => t.key === topic)) : log
  const counts = useMemo(() => Object.fromEntries(TOPICS.map(t => [t.key, log.filter(p => t.re.test(`${p.title} ${p.brief}`)).length])), [log])
  const years = new Set(posts.map(p => new Date(p.publishedAt).getFullYear()))

  /* floating preview follows the cursor (springs, no re-render per move) */
  const px = useMotionValue(0), py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 260, damping: 26 }), sy = useSpring(py, { stiffness: 260, damping: 26 })
  const onMove = (e) => {
    const r = listRef.current.getBoundingClientRect()
    // ride along the right edge (never over the title), follow the cursor vertically
    px.set(r.width - 330)
    py.set(e.clientY - r.top - 95)
  }

  const url = (p) => p.url || `https://dakshsawhneyy.hashnode.dev/${p.slug}`

  return (
    <main className="bl-root">
      {/* ═════ HERO ═════ */}
      <header className="bl-hero">
        <div className="bl-wrap bl-hero-grid">
          <div>
            <motion.p className="bl-k" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease }}>
              <GitCommitHorizontal size={13} /> git log --oneline --author=daksh
            </motion.p>
            <h1 className="bl-h1">
              {['Field', 'notes.'].map((w, i) => (
                <span key={w} className="bl-h1-line">
                  <motion.span initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: .9, ease, delay: .1 + i * .12 }}
                    className={i ? 'is-em' : ''}>{w}</motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="bl-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}>
              Write-ups from building, breaking and fixing real systems: scaling to a million users, self-healing platforms,
              DevSecOps pipelines and multi-cloud plumbing.
            </motion.p>
          </div>
          <motion.dl className="bl-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7, ease }}>
            <div><dt>commits</dt><dd>{String(posts.length).padStart(2, '0')}</dd></div>
            <div><dt>since</dt><dd>{Math.min(...years)}</dd></div>
            <div><dt>status</dt><dd className="ok">{fetching ? 'syncing…' : 'up to date'}</dd></div>
            <a className="bl-hashnode" href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">
              <Rss size={14} /> Follow on Hashnode <ArrowUpRight size={14} />
            </a>
          </motion.dl>
        </div>
      </header>

      {/* ═════ PINNED: cat README.md ═════ */}
      {pinned && (
        <section className="bl-wrap bl-pinned-wrap">
          <motion.a className="bl-pinned" href={url(pinned)} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .8, ease }}>
            <div className="bl-pinned-cover">
              {pinned.cover ? <img src={pinned.cover} alt="" /> : <Cover post={pinned} big />}
              <span className="bl-pin"><Pin size={12} /> latest · HEAD</span>
            </div>
            <div className="bl-pinned-term">
              <div className="bl-term-bar"><i /><i /><i /><span>~/notes/{(pinned.slug || '').slice(0, 34)}</span></div>
              <div className="bl-term-body">
                <p className="bl-term-cmd"><b>❯</b> cat README.md</p>
                <p className="bl-term-meta">{fmt(pinned.publishedAt)} · <Clock3 size={11} /> {readTime(pinned.brief)} min read · {topicsOf(pinned).map(t => t.label).join(' · ')}</p>
                <h2 className="bl-pinned-title"># {pinned.title}</h2>
                <p className="bl-pinned-brief">{pinned.brief}</p>
                <span className="bl-read">read the full note <ArrowUpRight size={15} /></span>
              </div>
            </div>
          </motion.a>
        </section>
      )}

      {/* ═════ THE LOG ═════ */}
      <section className="bl-wrap bl-log-wrap">
        <div className="bl-filters" role="group" aria-label="Filter by topic">
          <button type="button" className={!topic ? 'is-on' : ''} onClick={() => setTopic(null)}>all <b>{log.length}</b></button>
          {TOPICS.map(t => counts[t.key] > 0 && (
            <button key={t.key} type="button" className={topic === t.key ? 'is-on' : ''} style={{ '--c': t.color }}
              onClick={() => setTopic(v => (v === t.key ? null : t.key))}>
              <i />{t.label} <b>{counts[t.key]}</b>
            </button>
          ))}
        </div>

        <div className="bl-log" ref={listRef} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          <span className="bl-branch" aria-hidden="true" />
          <AnimatePresence initial={false}>
            {shown.map((p, i) => {
              const tps = topicsOf(p)
              return (
                <motion.a key={p.slug || p.title} className="bl-commit" href={url(p)} target="_blank" rel="noreferrer"
                  layout
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: .45, ease, delay: Math.min(i, 8) * .04 }}
                  style={{ '--c': (tps[0] || TOPICS[2]).color }}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(p)}>
                  <span className="bl-dot" aria-hidden="true" />
                  <span className="bl-sha">{shortSha(p.slug || p.title)}</span>
                  <div className="bl-commit-body">
                    <h3><span>{p.title}</span></h3>
                    <p>{p.brief}</p>
                    <div className="bl-commit-meta">
                      <span>{fmt(p.publishedAt)}</span>
                      <span><Clock3 size={11} /> {readTime(p.brief)} min</span>
                      {tps.slice(0, 2).map(t => <span key={t.key} className="bl-tag" style={{ '--c': t.color }}>{t.label}</span>)}
                    </div>
                  </div>
                  <span className="bl-arrow"><ArrowUpRight size={18} /></span>
                </motion.a>
              )
            })}
          </AnimatePresence>
          <div className="bl-root-commit"><span className="bl-dot" /> <code>initial commit</code> · the first note. More on the way.</div>

          {/* floating preview */}
          <AnimatePresence>
            {hover && (
              <motion.div className="bl-preview" style={{ x: sx, y: sy }}
                initial={{ opacity: 0, scale: .85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: .9 }}
                transition={{ duration: .22 }}>
                {hover.cover ? <img src={hover.cover} alt="" /> : <Cover post={hover} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}

export default Blog
