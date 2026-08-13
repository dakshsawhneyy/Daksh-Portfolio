import React from 'react'
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import Lottie from "lottie-react"
import DevAnim from "../assets/dev-lottie1.json"
import DevAnimDark from "../assets/dev-lottie2.json"
import { useNavigate } from 'react-router-dom'

const Home = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate()
  return (
    <div className={`min-h-screen app-gradient text-white flex items-center justify-center px-4 home-hero`}>
      <div className='grid md:grid-cols-2 gap-8 max-w-6xl w-full items-center'>
        {/* Left Text / Glass Card (cinematic) */}
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="glass-card p-10 rounded-2xl">
          <div className="kicker muted">HELLO</div>
          <h1 className="text-4xl md:text-6xl font-grotesk font-black mb-2 leading-tight">Daksh<br/><span className="text-accent">Systems & Product</span></h1>
          <div className="mt-2 text-lg md:text-2xl font-semibold text-gray-200">I build resilient infrastructure, scalable platforms, and clear interfaces.</div>

          <TypeAnimation
            sequence={[
              "Observability · SRE · AIOps",
              1800,
              "Distributed Systems · Cloud",
              1800,
            ]}
            wrapper="div"
            speed={40}
            repeat={Infinity}
            className="block text-sm md:text-base text-accent font-medium mt-4"
          />

          <p className="mt-4 text-sm md:text-base text-gray-300 max-w-lg">
            I design systems that notice failure, reason about it, and fix it autonomously — with humane interfaces for engineers.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate('/system')} className="btn-primary" style={{padding:'12px 18px', fontSize:16}}>Enter System</button>
            <button onClick={() => navigate('/projects')} className="btn-primary" style={{background:'transparent', border:'1px solid rgba(255,255,255,0.06)'}}>View Projects</button>
            <button onClick={() => navigate('/contact')} className="btn-primary" style={{background:'#071024',color:'#9be7c4'}}>Contact</button>
          </div>
        </motion.div>

        {/* Right Animation / Illustration */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9 }} className="flex items-center justify-center">
          <div className="w-full max-w-lg glass-card rounded-2xl p-4 hero-anim">
            <Lottie animationData={darkMode ? DevAnimDark : DevAnim} loop={true} style={{width:'100%', height:420}} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home