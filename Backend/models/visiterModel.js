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

visitorSchema.index({ createdAt:1 }, { expireAfterSeconds: 24 * 60 * 60 * 7 }) // clear after 7 days

const visitorModel = mongoose.models.Visitors || mongoose.model('Visitors', visitorSchema)

export default visitorModel