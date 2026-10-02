/* ══════════════════════════════════════════════════════════════════
   ROCK ENGINE — a tiny procedural rock band in the Web Audio API.
   No audio files, no licensing: drums, bass, distorted power-chord
   guitar and a pentatonic lead are synthesised and scheduled live.

   Song: E5 – C5 – G5 – D5 @ 138 BPM
     bars 0-3  : palm-muted chug verse
     bars 4-7  : open-chord chorus + lead melody
   ══════════════════════════════════════════════════════════════════ */

const BPM = 138
const STEP = 60 / BPM / 4            // one 16th note in seconds
const LOOKAHEAD_MS = 25
const SCHEDULE_AHEAD = 0.14

// power-chord roots (guitar) — bass plays an octave below
const PROGRESSION = [82.41, 130.81, 98.0, 146.83] // E2, C3, G2, D3

const N = { 'F#4': 369.99, G4: 392.0, A4: 440.0, B4: 493.88, D5: 587.33, E5: 659.25 }
// [startStep, note, lengthInSteps] per chorus bar
const LEAD = [
  [[0, 'B4', 3], [3, 'A4', 1], [4, 'G4', 2], [6, 'A4', 2], [8, 'B4', 6], [14, 'D5', 2]],
  [[0, 'E5', 4], [4, 'D5', 2], [6, 'B4', 2], [8, 'G4', 6], [14, 'A4', 2]],
  [[0, 'B4', 3], [3, 'D5', 1], [4, 'B4', 2], [6, 'A4', 2], [8, 'G4', 4], [12, 'A4', 4]],
  [[0, 'A4', 2], [2, 'G4', 2], [4, 'F#4', 2], [6, 'G4', 2], [8, 'A4', 8]],
]

const KICK  = new Set([0, 3, 8, 10])
const SNARE = new Set([4, 12])

