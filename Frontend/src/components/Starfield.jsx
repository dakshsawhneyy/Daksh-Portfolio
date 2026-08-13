import React, { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadStarsPreset } from '@tsparticles/preset-stars';

const Starfield = () => {
    const [init, setInit] = useState(false);

    // Mandated v3 lifecycle engine initialization
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadStarsPreset(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);
    
    const isDark = document.documentElement.classList.contains("dark")
    
    if (init) {
        return (
            <Particles
                id="tsparticles"
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

    return null;
}

export default Starfield
