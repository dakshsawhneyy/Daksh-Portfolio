import { useEffect, useRef } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import '../styles/impact-strip.css'

/* ══════════════════════════════════════════════════════════════════
   IMPACT STRIP — the home metrics, one colour system:
   ink numbers, coral only for the unit + the fill bar.
   All motion is one-shot when it scrolls into view.
   ══════════════════════════════════════════════════════════════════ */

const ITEMS = [
  { value: 40, sign: '−', unit: '%', label: 'P95 latency', ctx: 'Lambda memory + cold-start tuning', bar: 40 },
  { value: 78, sign: '−', unit: '%', label: 'MTTR', ctx: 'faster detection & recovery', bar: 78 },
  { value: 70, sign: '−', unit: '%', label: 'Deploy time', ctx: '40 → 12 min, Terraform + Actions', bar: 70 },
  { value: 180, sign: '', unit: 'h+', label: 'DevOps & SRE taught', ctx: 'SelfCode Academy', bar: 100 },
  { value: 100, sign: '', unit: 'h+', label: 'Multi-cloud taught', ctx: 'AWS · Azure · GCP', bar: 56 },
]

const Num = ({ to, inView }) => {
  const ref = useRef(null)
  useEffect(() => {
    if (!inView) return
    const node = ref.current
    const c = animate(0, to, { duration: 1.5, ease: [0.16, 1, 0.3, 1], onUpdate: v => { node.textContent = Math.round(v) } })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

const ImpactStrip = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <section className="im-root" ref={ref} aria-label="Impact">
      <div className="im-grid">
        {ITEMS.map((it, i) => (
          <motion.div key={it.label} className="im-cell"
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .7, ease: [0.22, 1, 0.36, 1], delay: i * .07 }}>
            <span className="im-idx">{String(i + 1).padStart(2, '0')}</span>
            <strong className="im-val">
              {it.sign && <span className="im-sign">{it.sign}</span>}
              <Num to={it.value} inView={inView} />
              <span className="im-unit">{it.unit}</span>
            </strong>
            <span className="im-label">{it.label}</span>
            <span className="im-bar"><motion.i style={{ originX: 0 }} initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: it.bar / 100 } : {}} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: .2 + i * .07 }} /></span>
            <span className="im-ctx">{it.ctx}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ImpactStrip
