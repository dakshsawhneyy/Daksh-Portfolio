import { useMotionValue, useSpring } from 'framer-motion'
import { useCallback } from 'react'

/* Magnetic pull: element drifts toward the pointer while hovered and
   springs back on leave. Returns motion values + handlers to spread. */
export default function useMagnetic(strength = 0.35, spring = { stiffness: 220, damping: 16, mass: 0.6 }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, spring)
  const y = useSpring(my, spring)

  const onPointerMove = useCallback((e) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }, [mx, my, strength])

  const onPointerLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return { x, y, handlers: { onPointerMove, onPointerLeave } }
}
