import React, { useEffect, useState } from 'react'
import MetricsPanel from '../components/MetricsPanel'
import { generateMetrics } from '../data/Dashboard'

const Dashboard = () => {

    // Need to create state for changing metrics
    const [metrics, setMetrics] = useState(generateMetrics())

    // Use effect to change every 1 second the metics
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(generateMetrics())
        }, 1500);   // change every 1 second

        return () => clearInterval(interval)

    }, [])

    const MetricBox = ({label, value}) => (
        <div className="bg-white w-full dark:bg-[#0f0f0f] border border-green-500/30 p-5 rounded-xl shadow-xl hover:shadow-green-300/30 transition-all">
            <p className="text-sm text-gray-500 dark:text-green-200 mb-2">{label}</p>
            <h3 className="text-2xl font-bold tracking-wider">{value}</h3>
        </div>
    )

  return (
    <div className='min-h-screen px-4 py-16 md:pt-24 bg-white dark:bg-black text-primary dark:text-success font-mono'>
        <h1 className="text-3xl md:text-3xl mb-10 terminal-blink text-center dark:text-green-600">$ watch ~/metrics/logs.sh</h1>

        {/* Dashboards */}
        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <MetricBox label="CPU Usage" value={`${metrics.cpuUsage}`}></MetricBox>
            <MetricBox label="Memory Usage" value={`${metrics.memoryUsage}`}></MetricBox>
            <MetricBox label="Deployment Speed" value={`${metrics.deploymentSpeed}`}></MetricBox>
            <MetricBox label="S3 Storage" value={`${metrics.s3Storage}`}></MetricBox>
            <MetricBox label="Requests Per Minute" value={`${metrics.requestsPerSec}`}></MetricBox>
            <MetricBox label="Build Success Rate" value={`${metrics.buildSuccessRate}%`} />
            <MetricBox label="Uptime" value={`${metrics.uptime}%`} />
        </div>

        {/* Line chart panel below */}
        <MetricsPanel />

    </div>
  )
}

export default Dashboard