import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import '../styles/portrait.css'

/* ══════════════════════════════════════════════════════════════════
   PORTRAIT — About hero. Layered depth composition:
     back  : orbiting role ring + dotted orbit
     mid   : warm sun disc with lattice texture
     front : cut-out photo that breaks out of the top of the disc
     float : credential chips at different parallax depths
   Pointer moves each layer by a different amount (parallax).
   ══════════════════════════════════════════════════════════════════ */

const RING = 'CLOUD ENGINEER ✦ SRE ✦ DEVOPS ✦ MULTI-CLOUD INSTRUCTOR ✦ BUILDER ✦ '

const Chip = ({ className, depth, mx, my, delay, children }) => {
  const x = useTransform(mx, v => v * depth)
  const y = useTransform(my, v => v * depth)
  return (
    <motion.div className={`pt-chip ${className}`} style={{ x, y }}
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const Portrait = () => {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 90, damping: 16 })
  const my = useSpring(rawY, { stiffness: 90, damping: 16 })

  // disc + photo move as one layer so the circular mask stays aligned
  const coreX = useTransform(mx, v => v * 14)
  const coreY = useTransform(my, v => v * 10)
  const ringX = useTransform(mx, v => v * -8)
  const ringY = useTransform(my, v => v * -8)
  const tiltX = useTransform(my, v => v * -6)
  const tiltY = useTransform(mx, v => v * 8)

  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width - 0.5)
    rawY.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      className="pt-root"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="pt-scene" style={{ rotateX: tiltX, rotateY: tiltY }}>

        {/* back: rotating role ring */}
        <motion.svg className="pt-ring" viewBox="0 0 400 400" style={{ x: ringX, y: ringY }} aria-hidden="true">
          <defs>
            <path id="pt-ring-path" d="M200,200 m-178,0 a178,178 0 1,1 356,0 a178,178 0 1,1 -356,0" />
          </defs>
          <circle cx="200" cy="200" r="194" className="pt-orbit" />
          <circle cx="200" cy="200" r="162" className="pt-orbit pt-orbit-inner" />
          <g className="pt-ring-text">
            <text><textPath href="#pt-ring-path" textLength="1110" lengthAdjust="spacing">{RING}{RING}</textPath></text>
          </g>
          <g className="pt-satellite"><circle cx="200" cy="6" r="4.5" /></g>
        </motion.svg>

        <motion.div className="pt-core" style={{ x: coreX, y: coreY }}>
          {/* mid: sun disc */}
          <div className="pt-disc" aria-hidden="true">
            <span className="pt-disc-grid" />
            <span className="pt-disc-shine" />
          </div>

          {/* front: photo breaking out of the top of the disc */}
          <div className="pt-photo-wrap">
            <img
              className="pt-photo"
              src="/profile_photo/photo-removebg-preview.png"
              alt="Daksh Sawhney"
              loading="eager"
              draggable="false"
            />
          </div>
        </motion.div>

        {/* floating credentials */}
        <Chip className="pt-chip-tl" depth={-26} mx={mx} my={my} delay={0.7}>
          <span className="pt-chip-logo pt-logo-code">
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M8 9L5 14l3 5" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 9l3 5-3 5" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8l-4 12" stroke="#e8674a" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
          <span>
            <b>Multi-Cloud Instructor</b>
            <small>SelfCode Academy · 2026</small>
          </span>
        </Chip>

        <Chip className="pt-chip-br" depth={30} mx={mx} my={my} delay={0.85}>
          <span className="pt-chip-logo pt-logo-aws">aws</span>
          <span>
            <b>AWS Cloud Intern</b>
            <small>IPage UMS · 2025</small>
          </span>
        </Chip>

        <Chip className="pt-chip-r" depth={18} mx={mx} my={my} delay={1}>
          <span className="pt-live" /> <b>online</b><small>&nbsp;· IST</small>
        </Chip>

      </motion.div>
    </motion.div>
  )
}

export default Portrait
