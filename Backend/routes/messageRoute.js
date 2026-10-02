import express from "express";
import mongoose from "mongoose";
import messageModel from "../models/messageModel.js";

const msgRouter = express.Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

msgRouter.post('/', async (req, res) => {
    const name = clean(req.body?.name, 120)
    const email = clean(req.body?.email, 200)
    const message = clean(req.body?.message, 5000)

    if (!name || !EMAIL_RE.test(email) || message.length < 2) {
        return res.status(400).json({ success: false, message: "Name, a valid email and a message are required" })
    }
    // fail fast instead of hanging ~10s on mongoose's command buffer
    if (mongoose.connection.readyState !== 1) {
        console.error('message: database not connected')
        return res.status(503).json({ success: false, message: "Message service temporarily unavailable" })
    }

    try {
        await messageModel.create({ name, email, message })
        res.status(200).json({ success: true, message: "Message Sent Successfully" })
    } catch (error) {
        console.error('message: save failed', error)
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
})

export default msgRouter
