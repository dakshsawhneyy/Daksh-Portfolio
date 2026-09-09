import { ArrowUpRight, Github, Linkedin, Mail, MapPin, FileText, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="site-footer">

    {/* top rule with label */}
    <div className="sf-rule">
      <span className="sf-rule-label">
        <Activity size={11} />
        END OF SESSION · RELIABILITY LAB
      </span>
    </div>

    <div className="sf-inner">

      {/* LEFT — statement + CTA */}
      <div className="sf-statement">
        <p className="sf-kicker">Open to full-time roles · Aug 2027</p>
        <h2 className="sf-heading">
          Have a reliability<br />
          problem to solve?
        </h2>
        <p className="sf-sub">
          Cloud infrastructure, SRE platforms,
          multi-cloud architecture — reach out.
        </p>
        <div className="sf-actions">
          <a className="sf-btn-primary" href="mailto:dakshsawhneyy@gmail.com">
            Let's talk <ArrowUpRight size={14} />
          </a>
          <a className="sf-btn-outline" href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">
            <FileText size={13} /> Resume
          </a>
        </div>
      </div>

      {/* MIDDLE — nav */}
      <div className="sf-col">
        <p className="sf-col-label">Navigate</p>
        <nav className="sf-links">
          <Link to="/">Home</Link>
          <Link to="/projects">Systems</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Writing</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      {/* RIGHT — connect */}
      <div className="sf-col">
        <p className="sf-col-label">Connect</p>
        <div className="sf-socials">
          <a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer">
            <Github size={15} /> GitHub
          </a>
          <a href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer">
            <Linkedin size={15} /> LinkedIn
          </a>
          <a href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">
            <Mail size={15} /> Hashnode
          </a>
        </div>
        <div className="sf-location">
          <MapPin size={11} /> Jammu, India
        </div>
      </div>

    </div>

    {/* bottom bar */}
    <div className="sf-bottom">
      <span className="sf-copy">© 2026 Daksh Sawhney</span>
      <span className="sf-stack">AWS · Azure · Kubernetes · Terraform · Prometheus</span>
    </div>

  </footer>
)

export default Footer
