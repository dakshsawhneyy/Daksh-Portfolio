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
        title: "Incident Zero",
        category: ["Reliability", "System Design"],
        description: "A failure simulation and response workflow for turning noisy signals into documented recovery.",
        year: 2026,
        tags: ["Incident Response", "SRE", "Observability", "RCA", "Reliability"],
        image: aiops,
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

export default projects
