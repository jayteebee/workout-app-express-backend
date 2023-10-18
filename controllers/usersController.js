const express = require("express")
const User = require("../schemas/userSchema")

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

module.exports = {
    getAllUsers
}