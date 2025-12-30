import React, { useState } from 'react'
import projects from '../data/projects'
import { motion } from "framer-motion"
import Tilt from 'react-parallax-tilt'

const Projects = () => {
  const [selectedTag, setSelectedTag] = useState("all")
  const tags = ["All", "DevOps", "Cloud", "MERN", "Python", "System Design"]

  const filteredProjects = (
    selectedTag === "all" ? projects : projects.filter(project => project.category.map(item => item.toLowerCase()).includes(selectedTag.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-[#f5f7f8] dark:bg-black text-[#2a5d3c] dark:text-green-400 px-5 md:px-10 py-10 font-mono">
      {/* Terminal Heading */}
      <div className="max-w-6xl mx-auto text-left mb-8 md:pt-10">
        <motion.h2 className="text-md sm:text-3xl md:text-4xl font-bold text-[#6366F1] dark:text-green-400 terminal-blink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} >
          $ ls ~/Side_Hustles_&_Scalable_Stuff
        </motion.h2>
        <p className="text-[#475569] dark:text-accent mt-1 text-sm sm:text-xl">// Displaying filtered projects...</p>
        <hr className="my-4 border-[#6366F1] dark:border-success" />
      </div>

      {/* Filter Tags */}
      <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-10">
        {tags.map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag.toLowerCase())} className={`px-4 py-1 rounded-full text-sm font-semibold transition-all ${selectedTag === tag.toLowerCase() ? "bg-green-700 text-white" : "bg-[#e0e4e3] dark:bg-[#0f0f0f] text-[#2a5d3c] dark:text-green-400 border border-green-300/30 dark:border-green-700/50" }`} >
            {tag}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredProjects.map((item, index) => (
          <Tilt key={index} glareEnable glareMaxOpacity={0.2} scale={1.05} transitionSpeed={400} className="bg-[#fefefe] dark:bg-[#0f0f0f] rounded-2xl border border-green-600/40 dark:border-green-700/40 backdrop-blur-md shadow-xl transition-all" >
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="overflow-hidden rounded-xl" >
              <img src={item.image} alt="project-img" className="w-full h-52 object-cover dark:border-b border-green-700/30" />
              <div className="p-4">
                <h3 className="text-md font-bold text-[#6366F1] dark:text-green-300 mb-1">{item.title}</h3>
                <p className="text-sm text-[#475569] dark:text-green-400">{item.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, ind) => (
                    <span key={ind} className="text-xs px-1 sm:px-1 py-1 bg-green-200 text-green-900 dark:bg-green-400 dark:text-black rounded-full font-bold" >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Links Section */}
                <div className="flex flex-col sm:flex-row justify-between mt-4">
                  {/* GitHub Link */}
                  <a href={item.github} target="_blank" rel="noreferrer" className="text-[#475569] dark:text-accent font-semibold hover:underline" >
                    ↳ View on GitHub
                  </a>

                  {/* Live Link (conditionally rendered) */}
                  {item.live && item.live !== "#" && (
                    <a href={item.live} target="_blank" rel="noreferrer" className="text-[#475569] dark:text-accent font-semibold hover:underline" >
                      ↳ Live Demo
                    </a>
                  )}
                </div>
                
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  )
}


export default Projects
