/* ══════════════════════════════════════════════════════════════════
   MESH FIELD — canvas engine behind the signature footer.

   A perspective "infrastructure plane": a grid receding to a horizon,
   with service nodes sitting on its intersections. While the footer
   is approached, nodes are scattered in 3D (drift); scroll progress
   reconciles them onto the lattice (desired state).

   Inputs (mutated by the React component, read every frame):
     state.target   0..1 scroll progress
     state.mouse    { x, y, active } in canvas CSS px
     state.vel      scroll velocity (px/frame, decays here)
   Outputs:
     onFrame(p)     eased progress, used to drive typography
   ══════════════════════════════════════════════════════════════════ */

const SERVICE_NAMES = [
  'api-gateway', 'payments', 'auth', 'kafka-0', 'redis', 'etcd', 'ingress-nginx',
  'prometheus', 'grafana', 'argocd', 'coredns', 'worker', 'scheduler', 'vault',
  'postgres-0', 'otel-collector', 'loki', 'karpenter', 'istiod', 'cert-manager',
]

const PAPER = '243,241,235'
const CORAL = '232,103,74'
const GREEN = '114,223,172'
const GOLD = '240,188,98'
const BG = '#0c0e0c'

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))
// tiny deterministic PRNG so the layout is stable between renders
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

