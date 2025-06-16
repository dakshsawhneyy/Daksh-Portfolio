import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MetricsPanel = () => {

    const [cpuMetric, setCpuMetric] = useState([
        { time: '00:00', usage: 30 },
        { time: '00:05', usage: 45 },
        { time: '00:10', usage: 35 },
        { time: '00:15', usage: 55 },
        { time: '00:20', usage: 60 },
        { time: '00:25', usage: 48 },
    ])

    // using useEffect to dynamically change
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuMetric(prev => {
                const newCpuUsage = Math.floor(Math.random() * 10 + 15)
                const newTime = new Date().toLocaleTimeString().slice(0,5)
                const updated = [...prev.slice(1), { time: newTime, usage: newCpuUsage }]
                return updated
            })
        }, 2000);
    
        return () => clearInterval(interval)
    }, [])
    

  return (
    <div className='max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-6 font-mono'>
        <div className='bg-white dark:bg-black border border-green-700/50 rounded-xl p-4 shadow-2xl'>
            <h3 className='text-lg text-primary dark:text-success mb-3'>Container CPU Usage</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cpuMetric}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usage" stroke="#10B981" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  )
}

export default MetricsPanel