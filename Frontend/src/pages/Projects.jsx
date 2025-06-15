import React, { useState } from 'react'
import projects from '../data/projects'
import { motion } from "framer-motion"

const Projects = () => {
  
  // Creating use state for fetching projects based on tags
  const [selectedTag, setSelectedTag] = useState("All")
  
  const tags = ["All", "DevOps", "Cloud", "MERN", "Python"]

  const filteredProjects = (selectedTag === "All" ? projects : projects.filter(project => project.category === selectedTag))

  return (
    <div className='min-h-screen bg-white dark:bg-bgDark px-6 pt-28'>
        <h2 className="text-3xl font-grotesk font-bold text-gray-900 dark:text-white mb-8 text-center">Side Hustles & Scalable Stuff</h2>

      {/* Filter Buttons */}
      <div className='flex justify-center gap-1 sm:gap-4 mb-8'>
        {tags.map(tag => (
          <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-4 py-1 rounded-full text-xs sm:text-md md:text-lg md:font-medium ${selectedTag === tag ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white"}`}>{tag}</button>
        ))}
      </div>

      {/* Project Cards */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'> 
        {filteredProjects.map((item,index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-900 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 ">
            <img src={item.image} alt="project-image" className='w-full md:max-h-60 object-cover' />
            <div className='p-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              {/* providing tags */}
              <div className='flex flex-wrap gap-2 mt-3'>
                {item.tags.map((tag, ind) => (
                  <span key={ind} className='text-xs px-2 py-1 bg-accent text-black dark:text-black rounded-full font-medium'>{tag}</span>
                ))}
              </div>
              {/* Show on GitHub Icon */}
              <a href={item.github} target="_blank" className='inline-block mt-4 text-primary font-semibold hover:underline'>View on GitHub →</a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Projects
