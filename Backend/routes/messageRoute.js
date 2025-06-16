import express from "express";
import messageModel from "../models/messageModel.js";

const msgRouter = express.Router()

msgRouter.post('/', async (req,res) => {
    try {
        const { name, email, message } = req.body
        
        const msg = new messageModel({ name, email, message })
        await msg.save()

        res.status(200).json({success: true, message: "Message Sent Successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Something went wrong"})
    }
})

export default msgRouter