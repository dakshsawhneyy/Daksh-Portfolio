import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Phone, MapPin } from 'lucide-react'
import Starfield from '../components/Starfield'
import axios from 'axios'

const Contact = () => {

  // Making state to store form data and send to backend
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  // Making state for fetching the state of status
  const [status, setStatus] = useState('')

  // Function to Change FormData from input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Function to send details to backend when form submits
  const handleSubmit = async(e) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/message`, formData)
      if(res.data.success){
        setStatus("Message Sent")
        setFormData({ name:'', email:'', message:'' })
      }else{
        setStatus("Failed to send message")
      }
    } catch (error) {
      setStatus("Server Error")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-bgDark">
      
      <Starfield />

      {/* Left Panel: Info & Socials */}
      <motion.div className="lg:w-1/2 flex flex-col justify-center items-start p-8 lg:p-16 gap-6 backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 rounded-tr-3xl rounded-br-3xl m-4 lg:m-8 shadow-xl" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          console.log("Let's Build Something Together")
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Whether you've got a project in mind or just want to say hi, I'm all ears.
        </p>

        {/* Contact Details */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-3 text-gray-800 dark:text-white">
            <Mail size={20} /> <a href="mailto:dakshsawhneyy@gmail.com">dakshsawhneyy@gmail.com</a>
          </div>
          <div className="flex items-center gap-3 text-gray-800 dark:text-white">
            <Phone size={20} /> <a href="tel:+919622727121">+91 9622727121</a>
          </div>
          <div className="flex items-center gap-3 text-gray-800 dark:text-white">
            <MapPin size={20} /> Jammu, Jammu and Kashmir, India
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 mt-8">
          {[ 
            { Icon: Github, url: 'https://github.com/dakshsawhneyy' },
            { Icon: Linkedin, url: 'https://linkedin.com/in/dakshsawhneyy' },
          ].map(({ Icon, url }, i) => (
            <a key={i} href={url} target="_blank" rel="noopener" className="p-2 rounded-full bg-white/20 dark:bg-gray-700/30 hover:bg-white/30 transition">
              <Icon size={24} className="text-gray-900 dark:text-white hover:text-primary" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Right Panel: Form */}
      <motion.form onSubmit={handleSubmit} target="_blank" className="lg:w-1/2 p-8 lg:p-16 m-4 lg:m-8 backdrop-blur-xl bg-white/30 dark:bg-gray-800/40 rounded-tl-3xl rounded-bl-3xl shadow-xl" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <input type="hidden" name="_captcha" value="false" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" onChange={handleChange} value={formData.name} type="text" placeholder="Your Name" required className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border dark:text-white border-gray-300 dark:border-gray-600 focus:outline-primary transition" />
          <input name="email" onChange={handleChange} value={formData.email} type="email" placeholder="Your Email" required className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border dark:text-white border-gray-300 dark:border-gray-600 focus:outline-primary transition" />
        </div>
        <textarea name="message" onChange={handleChange} value={formData.message} rows="5" placeholder="Your Message" required className="w-full mt-4 px-4 py-3 rounded-lg bg-white dark:bg-gray-900 border dark:text-white border-gray-300 dark:border-gray-600 focus:outline-primary transition"></textarea>
        <button type="submit" className="mt-6 w-full py-3 font-semibold bg-primary text-white rounded-lg hover:opacity-90 transition">
          Send Message
        </button>
      </motion.form>
      {status && <p className="mt-2 text-accent">{status}</p>}
    </div>
  )
}

export default Contact