import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenAI } from '@google/genai'
import { SYSTEM_PROMPT } from './profile.js'

/* LLM providers for the "Ask about Daksh" agent.
   Each provider: stream(messages, onText, signal) → resolves when done.
   messages = [{ role: 'user'|'assistant', content: string }] */

/* ── Google Gemini (free tier friendly, fast) ── */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
let gemini = null

async function streamGemini(messages, onText, signal) {
  gemini ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  const config = {
    systemInstruction: SYSTEM_PROMPT,
    maxOutputTokens: 1024,
    temperature: 0.6,
    abortSignal: signal,
  }
  // 2.5 Flash: thinking off = lowest latency for short chat answers
  if (/2\.5-flash/.test(GEMINI_MODEL)) config.thinkingConfig = { thinkingBudget: 0 }

  const stream = await gemini.models.generateContentStream({
    model: GEMINI_MODEL,
    contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    config,
  })
  for await (const chunk of stream) {
    const t = chunk.text
    if (t) onText(t)
  }
}

/* ── Anthropic Claude ── */
const CLAUDE_MODEL = process.env.AGENT_MODEL || 'claude-opus-5-5'
let claude = null

async function streamClaude(messages, onText, signal) {
  claude ??= new Anthropic()
  const stream = claude.beta.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 4000,
    output_config: { effort: 'low' },          // chat: short, fast answers
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',                       // re-run safety declines on the recommended model
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages,
  }, { signal })
  let wrote = false
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onText(event.delta.text)
      wrote = true
    }
  }
  const final = await stream.finalMessage()
  if (final.stop_reason === 'refusal' && !wrote) {
    onText("I can't help with that one — but I'm happy to tell you about Daksh's work, skills or experience.")
  }
}

const PROVIDERS = {
  gemini: { name: 'gemini', enabled: () => !!process.env.GEMINI_API_KEY, stream: streamGemini },
  anthropic: { name: 'anthropic', enabled: () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN), stream: streamClaude },
}

/* Order: AGENT_PROVIDER first if set, then Gemini (free), then Claude. */
export function providerChain() {
  const preferred = process.env.AGENT_PROVIDER
  const order = preferred && PROVIDERS[preferred]
    ? [preferred, ...Object.keys(PROVIDERS).filter(k => k !== preferred)]
    : ['gemini', 'anthropic']
  return order.map(k => PROVIDERS[k]).filter(p => p.enabled())
}
