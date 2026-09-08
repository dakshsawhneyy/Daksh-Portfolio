import { ArrowDown, Cloud, Database, GitBranch, ShieldCheck, Activity } from 'lucide-react'

const CloudTopology = ({ compact = false }) => (
  <div className={`cloud-topology ${compact ? 'cloud-topology-compact' : ''}`} aria-label="Multi-cloud SRE architecture diagram">
    <div className="topology-heading"><span>REFERENCE ARCHITECTURE</span><strong>multi-cloud reliability loop</strong></div>
    <div className="topology-clouds">
      <div className="topology-cloud topology-aws"><Cloud size={19} /><strong>AWS</strong><span>EKS / ECS</span></div>
      <div className="topology-cloud topology-azure"><Cloud size={19} /><strong>AZURE</strong><span>VMs / AKS</span></div>
      <div className="topology-cloud topology-edge"><Activity size={19} /><strong>EDGE</strong><span>traffic / events</span></div>
    </div>
    <div className="topology-bus"><span /><span /><span /><span /><span /><span /></div>
    <div className="topology-core"><div><ShieldCheck size={19} /><strong>POLICY ENGINE</strong></div><span>detect <b>→</b> decide <b>→</b> remediate</span></div>
    <div className="topology-arrows"><ArrowDown size={17} /><ArrowDown size={17} /><ArrowDown size={17} /></div>
    <div className="topology-foundation"><span><Database size={16} /> telemetry lake</span><span><GitBranch size={16} /> delivery pipelines</span></div>
  </div>
)

export default CloudTopology
