const posts = [
  { title: "Designing systems that can explain themselves", brief: "Why observability is a product decision, not a dashboard decision, and how to make signals useful during a real incident.", slug: "designing-systems-that-can-explain-themselves", publishedAt: "2026-01-20" },
  { title: "The human side of autonomous remediation", brief: "A practical framework for deciding what to automate, what to gate, and where human judgment belongs in an SRE platform.", slug: "the-human-side-of-autonomous-remediation", publishedAt: "2025-11-14" },
  { title: "From noisy logs to a reliable feedback loop", brief: "Lessons from building event-driven ingestion pipelines across cloud providers, queues, and teams.", slug: "from-noisy-logs-to-a-reliable-feedback-loop", publishedAt: "2025-09-02" }
]

export const fetchBlogs = async () => posts