import { ArrowUpRight, Clock3, Rss, RefreshCw, BookOpen } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { fetchBlogs, FALLBACK_POSTS } from '../data/blogService'
import '../pages-unified.css'

const fadeUp  = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

const readTime = (text = '') => Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))

const Blog = () => {
  // Start with fallback posts immediately — no empty loading state
  const [blogs, setBlogs]       = useState(FALLBACK_POSTS)
  const [fetching, setFetching] = useState(true)   // background fetch in progress
  const [error, setError]       = useState(false)

  const load = useCallback(() => {
    setFetching(true); setError(false)
    fetchBlogs()
      .then(posts => {
        setBlogs(posts)
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setFetching(false))
  }, [])

  useEffect(() => { load() }, [load])

  const featured = blogs[0] || null
  const rest     = blogs.slice(1)

  return (
    <main className="blog-page-v3">

      {/* ── Hero ── */}
      <section className="bp3-hero">
        <div className="bp3-hero-inner">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="bp3-eyebrow" variants={fadeUp}>
              <BookOpen size={11} /> Notes from the field
            </motion.p>
            <motion.h1 className="bp3-h1" variants={fadeUp}>
              Writing on systems,<br /><em>failure &amp; craft.</em>
            </motion.h1>
          </motion.div>
          <motion.div
            className="bp3-hero-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <a className="bp3-hashnode-btn" href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">
              Open Hashnode <Rss size={14} />
            </a>
            {!fetching && !error && (
              <span className="bp3-count">{blogs.length} article{blogs.length !== 1 ? 's' : ''} published</span>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="bp3-body">

        {/* Subtle background refresh indicator */}
        {fetching && blogs.length > 0 && (
          <div className="bp3-refresh-bar">
            <span className="bp3-refresh-dot" /> Fetching latest posts…
          </div>
        )}

        {/* error — only shown if we have no posts at all */}
        {error && blogs.length === 0 && (
          <div className="bp3-state">
            <p>Couldn't load articles.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginTop:14 }}>
              <button className="bp3-retry-btn" onClick={load}><RefreshCw size={13}/> Retry</button>
              <a className="bp3-retry-btn" href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">
                Browse Hashnode <ArrowUpRight size={13}/>
              </a>
            </div>
          </div>
        )}

        {/* content — always shown (starts with fallback, updates when real posts arrive) */}
        {blogs.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            {/* featured first article */}
            {featured && (
              <motion.a
                className="bp3-featured"
                href={featured.url || `https://dakshsawhneyy.hashnode.dev/${featured.slug}`}
                target="_blank"
                rel="noreferrer"
                variants={fadeUp}
              >
                <div className="bp3-feat-visual">
                  {featured.cover
                    ? <img src={featured.cover} alt={featured.title} className="bp3-feat-cover" />
                    : <div className="bp3-feat-visual-inner"><span className="bp3-feat-num">01</span></div>
                  }
                  <span className="bp3-feat-badge">LATEST POST</span>
                </div>
                <div className="bp3-feat-body">
                  <div className="bp3-feat-meta">
                    <span>
                      {new Date(featured.publishedAt || Date.now()).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                    </span>
                    <span><Clock3 size={11}/> {readTime(featured.brief)} min read</span>
                  </div>
                  <h2 className="bp3-feat-title">{featured.title}</h2>
                  <p className="bp3-feat-brief">{featured.brief}</p>
                  <span className="bp3-feat-cta">
                    Read article <ArrowUpRight size={14}/>
                  </span>
                </div>
              </motion.a>
            )}

            {/* remaining articles list */}
            {rest.length > 0 && (
              <div className="bp3-list">
                {rest.map((item, i) => {
                  const url  = item.url || `https://dakshsawhneyy.hashnode.dev/${item.slug}`
                  const mins = readTime(item.brief)
                  return (
                    <motion.a
                      key={item.slug || i}
                      className="bp3-article"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      variants={fadeUp}
                    >
                      <div className="bp3-art-num">{String(i + 2).padStart(2, '0')}</div>
                      <div className="bp3-art-copy">
                        <div className="bp3-art-meta">
                          <span>
                            {new Date(item.publishedAt || Date.now()).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                          </span>
                          <span><Clock3 size={11}/> {mins} min read</span>
                        </div>
                        <h2 className="bp3-art-title">{item.title}</h2>
                        <p className="bp3-art-brief">{item.brief}</p>
                      </div>
                      {item.cover && (
                        <div className="bp3-art-cover">
                          <img src={item.cover} alt={item.title} />
                        </div>
                      )}
                      <div className="bp3-art-arrow"><ArrowUpRight size={16}/></div>
                    </motion.a>
                  )
                })}
              </div>
            )}

          </motion.div>
        )}

        {/* empty */}
        {!fetching && !error && blogs.length === 0 && (
          <div className="bp3-state">
            <p>No articles found.</p>
            <a className="bp3-retry-btn" href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">
              Open Hashnode <ArrowUpRight size={13}/>
            </a>
          </div>
        )}

      </div>
    </main>
  )
}

export default Blog



