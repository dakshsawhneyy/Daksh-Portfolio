import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Minimize2, X } from 'lucide-react'
import projects from '../data/projects'
import { offlineAnswer } from '../data/knowledge'
import '../styles/terminal.css'

/* ══════════════════════════════════════════════════════════════════
   DAKSH-OS TERMINAL — CRT-styled interactive shell.
   Boot sequence, neofetch, live `top`, `kubectl`, `matrix`,
   `ask <question>` streamed from the AI agent, music control,
   route navigation (`cd about`), tab-completion with ghost text.
   ══════════════════════════════════════════════════════════════════ */

const BOOTED_KEY = 'dk-term-booted'

const BANNER = [
  '██████╗  █████╗ ██╗  ██╗███████╗██╗  ██╗',
  '██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║',
  '██║  ██║███████║█████╔╝ ███████╗███████║',
  '██║  ██║██╔══██║██╔═██╗ ╚════██║██╔══██║',
  '██████╔╝██║  ██║██║  ██╗███████║██║  ██║',
  '╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝',
]

const BOOT = [
  'Booting daksh-os 26.10 (kernel 6.9.0-sre)',
  'Mounted /home/daksh',
  'Started kubelet.service',
  'Started prometheus.service — scraping 3 clouds',
  'Reconciled desired state',
  'Reached target: Open to Work',
]

const ROUTES = { home: '/', '~': '/', work: '/projects', projects: '/projects', systems: '/projects', about: '/about', experience: '/about#experience', blog: '/blog', writing: '/blog', contact: '/contact' }
const FILES = {
  'about.md': 'about', 'skills.yaml': 'skills', 'experience.log': 'experience',
  'contact.txt': 'contact', 'resume.pdf': 'resume', 'projects/': 'projects',
}

const HELP = [
  ['about / whoami', 'who is daksh'],
  ['neofetch', 'system summary'],
  ['experience', 'roles & impact'],
  ['projects · open <n>', 'systems I built'],
  ['skills', 'the stack'],
  ['ask <question>', 'ask the AI agent anything'],
  ['kubectl get pods', 'peek at the cluster'],
  ['top', 'live process monitor'],
  ['cd <page>', 'navigate: about, work, blog, contact'],
  ['play · pause', 'control the soundtrack'],
  ['hire', 'availability + how to reach me'],
  ['matrix', '…you know'],
  ['clear · history · exit', 'shell stuff'],
]

const COMMAND_NAMES = ['help', 'about', 'whoami', 'neofetch', 'experience', 'projects', 'open', 'skills', 'ask', 'agent',
  'kubectl get pods', 'kubectl get nodes', 'top', 'cd', 'ls', 'cat', 'play', 'pause', 'music', 'hire', 'contact', 'resume',
  'socials', 'github', 'matrix', 'date', 'uptime', 'history', 'echo', 'clear', 'exit', 'sudo', 'coffee', 'ping']

const CHIPS = ['neofetch', 'ask is he open to roles?', 'projects', 'top', 'kubectl get pods', 'hire', 'matrix']

const plain = (md) => md
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => (u.startsWith('mailto:') || t.includes('.') ? t : `${t} (${u})`))
  .replace(/^\s*[-*]\s+/gm, '  › ')

