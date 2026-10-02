import express from 'express'
import { providerChain } from '../agent/providers.js'

/* POST /api/agent  { messages: [{ role: 'user'|'assistant', content: string }] }
   Streams the answer back as plain UTF-8 text chunks.
   Provider: Gemini if GEMINI_API_KEY is set (free tier), else Claude; if the
   first provider fails before sending anything, the next one is tried. */

const agentRouter = express.Router()

const MAX_TURNS = 12
const MAX_CHARS = 1000

/* ── cost guards: per-IP window + global daily cap ── */
const WINDOW_MS = 15 * 60 * 1000
const PER_IP = Number(process.env.AGENT_PER_IP_LIMIT || 25)
const DAILY_CAP = Number(process.env.AGENT_DAILY_LIMIT || 600)
const hits = new Map()
let day = new Date().toDateString()
let dailyCount = 0

const allow = (ip) => {
  const today = new Date().toDateString()
  if (today !== day) { day = today; dailyCount = 0; hits.clear() }
  if (dailyCount >= DAILY_CAP) return false
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS)
  if (recent.length >= PER_IP) return false
  recent.push(now)
  hits.set(ip, recent)
  dailyCount++
  return true
}

const sanitize = (messages) => {
  if (!Array.isArray(messages)) return null
  const clean = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS)
  while (clean.length && clean[0].role !== 'user') clean.shift()
  if (!clean.length || clean[clean.length - 1].role !== 'user') return null
  return clean
}

agentRouter.post('/', async (req, res) => {
  const chain = providerChain()
  if (!chain.length) return res.status(503).json({ error: 'agent_not_configured' })
  const messages = sanitize(req.body?.messages)
  if (!messages) return res.status(400).json({ error: 'invalid_messages' })
  if (!allow(req.ip)) return res.status(429).json({ error: 'rate_limited' })

  const ctrl = new AbortController()
  res.on('close', () => { if (!res.writableEnded) ctrl.abort() })

  let wrote = false
  let current = ''
  const onText = (t) => {
    if (!wrote) {
      res.setHeader('X-Agent-Provider', current)
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('X-Accel-Buffering', 'no')
    }
    wrote = true
    res.write(t)
  }

  for (const provider of chain) {
    current = provider.name
    try {
      await provider.stream(messages, onText, ctrl.signal)
      if (!wrote) continue // empty answer → let the next provider try
      return res.end()
    } catch (err) {
      if (ctrl.signal.aborted) return
      console.error(`agent: ${provider.name} failed`, err?.status ?? '', err?.message ?? err)
      if (wrote) {
        res.write('\n\n(Connection hiccup — please ask again.)')
        return res.end()
      }
    }
  }
  if (!res.headersSent) return res.status(502).json({ error: 'upstream_error' })
  res.end()
})

export default agentRouter
