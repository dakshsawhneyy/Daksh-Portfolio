import { Activity, BookOpen, FileText, Github, Home, Mail, Terminal, UserRound, Waypoints } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ onOpenSreMode }) => {
  const location = useLocation()
  const links = [
    { label: 'Home',    path: '/',        icon: Home },
    { label: 'Work',    path: '/projects', icon: Waypoints },
    { label: 'About',   path: '/about',   icon: UserRound },
    { label: 'Blog',    path: '/blog',    icon: BookOpen },
    { label: 'Contact', path: '/contact', icon: Mail },
  ]

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/' && !location.hash
      : location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <header className="site-nav" aria-label="Primary navigation">
      {/* brand */}
      <Link to="/" className="brand-mark" aria-label="Daksh Sawhney — home">
        <span>DS</span>
      </Link>

      {/* nav links */}
      <nav className="nav-links" aria-label="Main navigation">
        {links.map(({ label, path, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className={isActive(path) ? 'active' : ''}
            title={label}
            aria-label={label}
          >
            <Icon size={17} />
            <span className="nav-link-label">{label}</span>
          </Link>
        ))}
      </nav>

      {/* actions */}
      <div className="nav-actions">
        {/* SRE Terminal button */}
        <button
          type="button"
          className="nav-terminal"
          onClick={onOpenSreMode}
          aria-label="Open Portfolio Terminal"
          title="Portfolio Terminal"
        >
          <Terminal size={16} />
        </button>

        {/* Resume */}
        <a
          className="nav-resume"
          href="/resume/Daksh-Resume.pdf"
          target="_blank"
          rel="noreferrer"
          aria-label="Open resume PDF"
          title="Resume"
        >
          <FileText size={15} />
        </a>

        {/* GitHub */}
        <a
          className="nav-github"
          href="https://github.com/dakshsawhneyy"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub profile"
          title="GitHub"
        >
          <Github size={16} />
        </a>
      </div>
    </header>
  )
}

export default Navbar
