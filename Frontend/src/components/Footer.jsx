import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="portfolio-footer">
      <div><span className="eyebrow">Have a hard problem?</span><h2>Let's make it legible.</h2></div>
      <div className="footer-links"><a href="mailto:dakshsawhneyy@gmail.com">Email me <ArrowUpRight size={15} /></a><div><a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a><a href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a><a href="mailto:dakshsawhneyy@gmail.com" aria-label="Email"><Mail size={18} /></a></div></div>
    </footer>
  )
}

export default Footer
