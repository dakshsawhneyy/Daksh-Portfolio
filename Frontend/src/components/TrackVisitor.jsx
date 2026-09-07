import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const TrackVisitor = () => {

    const location = useLocation();

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        if (!backendUrl || import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') return

        const track = async () => {
            try {
                await axios.post(`${backendUrl}/api/visitor`, {
                    path: location.pathname,
                })
            } catch {
                // Analytics must never prevent the portfolio from rendering.
            }
        }

        void track()
    }, [location.pathname])

    return null
}

export default TrackVisitor
