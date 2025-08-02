# Daksh Sawhney - Full Stack Cloud Portfolio

> **Built by a Cloud Engineer who autoscaled his soul and logs for fun. █**

This is a professional-grade portfolio site, crafted as a fusion of modern **MERN Stack development**, **Cloud-native deployment**, and advanced **DevOps engineering**. It reflects not only the skillset of a full-stack developer but the engineering maturity of someone who automates and scales infrastructure like second nature.

<img width="1895" height="1200" alt="image" src="https://github.com/user-attachments/assets/1dfd3897-e8ab-491d-8134-534e02621759" />

---

## Overview

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/d265e8bf-2580-49aa-8a12-b94c332841c1" />

This isn't just a portfolio — it's a demonstration of production-ready engineering.
Designed for recruiters, hiring managers, and engineers who understand what it takes to ship resilient, attractive, and scalable digital systems.

- **Frontend**: React + TailwindCSS + Framer Motion + Heroicons + Responsive layout
- **Backend**: Express + MongoDB + REST API + secure mail service + modularized routes
- **Deployment**: Fully containerized and deployed to AWS EKS via **Helm**
- **Cloud Native**: NGINX Ingress Controller, custom domain, SSL via ACM, managed DNS
- **CI/CD**: Jenkins for image build & Render auto-deploy
- **Monitoring Add-ons**: Real-time (simulated) DevOps Metrics panel with React Charts
- **Logging-Ready**: App architecture built to support centralized logging integrations
- **Terminal UI**: Hacker-themed CLI elements with animated interactions
- **Personal Touches**: CLI intro section, futuristic UX, custom SVGs & matrix background

---

##  Key Features

<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/774f0ec2-b73c-4e2a-a964-0c358f30b9b5" />
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/19b54375-452b-477c-9476-62d18445cc8c" />


### Frontend

- Fully responsive design with clean and modern layout
- Animated hero section with matrix/starfield background
- Multiple pages: Home, About, Projects, Blogs, Contact, Metrics Dashboard
- Integrated blog feed using Hashnode API
- Custom SVG favicon and hacker-inspired typography

### Backend

- Secure contact form storing messages in MongoDB
- Modular Express structure ready for scaling
- Environment-based configuration
- REST API endpoint protection for future admin utilities

### Cloud & DevOps

- Dockerized microservices: Frontend, Backend, MongoDB
- Helm Charts for simplified EKS deployment (namespace, ingress, TLS)
- Ingress Controller setup with NGINX + LoadBalancer + ACM
- Route53 + HTTPS domain: `https://daksh-portfolio.cctlds.online`
- Auto Deploy via GitHub to Render (for cost-optimized static deploys)
- Designed for observability: future-ready logging + monitoring stack

---

## Repository Structure

```
├── frontend/             # React frontend
│   ├── public/           # Static assets
│   ├── src/              # Components, pages, routing
│   └── vite.config.js    # Custom build & redirects
├── backend/              # Express backend + MongoDB API
│   ├── routes/           # Modular endpoints
│   └── controllers/
├── daksh-portfolio-helm/ # Helm chart for EKS
│   ├── charts/           # Subcharts for frontend/backend
│   └── templates/        # Namespace, ingress, secrets
```

---

## Live URL

 [https://daksh-portfolio.cctlds.online](https://daksh-portfolio.cctlds.online)

---

## Tech Stack Summary

| Area        | Technologies |
|-------------|--------------|
| Frontend    | React, TailwindCSS, Framer Motion |
| Backend     | Express.js, MongoDB, NodeMailer |
| Cloud       | AWS EKS, Route53, ACM, S3 |
| DevOps      | Helm, Docker, GitHub Actions, Render |
| Extras      | Vite, Recharts, Parallax Tilt, Particle.js |

---

## 👨‍💻 About Me

I'm Daksh, a passionate **Cloud & DevOps Engineer** with a strong MERN foundation.
This portfolio reflects not just what I build, but **how I deploy, monitor, scale, and secure it**.

> “Good code ships features. Great engineering ships confidence.”

Let's connect: [LinkedIn](https://linkedin.com/in/dakshsawhneyy) | [GitHub](https://github.com/dakshsawhneyy)
