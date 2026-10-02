import { motion, useScroll, useSpring } from 'framer-motion'

/* Thin coral beam across the top of the viewport showing read progress. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return <motion.div className="scroll-beam" style={{ scaleX }} aria-hidden="true" />
}

export default ScrollProgress