function distortionCurve(amount) {
  const n = 2048
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

export function createRockEngine() {
  const AC = window.AudioContext || window.webkitAudioContext
  const ctx = new AC()

  /* ── master bus ── */
  const master = ctx.createGain()
  master.gain.value = 0
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16
  comp.ratio.value = 4
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 64
  analyser.smoothingTimeConstant = 0.78
  master.connect(comp).connect(analyser).connect(ctx.destination)

  /* ── shared noise buffer for drums ── */
  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const nd = noise.getChannelData(0)
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

  /* ── guitar bus: drive → shaper → cab ── */
  const makeAmp = (drive, cabHz, level) => {
    const input = ctx.createGain(); input.gain.value = drive
    const shaper = ctx.createWaveShaper(); shaper.curve = distortionCurve(420); shaper.oversample = '4x'
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 95
    const cab = ctx.createBiquadFilter(); cab.type = 'lowpass'; cab.frequency.value = cabHz; cab.Q.value = 0.9
    const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 1400; mid.gain.value = 3
    const out = ctx.createGain(); out.gain.value = level
    input.connect(shaper).connect(hp).connect(mid).connect(cab).connect(out).connect(master)
    return input
  }
  const rhythmAmp = makeAmp(2.2, 3600, 0.16)
  const leadAmp = makeAmp(1.6, 4200, 0.075)

  // slap-back delay on the lead
  const delay = ctx.createDelay(); delay.delayTime.value = STEP * 3
  const fb = ctx.createGain(); fb.gain.value = 0.28
  const wet = ctx.createGain(); wet.gain.value = 0.35
  leadAmp.connect(delay); delay.connect(fb).connect(delay); delay.connect(wet).connect(master)

  /* ── instruments ── */
  const kick = (t) => {
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.frequency.setValueAtTime(160, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
    g.gain.setValueAtTime(0.95, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.34)
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.36)
  }

  const noiseHit = (t, { type, freq, q = 0.8, gain, decay }) => {
    const s = ctx.createBufferSource(); s.buffer = noise
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + decay)
    s.connect(f).connect(g).connect(master)
    s.start(t, Math.random() * 0.5); s.stop(t + decay + 0.02)
  }

  const snare = (t) => {
    noiseHit(t, { type: 'highpass', freq: 1300, gain: 0.5, decay: 0.19 })
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = 'triangle'; o.frequency.setValueAtTime(210, t); o.frequency.exponentialRampToValueAtTime(150, t + 0.08)
    g.gain.setValueAtTime(0.42, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.14)
  }

  const hat = (t, open) => noiseHit(t, { type: 'highpass', freq: 7600, gain: open ? 0.16 : 0.11, decay: open ? 0.22 : 0.045 })
  const crash = (t) => noiseHit(t, { type: 'highpass', freq: 4800, gain: 0.22, decay: 1.4 })

  const bass = (t, f, len) => {
    const o = ctx.createOscillator(); const lp = ctx.createBiquadFilter(); const g = ctx.createGain()
    o.type = 'sawtooth'; o.frequency.value = f / 2
    lp.type = 'lowpass'; lp.frequency.value = 520
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.32, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.001, t + len)
    o.connect(lp).connect(g).connect(master); o.start(t); o.stop(t + len + 0.02)
  }

  const powerChord = (t, root, len, muted) => {
    const g = ctx.createGain()
    const peak = muted ? 0.5 : 0.62
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + 0.006)
    g.gain.exponentialRampToValueAtTime(muted ? 0.001 : 0.25, t + (muted ? 0.11 : len * 0.6))
    if (!muted) g.gain.exponentialRampToValueAtTime(0.001, t + len)
    const pre = ctx.createBiquadFilter(); pre.type = 'lowpass'; pre.frequency.value = muted ? 1100 : 5000
    g.connect(pre).connect(rhythmAmp)
    for (const mult of [1, 1.4983, 2]) {
      for (const det of [-7, 6]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'
        o.frequency.value = root * mult; o.detune.value = det
        o.connect(g); o.start(t); o.stop(t + len + 0.05)
      }
    }
  }

  const lead = (t, f, len) => {
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = 'square'; o.frequency.setValueAtTime(f * 0.985, t)
    o.frequency.exponentialRampToValueAtTime(f, t + 0.05)             // little pick-slide
    const vib = ctx.createOscillator(); const vg = ctx.createGain()
    vib.frequency.value = 5.6; vg.gain.value = len > 0.4 ? 6 : 0
    vib.connect(vg).connect(o.detune)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.01)
    g.gain.setTargetAtTime(0.0001, t + len * 0.85, 0.05)
    o.connect(g).connect(leadAmp)
    o.start(t); vib.start(t); o.stop(t + len + 0.3); vib.stop(t + len + 0.3)
  }

  /* ── sequencer ── */
  let step = 0
  let nextTime = 0
  let timer = null

  const scheduleStep = (s, t) => {
    const bar = Math.floor(s / 16) % 8
    const pos = s % 16
    const chorus = bar >= 4
    const root = PROGRESSION[bar % 4]

    if (pos === 0 && (bar === 0 || bar === 4)) crash(t)
    if (KICK.has(pos) || (chorus && pos === 14)) kick(t)
    if (SNARE.has(pos)) snare(t)
    if (pos % 2 === 0) hat(t, chorus && pos === 14)
    if (bar === 7 && pos >= 12) snare(t)                            // fill into the loop

    if (pos % 2 === 0) bass(t, root, STEP * 1.8)

    if (!chorus) {
      if (pos % 2 === 0) powerChord(t, root, STEP * 2, pos !== 0 && pos !== 8)
    } else {
      if (pos === 0) powerChord(t, root, STEP * 6, false)
      else if (pos === 6) powerChord(t, root, STEP * 4, false)
      else if (pos === 10 || pos === 12 || pos === 14) powerChord(t, root, STEP * 2, true)
      for (const [st, note, l] of LEAD[bar - 4]) if (st === pos) lead(t, N[note], l * STEP)
    }
  }

  const tick = () => {
    while (nextTime < ctx.currentTime + SCHEDULE_AHEAD) {
      scheduleStep(step, nextTime)
      nextTime += STEP
      step++
    }
  }

  let playing = false

  return {
    analyser,
    get playing() { return playing },
    async play(volume = 0.38) {
      if (playing) return
      await ctx.resume()
      playing = true
      nextTime = ctx.currentTime + 0.06
      timer = setInterval(tick, LOOKAHEAD_MS)
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.8)
    },
    pause() {
      if (!playing) return
      playing = false
      clearInterval(timer)
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35)
      setTimeout(() => { if (!playing) ctx.suspend() }, 420)
    },
    destroy() { clearInterval(timer); ctx.close() },
  }
}

/* Wraps a real audio file with the same interface, so a licensed
   track can be dropped in via src/data/music.js */
export function createFileEngine(src) {
  const AC = window.AudioContext || window.webkitAudioContext
  const ctx = new AC()
  const audio = new Audio(src)
  audio.loop = true
  audio.crossOrigin = 'anonymous'
  const node = ctx.createMediaElementSource(audio)
  const gain = ctx.createGain(); gain.gain.value = 0
  const analyser = ctx.createAnalyser(); analyser.fftSize = 64; analyser.smoothingTimeConstant = 0.78
  node.connect(gain).connect(analyser).connect(ctx.destination)
  let playing = false
  return {
    analyser,
    get playing() { return playing },
    async play(volume = 0.7) {
      await ctx.resume(); await audio.play(); playing = true
      gain.gain.cancelScheduledValues(ctx.currentTime)
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.8)
    },
    pause() {
      playing = false
      gain.gain.cancelScheduledValues(ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.35)
      setTimeout(() => { if (!playing) audio.pause() }, 400)
    },
    destroy() { audio.pause(); ctx.close() },
  }
}
