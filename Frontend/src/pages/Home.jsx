import { ArrowUpRight, Cloud, GitBranch, HeartPulse, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import projects from '../data/projects'

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const Home = () => {
  const featured = projects.slice(0, 3)
  return <main className="home-page">
    <section className="home-hero-new page-wrap"><div className="hero-copy"><p className="eyebrow"><span className="live-dot" /> Cloud engineer / product builder</p><h1>Making complex systems feel <em>obvious.</em></h1><p className="hero-lede">I design resilient infrastructure, useful developer tools, and interfaces that help teams move with confidence.</p><div className="hero-actions"><Link className="button button-dark" to="/projects">Explore selected work <ArrowUpRight size={17} /></Link><Link className="text-link" to="/about">More about me <MoveUpRight size={15} /></Link></div></div><div className="hero-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="signal-card"><span>NOW BUILDING</span><strong>Autonomous<br />reliability systems</strong><small>01 / 04</small></div><div className="hero-stamp">DAKSH<br />SAWHNEY</div></div></section>
    <section className="signal-strip"><div><Cloud size={18} /><span>Cloud architecture</span></div><div><HeartPulse size={18} /><span>SRE & observability</span></div><div><GitBranch size={18} /><span>Developer experience</span></div></section>
    <section className="featured-section page-wrap"><div className="section-heading"><div><p className="eyebrow">A few things I have shipped</p><h2>Selected work</h2></div><Link className="text-link" to="/projects">View all projects <ArrowUpRight size={15} /></Link></div><div className="featured-grid">{featured.map((project, index) => <Link to={`/projects/${slugify(project.title)}`} className={`featured-card card-${index + 1}`} key={project.title}><div className="featured-image" style={{ backgroundImage: `url(${project.image})` }} /><div className="featured-info"><span>{String(index + 1).padStart(2, '0')} / {project.category?.[0]}</span><h3>{project.title}</h3><p>{project.description}</p><ArrowUpRight size={20} /></div></Link>)}</div></section>
  </main>
}

export default Home