const wearsphereImg = "https://d13b09r5pqtq1e.cloudfront.net/projects/wearsphere.png"
const ytPipeline = "https://d13b09r5pqtq1e.cloudfront.net/projects/youtube-pipeline.png"
const cost_bot = "https://d13b09r5pqtq1e.cloudfront.net/projects/cost_bot.jpg"
const invoice = "https://d13b09r5pqtq1e.cloudfront.net/projects/invoice.jpg"
const log_analyser = "https://d13b09r5pqtq1e.cloudfront.net/projects/log_analyser.jpg"
const todo = "https://d13b09r5pqtq1e.cloudfront.net/projects/todo.jpg"
const ansible = "https://d13b09r5pqtq1e.cloudfront.net/projects/ansible.jpg"
const aws_card_game = "https://d13b09r5pqtq1e.cloudfront.net/projects/aws_card_game.png";
const picture_processing1 = "https://d13b09r5pqtq1e.cloudfront.net/projects/picture_processing1.png"
const kubelogstack = "https://d13b09r5pqtq1e.cloudfront.net/projects/kubelogstack.png"
const infra = "https://d13b09r5pqtq1e.cloudfront.net/projects/infra.png"
const kafka = "https://d13b09r5pqtq1e.cloudfront.net/projects/kafka3.jpg"
const finops = "https://d13b09r5pqtq1e.cloudfront.net/projects/finops.png"
const sre_framework = "https://d13b09r5pqtq1e.cloudfront.net/projects/sre_framework.png"
const chaos_panda = "https://d13b09r5pqtq1e.cloudfront.net/projects/chaos_panda.png"
const cross_system = "https://d13b09r5pqtq1e.cloudfront.net/projects/cross_system.png"
const notification = "https://d13b09r5pqtq1e.cloudfront.net/projects/notification.png"
const observability = "https://d13b09r5pqtq1e.cloudfront.net/projects/observability.png"
const deploy_sphere = "https://d13b09r5pqtq1e.cloudfront.net/projects/deploy_sphere.png"
const micro_services = "https://d13b09r5pqtq1e.cloudfront.net/projects/micro_services.png"
const aws_1_million = "https://d13b09r5pqtq1e.cloudfront.net/projects/image_2025-10-27_092900266.png"
const log_ingesion = "https://d13b09r5pqtq1e.cloudfront.net/projects/log_ingesion.png"
const multi_cloud = "https://d13b09r5pqtq1e.cloudfront.net/projects/image_2025-10-27_092910305.png"
const ecs_orchestration = "https://d13b09r5pqtq1e.cloudfront.net/projects/371c2715-e6ac-46f7-8e59-5a44e94d579a.jpg"
const ai_finops = "https://d13b09r5pqtq1e.cloudfront.net/projects/f0d605ea-57b2-4bd8-8973-8caa95c2cb35.jpg"
const aiops = "https://d13b09r5pqtq1e.cloudfront.net/projects/AIOps.png"

const projects = [
    {
        title: "MultiCloud-AIOps",
        category: ["Cloud", "System Design"],
        description: "multi-cloud AIOps-driven SRE platform that autonomously detects anomalies and self-heals Kubernetes workloads using ML-powered intelligence.",
        year: 2026,
        heroStatement: "An autonomous SRE platform that detects and heals production faults across multi-cloud clusters, reducing toil and improving reliability by automating remediation.",
        context: [
            "Manual incident response at scale led to delayed recovery and engineering burnout.",
            "The system needed to operate across AWS and Azure with consistent guarantees.",
            "Goal: reduce MTTR and enable safe automated remediation driven by observability and ML signals."
        ],
        system: {
            diagram: aiops,
            overview: "Event-driven architecture: telemetry → anomaly detection → decision engine → automated remediation playbooks.",
            components: ["Prometheus / Metrics", "Kafka / Event Bus", "ML Anomaly Detector", "Policy Engine", "Safe Remediation Runners"]
        },
        experience: {
            note: "Interactive operator console and remediation visualizer (demo available on request).",
            demo: null,
            video: null
        },
        details: [
            "Declarative remediation playbooks with safety gates",
            "Canary rollbacks and progressive verification",
            "End-to-end observability pipelines and tracing",
            "Role-based runbooks integrated with incident workflows"
        ],
        outcome: {
            mttr: "-78% MTTR",
            incidentsReduced: "-65% SEV frequency",
            uptime: "99.995%",
            lessons: ["Design for observability first","Automate tactical remediations, not business logic"]
        },
        tags: ["#AIOps" ,"#SRE" ,"#DevOps" ,"#MLOps" ,"#MultiCloud" ,"#Kubernetes" ,"#AWS" ,"#Azure" ,"#Terraform"],
        github: "https://github.com/dakshsawhneyy/AIOps-Driven-Auto-Healing-SRE-System.git",
        image: aiops,
        live: "#",
    },
    {
        title: "ECS Managed Orchestration",
        category: ["Cloud", "System Design"],
        description: "cloud-native, scalable pipeline designed to ingest, process, and store log data efficiently. It is built on an event-driven, microservice architecture orchestrated by Amazon ECS with Fargate.",
        tags: ["AWS", "Cloud", "Terraform", "ECS", "Fargate", "CW-X-Ray", "GitHub Actions", "CloudWatch", "Chaos"],
        github: "https://github.com/dakshsawhneyy/ECS-Managed-Orchestration.git",
        image: ecs_orchestration,
        live: "#",
    },
    {
        title: "AI FinOps Platform",
        category: ["Cloud", "System Design", "DevOps"],
        description: "This project implements a real-time, event-driven FinOps platform on AWS EKS to monitor and visualize specialized AI/ML costs that are not covered by standard cloud billing dashboards.",
        tags: ["AWS", "Cloud", "Terraform", "Kafka", "EKS", "OpenCost", "Grafana", "Prometheus", "Python", "Helm"],
        github: "https://github.com/dakshsawhneyy/AI-FinOps-Platform.git",
        image: ai_finops,
        live: "#",
    },
    {
        title: "Multi Cloud Orchestration",
        category: ["Cloud", "System Design"],
        description: "A zero-touch CI/CD pipeline that deploys a web app across AWS and Azure from a single codebase. Built with Terraform Workspaces, Ansible, GitHub Actions, and Datadog for full automation and observability",
        tags: ["AWS", "Cloud", "Terraform", "AZURE", "Ansible", "Terraform Workspaces", "GitHub Actions", "Datadog", "Observability"],
        github: "https://github.com/dakshsawhneyy/Multi-Cloud-Orchestration.git",
        image: multi_cloud,
        live: "#",
    },
    {
        title: "Scaling Infra from 1 to 1 Million+ Users",
        category: ["Cloud", "System Design"],
        description: "Designed and deployed multi-region AWS infrastructure using Terraform with global routing for scalable, resilient, and highly available applications.",
        tags: ["AWS", "Cloud", "Terraform", "Route53", "CDN", "CloudFront", "GitOps", "WAF", "K8S"],
        github: "https://github.com/dakshsawhneyy/AWS-1_to_1Million_Users.git",
        image: aws_1_million,
        live: "#",
    }
]

const incidentZero = {
    title: "Incident Zero",
    category: ["Reliability", "System Design"],
    description: "A failure simulation and response workflow for turning noisy signals into documented recovery.",
    year: 2026,
    tags: ["Incident Response", "SRE", "Observability", "RCA", "Reliability"],
    image: aiops,
}

export default projects
