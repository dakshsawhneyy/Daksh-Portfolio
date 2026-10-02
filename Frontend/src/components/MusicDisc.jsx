import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import music from '../data/music'
import '../styles/music-disc.css'

const BARS = 28
const HINT_KEY = 'dk-music-hint-seen'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Floating vinyl that plays a rock loop while visitors browse.
   Rotation is physics-driven (spins up / coasts down) and a radial
   visualiser around the disc reads the live analyser. */
const MusicDisc = () => {
  const [playing, setPlaying] = useState(false)
  const [hint, setHint] = useState(false)
  const engineRef = useRef(null)
  const discRef = useRef(null)
  const canvasRef = useRef(null)
  const playingRef = useRef(false)
  const rafRef = useRef(0)
  const kickRef = useRef(() => {})

  // one-time nudge so people notice the disc exists
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem(HINT_KEY) === '1' } catch { /* storage blocked */ }
    if (seen) return
    const show = setTimeout(() => setHint(true), 3500)
    const hide = setTimeout(() => setHint(false), 11000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  // render loop: angular velocity eases toward target → feels like a real platter
  useEffect(() => {
    const reduced = prefersReducedMotion()
    let angle = 0
    let velocity = 0
    let data = null
    const canvas = canvasRef.current
    const c = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = canvas.clientWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    c.scale(dpr, dpr)
    const levels = new Float32Array(BARS)

    const frame = () => {
      const target = playingRef.current && !reduced ? 3.4 : 0
      velocity += (target - velocity) * (target > velocity ? 0.035 : 0.022)
      angle = (angle + velocity) % 360
      if (discRef.current) discRef.current.style.transform = `rotate(${angle}deg)`

      const an = engineRef.current?.analyser
      if (an && !data) data = new Uint8Array(an.frequencyBinCount)
      if (an) an.getByteFrequencyData(data)

      c.clearRect(0, 0, size, size)
      const cx = size / 2
      const r0 = size * 0.36
      let energy = 0
      for (let i = 0; i < BARS; i++) {
        const raw = an && playingRef.current ? data[1 + (i % (data.length - 4))] / 255 : 0
        levels[i] += (raw - levels[i]) * 0.3
        energy += levels[i]
        const a = (i / BARS) * Math.PI * 2 - Math.PI / 2 + (angle * Math.PI) / 1800
        const len = 2 + levels[i] * size * 0.12
        c.strokeStyle = i % 7 === 0 ? 'rgba(114,223,172,.95)' : 'rgba(232,103,74,.9)'
        c.globalAlpha = 0.25 + levels[i] * 0.75
        c.lineWidth = 2
        c.lineCap = 'round'
        c.beginPath()
        c.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0)
        c.lineTo(cx + Math.cos(a) * (r0 + len), cx + Math.sin(a) * (r0 + len))
        c.stroke()
      }
      c.globalAlpha = 1
      // let CSS breathe with the music (glow intensity)
      canvas.parentElement?.style.setProperty('--energy', (energy / BARS).toFixed(3))

      if (velocity > 0.01 || playingRef.current) rafRef.current = requestAnimationFrame(frame)
      else rafRef.current = 0
    }

    const kick = () => { if (!rafRef.current) rafRef.current = requestAnimationFrame(frame) }
    kickRef.current = kick
    kick()
    return () => { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
  }, [])

  useEffect(() => () => engineRef.current?.destroy(), [])

  const toggle = async () => {
    setHint(false)
    try { sessionStorage.setItem(HINT_KEY, '1') } catch { /* storage blocked */ }
    if (!engineRef.current) {
      const mod = await import('../audio/rockEngine')
      engineRef.current = music.src ? mod.createFileEngine(music.src) : mod.createRockEngine()
    }
    const e = engineRef.current
    if (playingRef.current) {
      e.pause()
      playingRef.current = false
      setPlaying(false)
    } else {
      try {
        await e.play()
        playingRef.current = true
        setPlaying(true)
      } catch (err) {
        console.warn('Music playback failed', err)
      }
    }
    kickRef.current()
  }

  return (
    <div className={`mdisc ${playing ? 'is-playing' : ''}`}>
      <div className={`mdisc-hint ${hint ? 'show' : ''}`} aria-hidden={!hint}>
        <span className="mdisc-hint-dot" /> Soundtrack for the tour — tap the record
      </div>

      <div className="mdisc-label" aria-hidden="true">
        <span className="mdisc-label-k">{playing ? 'Now playing' : 'Paused'}</span>
        <span className="mdisc-label-t">{music.title}</span>
        <span className="mdisc-label-a">{music.artist}</span>
      </div>

      <button
        type="button"
        className="mdisc-btn"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${music.title}` : `Play ${music.title}`}
        title={playing ? 'Pause music' : 'Play music'}
      >
        <canvas ref={canvasRef} className="mdisc-viz" aria-hidden="true" />
        <span className="mdisc-glow" aria-hidden="true" />
        <span ref={discRef} className="mdisc-vinyl" aria-hidden="true">
          <span className="mdisc-shine" />
          <span className="mdisc-center">
            <span className="mdisc-spindle" />
          </span>
        </span>
        <span className="mdisc-icon" aria-hidden="true">
          {playing ? <Pause size={13} strokeWidth={2.6} /> : <Play size={13} strokeWidth={2.6} />}
        </span>
      </button>
    </div>
  )
}

export default MusicDisc
