const incidentzero = "/projects/incident-zero.png"
const aws_1_million = "https://d13b09r5pqtq1e.cloudfront.net/projects/image_2025-10-27_092900266.png"
const scaling ="/projects/scaling.png"

const projects = [
    {
        title: "Incident Zero",
        category: ["Reliability", "System Design"],
        description: "A failure simulation and response workflow for turning noisy signals into documented recovery.",
        year: 2026,
        tags: ["Incident Response", "SRE", "Observability", "RCA", "Reliability"],
        image: incidentzero,
    },
    {
        title: "Scaling Infra from 1 to 1 Million+ Users",
        category: ["Cloud", "System Design"],
        description: "Designed and deployed multi-region AWS infrastructure using Terraform with global routing for scalable, resilient, and highly available applications.",
        tags: ["AWS", "Cloud", "Terraform", "Route53", "CDN", "CloudFront", "GitOps", "WAF", "K8S"],
        github: "https://github.com/dakshsawhneyy/AWS-1_to_1Million_Users.git",
        image: scaling,
        live: "#",
    }
]

export default projects