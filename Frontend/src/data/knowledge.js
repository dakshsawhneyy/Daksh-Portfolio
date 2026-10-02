/* Offline answers for the "Ask about Daksh" agent.
   Used when the backend (/api/agent → Claude) is unreachable or not configured.
   Keep facts in sync with Backend/agent/profile.js (the LLM system prompt). */

const INTENTS = [
  {
    weight: 2, // beats the generic "who is daksh" intent on ties
    keys: ['single', 'girlfriend', 'gf', 'relationship', 'dating', 'taken', 'married', 'crush', 'partner', 'boyfriend', 'available romantically'],
    answer: "Yes — **100% single** 😄 Current relationship status: committed to Kubernetes, emotionally attached to Terraform, and in a long-distance thing with AWS (us-east-1, it's complicated). Uptime of his love life: 0% — but his error budget is wide open. For serious enquiries, the [Contact](/contact) page works for those too.",
  },
  {
    keys: ['hi', 'hello', 'hey', 'yo', 'sup', 'namaste'],
    answer: "Hey! 👋 I'm Daksh's agent. Ask me about his **experience**, **projects**, **skills**, or whether he's **open to roles**.",
  },
  {
    keys: ['who', 'daksh', 'about', 'yourself', 'introduce', 'summary', 'what does', 'do'],
    answer: "Daksh Sawhney is a **Cloud / DevOps / SRE engineer** and final-year CS student from Jammu, India. He builds multicloud systems that run in production — self-healing platforms, observability pipelines and reliable infrastructure — and teaches multi-cloud engineering at SelfCode Academy. More on the [About](/about) page.",
  },
  {
    keys: ['experience', 'work', 'job', 'worked', 'career', 'intern', 'internship', 'ipage'],
    answer: "Two roles so far:\n- **Multi-Cloud Computing Instructor, SelfCode Academy** (Feb 2026 – present) — promoted from DevOps Instructor after teaching 180+ hours; now teaches AWS, Azure & GCP.\n- **AWS Cloud Intern, IPage UMS** (Sept – Nov 2025) — serverless APIs on Lambda/API Gateway/DynamoDB, **P95 latency −40%**, **MTTR −30%**.\n\nFull timeline: [Experience](/about#experience).",
  },
  {
    keys: ['aws', 'lambda', 'serverless', 'dynamodb', 'cloudwatch', 'eks'],
    answer: "On AWS, Daksh built production serverless APIs (Lambda, API Gateway, DynamoDB) during his internship, cutting **P95 latency by 40%**, and set up CloudWatch dashboards, alarms and runbooks that cut **MTTR by 30%**. He's also run EKS with autoscaling, Route53 global routing and CloudFront for a 50k-concurrent-user load test.",
  },
  {
    keys: ['teach', 'instructor', 'selfcode', 'curriculum', 'student', 'course', 'mentor'],
    answer: "Daksh is a **Multi-Cloud Computing Instructor at SelfCode Academy**. He taught 180+ hours of DevOps/SRE (Docker, Kubernetes, Terraform, CI/CD, incident response), was promoted, and now teaches a 100+ hour multi-cloud track across AWS, Azure and GCP. He also built the incident-simulation labs that became Incident Zero.",
  },
  {
    keys: ['project', 'projects', 'built', 'build', 'portfolio', 'github', 'repo'],
    answer: "Highlights:\n- **Incident Zero** — his own SRE training platform with 5 real failure scenarios ([live](https://incidentzero.monster)).\n- **Scaling Infra from 1 to 1M+ users** — HA platform on AWS EKS + Terraform, load-tested to 50k concurrent users at sub-200ms p95.\n\nSee them all on [Work](/projects).",
  },
  {
    keys: ['incident', 'zero', 'chaos', 'simulation', 'rca', 'crashloop', 'oom'],
    answer: "**Incident Zero** is Daksh's own product — a production-incident simulation platform for SRE training on Azure (Terraform-provisioned VM Scale Sets + Load Balancer, Kubernetes, CI/CD). It has 5 reproducible scenarios: CrashLoopBackOff, OOMKilled, K8s DNS failure, DB pool exhaustion and latency spikes — each solved by correlating logs, metrics and events into an RCA. Try it at [incidentzero.monster](https://incidentzero.monster).",
  },
  {
    keys: ['scale', 'scaling', 'million', 'load', 'hpa', 'autoscaling', 'high availability', 'event platform'],
    answer: "His **High-Availability Event Platform** runs on AWS EKS with Horizontal Pod Autoscaling. Terraform + GitHub Actions cut deploys from 40 to 12 minutes (**−70%**), and it was load-tested to **50k concurrent users at sub-200ms p95** — he traced early degradation to a mismatched HPA threshold and undersized pod limits using Prometheus/Grafana.",
  },
  {
    keys: ['skill', 'skills', 'stack', 'tech', 'tools', 'technologies', 'know', 'strong', 'strongest'],
    answer: "Core stack:\n- **Cloud:** AWS, Azure, GCP — networking, IAM/RBAC, security\n- **Platform:** Kubernetes, Docker, Helm, Terraform, Ansible, ArgoCD\n- **CI/CD:** GitHub Actions, Jenkins, GitOps\n- **Reliability:** Prometheus, Grafana, SLOs, incident response, RCA, chaos engineering, FinOps\n- **Code:** Python, Bash, Linux",
  },
  {
    keys: ['kubernetes', 'k8s', 'docker', 'helm', 'container', 'aks', 'gke'],
    answer: "Kubernetes is central to Daksh's work: EKS with HPA for the 50k-user platform, Kubernetes failure scenarios in Incident Zero, Helm charts for this portfolio, and he teaches EKS, AKS and GKE in his multi-cloud course.",
  },
  {
    keys: ['azure', 'gcp', 'google cloud', 'multi-cloud', 'multicloud', 'multi cloud'],
    answer: "Daksh works across all three clouds — AWS (EKS, Lambda), **Azure** (AKS, VM Scale Sets, Load Balancer — Incident Zero runs here) and **GCP** (GKE, Cloud Functions) — and teaches Terraform-based multi-cloud IaC.",
  },
  {
    keys: ['terraform', 'iac', 'infrastructure as code', 'ansible', 'ci/cd', 'cicd', 'pipeline', 'github actions', 'jenkins'],
    answer: "Daksh provisions everything as code with **Terraform** (multi-cloud), automates with **GitHub Actions** and Jenkins, and uses GitOps with ArgoCD. One Terraform + GitHub Actions pipeline cut deploy time by **70%** (40 → 12 min).",
  },
  {
    keys: ['observability', 'monitoring', 'prometheus', 'grafana', 'slo', 'sre', 'reliability', 'on-call', 'oncall'],
    answer: "Reliability is his focus: SLOs/SLIs, Prometheus + Grafana, CloudWatch alarms, runbooks and on-call. At his internship, dashboards and runbooks he built cut **MTTR by 30%**, and Incident Zero exists to train exactly this skill.",
  },
  {
    keys: ['education', 'college', 'university', 'degree', 'study', 'hbtu', 'cgpa', 'gpa', 'graduate'],
    answer: "B.Tech in Computer Science & Engineering at **Harcourt Butler Technical University (HBTU), Kanpur**, 2023 – 2027, CGPA **8.2/10**.",
  },
  {
    keys: ['hire', 'hiring', 'available', 'availability', 'open', 'role', 'roles', 'job', 'full-time', 'fulltime', 'relocat', 'opportunit', 'recruit', 'join', 'joining', 'joiner', 'notice'],
    answer: "Yes — Daksh is **open to full-time Cloud / DevOps / SRE roles**, an **immediate joiner** (no notice period), and **open to relocation**. Best way to reach him: [dakshsawhneyy@gmail.com](mailto:dakshsawhneyy@gmail.com) or the [Contact](/contact) page. His [resume](/resume/Daksh-Resume.pdf) has the details.",
  },
  {
    keys: ['contact', 'email', 'reach', 'mail', 'linkedin', 'connect', 'talk', 'message'],
    answer: "Reach Daksh at [dakshsawhneyy@gmail.com](mailto:dakshsawhneyy@gmail.com), on [LinkedIn](https://linkedin.com/in/dakshsawhneyy), or through the [Contact](/contact) page. Code lives on [GitHub](https://github.com/dakshsawhneyy).",
  },
  {
    keys: ['resume', 'cv'],
    answer: "Here's his resume: [Daksh-Resume.pdf](/resume/Daksh-Resume.pdf).",
  },
  {
    keys: ['where', 'location', 'based', 'live', 'city', 'country', 'india', 'jammu'],
    answer: "Daksh is based in **Jammu, India**, studies in Kanpur, and is open to relocation.",
  },
  {
    keys: ['impact', 'numbers', 'metrics', 'achievement', 'achievements', 'results'],
    answer: "Headline numbers: **P95 latency −40%** and **MTTR −30%** (AWS internship), **deploy time −70%**, a **50k concurrent user** load test at sub-200ms p95, and **280+ hours** of DevOps and multi-cloud content taught.",
  },
  {
    keys: ['ai', 'llm', 'machine learning', 'ml', 'agent', 'aiops'],
    answer: "Daksh experiments with AI on top of infrastructure — Incident Zero started as an AIOps-driven auto-healing SRE system, and this very agent is part of his portfolio. His core expertise is cloud, platform and reliability engineering.",
  },
  {
    keys: ['site', 'website', 'this portfolio', 'made', 'how was'],
    answer: "This portfolio is React + Vite with a Node/Express + MongoDB backend, deployed with Terraform (AWS CloudFront and Azure Front Door), Helm charts for EKS, and CI via Jenkins and GitHub Actions — infra he built himself.",
  },
]

const FALLBACK =
  "I don't have that detail. For anything specific, Daksh is happy to answer directly at [dakshsawhneyy@gmail.com](mailto:dakshsawhneyy@gmail.com). Meanwhile, you could ask about his **projects**, **experience** or **skills**."

const tokens = (s) => s.toLowerCase().replace(/[^a-z0-9/+\-\s]/g, ' ')

export function offlineAnswer(question) {
  const q = ` ${tokens(question)} `
  let best = null
  let bestScore = 0
  for (const intent of INTENTS) {
    let score = 0
    for (const k of intent.keys) {
      if (q.includes(` ${k} `)) score += 3
      else if (k.length > 3 && q.includes(k)) score += 2
    }
    score *= intent.weight || 1
    if (score > bestScore) { bestScore = score; best = intent }
  }
  return best ? best.answer : FALLBACK
}

export const SUGGESTIONS = [
  'What does Daksh do?',
  'Is he open to full-time roles?',
  'Tell me about Incident Zero',
  "What's his AWS experience?",
  'What are his strongest skills?',
  'How can I contact him?',
  'Is Daksh single?',
]
