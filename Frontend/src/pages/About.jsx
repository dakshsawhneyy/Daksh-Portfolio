import { timeline,certs,skills } from "../data/about"
import { motion } from "framer-motion"
import { Award } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-bgDark px-6 pt-8 md:pt-28">
      <h2 className="text-3xl font-grotesk font-bold text-gray-900 dark:text-white mb-1 text-center">The Person Behind the Projects</h2>
      <h6 className="text-xs sm:text-sm font-grotesk text-gray-900 dark:text-white mb-12 text-center">A deep dive into who I am, what I build, and why I do it.</h6>

      {/* Timeline */}
      <div className="">
        {timeline.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 50 }}  whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className="mb-10">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.year}</p>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      

      {/* Skills Section */}
      <h3 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 my-12 drop-shadow-md">
        My Tech Stack
      </h3>
      <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-6 sm:px-6 mb-24">
        {skills.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="relative group py-4 sm:p-6 rounded-2xl text-center font-medium text-gray-800 dark:text-white bg-gray-100/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-gray-600/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent dark:from-white/5 dark:to-transparent opacity-20 rounded-2xl z-0 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 shadow-[0_0_40px_10px_rgba(255,255,255,0.1)] z-0 pointer-events-none"></div>
            <div className="relative z-10 text-[0.9rem] sm:text-[1rem] tracking-wide">{item}</div>
          </motion.div>
        ))}
      </div>


      {/* Certifications */}
      <section className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Certifications</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
        {certs.map((cert, i) => (
          <motion.a key={i} href={cert.link} target="_blank" className="relative group backdrop-blur-lg bg-white/20 dark:bg-gray-800/30 border border-white/30 dark:border-gray-600/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center font-medium text-gray-900 dark:text-white shadow-md transition hover:scale-110" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="text-4xl mb-2 text-primary">
              <Award size={32} />
            </div>
            <p className="text-sm">{cert.title}</p>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 rounded-2xl transition" />
          </motion.a>
        ))}
      </div>
    </section>

      {/* Currently Grinding */}
      <div className="text-center pb-20">
        <p className="text-lg font-semibold text-primary mb-2">Currently Grinding</p>
        <p className="text-gray-700 dark:text-gray-200 max-w-xl mx-auto">
          DevSecOps tools, Resume polishing, Cloud security practices, Helm charts, System Design for DevOps, open-source contributions, and internship applications.
        </p>
      </div>
    </div>
  )
}

export default About