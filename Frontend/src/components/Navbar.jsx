import { BookOpen, FileText, Github, Home, Mail, Terminal, UserRound, Waypoints } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/* Aesthetic logo mark — geometric DS monogram */
const LogoMark = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="#10110f" />
    <path d="M7 9h4.5c3.5 0 5.5 2 5.5 7s-2 7-5.5 7H7V9z"
      fill="none" stroke="#e8684a" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M19 9h6M19 16h5c1 0 2 .8 2 2s-.9 2-2 2h-5"
      fill="none" stroke="#f0bc62" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="25" cy="9" r="1.2" fill="#72dfac" />
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
            {/* <b> is used by CSS for the rotated text label on desktop
                and the small label below icon on mobile */}
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
