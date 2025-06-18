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


const projects = [
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
        title: "WearSphere E-commerce",
        category: ["MERN","DevOps"],
        description: "WearSphere is a fully automated 4-tier e-commerce platform built with MERN stack, deployed on AWS EKS with CI/CD pipelines by Jenkins. The project integrates DevSecOps practices for security, and includes Prometheus and Grafana for monitoring",
        tags: ["React", "Node", "AWS", "K8s", "EKS", "DevSecOps", "Jenkins", "Agile", "ArgoCD"],
        github: "https://github.com/dakshsawhneyy/WearSphere-Ecommerce-MERN.git",
        image: wearsphereImg,
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
        image: log_analyser,
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