export function createMeshField(canvas, { state, onFrame, reduced, mobile }) {
  const c = canvas.getContext('2d', { alpha: false })
  const rand = rng(1337)

  const S = 60                                 // lattice spacing (world units)
  const ROWS = mobile ? 18 : 26
  const COLS = mobile ? 26 : 50
  const Z_NEAR = 40
  const DEPTH = ROWS * S
  const NODE_RATE = mobile ? 0.13 : 0.12

  let W = 0, H = 0, dpr = 1, f = 1, hy = 0
  let raf = 0
  let running = false
  let p = reduced ? 1 : 0
  let travel = 0
  let last = 0
  let time = 0
  let camX = 0, camH = 130

  /* ── nodes on the lattice ── */
  const nodes = []
  for (let r = 0; r < ROWS; r++) {
    for (let col = 0; col < COLS; col++) {
      if (rand() > NODE_RATE) continue
      const roll = rand()
      nodes.push({
        col, row: r,
        x: (col - COLS / 2) * S,
        // drift vector — where this node "wants" to be when unreconciled
        dx: (rand() - 0.5) * 900,
        dy: 40 + rand() * 420,
        dz: (rand() - 0.5) * 500,
        phase: rand() * Math.PI * 2,
        kind: roll < 0.08 ? 'ingress' : roll < 0.22 ? 'healthy' : roll < 0.28 ? 'warn' : 'svc',
        name: `${SERVICE_NAMES[Math.floor(rand() * SERVICE_NAMES.length)]}-${Math.floor(rand() * 0xffff).toString(16).padStart(4, '0')}`,
        lift: 0, flash: 0,
        sx: 0, sy: 0, z: 0, a: 0,
      })
    }
  }
  // lattice neighbours: closest nodes within 2 rows / 4 cols
  for (const n of nodes) {
    n.links = nodes
      .filter(m => m !== n && m.row >= n.row && Math.abs(m.row - n.row) <= 2 && Math.abs(m.col - n.col) <= 4)
      .sort((a, b) => (Math.abs(a.col - n.col) + Math.abs(a.row - n.row)) - (Math.abs(b.col - n.col) + Math.abs(b.row - n.row)))
      .slice(0, 2)
  }

  /* ── packets: data streaming along lattice lines toward the viewer ── */
  const packets = Array.from({ length: mobile ? 14 : 34 }, () => ({
    col: Math.floor(rand() * COLS),
    z: Z_NEAR + rand() * DEPTH,
    speed: 140 + rand() * 260,
    color: rand() < 0.65 ? CORAL : rand() < 0.5 ? GREEN : GOLD,
  }))

  const ripples = []

  /* ── projection ── */
  const proj = (x, y, z) => {
    const k = f / z
    return [W / 2 + (x - camX) * k, hy + (camH - y) * k]
  }
  const fog = z => clamp((Z_NEAR + DEPTH - z) / (DEPTH * 0.55)) * clamp((z - Z_NEAR) / (S * 1.5))

  // screen → plane (y=0)
  const unproject = (sx, sy) => {
    if (sy <= hy + 2) return null
    const z = (camH * f) / (sy - hy)
    return { x: camX + ((sx - W / 2) * z) / f, z }
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    W = rect.width; H = rect.height
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75)
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    hy = H * (mobile ? 0.5 : 0.46)
    f = Math.max(H * 0.95, W * 0.55)
    if (!running) draw(0)
  }

  const worldCircle = (x, z, r, steps = 40) => {
    c.beginPath()
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2
      const zz = z + Math.sin(a) * r
      if (zz < Z_NEAR * 0.6) continue
      const [sx, sy] = proj(x + Math.cos(a) * r, 0, zz)
      i === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy)
    }
  }

  function draw(dt) {
    time += dt
    const d = Math.pow(1 - p, 1.4)                 // drift amount
    const vel = Math.abs(state.vel)
    state.vel *= 0.9

    // camera parallax from the cursor (or a slow wander on touch)
    let tx = 0, th = 130
    if (state.mouse.active) {
      tx = (state.mouse.x / W - 0.5) * 160
      th = 130 - (state.mouse.y / H - 0.5) * 40
    } else if (!reduced) {
      tx = Math.sin(time * 0.00018) * 60
    }
    camX += (tx - camX) * 0.05
    camH += (th - camH) * 0.05

    if (!reduced) travel = (travel + dt * (0.016 + Math.min(vel, 60) * 0.0025) * (0.4 + p)) % DEPTH

    /* background */
    c.fillStyle = BG
    c.fillRect(0, 0, W, H)

    // horizon glow — brightens as the system converges
    const g = c.createRadialGradient(W / 2, hy, 0, W / 2, hy, Math.max(W, H) * 0.6)
    g.addColorStop(0, `rgba(${CORAL},${0.05 + 0.13 * p})`)
    g.addColorStop(0.45, `rgba(${CORAL},${0.02 + 0.03 * p})`)
    g.addColorStop(1, 'rgba(12,14,12,0)')
    c.fillStyle = g
    c.fillRect(0, 0, W, H)

    /* lattice */
    const gridA = 0.035 + 0.075 * p
    c.lineWidth = 1
    c.strokeStyle = `rgba(${PAPER},${gridA})`
    c.beginPath()
    const xMax = (COLS / 2) * S
    for (let col = 0; col <= COLS; col++) {
      const x = (col - COLS / 2) * S
      const [x1, y1] = proj(x, 0, Z_NEAR)
      const [x2, y2] = proj(x, 0, Z_NEAR + DEPTH)
      c.moveTo(x1, y1); c.lineTo(x2, y2)
    }
    for (let r = 0; r < ROWS; r++) {
      const z = Z_NEAR + ((r * S - travel + DEPTH) % DEPTH)
      const [x1, y1] = proj(-xMax, 0, z)
      const [x2, y2] = proj(xMax, 0, z)
      c.moveTo(x1, y1); c.lineTo(x2, y2)
    }
    c.stroke()

    // distance fog over the lattice (paints the horizon back to bg)
    const fg = c.createLinearGradient(0, hy - 2, 0, hy + H * 0.22)
    fg.addColorStop(0, 'rgba(12,14,12,1)')
    fg.addColorStop(1, 'rgba(12,14,12,0)')
    c.fillStyle = fg
    c.fillRect(0, hy - 2, W, H * 0.22 + 2)

    /* probe (cursor on the plane) */
    const probe = state.mouse.active ? unproject(state.mouse.x, state.mouse.y) : null
    const PR = 150

    /* ripples */
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i]
      rp.r += dt * 0.9
      if (rp.r > 1600) ripples.splice(i, 1)
    }

    /* nodes: position */
    let nearest = null, nearestD = Infinity
    for (const n of nodes) {
      const baseZ = Z_NEAR + ((n.row * S - travel + DEPTH) % DEPTH)
      const wob = (d * 18 + Math.min(vel, 40) * 0.6) * Math.sin(time * 0.0016 + n.phase)
      const x = n.x + n.dx * d + wob
      const z = baseZ + n.dz * d
      let targetLift = 0
      if (probe) {
        const dist = Math.hypot(x - probe.x, z - probe.z)
        if (dist < PR) {
          targetLift = Math.pow(1 - dist / PR, 2) * 70
          if (dist < nearestD) { nearestD = dist; nearest = n }
        }
      }
      for (const rp of ripples) {
        const dist = Math.hypot(x - rp.x, z - rp.z)
        if (Math.abs(dist - rp.r) < 45) { n.flash = 1; targetLift = Math.max(targetLift, 36) }
      }
      n.lift += (targetLift - n.lift) * 0.12
      n.flash *= 0.95
      const y = n.dy * d + n.lift + wob * 0.4
      const [sx, sy] = proj(x, y, Math.max(z, Z_NEAR * 0.5))
      n.sx = sx; n.sy = sy; n.z = z; n.wx = x
      n.a = fog(z) * (0.35 + 0.65 * (1 - d * 0.6))
    }

    /* edges between lattice neighbours — only exist once reconciled */
    if (p > 0.15) {
      c.lineWidth = 1
      for (const n of nodes) {
        for (const m of n.links) {
          if (Math.abs(m.z - n.z) > S * 3) continue // wrap seam
          const a = Math.min(n.a, m.a) * (p - 0.15) * 0.42
          if (a < 0.01) continue
          const hot = n.flash > 0.2 || m.flash > 0.2
          c.strokeStyle = hot ? `rgba(${CORAL},${a * 2})` : `rgba(${PAPER},${a})`
          c.beginPath(); c.moveTo(n.sx, n.sy); c.lineTo(m.sx, m.sy); c.stroke()
        }
      }
    }

    /* packets */
    if (!reduced) {
      for (const pk of packets) {
        pk.z -= dt * pk.speed * 0.001 * (0.6 + p)
        if (pk.z < Z_NEAR) { pk.z = Z_NEAR + DEPTH; pk.col = Math.floor(Math.random() * COLS) }
        const x = (pk.col - COLS / 2) * S
        const a = fog(pk.z) * (0.25 + 0.75 * p)
        if (a < 0.02) continue
        const [x1, y1] = proj(x, 0, pk.z)
        const [x2, y2] = proj(x, 0, pk.z + 70)
        const grad = c.createLinearGradient(x1, y1, x2, y2)
        grad.addColorStop(0, `rgba(${pk.color},${a})`)
        grad.addColorStop(1, `rgba(${pk.color},0)`)
        c.strokeStyle = grad
        c.lineWidth = clamp(f / pk.z * 2.2, 0.8, 2.6)
        c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke()
      }
    }

    /* ingress beams — light pillars rising from edge services once healthy */
    if (p > 0.6) {
      const beamA = (p - 0.6) / 0.4
      for (const n of nodes) {
        if (n.kind !== 'ingress' || n.a < 0.15) continue
        const top = n.sy - (f / n.z) * 260
        const bg = c.createLinearGradient(0, n.sy, 0, top)
        bg.addColorStop(0, `rgba(${CORAL},${0.32 * beamA * n.a})`)
        bg.addColorStop(1, `rgba(${CORAL},0)`)
        c.fillStyle = bg
        const w = clamp(f / n.z * 3, 1, 4)
        c.fillRect(n.sx - w / 2, top, w, n.sy - top)
      }
    }

    /* nodes: draw */
    for (const n of nodes) {
      if (n.a < 0.02) continue
      const size = clamp((f / n.z) * 3.2, 0.8, 5.5) * (1 + n.lift / 90)
      let col = PAPER
      if (n.kind === 'ingress') col = CORAL
      else if (n.kind === 'healthy') col = GREEN
      else if (n.kind === 'warn') col = d > 0.35 ? GOLD : GREEN   // warnings clear as the system heals
      const a = Math.min(1, n.a + n.flash * 0.6 + n.lift / 80)
      if (n.flash > 0.05 || n.lift > 8) {
        c.fillStyle = `rgba(${CORAL},${0.18 * a})`
        c.beginPath(); c.arc(n.sx, n.sy, size * 3.2, 0, Math.PI * 2); c.fill()
        col = n.flash > 0.3 ? CORAL : col
      }
      c.fillStyle = `rgba(${col},${a})`
      if (n.kind === 'svc') {
        c.fillRect(n.sx - size / 2, n.sy - size / 2, size, size)
      } else {
        c.beginPath(); c.arc(n.sx, n.sy, size * 0.62, 0, Math.PI * 2); c.fill()
      }
    }

    /* ripple rings */
    for (const rp of ripples) {
      const a = clamp(1 - rp.r / 1600) * 0.55
      c.strokeStyle = `rgba(${CORAL},${a})`
      c.lineWidth = 1.2
      worldCircle(rp.x, rp.z, rp.r, 64)
      c.stroke()
    }

    /* probe ring + connections + label */
    if (probe && probe.z < Z_NEAR + DEPTH * 0.8) {
      c.strokeStyle = `rgba(${PAPER},0.35)`
      c.setLineDash([3, 5])
      c.lineWidth = 1
      worldCircle(probe.x, probe.z, PR)
      c.stroke()
      c.setLineDash([])
      const [px, py] = proj(probe.x, 0, probe.z)
      let links = 0
      for (const n of nodes) {
        if (links > 5 || n.lift < 6) continue
        links++
        c.strokeStyle = `rgba(${CORAL},${0.15 + n.lift / 140})`
        c.beginPath(); c.moveTo(px, py); c.lineTo(n.sx, n.sy); c.stroke()
      }
      c.fillStyle = `rgba(${CORAL},0.9)`
      c.beginPath(); c.arc(px, py, 2.5, 0, Math.PI * 2); c.fill()
      if (nearest && nearest.a > 0.2) {
        const ms = (4 + (nearest.phase * 7) % 18 + Math.sin(time * 0.004) * 1.5).toFixed(1)
        const label = `${nearest.name}  ·  ${ms}ms  ·  200 OK`
        c.font = '600 10.5px ui-monospace, SFMono-Regular, Menlo, monospace'
        const tw = c.measureText(label).width
        const lx = clamp(nearest.sx + 14, 8, W - tw - 24)
        const ly = nearest.sy - 22
        c.fillStyle = 'rgba(12,14,12,0.85)'
        c.strokeStyle = `rgba(${CORAL},0.5)`
        c.beginPath()
        if (c.roundRect) c.roundRect(lx - 8, ly - 13, tw + 16, 20, 4)
        else c.rect(lx - 8, ly - 13, tw + 16, 20)
        c.fill(); c.stroke()
        c.fillStyle = `rgba(${PAPER},0.92)`
        c.fillText(label, lx, ly + 1)
      }
    }

    onFrame?.(p)
  }

  const loop = (now) => {
    const dt = Math.min(now - (last || now), 48)
    last = now
    p += (state.target - p) * 0.055
    draw(dt)
    raf = requestAnimationFrame(loop)
  }

  return {
    resize,
    start() {
      if (running || reduced) { if (reduced) draw(0); return }
      running = true; last = 0
      raf = requestAnimationFrame(loop)
    },
    stop() { running = false; cancelAnimationFrame(raf) },
    ripple(sx, sy) {
      const pt = unproject(sx, sy)
      if (pt) ripples.push({ ...pt, r: 0 })
      else ripples.push({ x: camX, z: Z_NEAR + DEPTH * 0.3, r: 0 })
      if (reduced) draw(0)
    },
    nodeCount: nodes.length,
    destroy() { running = false; cancelAnimationFrame(raf) },
  }
}
