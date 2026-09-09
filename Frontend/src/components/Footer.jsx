import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Activity, FileText, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="ft-root">

      {/* top noise texture overlay */}
      <div className="ft-bg" aria-hidden />

      <div className="ft-inner">

        {/* LEFT — CTA */}
        <div className="ft-cta">
          <div className="ft-cta-tag">
            <span className="ft-tag-dot" />
            <span>Available for work</span>
          </div>
          <h2 className="ft-heading">
            Have a system<br />
            <em>worth building?</em>
          </h2>
          <p className="ft-sub">
            Multicloud infrastructure, reliability engineering,<br />
            DevOps pipelines — let's talk.
          </p>
          <div className="ft-cta-actions">
            <a className="ft-btn-primary" href="mailto:dakshsawhneyy@gmail.com">
              Start a conversation <ArrowUpRight size={16} />
            </a>
            <a className="ft-btn-ghost" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">
              <FileText size={15} /> Resume
            </a>
          </div>
        </div>

        {/* MIDDLE — nav links */}
        <div className="ft-nav">
          <p className="ft-nav-label">Navigation</p>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/projects">Systems</Link>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        {/* RIGHT — identity */}
        <div className="ft-identity">
          <div className="ft-monogram">DS</div>
          <p className="ft-name">Daksh Sawhney</p>
          <p className="ft-role">Cloud &amp; SRE Engineer</p>
          <div className="ft-location">
            <MapPin size={12} /> Jammu, India
          </div>
          <div className="ft-socials">
            <a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={17} />
            </a>
            <a href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={17} />
            </a>
            <a href="mailto:dakshsawhneyy@gmail.com" aria-label="Email">
              <Mail size={17} />
            </a>
          </div>
        </div>

      </div>

      {/* bottom bar */}
      <div className="ft-bottom">
        <span className="ft-copy">
          <Activity size={11} /> © 2026 Daksh Sawhney — Cloud / SRE / DevOps
        </span>
        <span className="ft-stack">
          AWS · Azure · Kubernetes · Terraform · Prometheus
        </span>
      </div>

    </footer>
  )
}

export default Footer
