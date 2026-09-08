import { ArrowUpRight, Check, Github, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../home-reference.css'

const Home = () => {
  const featured = [
    ['01', 'AIOps Auto-Healing SRE System', 'Anomaly detection, policy gates, and automated Kubernetes recovery.', 'AIOps / Kubernetes / ML', '/projects/multicloud-aiops-driven-auto-healing-sre-system'],
    ['02', 'ECS Managed Orchestration', 'Event-driven log processing designed for reliable, observable delivery.', 'AWS / ECS / Kafka', '/projects/ecs-managed-orchestration'],
    ['03', 'AI FinOps Platform', 'Cost signals and operational decisions for production AI workloads.', 'EKS / OpenCost / Grafana', '/projects/ai-finops-platform']
  ]

  return <main className="sre-home">
    <div className="sre-home-shell">
      <aside className="sre-identity">
        <div className="sre-identity-top"><span className="sre-monogram">DS</span><span>IDENTITY / 01</span></div>
        <div className="sre-identity-main"><p className="sre-kicker">Cloud &amp; reliability engineer</p><h2>Daksh<br /><strong>Sawhney</strong></h2><p className="sre-role">I build platforms that make production calmer: observable by default, automated with guardrails, and ready for failure.</p></div>
        <div className="sre-identity-bottom"><span><MapPin size={13} /> Jammu, India</span><a href="mailto:dakshsawhneyy@gmail.com"><Mail size={13} /> Email me</a><a href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowUpRight size={13} /></a></div>
      </aside>
      <section className="sre-main">
        <header className="sre-intro"><div className="sre-intro-copyblock"><p className="sre-kicker">Portfolio / Site reliability engineering</p><h1>Systems that<br /><em>recover.</em></h1><p className="sre-intro-copy">Infrastructure, observability, and delivery systems for teams operating in the messy middle between a prototype and production.</p><div className="sre-intro-actions"><Link className="sre-primary" to="/projects">Explore the work <ArrowUpRight size={16} /></Link><Link className="sre-secondary" to="/contact">Start a conversation</Link></div></div><div className="sre-hero-dashboard"><div className="sre-dashboard-top"><span>PRODUCTION / OBSERVABILITY</span><strong><i /> ALL SYSTEMS NOMINAL</strong></div><div className="sre-dashboard-chart"><span className="dashboard-axis axis-a">100</span><span className="dashboard-axis axis-b">50</span><span className="dashboard-axis axis-c">0</span><div className="dashboard-spark"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="sre-dashboard-metrics"><span><b>99.995%</b>UPTIME</span><span><b>42ms</b>P95 LATENCY</span><span><b>0</b>OPEN INCIDENTS</span></div></div></header>
        <div className="sre-signal-line"><span><i /> AVAILABLE FOR SELECTED WORK</span><span>OBSERVE <b>→</b> DECIDE <b>→</b> RECOVER</span></div>
        <section className="sre-work-section"><div className="sre-section-heading"><div><p className="sre-kicker">Selected systems</p><h2>Work with a<br /><em>failure mode.</em></h2></div><Link to="/projects">View all work <ArrowUpRight size={15} /></Link></div><div className="sre-work-grid">{featured.map(([number, title, description, stack, path], index) => <Link to={path} className={`sre-work-card sre-work-card-${index + 1}`} key={title}><div className="sre-card-visual"><span>{number} / SYSTEM</span><div className="sre-card-network"><i /><i /><i /><i /></div><ArrowUpRight size={17} /></div><div className="sre-work-copy"><span>{stack}</span><h3>{title}</h3><p>{description}</p></div></Link>)}</div></section>
        <section className="sre-proof"><div><p className="sre-kicker">Operating principles</p><h2>Make the signal<br /><em>useful.</em></h2></div><div className="sre-proof-list"><span><Check size={15} /> Observability before automation</span><span><Check size={15} /> Guardrails before autonomy</span><span><Check size={15} /> Clear systems over clever systems</span></div></section>
        <footer className="sre-home-footer"><span>© 2026 Daksh Sawhney</span><a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a><Link to="/contact">Let&apos;s talk <ArrowUpRight size={15} /></Link></footer>
      </section>
    </div>
  </main>
}

export default Home