const started = Date.now()
const fmtUptime = () => {
  const s = Math.floor((Date.now() - started) / 1000)
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

/* ── live widgets rendered inside the scrollback ── */
const Top = () => {
  const procs = useMemo(() => [
    ['kubelet', 'root'], ['prometheus', 'sre'], ['grafana', 'sre'], ['argocd-server', 'gitops'],
    ['terraform apply', 'daksh'], ['incident-zero', 'daksh'], ['daksh-brain', 'daksh'], ['coffee.exe', 'daksh'],
  ], [])
  const [tick, setTick] = useState(0)
  const [live, setLive] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 450)
    const stop = setTimeout(() => { clearInterval(t); setLive(false) }, 7000)
    return () => { clearInterval(t); clearTimeout(stop) }
  }, [])
  const rows = procs.map(([name, user], i) => {
    const base = name === 'daksh-brain' ? 78 : name === 'coffee.exe' ? 64 : 8 + i * 5
    const cpu = Math.max(1, Math.min(99, base + Math.round(Math.sin(tick * 0.9 + i * 1.7) * 14)))
    return { pid: 1200 + i * 37, name, user, cpu, mem: (0.4 + ((i * 7) % 9) * 0.6).toFixed(1) }
  }).sort((a, b) => b.cpu - a.cpu)
  return (
    <div className="xt-top">
      <div className="xt-top-head">
        <span>daksh-os · load {(1.2 + Math.sin(tick) * 0.3).toFixed(2)} · {live ? <b className="xt-ok">● live</b> : <span className="xt-dim">snapshot</span>}</span>
        <span>uptime {fmtUptime()}</span>
      </div>
      <div className="xt-top-row xt-top-th"><span>PID</span><span>USER</span><span>CPU</span><span /><span>MEM%</span><span>COMMAND</span></div>
      {rows.map(r => (
        <div className="xt-top-row" key={r.name}>
          <span className="xt-dim">{r.pid}</span>
          <span>{r.user}</span>
          <span className={r.cpu > 60 ? 'xt-hot' : r.cpu > 30 ? 'xt-warn' : 'xt-ok'}>{String(r.cpu).padStart(2, ' ')}%</span>
          <span className="xt-bar"><i style={{ width: `${r.cpu}%` }} className={r.cpu > 60 ? 'hot' : r.cpu > 30 ? 'warn' : ''} /></span>
          <span className="xt-dim">{r.mem}</span>
          <span className={r.name === 'daksh-brain' ? 'xt-accent' : ''}>{r.name}</span>
        </div>
      ))}
    </div>
  )
}

