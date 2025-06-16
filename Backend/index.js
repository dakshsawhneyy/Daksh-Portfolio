import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/mongodb.js';

const app = express();
const port = process.env.port || 4000
connectDB()

// Middlewares
app. use(cors())
app.use(express.json())

// Api's
app.get('/', (req,res) => {
    res.send("Hello Master Daksh !!")
})

app.listen(port, () => console.log(`Server is running on port ${port}`))