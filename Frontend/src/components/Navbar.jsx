import { BookOpen, FileText, Github, Home, Mail, Terminal, UserRound, Waypoints } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/* Clean logo mark — signal/wave motif, SRE aesthetic */
const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#111210"/>
    {/* Signal wave — left channel */}
    <path
      d="M4 16 h3 l2-5 l3 10 l2-10 l2 5 h3"
      stroke="#e8674a" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"
      fill="none"
    />
    {/* Flat tail */}
    <path
      d="M19 16 h9"
      stroke="#e8674a" strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.4"
    />
    {/* Live dot */}
    <circle cx="27" cy="10" r="2.2" fill="#72dfac"/>
  </svg>
)

const Navbar = ({ onOpenSreMode }) => {
  const location = useLocation()
  const links = [
    { label: 'Home',    short: 'HOME',    path: '/',         icon: Home },
    { label: 'Work',    short: 'WORK',    path: '/projects', icon: Waypoints },
    { label: 'About',   short: 'ABOUT',   path: '/about',    icon: UserRound },
    { label: 'Blog',    short: 'BLOG',    path: '/blog',     icon: BookOpen },
    { label: 'Contact', short: 'CONTACT', path: '/contact',  icon: Mail },
  ]

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/' && !location.hash
      : location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <header className="site-nav" aria-label="Primary navigation">
      <Link to="/" className="brand-mark" aria-label="Home" title="Home">
        <LogoMark />
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map(({ label, short, path, icon: Icon }) => (
          <Link
            key={label}
            to={path}
            className={isActive(path) ? 'active' : ''}
            title={label}
            aria-label={label}
          >
            <Icon size={16} />
            {/* b tag: rotated text on desktop, hidden on mobile */}
            <b>{short}</b>
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="nav-terminal"
          onClick={onOpenSreMode}
          aria-label="Portfolio Terminal"
          title="Terminal"
        >
          <Terminal size={15} />
        </button>

        <a
          className="nav-resume"
          href="/resume/Daksh-Resume.pdf"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="View resume"
          title="Resume"
        >
          <FileText size={15} />
        </a>

        <a
          className="nav-github"
          href="https://github.com/dakshsawhneyy"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <Github size={15} />
        </a>
      </div>
    </header>
  )
}

export default Navbar
