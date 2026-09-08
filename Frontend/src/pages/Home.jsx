import { ArrowUpRight, Check, Github, Mail, MapPin, ShieldCheck, Activity, Server, GitBranch } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../home-reference.css'

const Home = () => {
  const featured = [
    ['01', 'AIOps Auto-Healing SRE System', 'Anomaly detection, policy gates, and automated Kubernetes recovery.', 'AIOps / Kubernetes / ML', '/projects/multicloud-aiops-driven-auto-healing-sre-system'],
    ['02', 'ECS Managed Orchestration', 'Event-driven log processing designed for reliable, observable delivery.', 'AWS / ECS / Kafka', '/projects/ecs-managed-orchestration'],
    ['03', 'AI FinOps Platform', 'Cost signals and operational decisions for production AI workloads.', 'EKS / OpenCost / Grafana', '/projects/ai-finops-platform']
  ]

  return <main className="sre-home sre-desk-home">
    <div className="sre-home-shell">
      <section className="sre-main">
        <div className="desk-identity-strip"><span className="sre-monogram">DS</span><strong>Daksh Sawhney</strong><span>Cloud &amp; reliability engineer</span><span className="desk-location"><MapPin size={12} /> India</span><a href="mailto:dakshsawhneyy@gmail.com"><Mail size={12} /> Email</a><a href="/resume/Daksh-Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowUpRight size={12} /></a></div>
        <header className="desk-hero"><div className="desk-hero-copy"><p className="sre-kicker">Site reliability engineering / portfolio</p><h1>Build for<br /><em>the failure.</em></h1><p className="sre-intro-copy">Observable infrastructure and automated recovery systems for production workloads that cannot afford guesswork.</p><div className="sre-intro-actions"><Link className="sre-primary" to="/projects">View systems <ArrowUpRight size={16} /></Link><Link className="sre-secondary" to="/contact">Work with me</Link></div></div><div className="desk-command-panel"><div className="desk-panel-head"><span><i /> OPERATIONS / LIVE</span><span>09:42:18 UTC</span></div><div className="desk-health"><ShieldCheck size={18} /><div><strong>Platform health</strong><span>All services within SLO</span></div><b>99.995%</b></div><div className="desk-services"><span><Server size={14} /> API GATEWAY <b>HEALTHY</b></span><span><Activity size={14} /> TELEMETRY <b>STREAMING</b></span><span><GitBranch size={14} /> DELIVERY <b>GREEN</b></span></div><div className="desk-trace"><span /><span /><span /><span /><span /><span /></div><small>latency / 42ms p95</small></div></header>
        <div className="sre-signal-line"><span><i /> AVAILABLE FOR SELECTED WORK</span><span>OBSERVE <b>→</b> DECIDE <b>→</b> RECOVER</span></div>
        <section className="desk-work"><div className="desk-section-head"><div><p className="sre-kicker">Systems I have built</p><h2>From signal<br /><em>to recovery.</em></h2></div><Link to="/projects">Open work archive <ArrowUpRight size={15} /></Link></div><div className="desk-work-list">{featured.map(([number, title, description, stack, path], index) => <Link to={path} className="desk-work-row" key={title}><span className="desk-row-number">{number}</span><div className={`desk-row-visual desk-row-visual-${index + 1}`}><i /><i /><i /></div><div className="desk-row-copy"><span>{stack}</span><h3>{title}</h3><p>{description}</p></div><ArrowUpRight className="desk-row-arrow" size={18} /></Link>)}</div></section>
        <section className="desk-principles"><p className="sre-kicker">Reliability principles</p><div><span><Check size={14} /> Observe first</span><span><Check size={14} /> Automate safely</span><span><Check size={14} /> Recover clearly</span></div></section>
        <footer className="sre-home-footer"><span>© 2026 Daksh Sawhney</span><a href="https://github.com/dakshsawhneyy" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a><Link to="/contact">Let&apos;s talk <ArrowUpRight size={15} /></Link></footer>
      </section>
    </div>
  </main>
}

export default Home