import { ArrowUpRight, ExternalLink, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import projects from '../data/projects'

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const Projects = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const list = useMemo(() => projects.map((project, index) => ({ ...project, index, slug: slugify(project.title) })), [])
  const categoryNames = project => (project.category || []).flatMap(category => category.split(',').map(value => value.trim())).map(value => value.toLowerCase() === 'cloud' ? 'Cloud' : value.toLowerCase() === 'python' ? 'Python' : value)
  const categories = ['All', ...new Set(list.flatMap(categoryNames))].slice(0, 7)
  const visible = list.filter(project => { const text = `${project.title} ${project.description} ${(project.tags || []).join(' ')}`.toLowerCase(); return (filter === 'All' || categoryNames(project).includes(filter)) && text.includes(query.toLowerCase()) })
  return <main className="content-page page-wrap projects-page"><div className="content-intro"><div><p className="eyebrow">Selected work / 2022-26</p><h1>Built for the<br /><em>messy middle.</em></h1></div><p className="intro-aside">A working archive of cloud platforms, developer tools, and experiments in making infrastructure more legible.</p></div><div className="project-toolbar"><div className="filter-tabs">{categories.map(category => <button key={category} onClick={() => setFilter(category)} className={filter === category ? 'selected' : ''}>{category}</button>)}</div><label className="search-field"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects" /></label></div><div className="project-card-grid">{visible.map((project, index) => <article className="project-card" key={project.slug} onClick={() => navigate(`/projects/${project.slug}`)}><div className="project-card-image" style={{ backgroundImage: `url(${project.image})` }}><span>{String(index + 1).padStart(2, '0')}</span><ArrowUpRight /></div><div className="project-card-body"><div className="project-card-meta"><span>{project.category?.[0]}</span><span>{project.year || '2026'}</span></div><h2>{project.title}</h2><p>{project.description}</p><div className="project-tags">{(project.tags || []).slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><a href={project.github} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}><ExternalLink size={14} /> Source</a></div></article>)}</div>{!visible.length && <p className="empty-state">No projects match that search.</p>}</main>
}

export default Projects