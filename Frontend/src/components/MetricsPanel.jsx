import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MetricsPanel = () => {
  const [cpuData, setCpuData] = useState(generateInitialData())
  const [memoryData, setMemoryData] = useState(generateInitialData())

  // Generate initial static data
  function generateInitialData() {
    const now = new Date()
    return Array.from({ length: 6 }).map((_, i) => {
      const time = new Date(now.getTime() - (5 - i) * 1000).toLocaleTimeString().slice(0, 5)
      return {
        time,
        usage: Math.floor(Math.random() * 40 + 30) // 30-70%
      }
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString().slice(0, 5)
      const newCpu = { time, usage: Math.floor(Math.random() * 40 + 30) }
      const newMem = { time, usage: Math.floor(Math.random() * 50 + 40) }

      setCpuData(prev => [...prev.slice(1), newCpu])
      setMemoryData(prev => [...prev.slice(1), newMem])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const ChartCard = ({ title, data, color }) => (
    <div className='bg-white dark:bg-black border border-green-700/50 rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl'>
      <h3 className='text-lg text-primary dark:text-success mb-3'>{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={[20, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="usage" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className='max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-2 gap-6 py-10 px-0 sm:px-6 font-mono'>
      <ChartCard title="Container CPU Usage" data={cpuData} color="#10B981" />
      <ChartCard title="Memory Usage" data={memoryData} color="#3B82F6" />
    </div>
  )
}

export default MetricsPanel
