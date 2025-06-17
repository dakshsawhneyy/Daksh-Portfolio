import visitorModel from "../models/visiterModel.js";
import express, { Router } from 'express'

const visitorRouter = express.Router()

visitorRouter.post('/', async(req, res) => {
    try {
        
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const userAgent = req.headers['user-agent']
        const { path } = req.body

        const newVisitor = new visitorModel({
            ip, 
            userAgent,
            path,
            timestamp: new Date()
        })

        await newVisitor.save()
        res.status(201).json({ success:true })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false} )
    }
})

export default visitorRouter