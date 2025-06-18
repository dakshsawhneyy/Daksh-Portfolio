import visitorModel from "../models/visiterModel.js";
import express, { Router } from 'express'

const visitorRouter = express.Router()

visitorRouter.post('/', async(req, res) => {
    try {
        
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const userAgent = req.headers['user-agent']
        const { path } = req.body

        // Only add new entry when user changes - if path changes update to existing entry
        let visitor = await visitorModel.findOne({ ip, userAgent });

        if(visitor){
            if(!visitor.paths.includes(path)) {
                visitor.paths.push(path);
                await visitor.save()
            }
        }else{
            visitor = new visitorModel({
                ip, 
                userAgent,
                path,
                timestamp: new Date()
            })
            await visitor.save()
        }

        res.status(201).json({ success:true })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success:false} )
    }
})

export default visitorRouter