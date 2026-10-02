/* ══════════════════════════════════════════════════════════════════
   GALAXY ENGINE — tiny force simulation for the skill constellation.
   Nodes are DOM elements (crisp text); edges are drawn on a canvas.
   Forces: pairwise repulsion + collision, edge springs, centre
   gravity, cursor field. Dragged nodes are pinned and can be flung.
   ══════════════════════════════════════════════════════════════════ */

const CORAL = '232,103,74'
const INK = '16,17,15'

export function createGalaxy({ canvas, nodes, edges, reduced }) {
  const c = canvas.getContext('2d')
  let W = 0, H = 0, dpr = 1
  let raf = 0, running = false, last = 0, time = 0
  let heat = 1
  let mouse = null
  let grabbed = -1
  let grabOffset = [0, 0]
  let lastGrab = [0, 0, 0]
  let focus = null           // Set of node indices to highlight, or null
  let focusCenter = false

  const adj = nodes.map(() => new Set())
  for (const [a, b] of edges) { adj[a].add(b); adj[b].add(a) }

  const resize = () => {
    const r = canvas.getBoundingClientRect()
    const firstLayout = !W
    W = r.width; H = r.height
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    if (firstLayout) {
      // projects on a ring, tools scattered near the centre
      const projects = nodes.filter(n => n.kind === 'project')
      projects.forEach((n, i) => {
        n.angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2
        n.x = W / 2 + Math.cos(n.angle) * W * 0.36
        n.y = H / 2 + Math.sin(n.angle) * H * 0.36
      })
      nodes.forEach(n => {
        if (n.kind !== 'project') {
          n.x = W / 2 + (Math.random() - 0.5) * W * 0.5
          n.y = H / 2 + (Math.random() - 0.5) * H * 0.5
        }
        n.vx = 0; n.vy = 0
      })
      if (reduced) for (let i = 0; i < 400; i++) step(16)
    }
    // project anchors on an ellipse (recomputed on every resize)
    nodes.forEach(n => {
      if (n.kind === 'project') {
        n.ax = W / 2 + Math.cos(n.angle) * (W / 2 - n.w / 2 - 28)
        n.ay = H / 2 + Math.sin(n.angle) * (H / 2 - n.h / 2 - 34)
      }
    })
    if (!running) render()
  }

  function step(dt) {
    const k = Math.min(dt / 16, 2)
    const n = nodes.length
    const cx = W / 2, cy = H / 2
    const strength = Math.max(heat, 0.08)

    for (let i = 0; i < n; i++) {
      const a = nodes[i]
      for (let j = i + 1; j < n; j++) {
        const b = nodes[j]
        let dx = b.x - a.x, dy = b.y - a.y
        let d2 = dx * dx + dy * dy
        if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1 }
        const d = Math.sqrt(d2)
        const minD = a.r + b.r + 8
        let f = (a.kind === 'project' && b.kind === 'project' ? 9000 : 1500) / d2
        if (d < minD) f += (minD - d) * 0.35
        const fx = (dx / d) * f * strength, fy = (dy / d) * f * strength
        a.vx -= fx / a.m; a.vy -= fy / a.m
        b.vx += fx / b.m; b.vy += fy / b.m
      }
    }
    for (const [ia, ib] of edges) {
      const a = nodes[ia], b = nodes[ib]
      const dx = b.x - a.x, dy = b.y - a.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const rest = 40 + a.r + b.r
      const f = (d - rest) * 0.004 * strength
      const fx = (dx / d) * f, fy = (dy / d) * f
      a.vx += fx / a.m; a.vy += fy / a.m
      b.vx -= fx / b.m; b.vy -= fy / b.m
    }
    for (let i = 0; i < n; i++) {
      const a = nodes[i]
      if (i === grabbed) continue
      if (a.kind === 'project') {
        // hubs hold their place on the ring, shared tools settle between them
        a.vx += (a.ax - a.x) * 0.012
        a.vy += (a.ay - a.y) * 0.012
      } else {
        const pull = focus && focusCenter && focus.has(i) ? 0.01 : 0.0012
        a.vx += (cx - a.x) * pull * strength
        a.vy += (cy - a.y) * pull * strength * 1.3
      }
      if (mouse && grabbed < 0) {
        const dx = a.x - mouse.x, dy = a.y - mouse.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 110 && d > 1) { const f = (1 - d / 110) * 1.6; a.vx += (dx / d) * f; a.vy += (dy / d) * f }
      }
      // gentle idle drift keeps it alive
      if (!reduced) { a.vx += Math.sin(time * 0.0007 + i * 1.7) * 0.02; a.vy += Math.cos(time * 0.0006 + i) * 0.02 }
      a.vx *= 0.84; a.vy *= 0.84
      a.x += a.vx * k; a.y += a.vy * k
      const padX = a.w / 2 + 8, padY = a.h / 2 + 8
      if (a.x < padX) { a.x = padX; a.vx *= -0.5 }
      if (a.x > W - padX) { a.x = W - padX; a.vx *= -0.5 }
      if (a.y < padY) { a.y = padY; a.vy *= -0.5 }
      if (a.y > H - padY) { a.y = H - padY; a.vy *= -0.5 }
    }
    heat = Math.max(0.06, heat * 0.995)
  }

  function render() {
    c.clearRect(0, 0, W, H)
    const lit = focus
    for (const [ia, ib] of edges) {
      const a = nodes[ia], b = nodes[ib]
      const on = lit && lit.has(ia) && lit.has(ib)
      c.strokeStyle = on ? `rgba(${CORAL},0.75)` : `rgba(${INK},${lit ? 0.04 : 0.11})`
      c.lineWidth = on ? 1.6 : 1
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke()
      if (on && !reduced) {
        // packets flowing from project → tool
        const [p, q] = a.kind === 'project' ? [a, b] : [b, a]
        const t = ((time * 0.0006 + ia * 0.13 + ib * 0.07) % 1)
        c.fillStyle = `rgba(${CORAL},0.95)`
        c.beginPath(); c.arc(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t, 2.4, 0, Math.PI * 2); c.fill()
      }
    }
    // only touch the DOM for nodes that actually moved (settled graph = no style work)
    for (const nd of nodes) {
      if (!nd.el) continue
      if (nd.px !== undefined && Math.abs(nd.x - nd.px) < 0.15 && Math.abs(nd.y - nd.py) < 0.15) continue
      nd.px = nd.x; nd.py = nd.y
      nd.el.style.transform = `translate3d(${(nd.x - nd.w / 2).toFixed(1)}px, ${(nd.y - nd.h / 2).toFixed(1)}px, 0)`
    }
  }

  const loop = (t) => {
    const dt = Math.min(t - (last || t), 40)
    last = t
    time += dt
    step(dt)
    render()
    raf = requestAnimationFrame(loop)
  }

  return {
    resize,
    adj,
    start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop) },
    stop() { running = false; cancelAnimationFrame(raf) },
    destroy() { running = false; cancelAnimationFrame(raf) },
    reheat(v = 0.6) { heat = Math.max(heat, v) },
    setMouse(m) { mouse = m },
    setFocus(set, center = false) { focus = set; focusCenter = center; heat = Math.max(heat, center ? 0.5 : heat); if (!running) render() },
    grab(i, x, y) { grabbed = i; grabOffset = [nodes[i].x - x, nodes[i].y - y]; lastGrab = [x, y, performance.now()]; heat = Math.max(heat, 0.5) },
    drag(x, y) {
      if (grabbed < 0) return
      const n = nodes[grabbed]
      const now = performance.now()
      const dtm = Math.max(16, now - lastGrab[2])
      n.vx = ((x - lastGrab[0]) / dtm) * 16
      n.vy = ((y - lastGrab[1]) / dtm) * 16
      n.x = x + grabOffset[0]; n.y = y + grabOffset[1]
      lastGrab = [x, y, now]
      if (!running) render()
    },
    release() { grabbed = -1 },
  }
}
