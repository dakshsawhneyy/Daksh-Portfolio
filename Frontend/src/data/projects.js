import aws from "../assets/aws_1_million.png"

const wearsphereImg = "https://d13b09r5pqtq1e.cloudfront.net/projects/wearsphere.png"
const ytPipeline = "https://d13b09r5pqtq1e.cloudfront.net/projects/youtube-pipeline.png"
const cost_bot = "https://d13b09r5pqtq1e.cloudfront.net/projects/cost_bot.jpg"
const invoice = "https://d13b09r5pqtq1e.cloudfront.net/projects/invoice.jpg"
const log_analyser = "https://d13b09r5pqtq1e.cloudfront.net/projects/log_analyser.jpg"
const todo = "https://d13b09r5pqtq1e.cloudfront.net/projects/todo.jpg"
const ansible = "https://d13b09r5pqtq1e.cloudfront.net/projects/ansible.jpg"
const food = "https://d13b09r5pqtq1e.cloudfront.net/projects/food.png"
const spotify = "https://d13b09r5pqtq1e.cloudfront.net/projects/spotify.png"
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


const projects = [
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
    },
    {
        title: "DeploySphere",
        category: ["Cloud", "System Design"],
        description: "Built DeploySphere, a cloud deployment platform using Kafka, S3, ClickHouse, ECS, ECR, and a custom reverse proxy for scalable application delivery.",
        tags: ["AWS", "ECS", "Kafka", "ECR", "ClickHouse", "Deployment Platform", "Scalable Architecture", "CloudOps", "CI/CD"],
        github: "https://github.com/dakshsawhneyy/DeploySphere.git",
        image: deploy_sphere,
        live: "#",
    },
    {
        title: "Automated AWS FinOps Platform",
        category: ["Cloud", "System Design", "DevOps"],
        description: "Automated AWS FinOps platform using serverless architecture to optimize costs, manage unused resources, and send actionable alerts. Implements Lambda, SNS, and scheduled jobs for proactive cloud cost management.",
        tags: ["AWS", "FinOps", "Serverless", "CloudOps", "Terraform", "Cloud Automation", "SNS", "Lambda", "EBS Cleanup"],
        github: "https://github.com/dakshsawhneyy/Automated-AWS-FinOps-Platform.git",
        image: finops,
        live: "#",
    },
    {
        title: "Multi Cloud - Log Ingesion - Pipeline",
        category: ["Cloud", "System Design", "DevOps"],
        description: "Built a cross-cloud, resilient log ingestion and analytics pipeline using AWS Kinesis, Azure VMs, Kafka, Lambda, and Grafana for real-time monitoring and alerts.",
        tags: ["AWS", "Azure", "Multi Cloud", "Kinesis", "Kafka", "ClickHouse", "Slack Alerts", "Resilient Architecture", "Monitoring"],
        github: "https://github.com/dakshsawhneyy/Resilient-Log-Ingestion-Analytics-Pipeline.git",
        image: log_ingesion,
        live: "#",
    },
    {
        title: "Chaos Panda(My own chaos engg. tool)",
        category: ["Cloud", "System Design"],
        description: "Developed a Kubernetes-based chaos engineering platform using Istio and Chaos Panda to test resilience of microservices with automated failure injection and canary deployments",
        tags: ["Resilience Testing", "Chaos Panda", "CI/CD", "Microservices", "Canary Deployment", "Cloud Automation", "Istio", "Kubernetes", "Terraform"],
        github: "https://github.com/dakshsawhneyy/Chaos_Panda_k8S.git",
        image: chaos_panda,
        live: "#",
    },
    {
        title: "SRE Framework",
        category: ["Cloud", "System Design"],
        description: "Built a serverless microservices framework on AWS using Lambda, API Gateway, and DynamoDB with canary deployments and X-Ray tracing for reliability and observability.",
        tags: ["AWS", "Microservices", "Serverless", "API Gateway", "DynamoDB", "Cloud Automation", "Canary Deployment", "Observability", "X-Ray"],
        github: "https://github.com/dakshsawhneyy/SRE_Framework.git",
        image: sre_framework,
        live: "#",
    },
    {
        title: "Event Driven Notification System",
        category: ["System Design"],
        description: "Built an event-driven notification system using AWS Lambda, SQS, and SES to automate messaging and email alerts based on system events.",
        tags: ["AWS", "Event-Driven", "Serverless", "Cloud Automation", "Messaging", "Email Alerts", "SQS", "SNS", "Lambda"],
        github: "https://github.com/dakshsawhneyy/event_driven_notification_system.git",
        image: notification,
        live: "#",
    },
    {
        title: "AWS Card Game",
        category: ["Cloud, DevOps"],
        description: "AWS-Card-Game - a fully serverless, production-grade, multiplayer card game using approx. 𝟮𝟬+ 𝗔𝗪𝗦 𝘀𝗲𝗿𝘃𝗶𝗰𝗲𝘀. = real-time game state, live health tracking, multiplayer turn logic, in-game chat",
        tags: ["AWS", "Cloud", "Devops", "CI/CD", "DynamoDB", "Lambda", "Serverless", "Athena", "Amplify"],
        github: "https://github.com/dakshsawhneyy/AWS-Card-Game.git",
        image: aws_card_game,
        live: "#",
    },
    {
        title: "Cross-System-Observability-Platform",
        category: ["Cloud, DevOps"],
        description: "Implemented a cross-system observability platform using Kubernetes, Prometheus, Fluent Bit, and Jaeger for centralized logging, metrics, and tracing.",
        tags: ["Kubernetes", "Observability", "Fluent Bit", "Jaeger", "Prometheus", "Microservices", "ServiceMonitor", "Tracing", "CloudOps"],
        github: "https://github.com/dakshsawhneyy/Cross-System-Observability-Platform.git",
        image: cross_system,
        live: "#",
    },
    {
        title: "Log Processing and Alerting System",
        category: ["System Design", "DevOps"],
        description: "Ever thought of Designing a system that can handle millions of requests per second, 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀 𝘁𝗵𝗲𝗺 𝗶𝗻 𝗿𝗲𝗮𝗹-𝘁𝗶𝗺𝗲, 𝘀𝘁𝗼𝗿𝗲𝘀 𝗰𝗿𝗶𝘁𝗶𝗰𝗮𝗹 𝗱𝗮𝘁𝗮 𝗶𝗻 𝗮 𝗯𝗹𝗮𝘇𝗶𝗻𝗴-𝗳𝗮𝘀𝘁 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲, and 𝗲𝘃𝗲𝗻 𝗮𝗹𝗲𝗿𝘁𝘀 𝘆𝗼𝘂 when something goes wrong?",
        tags: ["System Design", "Redis", "Kafka", "PostGres DB", "Prometheus", "Grafana", "Redis-Queues"],
        github: "https://github.com/dakshsawhneyy/AWS-Card-Game.git",
        image: kafka,
        live: "#",
    },
    {
        title: "WearSphere E-commerce",
        category: ["MERN","DevOps"],
        description: "WearSphere is a fully automated 4-tier e-commerce platform built with MERN stack, deployed on AWS EKS with CI/CD pipelines by Jenkins. The project integrates DevSecOps practices for security, and includes Prometheus and Grafana for monitoring",
        tags: ["React", "Node", "AWS", "K8s", "EKS", "DevSecOps", "Jenkins", "Agile", "ArgoCD"],
        github: "https://github.com/dakshsawhneyy/WearSphere-Ecommerce-MERN.git",
        image: wearsphereImg,
        live: "https://wearsphere.dakshsawhneyy.online",
    },
    {
        title: "Full-Stack-Observability-Platform",
        category: ["DevOps"],
        description: "Developed a full-stack observability platform using Docker, FluentD, Elasticsearch, and Prometheus for centralized logging, metrics, and monitoring.",
        tags: ["Observability", "Full-Stack", "Docker", "FluentD", "Elasticsearch", "Prometheus", "Monitoring", "Logging", "Metrics"],
        github: "https://github.com/dakshsawhneyy/Full-Stack-Observability-Platform.git",
        image: observability,
        live: "#",
    },
    {
        title: "YouTube Media Downloader Pipeline",
        category: ["Python"],
        description: "A powerful desktop + backend + DevOps project that extracts, stores, and manages video metadata — complete with GUI interface, logging, Dockerization, CI/CD, and monitoring.",
        tags: ["Python", "Loguru", "Prometheus", "CI/CD", "Grafana", "SQLite", "GitHub Actions", "Tkinter"],
        github: "https://github.com/dakshsawhneyy/YT_Video_Downloader_Pipeline.git",
        image: ytPipeline,
        live: "#",
    },
    {
        title: "Kafka Connecting Micro Services",
        category: ["System Design"],
        description: "Developed a microservices application with Kafka-based producer-consumer services including payment, email, order, and analytics, with a complete frontend client.",
        tags: ["Microservices", "Kafka", "Producer-Consumer", "Scalable Architecture", "CloudOps", "Docker"],
        github: "https://github.com/dakshsawhneyy/Micro-Services-App.git",
        image: micro_services,
        live: "#",
    },
    {
        title: "Picture Processing Pipeline",
        category: ["System Design", "DevOps"],
        description: "A fast Image Processing Pipeline built using Redis, BullMQ, Node.js, and Sharp. It supports asynchronous image resizing, job status tracking, and is architected for horizontal scalability.",
        tags: ["Redis", "BullMQ", "Messaging Queue", "System Design", "Automation", "NodeJS", "Sharp"],
        github: "https://github.com/dakshsawhneyy/YT_Video_Downloader_Pipeline.git",
        image: picture_processing1,
        live: "#",
    },
    {
        title: "AWS Cost Estimator Bot",
        category: ["Python","cloud"],
        description: "A lightweight Python bot that estimates your AWS EC2, S3, and RDS usage costs in real-time — and emails you a daily cost report using AWS SNS.",
        tags: ["Python", "AWS Pricing Api", "AWS SNS", "Cron", "Boto3 SDK"],
        github: "https://github.com/dakshsawhneyy/Cost-Estimator-Bot-Py.git",
        image: cost_bot,
        live: "#",
    },
    {
        title: "Infra Health Monitor",
        category: ["DevOps"],
        description: "This project is a complete monitoring suite designed to help you track the health of your Docker containers and the uptime of external websites. It integrates alerting, log rotation, and JSON dashboard generation using pure shell scripting.",
        tags: ["Slack", "JSON", "Shell Scripting", "Alerts", "HTTP", "Payload"],
        github: "https://github.com/dakshsawhneyy/Infra-Health-Monitor-sh.git",
        image: infra,
        live: "#",
    },
    {
        title: "AWS Invoice generator",
        category: ["cloud"],
        description: "A serverless invoice generation pipeline built with AWS services that converts invoice data into a PDF, emails it to the customer, uploads it to S3 and logs metrics to CloudWatch",
        tags: ["AWS Lambda", "Postman", "AWS API Gateway", "CloudWatch", "AWS SES", "AWS SNS"],
        github: "https://github.com/dakshsawhneyy/invoice_generator_AWS.git",
        image: invoice,
        live: "#",
    },
    {
        title: "Log Analyzer CLI Tool",
        category: ["python"],
        description: "A lightweight Python-based CLI tool to parse and analyze log files for critical alerts and generate summaries.",
        tags: ["Python", "Bash", "argparse", "smtplib", "Boto3 SDK"],
        github: "https://github.com/dakshsawhneyy/Log_Analyzer_CLI_Tool.git",
        image: log_analyser,
        live: "#",
    },
    {
        title: "KubeLogStack",
        category: ["DevOps"],
        description: "KubeLogStack is a production-ready Kubernetes-native log management pipeline. It collects logs = every node, stores them in a persistent database, and automates daily backups to AWS S3",
        tags: ["daemonset", "statefulset", "k8s", "cronjob", "log-pvc", "mongodb", "kind"],
        github: "https://github.com/dakshsawhneyy/KubeLogStack.git",
        image: kubelogstack,
        live: "#",
    },
    {
        title: "To-Do List Manager",
        category: ["DevOps"],
        description: "A simple To-Do List Manager built using Shell Scripting. This project allows you to create, display, delete, and mark tasks as completed through a simple terminal-based interface.",
        tags: ["shell-scripting", "bash", "unix commands"],
        github: "https://github.com/dakshsawhneyy/todo_list_manager_shell_scripting.git",
        image: todo,
        live: "#",
    },
    {
        title: "Automated Web Server",
        category: ["DevOps", "cloud"],
        description: "This project automates the entire lifecycle of a secure web server on AWS EC2 using Ansible.",
        tags: ["Ansible", "IAC", "EC2", "AWS"],
        github: "https://github.com/dakshsawhneyy/todo_list_manager_shell_scripting.git",
        image: ansible,
        live: "#",
    },
    {
        title: "Food Delivery App",
        category: ["MERN"],
        description: "A full-stack food delivery web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Also contain Admin Panel to manage food items and orders",
        tags: ["MongoDB", "ExpressJS", "React", "NodeJS", "Tailwind"],
        github: "https://github.com/dakshsawhneyy/Food_Delivery_Mern_Stack.git",
        image: food,
        live: "#",
    },
    {
        title: "Spotify Clone",
        category: ["MERN"],
        description: "A full-featured Spotify-like music streaming web application built using the MERN (MongoDB, Express, React, Node.js) stack. Has an admin panel for uploading, listing and deleting songs",
        tags: ["MongoDB", "ExpressJS", "React", "NodeJS", "Tailwind"],
        github: "https://github.com/dakshsawhneyy/Spotify_Mern_Clone.git",
        image: spotify,
        live: "#",
    },
]


export default projects
