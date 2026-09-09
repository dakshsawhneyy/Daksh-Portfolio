import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import './App.css'
import './portfolio-polish.css'
import './pages-unified.css'
import './responsive.css'
import Home from "./pages/Home"
import About from "./pages/About"
import Navbar from "./components/Navbar"
import Projects from "./pages/Projects"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import TrackVisitor from "./components/TrackVisitor"
import SideRail from "./components/SideRail"
import SystemWorkspace from "./components/SystemWorkspace"
import CommandPalette from "./components/CommandPalette"
import SreTerminal from "./components/SreTerminal"

// Instant on first load, smooth fade on route changes
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
    style={{ willChange: 'opacity' }}
  >
    {children}
  </motion.div>
)

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    setDarkMode(d => !d)
  }

  const location = useLocation()
  const [hoveredModule, setHoveredModule]   = useState(null)
  const [activeModule, setActiveModule]     = useState(null)
  const [paletteOpen, setPaletteOpen]       = useState(false)
  const [sreModeOpen, setSreModeOpen]       = useState(false)
  const navigate = useNavigate()

  const modules = [
    { key: 'identity', title: 'IDENTITY', subtitle: 'who I am',       path: '/about',    type: 'ID',         preview: 'NAME: DAKSH — Cloud / SRE Engineer' },
    { key: 'projects', title: 'PROJECTS', subtitle: 'archive',        path: '/projects', type: 'WORK',       preview: 'PROJECTS — Click to explore' },
    { key: 'lab',      title: 'LAB',      subtitle: 'experiments',    path: '/blog',     type: 'EXPERIMENT', preview: 'Small experiments and prototypes.' },
    { key: 'journal',  title: 'JOURNAL',  subtitle: 'notes',          path: '/blog',     type: 'NOTES',      preview: 'Short essays and process notes.' },
    { key: 'stack',    title: 'STACK',    subtitle: 'tech',           path: '/about',    type: 'TECH',       preview: 'AWS • Azure • Kubernetes • Terraform • Observability' },
    { key: 'contact',  title: 'CONTACT',  subtitle: 'get in touch',   path: '/contact',  type: 'CONTACT',    preview: 'Email, socials, and ways to reach.' }
  ]

  const modulesMap = Object.fromEntries(modules.map(m => [m.key, m]))

  // Cmd+K / Ctrl+K palette
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCmdK = (isMac && e.metaKey && e.key.toLowerCase() === 'k') ||
                     (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')
      if (isCmdK) { e.preventDefault(); setPaletteOpen(o => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Navigate after module selection animation
  useEffect(() => {
    if (!activeModule) return
    const target = modulesMap[activeModule]
    if (!target) return
    const t1 = setTimeout(() => {
      navigate(target.path || '/')
      setActiveModule(null)
    }, 800)
    return () => clearTimeout(t1)
  }, [activeModule])   // eslint-disable-line react-hooks/exhaustive-deps

  const isSystem = location.pathname === '/system'
  const isProjectDetail = location.pathname.startsWith('/projects/')

  return (
    <div className="portfolio-app">
      <TrackVisitor />

      {!isSystem && <Navbar onOpenSreMode={() => setSreModeOpen(true)} />}
      <SreTerminal open={sreModeOpen} onClose={() => setSreModeOpen(false)} />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageTransition>
              <Home darkMode={darkMode} setDarkMode={setDarkMode} />
            </PageTransition>
          } />

          <Route path="/system" element={
            <>
              <SideRail
                modules={modules}
                hovered={hoveredModule}
                setHovered={setHoveredModule}
                onSelect={k => setActiveModule(k)}
              />
              <CommandPalette
                open={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                commands={[
                  ...modules,
                  { key: 'random',       title: 'RANDOM',       subtitle: 'Open a random item' },
                  { key: 'toggle-theme', title: 'Toggle Theme', subtitle: 'Switch light/dark' }
                ]}
                onExecute={(key) => {
                  if (key === 'random') {
                    const pick = modules[Math.floor(Math.random() * modules.length)]
                    setActiveModule(pick.key); setPaletteOpen(false); return
                  }
                  if (key === 'toggle-theme') { toggleDarkMode(); setPaletteOpen(false); return }
                  if (modulesMap[key]) { setActiveModule(key); setPaletteOpen(false); return }
                }}
              />
              <SystemWorkspace
                modules={modules}
                hovered={hoveredModule}
                setHovered={setHoveredModule}
                onSelect={k => setActiveModule(k)}
                activeModule={activeModule}
              />
            </>
          } />

          <Route path="/about"    element={<PageTransition><About /></PageTransition>} />
          <Route path="/home"     element={<PageTransition><Home darkMode={darkMode} setDarkMode={setDarkMode} /></PageTransition>} />
          <Route path="/blog"     element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/contact"  element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/metrics"  element={<Navigate to="/about" replace />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {!isSystem && !isProjectDetail && <Footer />}
    </div>
  )
}

export default App
