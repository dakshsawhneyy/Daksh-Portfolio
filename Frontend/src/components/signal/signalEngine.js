/* ══════════════════════════════════════════════════════════════════
   SIGNAL ENGINE — live p99-latency oscilloscope with incident replay.
   The signal scrolls right→left. Injecting an incident bends the
   curve; the feedback loop then annotates the graph in place:
     ▲ ALERT (observe) → ◆ RCA (investigate) → ● FIX (recover) → ✓ OK
   Annotations scroll away with the data, like Grafana annotations.
   ══════════════════════════════════════════════════════════════════ */

export const SCENARIOS = {
  deploy: { label: 'Bad deploy', cause: 'v2.4.1 added an N+1 query on /checkout', action: 'canary auto-rollback → v2.4.0', peak: 430 },
  leak: { label: 'Memory leak', cause: 'worker heap +40MB/min → GC thrashing', action: 'rolling restart + memory limit raised', peak: 380 },
  dns: { label: 'DNS failure', cause: 'CoreDNS ConfigMap typo → NXDOMAIN storm', action: 'ConfigMap reverted via GitOps', peak: 520 },
  spike: { label: 'Traffic spike', cause: 'HPA CPU target too high for the burst', action: 'scaled 6 → 14 pods, HPA retuned', peak: 360 },
}

const SLO = 250
const WINDOW = 16000          // ms of history across the width
const MAX_V = 700
const CORAL = '232,103,74'
const GREEN = '114,223,172'
const GOLD = '240,188,98'
const BLUE = '101,207,229'
const PAPER = '243,241,235'

