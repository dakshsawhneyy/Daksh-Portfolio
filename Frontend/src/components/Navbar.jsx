import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSun, FiMoon } from "react-icons/fi"
import { FiHome, FiUser, FiBriefcase, FiEdit3, FiMail } from "react-icons/fi"


const Navbar = ({darkMode, setDarkMode, toggleDarkMode}) => {

    // Creating useLocation for highlighting current route icon
    const location = useLocation()
    // Helper function to see if path matches
    const isActive = (path) => {
        location.pathname === path;
    }

    return (
        <>
            <nav className="hidden md:block fixed top-0 left-0 w-full z-50 bg-white dark:bg-bgDark shadow-md dark:shadow-none transition-all duration-300">
                <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-grotesk font-bold text-primary">Daksh</Link>
                    
                    {/* Nav Links */}
                    <div className="flex gap-6 items-center">
                        <Link to="/" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Home</Link>
                        <Link to="/about" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">About</Link>
                        <Link to="/blogs" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Blog</Link>
                        <Link to="/projects" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Projects</Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">Contact</Link>
                    </div>

                    {/* Dark Mode Button */}
                    <button onClick={toggleDarkMode} className="text-xl text-gray-800 dark:text-white hover:text-primary transition-all">
                        {darkMode ? <FiSun /> : <FiMoon />}
                    </button>
                </div>
            </nav>

            {/* For Mobile Screen */}
            <nav className='md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/30 dark:bg-bgDark/30 backdrop-blur-xl shadow-lg rounded-full px-6 py-3 z-50 flex items-center justify-between gap-6'>
                <div className='flex justify-between items-center gap-6'>
                    <Link to={"/"} className={`text-xl ${isActive("/") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"}`}> <FiHome/> </Link>
                    <Link to={"/about"} className={`text-xl ${isActive("/about") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"}`}> <FiUser/> </Link>
                    <Link to={"/blog"} className={`text-xl ${isActive("/blog") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"}`}> <FiEdit3/> </Link>
                    <Link to={"/projects"} className={`text-xl ${isActive("/projects") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"}`}> <FiBriefcase/> </Link>
                    <Link to={"/contact"} className={`text-xl ${isActive("/contact") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"}`}> <FiMail/> </Link>
                </div>

                {/* Dark Mode Toggle */}
                <button onClick={toggleDarkMode} className=" text-xl text-gray-800 dark:text-white hover:text-primary transition-all">
                    {darkMode ? <FiSun /> : <FiMoon />}
                </button>
            </nav>
        </>
    )
}

export default Navbar
