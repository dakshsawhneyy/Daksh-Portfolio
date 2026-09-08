import { Activity, ArrowUpRight, BookOpen, FileText, Github, Home, Mail, Terminal, UserRound, Waypoints } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ onOpenSreMode }) => {
  const location = useLocation()
  const links = [
    { label: 'Home', short: 'HOME', path: '/', icon: Home },
    { label: 'Systems', short: 'WORK', path: '/projects', icon: Waypoints },
    { label: 'About', short: 'IDENTITY', path: '/about', icon: UserRound },
    { label: 'Blog', short: 'BLOG', path: '/blog', icon: BookOpen },
    { label: 'Contact', short: 'CONTACT', path: '/contact', icon: Mail }
  ]
  const isActive = (path) => path.includes('#')
    ? location.pathname === '/' && location.hash === '#incident-zero'
    : path === '/' ? location.pathname === '/' && !location.hash : location.pathname === path || location.pathname.startsWith(path + '/')

  return <header className="site-nav" aria-label="Reliability Lab navigation">
    <div className="nav-console-head"><Link to="/" className="brand-mark" aria-label="Daksh Sawhney home"><span>DS</span><strong>Daksh Sawhney</strong><small><Activity size={11} /> RELIABILITY LAB</small></Link><span className="nav-rail-label">RCP / 01</span></div>
    <nav className="nav-links" aria-label="Primary navigation">{links.map(({ label, short, path, icon: Icon }, index) => <Link key={label} to={path} className={isActive(path) ? 'active' : ''} title={label}><b>0{index + 1}</b><Icon size={16} /><span>{short}</span></Link>)}</nav>
    <div className="nav-actions"><span className="nav-status"><i /> <span>LAB / READY</span></span><button type="button" className="nav-terminal" onClick={onOpenSreMode} aria-label="Open SRE Mode terminal" title="Open SRE Mode terminal"><Terminal size={16} /><span>SRE</span></button><a className="nav-resume nav-download" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer" aria-label="Open resume" title="Open resume"><FileText size={15} /><span>Resume</span><ArrowUpRight size={15} /></a><a className="nav-github" href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer" aria-label="Open GitHub" title="Open GitHub"><Github size={16} /></a></div>
  </header>
}

export default Navbar