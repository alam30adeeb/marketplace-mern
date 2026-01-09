import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import User from '../schema/user.js'
import bcryptjs from 'bcryptjs'

const authController = express()

authController.post('/register', async (req,res)=>{
    try{
        const existingUser = await User.findOne({email: req.body.email})
        if(existingUser){
            return res.status(404).json({message:"user already exists"})
        }

        const hashedPassword = await bcryptjs.hash(req.body.password,10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const savedUser = await newUser.save()
        res.status(201).json({savedUser})

    }catch(err){
        res.status(404).json({message:err.message})
    }
})






export default authController