const Matrix = () => {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const c = cv.getContext('2d')
    const w = cv.width = cv.clientWidth
    const h = cv.height = cv.clientHeight
    const fs = 14
    const cols = Math.floor(w / fs)
    const drops = Array.from({ length: cols }, () => Math.random() * -20)
    const glyphs = 'アカサタナハマヤラワ0123456789KUBECTLDAKSH$#{}<>'.split('')
    let raf
    const t0 = performance.now()
    const draw = (now) => {
      c.fillStyle = 'rgba(8,11,9,0.16)'
      c.fillRect(0, 0, w, h)
      c.font = `${fs}px ui-monospace, monospace`
      drops.forEach((y, i) => {
        const ch = glyphs[(Math.random() * glyphs.length) | 0]
        c.fillStyle = Math.random() < 0.06 ? '#e8674a' : '#72dfac'
        c.fillText(ch, i * fs, y * fs)
        drops[i] = y * fs > h && Math.random() > 0.975 ? 0 : y + 1
      })
      if (now - t0 < 5500) raf = requestAnimationFrame(draw)
      else { c.fillStyle = 'rgba(8,11,9,.75)'; c.fillRect(0, 0, w, h); c.fillStyle = '#72dfac'; c.font = `600 14px ui-monospace, monospace`; c.fillText('wake up, recruiter… the cluster has you.', 16, h / 2) }
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="xt-matrix" />
}

const Neofetch = () => (
  <div className="xt-neo">
    <pre className="xt-neo-logo" aria-hidden="true">{`   ▄▄▄▄▄▄▄▄▄
  █  ╱╲  ___ █
  █ ╱  ╲╱    █
  █▄▄▄▄▄▄▄▄▄▄█
     ▀▀▀▀▀▀`}</pre>
    <div className="xt-neo-info">
      <p><b className="xt-accent">daksh</b>@<b className="xt-accent">portfolio</b></p>
      <p className="xt-dim">─────────────────────</p>
      {[
        ['Role', 'Cloud · DevOps · SRE Engineer'],
        ['Teaching', 'Multi-Cloud Instructor @ SelfCode'],
        ['Prev', 'AWS Cloud Intern @ IPage UMS'],
        ['Clouds', 'AWS · Azure · GCP'],
        ['Shell', 'bash · python · terraform'],
        ['Orchestrator', 'kubernetes (eks/aks/gke)'],
        ['Uptime', fmtUptime()],
        ['Status', 'open to work · immediate joiner'],
      ].map(([k, v]) => <p key={k}><b className="xt-key">{k}</b>: {v}</p>)}
      <p className="xt-swatch">{['#10110f', '#e8674a', '#72dfac', '#f0bc62', '#65cfe5', '#8784d2', '#f3f1eb'].map(c => <i key={c} style={{ background: c }} />)}</p>
    </div>
  </div>
)

const SreTerminal = ({ open, onClose }) => {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [max, setMax] = useState(false)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const abortRef = useRef(null)
  const idRef = useRef(0)
  const navigate = useNavigate()

  const push = useCallback((...ls) => setLines(cur => [...cur, ...ls.map(l => ({ id: idRef.current++, ...l }))]), [])

  const greet = useCallback(() => {
    push({ k: 'banner' }, { k: 'dim', t: 'Cloud · DevOps · SRE — welcome to daksh-os. Type `help` or tap a command below.' }, { k: 'gap' })
  }, [push])

  /* open → boot (first time per session) or straight to banner */
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    setTimeout(() => inputRef.current?.focus(), 120)
    let cancelled = false
    let booted = false
    try { booted = sessionStorage.getItem(BOOTED_KEY) === '1' } catch { /* storage blocked */ }
    setLines([])
    if (booted || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      greet()
    } else {
      setBusy(true)
      ;(async () => {
        for (const b of BOOT) {
          await new Promise(r => setTimeout(r, 110 + Math.random() * 120))
          if (cancelled) return
          push({ k: 'boot', t: b })
        }
        await new Promise(r => setTimeout(r, 250))
        if (cancelled) return
        try { sessionStorage.setItem(BOOTED_KEY, '1') } catch { /* storage blocked */ }
        setLines([])
        greet()
        setBusy(false)
        setTimeout(() => inputRef.current?.focus(), 30)
      })()
    }
    return () => { cancelled = true; document.body.style.overflow = '' }
  }, [open, greet, push])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const patch = (id, fn) => setLines(ls => ls.map(l => (l.id === id ? fn(l) : l)))

  // offline-only agent (same knowledge base as the chat widget), typed out fast
  const askAgent = async (q) => {
    const id = idRef.current++
    setLines(ls => [...ls, { id, k: 'agent', t: '', pending: true }])
    setBusy(true)
    abortRef.current = { aborted: false }
    const ticket = abortRef.current
    await new Promise(r => setTimeout(r, 160))
    const words = offlineAnswer(q).match(/\S+\s*/g) || []
    for (let i = 0; i < words.length; i += 3) {
      if (ticket.aborted) { patch(id, l => ({ ...l, pending: false, t: l.t + ' ^C' })); setBusy(false); return }
      const chunk = words.slice(i, i + 3).join('')
      patch(id, l => ({ ...l, t: l.t + chunk }))
      await new Promise(r => setTimeout(r, 14))
    }
    patch(id, l => ({ ...l, pending: false }))
    setBusy(false)
  }

  const run = (raw) => {
    const line = raw.trim()
    push({ k: 'cmd', t: line })
    if (!line) return
    setHist(h => [line, ...h.filter(x => x !== line)].slice(0, 50))
    setHistIdx(-1)
    const [head, ...rest] = line.split(/\s+/)
    const cmd = head.toLowerCase()
    const arg = rest.join(' ')

    switch (cmd) {
      case 'help': case '?':
        push({ k: 'help' }); break
      case 'about': case 'whoami':
        push({ k: 'out', t: 'Daksh Sawhney — Cloud / DevOps / SRE engineer from Jammu, India.' },
          { k: 'out', t: 'Builds multicloud systems that self-heal; teaches multi-cloud at SelfCode Academy; ships products (Incident Zero) and experiments with AI.' },
          { k: 'dim', t: 'try: neofetch · experience · ask what makes him different?' }); break
      case 'neofetch': case 'fastfetch':
        push({ k: 'neo' }); break
      case 'experience': case 'exp':
        push(
          { k: 'accent', t: '▸ Multi-Cloud Computing Instructor · SelfCode Academy · Feb 2026 – now' },
          { k: 'out', t: '  180+ h DevOps/SRE taught → promoted · 100+ h AWS/Azure/GCP track · 2 capstones' },
          { k: 'accent', t: '▸ AWS Cloud Intern · IPage UMS · Sept – Nov 2025' },
          { k: 'out', t: '  serverless APIs · P95 latency −40% · MTTR −30% · least-privilege IAM' },
          { k: 'accent', t: '▸ B.Tech CSE · HBTU Kanpur · 2023 – 2027 · CGPA 8.2' },
        ); break
      case 'projects': case 'ls-projects':
        projects.forEach((p, i) => push({ k: 'proj', n: i + 1, t: p.title, d: p.description }))
        push({ k: 'dim', t: 'open <n> to launch · cd work for the full archive' }); break
      case 'open': {
        const n = parseInt(arg, 10)
        const p = projects[n - 1] || projects.find(x => x.title.toLowerCase().includes(arg.toLowerCase()))
        if (!p || !arg) { push({ k: 'err', t: 'usage: open <n|name>  (see `projects`)' }); break }
        const url = p.live && p.live !== '#' ? p.live : p.github
        push({ k: 'ok', t: `launching ${p.title} → ${url}` })
        window.open(url, '_blank', 'noopener'); break
      }
      case 'skills': case 'stack':
        push(
          { k: 'kv', a: 'cloud', b: 'AWS · Azure · GCP · VPC/VNet · IAM/RBAC' },
          { k: 'kv', a: 'platform', b: 'Kubernetes · Docker · Helm · Terraform · Ansible · ArgoCD' },
          { k: 'kv', a: 'ci/cd', b: 'GitHub Actions · Jenkins · GitOps' },
          { k: 'kv', a: 'reliability', b: 'Prometheus · Grafana · SLOs · incident response · RCA · chaos' },
          { k: 'kv', a: 'code', b: 'Python · Bash · Linux' },
        ); break
      case 'ask':
        if (!arg) { push({ k: 'err', t: 'usage: ask <question>   e.g. ask what did he build at his internship?' }); break }
        askAgent(arg); return
      case 'agent': case 'chat':
        window.dispatchEvent(new CustomEvent('dk-agent', { detail: { question: arg || undefined } }))
        onClose(); return
      case 'kubectl': {
        const what = rest.slice(1).join(' ') || rest[0] || ''
        if (/nodes?/.test(what)) push({ k: 'table', rows: [['NAME', 'STATUS', 'ROLES', 'AGE', 'VERSION'], ['node-a', 'Ready', 'worker', '412d', 'v1.31'], ['node-b', 'Ready', 'worker', '412d', 'v1.31'], ['node-c', 'Ready', 'control-plane', '412d', 'v1.31']] })
        else if (/pods?|get/.test(line)) push({ k: 'table', rows: [['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'], ['incident-zero-7f9c', '1/1', 'Running', '0', '58d'], ['portfolio-web-2b1d', '1/1', 'Running', '0', '3d'], ['ask-daksh-agent-9e4a', '1/1', 'Running', '0', '1d'], ['coffee-maker-0', '0/1', 'CrashLoopBackOff', '42', '7d'], ['open-to-work-1', '1/1', 'Running', '0', '∞']] })
        else push({ k: 'err', t: 'try: kubectl get pods · kubectl get nodes' })
        break
      }
      case 'top': case 'htop': case 'btop':
        push({ k: 'top' }); break
      case 'cd': {
        const target = ROUTES[(arg || '~').toLowerCase().replace(/^\//, '')]
        if (!target) { push({ k: 'err', t: `cd: no such page: ${arg}  (about, work, experience, blog, contact)` }); break }
        push({ k: 'ok', t: `→ ${target}` })
        setTimeout(() => { navigate(target); onClose() }, 280); return
      }
      case 'ls':
        push({ k: 'out', t: Object.keys(FILES).join('    ') }); break
      case 'cat': {
        const f = FILES[arg]
        if (!f) { push({ k: 'err', t: `cat: ${arg || '?'}: no such file (try ls)` }); break }
        if (f === 'resume') { push({ k: 'ok', t: 'opening resume.pdf…' }); window.open('/resume/Daksh-Resume.pdf', '_blank'); break }
        run(f); return
      }
      case 'play': case 'pause': case 'music':
        window.dispatchEvent(new CustomEvent('dk-music', { detail: { action: cmd === 'music' ? 'toggle' : cmd } }))
        push({ k: 'ok', t: cmd === 'pause' ? '⏸ soundtrack paused' : `♪ ${cmd === 'play' ? 'soundtrack playing — see the record, bottom-right' : 'toggled the soundtrack'}` }); break
      case 'hire': case 'contact':
        push({ k: 'ok', t: 'status: OPEN TO WORK · full-time Cloud / DevOps / SRE · immediate joiner · open to relocation' },
          { k: 'link', t: 'email   dakshsawhneyy@gmail.com', href: 'mailto:dakshsawhneyy@gmail.com' },
          { k: 'link', t: 'linkedin   linkedin.com/in/dakshsawhneyy', href: 'https://linkedin.com/in/dakshsawhneyy' },
          { k: 'link', t: 'resume   /resume/Daksh-Resume.pdf', href: '/resume/Daksh-Resume.pdf' }); break
      case 'resume':
        push({ k: 'ok', t: 'opening resume.pdf…' }); window.open('/resume/Daksh-Resume.pdf', '_blank'); break
      case 'socials': case 'github':
        push({ k: 'link', t: 'github     github.com/dakshsawhneyy', href: 'https://github.com/dakshsawhneyy' },
          { k: 'link', t: 'linkedin   linkedin.com/in/dakshsawhneyy', href: 'https://linkedin.com/in/dakshsawhneyy' },
          { k: 'link', t: 'blog       dakshsawhneyy.hashnode.dev', href: 'https://dakshsawhneyy.hashnode.dev' }); break
      case 'matrix':
        push({ k: 'matrix' }); break
      case 'date':
        push({ k: 'out', t: new Date().toString() }); break
      case 'uptime':
        push({ k: 'out', t: `up ${fmtUptime()} · systems: running · error budget: 99.97% · coffee: critically low` }); break
      case 'history':
        hist.slice().reverse().forEach((h, i) => push({ k: 'dim', t: `${String(i + 1).padStart(4)}  ${h}` })); break
      case 'echo':
        push({ k: 'out', t: arg }); break
      case 'ping':
        push({ k: 'out', t: `PING ${arg || 'daksh'}: 64 bytes · time=0.42ms · he usually replies within a day` }); break
      case 'sudo':
        push({ k: 'err', t: `[sudo] nice try. ${arg.includes('hire') ? 'but honestly — `hire` works without sudo.' : 'this incident will be reported (to a very friendly SRE).'}` }); break
      case 'coffee':
        push({ k: 'warn', t: 'coffee-maker-0 is in CrashLoopBackOff (restarts: 42). root cause: Monday.' }); break
      case 'rm':
        push({ k: 'err', t: 'rm: refusing to remove anything — this system is immutable, GitOps-managed. ;)' }); break
      case 'clear': case 'cls':
        setLines([]); return
      case 'exit': case 'quit': case 'q':
        onClose(); return
      default:
        push({ k: 'err', t: `zsh: command not found: ${head}` }, { k: 'dim', t: `hint: type \`help\` — or just ask: ask ${line}` })
    }
  }

  /* ghost-text autocomplete */
  const ghost = useMemo(() => {
    if (!input || /\s$/.test(input)) return ''
    const lower = input.toLowerCase()
    const [first, ...more] = lower.split(' ')
    let m = ''
    if (!more.length) m = COMMAND_NAMES.find(c => c.startsWith(lower) && c !== lower) || ''
    else if (first === 'cd') { const a = more.join(' '); m = Object.keys(ROUTES).find(r => r.startsWith(a) && r !== a); m = m ? `cd ${m}` : '' }
    else if (first === 'cat') { const a = more.join(' '); m = Object.keys(FILES).find(r => r.startsWith(a) && r !== a); m = m ? `cat ${m}` : '' }
    else m = COMMAND_NAMES.find(c => c.startsWith(lower) && c !== lower) || ''
    return m ? m.slice(input.length) : ''
  }, [input])

  const onKeyDown = (e) => {
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost && e.currentTarget.selectionStart === input.length) {
      e.preventDefault(); setInput(input + ghost)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(histIdx + 1, hist.length - 1)
      if (n >= 0) { setHistIdx(n); setInput(hist[n]) }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = histIdx - 1
      setHistIdx(Math.max(n, -1)); setInput(n < 0 ? '' : hist[n])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault(); setLines([])
    } else if (e.key === 'c' && e.ctrlKey && busy) {
      e.preventDefault(); if (abortRef.current) abortRef.current.aborted = true
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (busy) return
    const v = input
    setInput('')
    run(v)
  }

  const renderLine = (l) => {
    switch (l.k) {
      case 'banner':
        return (
          <div className="xt-banner">
            <pre aria-label="DAKSH">{BANNER.join('\n')}</pre>
            <span className="xt-banner-sub">cloud · devops · sre · builder — v26.10</span>
          </div>
        )
      case 'boot': return <div className="xt-line"><span className="xt-ok">[  OK  ]</span> {l.t}</div>
      case 'cmd':
        return (
          <div className="xt-line xt-cmdline">
            <span className="xt-ps1"><b>daksh</b><i>@portfolio</i> <em>~</em> <span>❯</span></span> {l.t}
          </div>
        )
      case 'gap': return <div className="xt-gap" />
      case 'help':
        return (
          <div className="xt-help">
            {HELP.map(([c, d]) => (
              <button type="button" key={c} onClick={() => run(c.split(' ')[0])}><b>{c}</b><span>{d}</span></button>
            ))}
          </div>
        )
      case 'neo': return <Neofetch />
      case 'top': return <Top />
      case 'matrix': return <Matrix />
      case 'proj':
        return (
          <div className="xt-proj">
            <span className="xt-proj-n">[{l.n}]</span>
            <div><b>{l.t}</b><p>{l.d}</p></div>
          </div>
        )
      case 'kv': return <div className="xt-line"><b className="xt-key">{l.a.padEnd(12, ' ')}</b>{l.b}</div>
      case 'table':
        return (
          <div className="xt-table">
            {l.rows.map((r, i) => (
              <div key={i} className={i === 0 ? 'xt-th' : ''}>
                {r.map((c, j) => <span key={j} className={c === 'Running' || c === 'Ready' ? 'xt-ok' : c.includes('Crash') ? 'xt-hot' : ''}>{c}</span>)}
              </div>
            ))}
          </div>
        )
      case 'link':
        return <div className="xt-line"><a href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">↗ {l.t}</a></div>
      case 'agent':
        return (
          <div className="xt-agent">
            <span className="xt-agent-tag">agent ›</span>
            <span>{plain(l.t)}{l.pending && <span className="xt-cursor" />}</span>
          </div>
        )
      default:
        return <div className={`xt-line xt-${l.k}`}>{l.t}</div>
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="xt-overlay"
          onMouseDown={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Motion.section
            className={`xt-window ${max ? 'is-max' : ''}`}
            role="dialog" aria-modal="true" aria-label="Portfolio terminal"
            onMouseDown={e => e.stopPropagation()}
            initial={{ opacity: 0, scaleY: 0.02, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleY: 0.02, scaleX: 0.8, transition: { duration: 0.22 } }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="xt-head">
              <div className="xt-dots">
                <button type="button" className="xt-dot r" onClick={onClose} aria-label="Close terminal" />
                <button type="button" className="xt-dot y" onClick={onClose} aria-label="Minimise terminal" />
                <button type="button" className="xt-dot g" onClick={() => setMax(m => !m)} aria-label="Toggle full screen" />
              </div>
              <span className="xt-title">daksh@portfolio: ~ — zsh — {max ? 'fullscreen' : '120×32'}</span>
              <button type="button" className="xt-icon" onClick={() => setMax(m => !m)} aria-label="Toggle full screen">
                {max ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button type="button" className="xt-icon" onClick={onClose} aria-label="Close terminal"><X size={15} /></button>
            </header>

            <div className="xt-screen" onClick={() => inputRef.current?.focus()}>
              <div className="xt-scroll" ref={scrollRef}>
                {lines.map(l => <div key={l.id}>{renderLine(l)}</div>)}
                <form className="xt-prompt" onSubmit={submit}>
                  <span className="xt-ps1"><b>daksh</b><i>@portfolio</i> <em>~</em> <span>❯</span></span>
                  <div className="xt-input-wrap">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => { setInput(e.target.value); setHistIdx(-1) }}
                      onKeyDown={onKeyDown}
                      aria-label="Terminal input"
                      autoComplete="off" autoCapitalize="off" spellCheck="false"
                      disabled={busy && !lines.some(l => l.pending)}
                    />
                    <span className="xt-ghost" aria-hidden="true"><span>{input}</span>{ghost}</span>
                  </div>
                </form>
              </div>
              <div className="xt-crt" aria-hidden="true" />
            </div>

            <div className="xt-chips">
              {CHIPS.map(c => (
                <button type="button" key={c} onClick={() => { if (!busy) run(c) }}>{c}</button>
              ))}
            </div>

            <footer className="xt-status">
              <span className="xt-seg xt-seg-mode">ZSH</span>
              <span className="xt-seg">⎇ main</span>
              <span className="xt-seg">⎈ prod-ap-south-1</span>
              <span className="xt-seg xt-seg-ok">● open to work</span>
              <span className="xt-seg xt-spacer">tab complete · ↑↓ history · ^L clear · esc</span>
            </footer>
          </Motion.section>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default SreTerminal
