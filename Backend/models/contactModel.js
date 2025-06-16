import mongoose, { mongo } from "mongoose";

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema)

export default contactModel