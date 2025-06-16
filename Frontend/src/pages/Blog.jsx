import { useEffect, useState } from "react"
import { fetchBlogs } from "../data/blogService"
import { motion } from 'framer-motion'


const Blog = () => {

  // Creating a state to store blogs fetched from Hashnode
  const [blogs, setBlogs] = useState([])  // Empty at starting

  useEffect(() => {
    const loadBlogs = async() => {
      const data = await fetchBlogs()
      setBlogs(data)
    }
    loadBlogs()
  }, [])

    // Pick first post as featured
    const [featured, ...rest] = blogs

  return (
    <div className='min-h-screen bg-white dark:bg-bgDark px-6 pt-8 sm:pt-28'>
      <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 font-grotesk'>My Blog Articles</h2>
      
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto'>
        {blogs.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <img src={item.coverImage?.url} alt={item.title} className="w-full h-48 object-cover"/>
            <div className="p-4 ">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.brief.slice(0, 150)}...</p>
              <a href={`https://hashnode.com/post/${item.slug}`} target="_blank" className="inline-block mt-4 text-primary font-semibold hover:underline">Read More →</a>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  )
}

export default Blog
