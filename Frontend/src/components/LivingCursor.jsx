import React, { useEffect, useRef, useState } from 'react'

const lerp = (a, b, n) => a + (b - a) * n

const LivingCursor = () => {
  const ref = useRef()
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const raf = useRef(null)
  const lastMove = useRef(Date.now())
  const [state, setState] = useState('default') // default, hover, view, open, drag, active, loading, idle
  const [label, setLabel] = useState('')

  // disable on touch or reduced-motion or small pointers
  const disabled = typeof window !== 'undefined' && (('ontouchstart' in window) || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (disabled) return

    const onMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      lastMove.current = Date.now()
      if (state === 'idle') setState('default')
    }

    const onOver = (e) => {
      const node = e.target.closest && e.target.closest('[data-interactive]')
      if (node) {
        const t = node.getAttribute('data-cursor') || 'hover'
        setState(t === 'open' || t === 'view' ? t : 'hover')
        setLabel(t === 'open' || t === 'view' ? t : (t || ''))
      }
    }

    const onOut = (e) => {
      const node = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-interactive]')
      if (!node) {
        setState('default')
        setLabel('')
      }
    }

    const onDown = () => { setState(s => s === 'loading' ? 'loading' : 'active') }
    const onUp = () => { setState(s => s === 'active' ? 'default' : s) }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const loop = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.18)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.18)
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${state === 'active' ? 0.88 : 1})`
        ref.current.dataset.state = state
        // label visibility
        if (label) ref.current.dataset.label = label
        else delete ref.current.dataset.label
      }

      // idle detection
      if (Date.now() - lastMove.current > 2200 && state !== 'idle' && state === 'default') setState('idle')

      raf.current = requestAnimationFrame(loop)
    }

    raf.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf.current)
    }
  }, [disabled, label, state])

  if (disabled) return null

  return (
    <div aria-hidden ref={ref} className={`living-cursor`}>
      <div className="cursor-core" />
      <div className="cursor-ring" />
      <div className="cursor-label" />
    </div>
  )
}

export default LivingCursor
