import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import './App.css'
import Home from "./pages/Home"
import About from "./pages/About"
import Navbar from "./components/Navbar"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Dashboard from "./pages/Dashboard"
import TrackVisitor from "./components/TrackVisitor"
import SystemShell from "./components/SystemShell"
import LivingCursor from "./components/LivingCursor"
import SideRail from "./components/SideRail"
import SystemWorkspace from "./components/SystemWorkspace"
import CommandPalette from "./components/CommandPalette"
import Landing from "./pages/Landing"

const App = () => {

  const [darkMode, setDarkMode] = useState(true)

  // Toggle dark mode
  const toggleDarkMode = () => {
      document.documentElement.classList.toggle("dark")
      setDarkMode(!darkMode)
  }

  useEffect(() => {
    if(darkMode){
      document.documentElement.classList.add("dark")
    }else{
      document.documentElement.classList.remove("dark")
    }
  },[darkMode])

  const location = useLocation()
  const [hoveredModule, setHoveredModule] = useState(null)
  const [activeModule, setActiveModule] = useState(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)

  const modules = [
    { key: 'identity', title: 'IDENTITY', subtitle: 'who I am', path: '/about', type: 'ID' , preview: 'NAME: DAKSH — Designer / Engineer'},
    { key: 'projects', title: 'PROJECTS', subtitle: 'archive', path: '/projects', type: 'WORK', preview: 'PROJECTS: 07 — Click to explore' },
    { key: 'lab', title: 'LAB', subtitle: 'experiments', path: '/blog', type: 'EXPERIMENT', preview: 'Small experiments and prototypes.'},
    { key: 'journal', title: 'JOURNAL', subtitle: 'notes', path: '/blog', type: 'NOTES', preview: 'Short essays and process notes.'},
    { key: 'stack', title: 'STACK', subtitle: 'tech', path: '/metrics', type: 'TECH', preview: 'MERN • AWS • Terraform • Observability' },
    { key: 'contact', title: 'CONTACT', subtitle: 'get in touch', path: '/contact', type: 'CONTACT', preview: 'Email, socials, and ways to reach.' }
  ]

  const modulesMap = Object.fromEntries(modules.map(m => [m.key, m]))

  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCmdK = (isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')
      if (isCmdK) {
        e.preventDefault(); setPaletteOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // when a module is selected, perform cinematic morph then navigate
  useEffect(() => {
    if (!activeModule) return
    const target = modulesMap[activeModule]
    if (!target) return
    setTransitioning(true)
    // timeline: module expands (600ms) -> morph to page (300ms)
    const t1 = setTimeout(() => {
      navigate(target.path || '/')
      setTransitioning(false)
      setActiveModule(null)
    }, 800)
    return () => clearTimeout(t1)
  }, [activeModule])

  return (
    <div>
      <TrackVisitor />
      <LivingCursor />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/system" element={<>
            <SideRail modules={modules} hovered={hoveredModule} setHovered={setHoveredModule} onSelect={(k)=>setActiveModule(k)} />
            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={[...modules, {key:'random',title:'RANDOM',subtitle:'Open a random item'},{key:'toggle-theme',title:'Toggle Theme',subtitle:'Switch light/dark'}]} onExecute={(key)=>{
              if(key === 'random'){
                const pick = modules[Math.floor(Math.random()*modules.length)]
                setActiveModule(pick.key)
                setPaletteOpen(false)
                return
              }
              if(key === 'toggle-theme'){
                toggleDarkMode(); setPaletteOpen(false); return
              }
              if(modulesMap[key]){ setActiveModule(key); setPaletteOpen(false); return }
            }} />
            <SystemWorkspace modules={modules} hovered={hoveredModule} setHovered={setHoveredModule} onSelect={(k)=>setActiveModule(k)} activeModule={activeModule} transitioning={transitioning} />
          </>} />

        <Route path="/about" element={<About />}></Route>
        <Route path="/home" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}></Route>
        <Route path="/blog" element={<Blog />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="/projects/:slug" element={<ProjectDetail />}></Route>
        <Route path="/metrics" element={<Dashboard />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Routes>

      {!(location.pathname === '/system' || location.pathname.startsWith('/projects/')) && <Footer/>}
    </div>
  )
}

export default App