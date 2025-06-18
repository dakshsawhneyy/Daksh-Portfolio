import { Github, Linkedin, Mail } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-md bg-white dark:bg-black border-t border-white/10 text-primary dark:text-success font-mono px-6 pt-5 pb-20 md:pb-5 sm:pb-10 drop-shadow-2xl border-t-gray-300 dark:border-t-green-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Hacker Style Terminal Text */}
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-sm sm:text-base tracking-wide text-primary dark:text-success ">
          [~] root@dakshsawhneyy:~# May contain traces of burnout.
        </motion.p> 

        {/* Glassy Icon Row */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-6 text-primary dark:text-success" >
          <a href="https://github.com/dakshsawhneyy" target="_blank" className="p-2 bg-white/10 dark:bg-white/5 rounded-full backdrop-blur-md transition hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]" >
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/dakshsawhneyy" target="_blank" className="p-2 bg-white/10 dark:bg-white/5 rounded-full backdrop-blur-md transition hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]" >
            <Linkedin size={20} />
          </a>
          <a href="mailto:dakshsawhneyy@gmail.com" className="p-2 bg-white/10 dark:bg-white/5 rounded-full backdrop-blur-md transition hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(0,255,0,0.8)]" >
            <Mail size={20} />
          </a>
        </motion.div>
      </div>

      {/* Blinking Cursor */}
      <div className="mt-6 text-center text-primary dark:text-success text-xs tracking-wider sm:text-sm">
        <span className="animate-pulse">Built by a Cloud engineer who autoscaled his soul and logs for fun.<span className=''>█</span></span> 
      </div>
    </footer>
  )
}

export default Footer
