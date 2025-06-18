export const generateMetrics = () => {
  return {
    cpuUsage: (Math.random() * 50 + 20).toFixed(1),           // 20% to 70%
    memoryUsage: (Math.random() * 60 + 30).toFixed(1),        // 30% to 90%
    deploymentSpeed: (Math.random() * 10 + 3).toFixed(2),     // 3s to 13s
    s3Storage: (Math.random() * 8 + 7).toFixed(2),            // 7GB to 15GB
    requestsPerSec: Math.floor(Math.random() * 10) + 1,     // 1-10
    buildSuccessRate: (Math.random() * 5 + 94).toFixed(2),    // 94% to 99%
    uptime: (Math.random() * 0.05 + 99.9).toFixed(3)          // 99.900% to 99.950%
  }
}