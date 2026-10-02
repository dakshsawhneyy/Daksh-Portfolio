import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { apiUrl } from '../lib/api'

const TrackVisitor = () => {

    const location = useLocation();

    useEffect(() => {
        if (import.meta.env.VITE_ENABLE_ANALYTICS !== 'true') return

        const track = async () => {
            try {
                await axios.post(apiUrl('/api/visitor'), {
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
