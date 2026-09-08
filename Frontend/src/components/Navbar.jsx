import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation()
  const links = [['About', '/about'], ['Projects', '/projects'], ['Notes', '/blog'], ['Contact', '/contact']]
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return <header className="site-nav">
    <Link to="/" className="brand-mark"><span>DS</span><strong>Daksh Sawhney</strong></Link>
    <nav className="nav-links" aria-label="Primary navigation">{links.map(([label, path]) => <Link key={path} to={path} className={isActive(path) ? 'active' : ''}>{label}</Link>)}</nav>
    <div className="nav-actions"><button className="theme-toggle" onClick={toggleDarkMode} aria-label="Toggle theme">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button><a className="nav-resume nav-download" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowUpRight size={15} /></a><Link className="nav-resume" to="/contact">Let's talk <ArrowUpRight size={15} /></Link></div>
  </header>
}

export default Navbar