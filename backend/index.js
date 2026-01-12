import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authController from './controllers/authControllers.js'
import cors from 'cors'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())

//mongoose connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("db connected")
}).catch((err)=>{console.log("error connecting to db",err)})

app.use("/auth/api", authController)

//dummy route
app.get('/',(req,res)=>{
    res.send("hi from server")
})

app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
})