import { ArrowUpRight, CircleDot, Mail, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../home-reference.css'

const Home = () => {
  return <main className="reference-home">
    <div className="reference-frame">
      <aside className="reference-rail" aria-label="Homepage sections">
        <Link to="/about"><CircleDot size={15} /> <span>About Me</span></Link>
        <div className="rail-words"><Link to="/metrics">SLOs</Link><Link to="/blog">Notes</Link><Link to="/projects">Projects</Link><Link to="/contact">Contact</Link></div>
      </aside>
      <section className="reference-profile">
        <div className="profile-top"><Sparkles size={15} /> <span>About Me</span></div>
        <div className="profile-portrait"><img src="/astronaut.avif" alt="Daksh Sawhney" /><div className="portrait-ring" /></div>
        <div className="profile-name">I&apos;m,<br /><strong>Daksh<br />Sawhney</strong></div>
        <a className="profile-email" href="mailto:dakshsawhneyy@gmail.com">dakshsawhneyy@gmail.com <Mail size={13} /></a>
        <span className="profile-mark">DS<br /><small>2026</small></span>
      </section>
      <div className="reference-content">
        <nav className="reference-nav" aria-label="Primary navigation"><Link className="current" to="/">Home</Link><Link to="/about">About</Link><Link to="/projects">Projects</Link><Link to="/metrics">Metrics</Link><Link to="/contact">Contact</Link><a href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">Resume</a></nav>
        <h1>Portfolio<span className="title-mark">↗</span></h1>
        <div className="reference-grid">
          <Link className="reference-feature sre-console" to="/projects">
            <div className="console-top"><span className="status-live"><i /> LIVE SYSTEMS</span><span>REGION: GLOBAL / 04</span></div><div className="console-graph"><span className="graph-line line-one" /><span className="graph-line line-two" /><span className="graph-node node-one" /><span className="graph-node node-two" /><span className="graph-node node-three" /><span className="graph-node node-four" /></div><div className="console-footer"><span className="feature-kicker">SRE portfolio / 01</span><span className="feature-name">AIOps &amp; Auto Healing</span></div>
          </Link>
          <div className="reference-stats"><Link to="/projects"><strong>19</strong><span>Projects shipped</span><i>⌝</i></Link><Link to="/metrics"><strong>99.995%</strong><span>SLO uptime target</span><i>⌝</i></Link></div>
          <Link className="reference-client" to="/about"><span>SRE / cloud platform</span><strong>Reliable systems<br />by design.</strong><small>Capabilities <ArrowUpRight size={14} /></small></Link>
          <Link className="reference-awards" to="/blog"><div className="award-orb">⌁</div><div><strong>RUNBOOKS</strong><span>Notes from<br />the platform.</span></div><i>⌝</i></Link>
        </div>
      </div>
    </div>
  </main>
}

export default Home