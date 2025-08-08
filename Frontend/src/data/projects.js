import wearsphereImg from "../assets/wearsphere.png"
import ytPipeline from "../assets/youtube-pipeline.png"
import cost_bot from "../assets/cost_bot.jpg"
import invoice from "../assets/invoice.jpg"
import log_analyser from "../assets/log_analyser.jpg"
import todo from "../assets/todo.jpg"
import ansible from "../assets/ansible.jpg"
import food from "../assets/food_delivery.jpg"
import foo from "../assets/food.png"
import spotify from "../assets/spotify.png"
import soon from "../assets/soon.avif"
import aws_card_game from "../assets/aws_card_game.png"
import picture_processing1 from "../assets/picture_processing1.png"
import kubelogstack from "../assets/kubelogstack.png"
import infra from "../assets/infra.png"
import kafka from "../assets/kafka3.jpg"

const projects = [
    {
        title: "AWS Card Game",
        category: ["Cloud, DevOps"],
        description: "AWS-Card-Game - a fully serverless, production-grade, multiplayer card game using approx. 𝟮𝟬+ 𝗔𝗪𝗦 𝘀𝗲𝗿𝘃𝗶𝗰𝗲𝘀. From real-time game state, live health tracking, multiplayer turn logic, in-game chat",
        tags: ["AWS", "Cloud", "Devops", "CI/CD", "DynamoDB", "Lambda", "Serverless", "Athena", "Amplify"],
        github: "https://github.com/dakshsawhneyy/AWS-Card-Game.git",
        image: aws_card_game,
        live: "https://master.dmyndyok8l8sp.amplifyapp.com",
    },
    {
        title: "Log Processing and Alerting System",
        category: ["System Design", "DevOps"],
        description: "Ever thought of 𝗱̲𝗲̲𝘀̲𝗶̲𝗴̲𝗻̲𝗶̲𝗻̲𝗴̲ ̲𝗮̲ ̲𝘀̲𝘆̲𝘀̲𝘁̲𝗲̲𝗺̲ ̲𝘁̲𝗵̲𝗮̲𝘁̲ ̲𝗵̲𝗮̲𝗻̲𝗱̲𝗹̲𝗲̲𝘀̲ ̲𝗺̲𝗶̲𝗹̲𝗹̲𝗶̲𝗼̲𝗻̲𝘀̲ ̲𝗼̲𝗳̲ ̲𝗿̲𝗲̲𝗾̲𝘂̲𝗲̲𝘀̲𝘁̲𝘀̲ ̲𝗽̲𝗲̲𝗿̲ ̲𝘀̲𝗲̲𝗰̲𝗼̲𝗻̲𝗱̲,̲ 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗲𝘀 𝘁𝗵𝗲𝗺 𝗶𝗻 𝗿𝗲𝗮𝗹-𝘁𝗶𝗺𝗲, 𝘀𝘁𝗼𝗿𝗲𝘀 𝗰𝗿𝗶𝘁𝗶𝗰𝗮𝗹 𝗱𝗮𝘁𝗮 𝗶𝗻 𝗮 𝗯𝗹𝗮𝘇𝗶𝗻𝗴-𝗳𝗮𝘀𝘁 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲, and 𝗲𝘃𝗲𝗻 𝗮𝗹𝗲𝗿𝘁𝘀 𝘆𝗼𝘂 when something goes wrong?",
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
        title: "YouTube Media Downloader Pipeline",
        category: ["Python"],
        description: "A powerful desktop + backend + DevOps project that extracts, stores, and manages video metadata — complete with GUI interface, logging, Dockerization, CI/CD, and monitoring.",
        tags: ["Python", "Loguru", "Prometheus", "CI/CD", "Grafana", "SQLite", "GitHub Actions", "Tkinter"],
        github: "https://github.com/dakshsawhneyy/YT_Video_Downloader_Pipeline.git",
        image: ytPipeline,
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
        description: "KubeLogStack is a production-ready Kubernetes-native log management pipeline. It collects logs from every node, stores them in a persistent database, and automates daily backups to AWS S3",
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
        image: foo,
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