import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authController from '../backend/controllers/authControllers.js'

const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000

//mongoose connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected")
}).catch((err)=>{console.log("error connecting to db",err)})

app.use("/auth/api", authController)

//dummy route
app.get('/',(req,res)=>{
    res.send("hi from derver")
})

app.listen(PORT,(req,res)=>{
    console.log(`server is running on PORT ${PORT}`)
})