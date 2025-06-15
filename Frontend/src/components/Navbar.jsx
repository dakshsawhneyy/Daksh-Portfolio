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
            <nav className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-6xl w-full px-6 justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-grotesk font-bold text-primary">Daksh</Link>
                    
                    {/* Nav Links */}
                    <div className="flex gap-6 px-10 py-3 backdrop-blur-md bg-white/30 dark:bg-bgDark/40 shadow-lg rounded-full border border-white/20 dark:border-gray-700 transition-all duration-300">
                        <Link to="/" className={`relative text-sm font-semibold uppercase tracking-wide ${isActive("/") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"} transition-all duration-300`}>Home <span className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 ${location.pathname === "/" ? "w-full" : "group-hover:w-full"}`}></span></Link>
                        <Link to="/about" className={`relative text-sm font-semibold uppercase tracking-wide ${isActive("/about") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"} transition-all duration-300`}>About <span className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 ${location.pathname === "/about" ? "w-full" : "group-hover:w-full"}`}></span></Link>
                        <Link to="/blog" className={`relative text-sm font-semibold uppercase tracking-wide ${isActive("/blog") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"} transition-all duration-300`}>Blog <span className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 ${location.pathname === "/blog" ? "w-full" : "group-hover:w-full"}`}></span></Link>
                        <Link to="/projects" className={`relative text-sm font-semibold uppercase tracking-wide ${isActive("/projects") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"} transition-all duration-300`}>Projects <span className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 ${location.pathname === "/projects" ? "w-full" : "group-hover:w-full"}`}></span></Link>
                        <Link to="/contact" className={`relative text-sm font-semibold uppercase tracking-wide ${isActive("/contact") ? "text-primary" : "text-gray-800 dark:text-white hover:text-primary"} transition-all duration-300`}>Contact <span className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 ${location.pathname === "/contact" ? "w-full" : "group-hover:w-full"}`}></span></Link>
                    </div>

                    {/* Dark Mode Button */}
                    <button onClick={toggleDarkMode} className="text-2xl text-gray-800 dark:text-white hover:text-primary transition-all">
                        {darkMode ? <FiSun /> : <FiMoon />}
                    </button>
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
