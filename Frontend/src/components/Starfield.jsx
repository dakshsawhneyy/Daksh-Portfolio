import React from 'react'
import Particles from 'react-tsparticles'
import { loadStarsPreset } from 'tsparticles-preset-stars';

const Starfield = () => {
    
    const particlesInit = async(main) => {
        await(loadStarsPreset(main))
    }
    
    const isDark = document.documentElement.classList.contains("dark")
    
    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                preset: "stars",
                background: {
                    color:{
                        value: isDark ? "#000000" : "#FDFDFD"
                    },
                },
                fullscreen: {
                    enable: true,
                    zIndex: -1,
                },
            }}
        />
    )
}

export default Starfield
