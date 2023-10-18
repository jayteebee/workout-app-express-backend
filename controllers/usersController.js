const express = require("express")
const User = require("../schemas/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// GET REQUESTS
// Get All
const getAllUsers = async (req,res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

// Get One
const getOneUser = async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

// POST REQUESTS
// Create One User
const createOneUser = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const newUser = await user.save()
        res.status(201).json(newUser)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

const checkUserData = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password
    const user = await User.findOne({email: email})

    if (!user) {
    res.status(500).send("Can't find user in database.");
    }

    try {
        if ( await bcrypt.compare(password, user.password)) {
            req.userEmail = email
            req.loginSuccess = true
            next()
        } else {
            req.loginSuccess = false
            next()
        }
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

const handleJWT = async (req,res) => {
    if (req.loginSuccess) {
        const email = req.userEmail
        const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
        res.json({accessToken: accessToken})
    } else {
        res.send("Failure - Not Authorized")
    }
}

// PUT REQUESTS
// Update One User
const updateOneUser = async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id)
        res.status(201).json(user)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

// DELETE REQUESTS
// Delete One User
const deleteOneUser = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(201).json(user)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser,
    checkUserData,
    handleJWT
}