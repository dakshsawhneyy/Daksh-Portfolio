import mongoose from 'mongoose'

const visitorSchema = new mongoose.Schema({
    ip: String,
    userAgent: String,
    paths: [String],
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const visitorModel = mongoose.models.Visitors || mongoose.model('Visitors', visitorSchema)

export default visitorModel