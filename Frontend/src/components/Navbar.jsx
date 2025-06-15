import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSun, FiMoon } from "react-icons/fi"

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false)

    // Toggle dark mode
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle("dark")
        setDarkMode(!darkMode)
    }

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-bgDark shadow-md dark:shadow-none transition-all duration-300">
            <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
                {/* Logo */}
                <Link to="/" className="text-2xl font-grotesk font-bold text-primary dark:text-white">Daksh</Link>
                
                {/* Nav Links */}
                <div className="flex gap-6 items-center">
                    <Link to="/" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Home</Link>
                    <Link to="/about" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">About</Link>
                    <Link to="/blog" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Blog</Link>
                    <Link to="/projects" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Projects</Link>
                    <Link to="/contact" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Contact</Link>
                </div>

                {/* Dark Mode Button */}
                <button
                    onClick={toggleDarkMode}
                    className="text-xl text-gray-800 dark:text-white hover:text-primary transition-all"
                >
                    {darkMode ? <FiSun /> : <FiMoon />}
                </button>
            </div>
        </nav>
    )
}

export default Navbar
