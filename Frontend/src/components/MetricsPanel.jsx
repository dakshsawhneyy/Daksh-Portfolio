import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = () => [
  { time: '10:00', usage: (Math.random() * (40-39)) + 39},
  { time: '10:15', usage: (Math.random() * (50-49)) + 49},
  { time: '10:30', usage: (Math.random() * (60-59)) + 59},
  { time: '10:45', usage: (Math.random() * (20-19)) + 19},
  { time: '11:00', usage: 70 },
  { time: '11:15', usage: 65 },
];

const MetricsPanel = () => {
  return (
    <div className='max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-6 font-mono'>
        <div className='bg-white dark:bg-black border border-green-700/50 rounded-xl p-4 shadow-2xl'>
            <h3 className='text-lg text-primary dark:text-success mb-3'>Container CPU Usage</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data()}>
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