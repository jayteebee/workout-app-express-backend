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
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}


module.exports = {
    getAllUsers,
    getOneUser
}