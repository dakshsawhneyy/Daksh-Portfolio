/* API base URL.
   Production (EKS): the ingress routes /api/* on the same host to the backend,
   so the default is same-origin: fetch('/api/message').
   Dev: vite.config.js proxies /api → http://localhost:4000.
   Only set VITE_BACKEND_URL (at BUILD time) when the backend lives on another
   origin (e.g. a static host + a separately hosted API). Never bake localhost in. */
const raw = (import.meta.env.VITE_BACKEND_URL || '').trim()
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(raw)
// a localhost URL in a production bundle is always a mistake → fall back to same-origin
export const API_BASE = (import.meta.env.PROD && isLocal ? '' : raw).replace(/\/$/, '')
export const apiUrl = (path) => `${API_BASE}${path}`
