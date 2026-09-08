import { ArrowUpRight, Github, Linkedin, Mail, Activity, FileText } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="portfolio-footer">
      <div className="footer-signal"><span><Activity size={15} /> RELIABILITY LAB / END OF SESSION</span><strong>Build → break → observe → recover</strong><h2>Have a system<br /><em>worth investigating?</em></h2></div>
      <div className="footer-actions"><a className="footer-primary" href="mailto:dakshsawhneyy@gmail.com">Let's talk <ArrowUpRight size={16} /></a><a href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer"><FileText size={15} /> Resume</a><a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a><a href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a><a href="mailto:dakshsawhneyy@gmail.com"><Mail size={15} /> Email</a></div>
      <div className="footer-bottom"><span>© 2026 Daksh Sawhney</span><span>Cloud / SRE / DevOps engineering portfolio</span></div>
    </footer>
  )
}

export default Footer
