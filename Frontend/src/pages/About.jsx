import { timeline, certs, skills } from "../data/about"
import { motion } from "framer-motion"
import { Award } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#6366F1] dark:text-success px-4 py-10 md:pt-20 md :pt-20 sm:px-6 md:px-10 font-mono">
      {/* Terminal-style Heading */}
      <div className="text-center mb-12">
        <motion.h2 className="text-2xl sm:text-3xl md:text-4xl font-bold terminal-blink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          $ whoami
        </motion.h2>
        <p className="text-[#475569] dark:text-accent mt-2">// A deep dive into who I am, what I build, and why I do it.</p>
        <hr className="my-4 border-green-800" />
      </div>

      {/* Timeline */}
      <div className="max-w-5xl mx-auto">
        {timeline.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} className="mb-8 border-l-2 border-green-500 pl-4">
            <p className="text-xs text-[#475569] dark:text-accent">~ {item.year}</p>
            <h3 className="text-lg font-semibold terminal-glow">{item.title}</h3>
            <p className="text-green-500 text-sm">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <hr className="my-4 border-green-800" />

      {/* Skills Section */}
      <div className="text-center my-10">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold terminal-glow mt-15">$ tech-stack --show-all</h3>
        <p className="text-[#475569] dark:text-accent mt-2">// All the tools I wield on my terminal</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-[#0f0f0f] border border-green-700/50 rounded-lg p-4 text-center hover:scale-105 transition cursor-pointer shadow-md hover:shadow-green-400/20">
            <span className="block text-green-200 tracking-wide text-sm sm:text-base">{item}</span>
          </motion.div>
        ))}
      </div>

      {/* Certifications */}
      <div className="text-center mt-20 mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold terminal-blink">$ ls ~/certifications</h2>
        <p className="text-[#475569] dark:text-accent mt-2">// Proof of execution</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {certs.map((cert, i) => (
          <motion.a key={i} href={cert.link} target="_blank" className="relative group bg-[#0f0f0f] border border-green-700/50 p-4 rounded-lg shadow-md hover:shadow-green-400/30 transition text-center" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="text-3xl mb-2 text-green-400">
              <Award size={28} />
            </div>
            <p className="text-sm text-green-200">{cert.title}</p>
          </motion.a>
        ))}
      </div>

      {/* Currently Grinding */}
      <div className="text-center mt-20 mb-12">
        <p className="text-md font-semibold text-success mb-2">$ currently --grinding</p>
        <p className="text-[#475569] dark:text-accent max-w-2xl mx-auto text-sm">
          DevSecOps tools, Resume polishing, Cloud security practices, Helm charts, System Design for DevOps, open-source contributions, and internship applications.
        </p>
      </div>
    </div>
  )
}

export default About