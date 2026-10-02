/* Skill constellation data: projects (hubs) wired to the tools they used.
   Keep in sync with data/projects.js, data/about.js and the resume. */

export const CATEGORIES = {
  cloud: { label: 'Cloud', color: '#d4940a' },
  platform: { label: 'Platform', color: '#2d8bbf' },
  cicd: { label: 'CI/CD', color: '#7c79ca' },
  obs: { label: 'Observability', color: '#e8674a' },
  practice: { label: 'Practices', color: '#27ae78' },
  code: { label: 'Code', color: '#6b6e67' },
}

export const PROJECTS = [
  { id: 'iz', label: 'Incident Zero', sub: 'SRE training platform', desc: 'Five reproducible production failures on Azure + Kubernetes, each solved through logs, metrics and a formal RCA.', href: 'https://incidentzero.monster' },
  { id: 'ha', label: 'HA Event Platform', sub: '1 → 1M+ users', desc: 'EKS with HPA, Terraform + GitHub Actions (deploys −70%), load-tested to 50k concurrent users at sub-200ms p95.', href: 'https://github.com/dakshsawhneyy/AWS-1_to_1Million_Users' },
  { id: 'intern', label: 'AWS Internship', sub: 'IPage UMS · 2025', desc: 'Serverless APIs on Lambda + API Gateway + DynamoDB. P95 latency −40%, MTTR −30% with alarms and runbooks.' },
  { id: 'teach', label: 'Multi-Cloud Teaching', sub: 'SelfCode Academy', desc: '280+ hours taught across DevOps and AWS/Azure/GCP: IaC, orchestration, CI/CD, FinOps and incident labs.' },
  { id: 'site', label: 'This Portfolio', sub: 'you are here', desc: 'React + Node, containerised, Helm charts for EKS, Terraform for CloudFront and Azure Front Door, Jenkins + GitHub Actions CI.' },
]

export const TOOLS = [
  ['AWS', 'cloud'], ['Azure', 'cloud'], ['GCP', 'cloud'], ['Lambda', 'cloud'], ['EKS', 'cloud'], ['AKS', 'cloud'],
  ['GKE', 'cloud'], ['DynamoDB', 'cloud'], ['CloudFront', 'cloud'], ['Route53', 'cloud'], ['VMSS', 'cloud'],
  ['Kubernetes', 'platform'], ['Docker', 'platform'], ['Helm', 'platform'], ['Terraform', 'platform'], ['ArgoCD', 'platform'],
  ['GitHub Actions', 'cicd'], ['Jenkins', 'cicd'],
  ['Prometheus', 'obs'], ['Grafana', 'obs'], ['CloudWatch', 'obs'],
  ['SLOs', 'practice'], ['RCA', 'practice'], ['Runbooks', 'practice'], ['Chaos', 'practice'], ['FinOps', 'practice'], ['IAM', 'practice'],
  ['Python', 'code'], ['Bash', 'code'], ['React', 'code'], ['Node.js', 'code'],
].map(([label, cat]) => ({ id: label, label, cat }))

export const USES = {
  iz: ['Azure', 'VMSS', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'Prometheus', 'Grafana', 'RCA', 'Chaos', 'SLOs', 'Python'],
  ha: ['AWS', 'EKS', 'Kubernetes', 'Helm', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana', 'Route53', 'CloudFront', 'SLOs'],
  intern: ['AWS', 'Lambda', 'DynamoDB', 'CloudWatch', 'IAM', 'Runbooks', 'Python', 'Bash'],
  teach: ['AWS', 'Azure', 'GCP', 'EKS', 'AKS', 'GKE', 'Terraform', 'Kubernetes', 'Docker', 'ArgoCD', 'FinOps', 'IAM', 'RCA', 'Bash'],
  site: ['React', 'Node.js', 'Docker', 'Helm', 'Terraform', 'Jenkins', 'GitHub Actions', 'CloudFront', 'Azure', 'EKS'],
}
