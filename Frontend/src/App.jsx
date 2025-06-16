import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Navbar from "./components/Navbar"
import Projects from "./pages/Projects"
import Blog from "./pages/Blog"
import Contact from "./pages/Contact"
import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Dashboard from "./pages/Dashboard"

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

  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/blog" element={<Blog />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="/metrics" element={<Dashboard />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App