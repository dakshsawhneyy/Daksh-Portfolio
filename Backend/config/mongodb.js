import mongoose from "mongoose";

const connectDB = async() => {
    mongoose.connection.on('connected',() => {
        console.log("connected to mongoose successfully");
    })

    mongoose.connection.on('error', (err) => console.error('mongoose error:', err.message))
    mongoose.connection.on('disconnected', () => console.warn('mongoose disconnected'))
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set — /api/message will return 503')
        return
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    } catch (err) {
        // log instead of crashing with an unhandled rejection; the route answers 503
        console.error('mongoose connect failed:', err.message)
    }
}

export default connectDB;