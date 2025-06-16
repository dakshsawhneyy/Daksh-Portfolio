import React from 'react'
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import Lottie from "lottie-react"
import DevAnim from "../assets/dev-lottie1.json"
import DevAnimDark from "../assets/dev-lottie2.json"

const Home = ({darkMode, setDarkMode}) => {
  return (
    <div className='bg-white dark:bg-black min-h-screen flex items-center justify-center px-4'>
      <div className='grid md:grid-cols-2 gap-10 max-w-7xl w-full'>
        {/* Left Text */}
        <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-grotesk font-bold text-gray-900 dark:text-white mb-4">Hi, I'm <span className="text-primary">Daksh</span></h1>
          <TypeAnimation
            sequence={[
              "Cloud DevOps Engineer",
              1500,
              "MERN Stack Developer",
              1500,
              "DevSecOps Learner",
              1500,
              "AWS Enthusiast",
              1500,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-xl md:text-2xl text-success dark:text-accent font-semibold"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-lg">
            From sleek UIs to scalable cloud infra - I'm the engineer behind the code, the pipelines, and the uptime.
          </p>
        </motion.div>

        {/* Right Animation */}
        <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="block">
          <Lottie animationData={darkMode ? DevAnim : DevAnimDark} loop={true} />
        </motion.div>
      </div>
    </div>
  )
}

export default Home