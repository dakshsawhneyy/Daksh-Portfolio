import { useEffect, useState } from "react"
import { fetchBlogs } from "../data/blogService"
import { motion } from "framer-motion"
import Tilt from 'react-parallax-tilt'

const Blog = () => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await fetchBlogs()
      setBlogs(data)
    }
    loadBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-black text-[#0F172A] dark:text-green-600 	px-6 sm:px-6 md:px-10 py-10 sm:py-12 font-mono">
      {/* Terminal Heading */}
      <div className="max-w-5xl mx-auto mb-10 md:pt-10">
        <motion.h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#6366F1] dark:text-green-600 terminal-blink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} >
          $ awk {'{'}print{'}'} ~/blogs/daksh.txt
        </motion.h2>
        <p className="text-[#475569] dark:text-accent mt-2">// Listing latest blog entries from Hashnode...</p>
        <hr className="my-4 border-green-800" />
      </div>

      {/* Blog Entries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {blogs.map((item, index) => (
          <Tilt key={index} glareEnable glareMaxOpacity={0.2} scale={1.05} transitionSpeed={400} className="bg-white dark:bg-[#0f0f0f] relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-lg border border-green-700/50">
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className=" p-4 rounded-lg hover:shadow-green-400/30 transition-all cursor-pointer " >
              <img src={item.coverImage?.url} alt={item.title} className="w-full h-40 object-cover mb-4 border border-[#6366F1] dark:border-green-700/40 rounded" />
              <h3 className="text-[#0F172A] dark:text-success text-lg font-semibold mb-2 terminal-glow">{item.title}</h3>
              <p className="text-[#475569] dark:text-green-300 text-sm">{item.brief.slice(0, 140)}...</p>
              <a href={`https://hashnode.com/post/${item.slug}`} target="_blank" rel="noreferrer" className="block mt-3 text-[#6366F1] dark:text-accent dark:hover:text-green-100 hover:text-black transition" >
                ↳ Read More
              </a>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </div>
  )
}

export default Blog
