const RSS_URL = 'https://dakshsawhneyy.hashnode.dev/rss.xml'

// Proxy services that convert RSS to JSON (tried in order, first success wins)
const RSS_PROXIES = [
  (url) => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
]

const FALLBACK_POSTS = [
  {
    title: "Multi-Tenant Jenkins — Secure SRE Approach",
    brief: "How to architect a multi-tenant Jenkins setup with proper isolation, RBAC, and security controls for SRE teams.",
    slug: "multi-tenant-jenkins-secure-sre-approach",
    publishedAt: "2026-09-01",
    url: "https://dakshsawhneyy.hashnode.dev/multi-tenant-jenkins-secure-sre-approach",
  },
  {
    title: "Designing systems that can explain themselves",
    brief: "Why observability is a product decision, not a dashboard decision, and how to make signals useful during a real incident.",
    slug: "designing-systems-that-can-explain-themselves",
    publishedAt: "2026-01-20",
    url: "https://dakshsawhneyy.hashnode.dev/designing-systems-that-can-explain-themselves",
  },
  {
    title: "The human side of autonomous remediation",
    brief: "A practical framework for deciding what to automate, what to gate, and where human judgment belongs in an SRE platform.",
    slug: "the-human-side-of-autonomous-remediation",
    publishedAt: "2025-11-14",
    url: "https://dakshsawhneyy.hashnode.dev/the-human-side-of-autonomous-remediation",
  },
]

/** Parse a raw XML string into post objects */
const parseRSS = (xml) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  const items = Array.from(doc.querySelectorAll('item'))
  if (!items.length) return null

  return items.slice(0, 10).map((item) => {
    const text = (tag) => item.querySelector(tag)?.textContent?.trim() ?? ''
    const link = text('link') || text('guid')
    // derive slug from the URL path
    const slug = link.split('/').filter(Boolean).pop() ?? ''
    // brief: strip HTML tags from description and cap at 160 chars
    const raw = text('description').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const brief = raw.length > 160 ? raw.slice(0, 157) + '…' : raw

    return {
      title: text('title'),
      brief,
      slug,
      url: link,
      publishedAt: text('pubDate') || new Date().toISOString(),
    }
  })
}

/** Try rss2json proxy — returns JSON directly */
const tryRss2Json = async () => {
  const res = await fetch(RSS_PROXIES[0](RSS_URL), { signal: AbortSignal.timeout(6000) })
  if (!res.ok) throw new Error('rss2json failed')
  const json = await res.json()
  if (json.status !== 'ok' || !json.items?.length) throw new Error('rss2json empty')

  return json.items.map((item) => {
    const link = item.link || item.guid || ''
    const slug = link.split('/').filter(Boolean).pop() ?? ''
    const raw = (item.description || item.content || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const brief = raw.length > 160 ? raw.slice(0, 157) + '…' : raw
    return {
      title: item.title,
      brief,
      slug,
      url: link,
      publishedAt: item.pubDate || new Date().toISOString(),
    }
  })
}

/** Try allorigins proxy — returns raw XML wrapped in JSON */
const tryAllOrigins = async () => {
  const res = await fetch(RSS_PROXIES[1](RSS_URL), { signal: AbortSignal.timeout(7000) })
  if (!res.ok) throw new Error('allorigins failed')
  const json = await res.json()
  const posts = parseRSS(json.contents || '')
  if (!posts) throw new Error('allorigins parse failed')
  return posts
}

/** Try direct fetch — works if Hashnode sends CORS headers */
const tryDirect = async () => {
  const res = await fetch(RSS_URL, { signal: AbortSignal.timeout(7000) })
  if (!res.ok) throw new Error('direct fetch failed')
  const xml = await res.text()
  const posts = parseRSS(xml)
  if (!posts) throw new Error('direct parse failed')
  return posts
}

export const fetchBlogs = async () => {
  // Try each strategy in order; first success wins
  for (const strategy of [tryRss2Json, tryAllOrigins, tryDirect]) {
    try {
      const posts = await strategy()
      if (posts?.length) return posts
    } catch {
      // continue to next strategy
    }
  }
  return FALLBACK_POSTS
}
