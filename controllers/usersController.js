const express = require("express")
const User = require("../schemas/userSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const RefreshToken = require("../schemas/refreshTokenSchema")
const AccessToken = require("../schemas/accessTokenSchema")

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

const login = async (req,res,next) => {
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

const createJWT = async (req,res) => {
    if (req.loginSuccess) {
        const email = req.userEmail
        
        const accessToken = generateAccessToken(email)
        const storeAccessTokenForDatabase = new AccessToken({token: accessToken})
        await storeAccessTokenForDatabase.save()

        const refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET)
        const storeRefreshTokenForDatabase = new RefreshToken({email: email, token: refreshToken})
        await storeRefreshTokenForDatabase.save()
        
        regenAccessTokenViaRefreshToken(refreshToken, email)
        res.json({accessToken: accessToken, refreshToken: refreshToken})
    } else {
        res.send("Failure - Not Authorized")
    }
}

const generateAccessToken = (email) => {
    return jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"})
}

// PUT REQUESTS
// Update One User
const updateOneUser = async (req,res) => {
    try {
        // new: true = return the updated json instead of original
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
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
        res.status(201).send(`DELETED USER: ${user.name}, ID: ${user._id} `)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

// Middleware
const authenticateToken = (req,res,next) => {
    // access the authorization header in the incoming request (think: axiosInstanceWithToken)
const authHeader = req.headers["authorization"]
console.log('authHeader', authHeader)
const token = authHeader && authHeader.split(" ")[1]
if (token == null) return res.status(401)

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    console.log('email', email)
      if (err) return res.sendStatus(403)
      req.user = email
      next()
})
}

const regenAccessTokenViaRefreshToken = async (refreshToken, email) => {
    const userEmail = email;
if (refreshToken == null) return res.status(401)

const tokenList = await RefreshToken.find({token: refreshToken})
if (tokenList.length === 0) return res.status(403).send("Invalid refresh token")

jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userEmail) => {

    if (err) return res.status(403).send("Invalid refresh token")
    const accessToken = generateAccessToken(userEmail.email)
    // res.json({accessToken: accessToken})
    console.log('regen access token', accessToken)
})
}

module.exports = {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser,
    login,
    createJWT,
    authenticateToken,
    regenAccessTokenViaRefreshToken
}

/**
 * create access token schema
 * save access token to database
 * 
 * create checkAccessTokenExpiry function
 * check for expiry
 * 
 */