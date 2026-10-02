import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Pauses CSS animations (and SVG/SMIL animations) inside page sections that are
   off-screen, and resumes them when they scroll back into view. Invisible work
   was the top cost in the scroll trace: infinite CSS animations keep forcing a
   style recalc every frame and SMIL keeps invalidating SVG layout even when the
   section can't be seen. Nothing visible changes. */
const SECTIONS = 'main > section, main > div, main > header, footer'

const OffscreenPauser = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    let io
    const t = setTimeout(() => {   // after the route's page has mounted
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const el = e.target
          if (e.isIntersecting) el.removeAttribute('data-offscreen')
          else el.setAttribute('data-offscreen', '')
          el.querySelectorAll('svg').forEach(svg => {
            if (!svg.pauseAnimations) return
            if (e.isIntersecting) svg.unpauseAnimations()
            else svg.pauseAnimations()
          })
        }
      }, { rootMargin: '200px 0px' })
      document.querySelectorAll(SECTIONS).forEach(el => io.observe(el))
    }, 400)
    return () => { clearTimeout(t); io?.disconnect() }
  }, [pathname])
  return null
}

export default OffscreenPauser
