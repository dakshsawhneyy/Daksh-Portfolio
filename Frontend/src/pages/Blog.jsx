import { ArrowUpRight, Clock3, Rss } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchBlogs } from '../data/blogService'

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { fetchBlogs().then(setBlogs).finally(() => setLoading(false)) }, [])
  return <main className="content-page page-wrap blog-page"><div className="content-intro"><div><p className="eyebrow">Notes from the field</p><h1>Writing on systems,<br /><em>failure & craft.</em></h1></div><a className="button button-outline" href="https://dakshsawhneyy.hashnode.dev" target="_blank" rel="noreferrer">Open Hashnode <Rss size={16} /></a></div><div className="blog-rule" />{loading ? <p className="empty-state">Loading the latest notes...</p> : <div className="article-list">{blogs.map((item, index) => <article className="article-row" key={item.slug || index}><div className="article-number">{String(index + 1).padStart(2, '0')}</div><div className="article-copy"><div className="article-meta"><span>{new Date(item.publishedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span><span><Clock3 size={13} /> 6 min read</span></div><h2>{item.title}</h2><p>{item.brief}</p></div><a className="article-link" href={`https://dakshsawhneyy.hashnode.dev/${item.slug}`} target="_blank" rel="noreferrer" aria-label={`Read ${item.title}`}><ArrowUpRight /></a></article>)}</div>}</main>
}

export default Blog