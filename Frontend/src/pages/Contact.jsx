import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { useState } from 'react'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\nReply to: ${form.email}`)
    window.location.href = `mailto:dakshsawhneyy@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }
  return <main className="content-page page-wrap contact-page"><section className="content-intro"><div><p className="eyebrow">Start a conversation</p><h1>Let’s build something<br /><em>useful.</em></h1></div><p className="intro-aside">Have a platform problem, a reliability question, or a project that needs a clearer shape? I would like to hear about it.</p></section><section className="contact-layout"><div className="contact-details"><p className="contact-lede">The best way to reach me is email. I usually reply within a day.</p><a className="contact-email" href="mailto:dakshsawhneyy@gmail.com">dakshsawhneyy@gmail.com <ArrowUpRight size={18} /></a><div className="contact-facts"><span><MapPin size={16} /> Jammu, India</span><span><Mail size={16} /> Available for selected work</span></div><div className="contact-socials"><a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer"><Github size={19} /> GitHub</a><a href="https://linkedin.com/in/dakshsawhneyy" target="_blank" rel="noreferrer"><Linkedin size={19} /> LinkedIn</a></div></div><form className="contact-form" onSubmit={handleSubmit}><label>Name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label><label>Email<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" /></label><label>What are you working on?<textarea required rows="5" value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="A few words about the problem..." /></label><button className="button button-dark" type="submit">Open email draft <ArrowUpRight size={17} /></button>{sent && <p className="form-note">Your email draft is ready.</p>}</form></section></main>
}

export default Contact