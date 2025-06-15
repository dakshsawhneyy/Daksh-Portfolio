import wearsphereImg from "../assets/wearsphere.png"
import ytPipeline from "../assets/youtube-pipeline.png"

const projects = [
    {
        title: "YouTube Media Downloader Pipeline",
        category: "Python",
        description: "Fully automated downloader pipeline with metadata management, CI/CD, logging, monitoring.",
        tags: ["Python", "Loguru", "Prometheus", "CI/CD", "Grafana"],
        github: "https://github.com/dakshsawhneyy/YT_Video_Downloader_Pipeline.git",
        image: ytPipeline,
    },
    {
        title: "WearSphere E-commerce",
        category: "MERN",
        description: "3-tier MERN app deployed on AWS EKS with full CI/CD and security.",
        tags: ["React", "Node", "AWS", "K8s", "SonarQube"],
        github: "https://github.com/dakshsawhneyy/WearSphere-Ecommerce-MERN.git",
        image: wearsphereImg,
    },
]

export default projects