import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const TrackVisitor = () => {

    const location = useLocation();

    // When location.pathname changes, track the visitor details
    useEffect(() => {
        const track = () => {
            try {
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/visitor`, {
                    path: location.pathname,    // Passing path because backend knows, user exploring which path
                })
            } catch (error) {
                console.log('Tracking Failed', error)
            }
        }

        track()
    }, [location.pathname])

    return null
}

export default TrackVisitor