export function createSignal(canvas, { reduced, onPhase, onStats }) {
  const c = canvas.getContext('2d')
  let W = 0, H = 0, dpr = 1
  let PAD_L = 46, PAD_R = 14, PAD_T = 30, PAD_B = 26
  let compact = false          // narrow screens: short labels, sparser axes
  const samples = []           // { t, v }
  const notes = []             // { t, kind, text }
  let incident = null          // { key, t0, phase, alertAt, rcaAt, fixAt }
  let v = 120
  let raf = 0, running = false, last = 0
  let now = 0
  let mouse = null
  let budget = 100
  let incidents = 0
  let mttrs = []
  let jitterBoost = 0
  let sampleAcc = 0

  const y = (val) => PAD_T + (1 - Math.min(val, MAX_V) / MAX_V) * (H - PAD_T - PAD_B)
  const x = (t) => (W - PAD_R) - ((now - t) / WINDOW) * (W - PAD_R - PAD_L)

  const resize = () => {
    const r = canvas.getBoundingClientRect()
    W = r.width; H = r.height
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    compact = W < 560
    PAD_L = compact ? 34 : 46
    PAD_R = compact ? 16 : 14
    PAD_T = compact ? 96 : 30   // compact: annotation lanes get their own band above the plot
    if (!running) draw()
  }

  const baseline = (t) => 112 + Math.sin(t / 1900) * 12 + Math.sin(t / 530) * 5 + (Math.random() - 0.5) * (8 + jitterBoost)

  const step = (dt) => {
    now += dt
    jitterBoost *= 0.96
    let target = baseline(now)
    if (incident) {
      const s = SCENARIOS[incident.key]
      const e = now - incident.t0
      if (incident.phase === 'observe' || incident.phase === 'investigate') {
        let shape
        if (incident.key === 'deploy') shape = Math.min(1, e / 500)
        else if (incident.key === 'leak') shape = Math.min(1, e / 2600)
        else if (incident.key === 'dns') shape = Math.min(1, e / 400) * (0.7 + Math.random() * 0.5)
        else shape = Math.min(1, e / 900) * (0.85 + 0.15 * Math.sin(e / 90))
        target += (s.peak - 112) * shape
      } else if (incident.phase === 'recover') {
        const k = now - incident.fixAt < 900 ? 1 : Math.exp(-(now - incident.fixAt - 900) / 700)
        target += (s.peak - 112) * k
      }
      // phase machine
      if (incident.phase === 'observe' && !incident.alertAt && v > SLO) {
        incident.alertAt = now + 650
      }
      if (incident.phase === 'observe' && incident.alertAt && now >= incident.alertAt) {
        incident.phase = 'investigate'
        notes.push({ t: now, kind: 'alert', text: `▲ ALERT  p99 ${Math.round(v)}ms`, short: `▲ ALERT ${Math.round(v)}ms` })
        onPhase?.('investigate', { scenario: incident.key, detail: `p99 ${Math.round(v)}ms > SLO ${SLO}ms · alert in ${((incident.alertAt - incident.t0) / 1000).toFixed(1)}s` })
        incident.rcaAt = now + 2300
      }
      if (incident.phase === 'investigate' && now >= incident.rcaAt) {
        incident.phase = 'recover'
        incident.fixAt = now
        notes.push({ t: now, kind: 'rca', text: `◆ RCA  ${s.cause}`, short: '◆ RCA' })
        onPhase?.('recover', { scenario: incident.key, detail: s.action })
      }
      if (incident.phase === 'recover' && !incident.fixNoted && now - incident.fixAt > 800) {
        incident.fixNoted = true
        notes.push({ t: now, kind: 'fix', text: `● FIX  ${s.action}`, short: '● FIX' })
      }
      if (incident.phase === 'recover' && incident.fixNoted && v < SLO - 40 && now - incident.fixAt > 1600) {
        const mttr = (now - incident.t0) / 1000
        mttrs.push(mttr)
        notes.push({ t: now, kind: 'ok', text: `✓ RECOVERED  MTTR ${mttr.toFixed(1)}s`, short: `✓ OK ${mttr.toFixed(1)}s` })
        onPhase?.('healthy', { scenario: incident.key, detail: `${s.action} · MTTR ${mttr.toFixed(1)}s`, mttr })
        incident = null
      }
    }
    v += (target - v) * 0.14
    sampleAcc += dt
    if (sampleAcc >= 32 || !samples.length) { sampleAcc = 0; samples.push({ t: now, v }) }
    else samples[samples.length - 1] = { t: now, v }   // newest point tracks the live value
    while (samples.length && samples[0].t < now - WINDOW - 400) samples.shift()
    while (notes.length && notes[0].t < now - WINDOW) notes.shift()

    if (v > SLO) budget = Math.max(0, budget - dt * 0.0011)
    else budget = Math.min(100, budget + dt * 0.00006)
  }

  function draw() {
    if (!W) return
    c.clearRect(0, 0, W, H)

    // grid
    c.font = `600 ${compact ? 9 : 10}px ui-monospace, SFMono-Regular, Menlo, monospace`
    c.textBaseline = 'middle'
    for (const val of compact ? [0, 200, 400, 600] : [0, 100, 200, 300, 400, 500, 600]) {
      const yy = y(val)
      c.strokeStyle = `rgba(${PAPER},0.06)`
      c.lineWidth = 1
      c.beginPath(); c.moveTo(PAD_L, yy); c.lineTo(W - PAD_R, yy); c.stroke()
      c.fillStyle = `rgba(${PAPER},0.32)`
      c.fillText(`${val}`, compact ? 4 : 8, yy)
    }
    for (let s = 0; s <= WINDOW; s += compact ? 4000 : 2000) {
      const xx = (W - PAD_R) - (s / WINDOW) * (W - PAD_R - PAD_L)
      c.strokeStyle = `rgba(${PAPER},0.04)`
      c.beginPath(); c.moveTo(xx, PAD_T); c.lineTo(xx, H - PAD_B); c.stroke()
      if (s) { c.fillStyle = `rgba(${PAPER},0.25)`; c.fillText(`-${s / 1000}s`, xx - 12, H - 10) }
    }

    // SLO threshold
    const sy = y(SLO)
    c.setLineDash([6, 6])
    c.strokeStyle = `rgba(${GOLD},0.65)`
    c.beginPath(); c.moveTo(PAD_L, sy); c.lineTo(W - PAD_R, sy); c.stroke()
    c.setLineDash([])
    c.fillStyle = `rgba(${GOLD},0.9)`
    c.fillText(compact ? 'SLO 250ms' : 'SLO  p99 < 250ms', PAD_L + 6, sy - 10)

    if (samples.length > 1) {
      // area
      const grad = c.createLinearGradient(0, PAD_T, 0, H - PAD_B)
      const hot = v > SLO
      grad.addColorStop(0, `rgba(${hot ? CORAL : GREEN},0.28)`)
      grad.addColorStop(1, `rgba(${hot ? CORAL : GREEN},0)`)
      c.beginPath()
      c.moveTo(x(samples[0].t), H - PAD_B)
      for (const s of samples) c.lineTo(x(s.t), y(s.v))
      c.lineTo(x(samples[samples.length - 1].t), H - PAD_B)
      c.closePath()
      c.fillStyle = grad
      c.fill()

      // line: two batched paths (healthy / breached) + a wide faint stroke as glow.
      // (per-segment shadowBlur cost ~30ms/frame — never reintroduce it)
      const okPath = new Path2D(), hotPath = new Path2D()
      for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1], b = samples[i]
        const path = b.v > SLO ? hotPath : okPath
        path.moveTo(x(a.t), y(a.v)); path.lineTo(x(b.t), y(b.v))
      }
      c.lineJoin = 'round'
      c.lineCap = 'round'
      for (const [path, col] of [[okPath, GREEN], [hotPath, CORAL]]) {
        c.strokeStyle = `rgba(${col},0.16)`; c.lineWidth = 7; c.stroke(path)
        c.strokeStyle = `rgba(${col},1)`; c.lineWidth = 2; c.stroke(path)
      }

      // head
      const hx = x(now), hy = y(v)
      const col = v > SLO ? CORAL : GREEN
      const ping = (now % 1200) / 1200
      c.strokeStyle = `rgba(${col},${1 - ping})`
      c.lineWidth = 1.5
      c.beginPath(); c.arc(hx - 2, hy, 4 + ping * 14, 0, Math.PI * 2); c.stroke()
      c.fillStyle = '#fff'
      c.beginPath(); c.arc(hx - 2, hy, 3.5, 0, Math.PI * 2); c.fill()
    }

    // annotations
    const colors = { alert: CORAL, rca: GOLD, fix: BLUE, ok: GREEN }
    const LANE = { alert: 0, rca: 1, fix: 2, ok: 3 }
    notes.forEach((n) => {
      const nx = x(n.t)
      if (nx < PAD_L) return
      const col = colors[n.kind]
      c.strokeStyle = `rgba(${col},0.75)`
      c.setLineDash([2, 3])
      c.beginPath(); c.moveTo(nx, compact ? 14 + LANE[n.kind] * 20 : PAD_T - 4); c.lineTo(nx, H - PAD_B); c.stroke()
      c.setLineDash([])
      const label = compact ? n.short : n.text
      c.font = `700 ${compact ? 9.5 : 10.5}px ui-monospace, SFMono-Regular, Menlo, monospace`
      const tw = c.measureText(label).width
      const ly = compact ? 14 + LANE[n.kind] * 20 : PAD_T + 4 + LANE[n.kind] * 22
      const lx = Math.max(PAD_L, Math.min(nx + 6, W - tw - 14))
      c.fillStyle = 'rgba(12,14,12,0.9)'
      c.fillRect(lx, ly - 9, tw + 12, 18)
      c.strokeStyle = `rgba(${col},0.7)`
      c.strokeRect(lx + 0.5, ly - 8.5, tw + 11, 17)
      c.fillStyle = `rgba(${col},1)`
      c.fillText(label, lx + 6, ly)
    })

    // crosshair
    if (mouse && mouse.x > PAD_L && samples.length) {
      const t = now - ((W - PAD_R - mouse.x) / (W - PAD_R - PAD_L)) * WINDOW
      let s = samples[0]
      for (const p of samples) { if (p.t > t) break; s = p }
      const cx = x(s.t), cy = y(s.v)
      c.strokeStyle = `rgba(${PAPER},0.35)`
      c.beginPath(); c.moveTo(cx, PAD_T); c.lineTo(cx, H - PAD_B); c.stroke()
      c.fillStyle = s.v > SLO ? `rgb(${CORAL})` : `rgb(${GREEN})`
      c.beginPath(); c.arc(cx, cy, 4, 0, Math.PI * 2); c.fill()
      const label = `${((now - s.t) / 1000).toFixed(1)}s ago · ${Math.round(s.v)}ms`
      c.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace'
      const tw = c.measureText(label).width
      const lx = Math.max(4, Math.min(cx + 10, W - tw - 20))
      c.fillStyle = 'rgba(243,241,235,0.95)'
      c.fillRect(lx, cy - 26, tw + 14, 20)
      c.fillStyle = '#10110f'
      c.fillText(label, lx + 7, cy - 16)
    }

    onStats?.({
      v: Math.round(v),
      budget,
      incidents,
      mttr: mttrs.length ? mttrs.reduce((a, b) => a + b, 0) / mttrs.length : null,
      breached: v > SLO,
    })
  }

  const loop = (t) => {
    const dt = Math.min(t - (last || t), 48)
    last = t
    step(dt)
    draw()
    raf = requestAnimationFrame(loop)
  }

  // prefill so the graph isn't empty on first view
  for (let i = 0; i < WINDOW / 16; i++) step(16)

  return {
    resize,
    start() { if (running || reduced) { draw(); return } running = true; last = 0; raf = requestAnimationFrame(loop) },
    stop() { running = false; cancelAnimationFrame(raf) },
    destroy() { running = false; cancelAnimationFrame(raf) },
    inject(key) {
      if (incident) return false
      const k = key || Object.keys(SCENARIOS)[Math.floor(Math.random() * 4)]
      incident = { key: k, t0: now, phase: 'observe', alertAt: 0 }
      incidents++
      onPhase?.('observe', { scenario: k, detail: `${SCENARIOS[k].label} injected · watching p99…` })
      if (reduced) { for (let i = 0; i < 400 && incident; i++) step(16); draw() }
      return true
    },
    busy: () => !!incident,
    setMouse(m) { mouse = m; if (!running) draw() },
    load(px) { jitterBoost = Math.min(60, jitterBoost + Math.abs(px) * 0.4) },
  }
}
