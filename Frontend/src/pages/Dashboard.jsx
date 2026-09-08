import { useEffect, useState } from 'react'
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
        <div className="metric-box">
            <p>{label}</p>
            <h3>{value}</h3>
        </div>
    )

  return (
    <main className="metrics-page">
        <header className="metrics-header">
            <div><p className="eyebrow">Observability / live workspace</p><h1>SRE control room</h1></div>
            <p>Streaming synthetic signals across the systems I build, operate, and automate.</p>
        </header>

        {/* Dashboards */}
        <div className="metrics-grid">
            <MetricBox label="CPU Usage" value={`${metrics.cpuUsage}`}></MetricBox>
            <MetricBox label="Memory Usage" value={`${metrics.memoryUsage}`}></MetricBox>
            <MetricBox label="Deployment Speed" value={`${metrics.deploymentSpeed}`}></MetricBox>
            <MetricBox label="S3 Storage" value={`${metrics.s3Storage}`}></MetricBox>
            <MetricBox label="Requests Per Minute" value={`${metrics.requestsPerSec}`}></MetricBox>
            <MetricBox label="Build Success Rate" value={`${metrics.buildSuccessRate}%`} />
            <MetricBox label="Uptime" value={`${metrics.uptime}%`} />
            <MetricBox label="Network Latency" value={`${metrics.networkLatency}`} />
            <MetricBox label="Container Restarts" value={`${metrics.containerRestarts}`} />
            <MetricBox label="Cost Per Hour" value={`${metrics.costPerHour}`} />
        </div>

        {/* Line chart panel below */}
        <MetricsPanel />

    </main>
  )
}

export default Dashboard