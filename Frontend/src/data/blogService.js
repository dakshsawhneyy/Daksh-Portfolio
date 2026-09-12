/**
 * blogService.js
 *
 * Uses Hashnode's public GraphQL API — works from the browser.
 * Falls back to accurate hardcoded real posts from the actual blog.
 */

const GQL_ENDPOINT = 'https://gql.hashnode.com'
const BLOG_HOST    = 'dakshsawhneyy.hashnode.dev'

/* ─────────────────────────────────────────────────────────────────
   ACCURATE FALLBACK — real posts from dakshsawhneyy.hashnode.dev
   Shown immediately while GQL fetch runs in background.
   ───────────────────────────────────────────────────────────────── */
export const FALLBACK_POSTS = [
  {
    title: "Multi-Tenant Jenkins — Secure SRE Approach",
    brief: "For a long time, I saw Multi-Tenant Jenkins mentioned repeatedly in SRE and DevOps discussions and interviews. I read articles, watched talks, but something always felt missing — not what real problem it was solving.",
    slug:  "multi-tenant-jenkins-secure-sre-approach",
    publishedAt: "2026-01-22T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/multi-tenant-jenkins-secure-sre-approach",
    cover: null,
  },
  {
    title: "AIOps-Driven Self Healing SRE Platform",
    brief: "This project came from system-level thinking — breaking a complex problem into smaller, solvable components and stitching them back into a single, intelligent platform that detects, decides, and repairs.",
    slug:  "aiops-driven-self-healing-sre-platform",
    publishedAt: "2025-10-24T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/aiops-driven-self-healing-sre-platform",
    cover: null,
  },
  {
    title: "Architecting for Hyperscale: The Journey from 1 to 1 Million+ Users",
    brief: "How this project was born: I was reading a system design article on how to build a platform that can handle 1 Million+ users on AWS. The article was just a direct answer — bottlenecks were not specified.",
    slug:  "architecting-for-hyperscale-the-journey-from-1-to-1-million-users",
    publishedAt: "2025-10-24T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/architecting-for-hyperscale-the-journey-from-1-to-1-million-users",
    cover: null,
  },
  {
    title: "Multi Cloud Orchestration",
    brief: "In an era defined by cloud computing, the debate is often framed as AWS vs. Azure. But the real strategic problem isn't picking a vendor — it's the risk of being locked into one and their flaws.",
    slug:  "multi-cloud-orchestration",
    publishedAt: "2025-03-24T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/multi-cloud-orchestration",
    cover: null,
  },
  {
    title: "Infra Health Monitoring Suite",
    brief: "In the real world, infrastructure monitoring isn't just about running a few checks. It's about building a system that tells you what's broken before your users do — automated, observable, and reliable.",
    slug:  "infra-health-monitoring-suite",
    publishedAt: "2025-07-04T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/infra-health-monitoring-suite",
    cover: null,
  },
  {
    title: "Deploying WearSphere: A 4-Tier E-commerce App on AWS with DevSecOps & EKS",
    brief: "Anyone can build a MERN app. But WearSphere isn't just another side project — it's a 4-tier e-commerce platform, fully automated and deployed on AWS using DevOps, DevSecOps, and GitOps best practices.",
    slug:  "deploying-wearsphere-a-4-tier-e-commerce-app-on-aws-with-devsecops-and-eks",
    publishedAt: "2025-04-21T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/deploying-wearsphere-a-4-tier-e-commerce-app-on-aws-with-devsecops-and-eks",
    cover: null,
  },
  {
    title: "Creation of Secure Web Server Using Ansible",
    brief: "In this walkthrough, we'll use Ansible to automate the creation of an AWS EC2 instance and set up a secure web server running Nginx — all without clicking through the AWS console or manually configuring a thing.",
    slug:  "creation-of-secure-web-server-using-ansible",
    publishedAt: "2025-07-29T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/creation-of-secure-web-server-using-ansible",
    cover: null,
  },
  {
    title: "DevSecOps CI/CD: SonarQube + OWASP + Trivy + Docker + Jenkins",
    brief: "This blog walks through how I set up an end-to-end pipeline, integrated security tools into it, and followed DevSecOps principles — shifting security left into every stage of delivery.",
    slug:  "devsecops-cicd-project-sonarqube-owasp-trivy-docker-jenkins",
    publishedAt: "2025-04-09T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/devsecops-cicd-project-sonarqube-owasp-trivy-docker-jenkins",
    cover: null,
  },
  {
    title: "Setting Up My First DevOps Pipeline with Terraform & Ansible",
    brief: "Deploying a secure and scalable web server shouldn't be a mystery or a manual process. Whether you're a DevOps enthusiast or an engineer tired of repetitive tasks, automation is your best friend.",
    slug:  "setting-up-my-first-devops-pipeline-with-terraform-and-ansible",
    publishedAt: "2025-03-07T00:00:00.000Z",
    url: "https://dakshsawhneyy.hashnode.dev/setting-up-my-first-devops-pipeline-with-terraform-and-ansible",
    cover: null,
  },
]

/* ─────────────────────────────────────────────────────────────────
   GQL QUERY — Hashnode v2 public API
   ───────────────────────────────────────────────────────────────── */
const GQL_QUERY = `
  query GetPosts($host: String!) {
    publication(host: $host) {
      posts(first: 10) {
        edges {
          node {
            title
            brief
            slug
            publishedAt
            url
            coverImage {
              url
            }
          }
        }
      }
    }
  }
`

const mapPost = (node) => ({
  title:       node.title || '',
  brief:       (node.brief || '').length > 200
                 ? (node.brief || '').slice(0, 197) + '…'
                 : (node.brief || ''),
  slug:        node.slug || '',
  publishedAt: node.publishedAt || new Date().toISOString(),
  url:         node.url || `https://${BLOG_HOST}/${node.slug}`,
  cover:       node.coverImage?.url || null,
})

/* ─────────────────────────────────────────────────────────────────
   MAIN EXPORT
   Shows fallback instantly, replaces with live data from GQL.
   ───────────────────────────────────────────────────────────────── */
export const fetchBlogs = async () => {
  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query:     GQL_QUERY,
        variables: { host: BLOG_HOST },
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) throw new Error(`GQL ${res.status}`)

    const text = await res.text()

    // Check if response is HTML (Cloudflare challenge) not JSON
    if (text.trim().startsWith('<')) throw new Error('Received HTML instead of JSON')

    const json = JSON.parse(text)
    if (json.errors?.length) throw new Error(json.errors[0].message)

    const edges = json?.data?.publication?.posts?.edges
    if (!edges?.length) throw new Error('No posts')

    const posts = edges.map(({ node }) => mapPost(node)).filter(p => p.slug && p.title)
    if (!posts.length) throw new Error('No valid posts')

    return posts
  } catch (err) {
    console.warn('[blogService] GQL fetch failed, using fallback:', err.message)
    return FALLBACK_POSTS
  }
}
