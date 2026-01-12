import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import User from '../schema/user.js'
import bcryptjs from 'bcryptjs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const authController = express()

authController.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(404).json({ message: "user already exists" })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const savedUser = await newUser.save()
        res.status(201).json({ savedUser })

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

//login
authController.post('/login', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (!existingUser) {
            return res.status(404).json({ message: "not an existing user" })
        }

        const isMatch = await bcrypt.compare(req.body.password, existingUser.password)
        if (!isMatch) {
            return res.status(404).json({ message: "incorrect password" })
        }

        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );


        res.status(200).json({ message: "login successfull" , token})

    }catch (err) {
        res.status(404).json({ message: err.message })
    }
})

authController.put('/users/:email', async (req,res)=>{
    try{
        const updatedUser = await User.findOneAndUpdate({email:req.params.email}, req.body,{new:true})
        if(!updatedUser){
            return res.status(400).json({message:"user not found"})
        }
        res.status(200).json(updatedUser)

    }catch (err) {
        res.status(404).json({ message: err.message })
    }
})

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

authController.get("/profiles", verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default authController
