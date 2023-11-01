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

// *** LOG IN START ***

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
        const storeAccessTokenForDatabase = new AccessToken({email: email, token: accessToken})
        await storeAccessTokenForDatabase.save()

        const refreshToken = jwt.sign({email}, process.env.REFRESH_TOKEN_SECRET)
        const storeRefreshTokenForDatabase = new RefreshToken({email: email, token: refreshToken})
        await storeRefreshTokenForDatabase.save()
        
        // regenAccessTokenViaRefreshToken(refreshToken, email)
        res.json({accessToken: accessToken, expiresAt: accessToken.exp})
        // verify the access token
        // send the expiry time to the front end
        // send the whole token to the front end
        // on front end, setItem(expiry) to local storage
        // on front end, setItem(token) to local storage

    } else {
        res.send("Failure - Not Authorized")
    }
}

const generateAccessToken = (email) => {
    return jwt.sign({email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20s"})
}

// *** LOG IN END ***


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

const checkAccessTokenExpiry = async () => {
    // There should be a check for if the token has expired as well as if it doesn't exist/is falsey
    const currentAccessToken = await AccessToken.find()
    console.log("currentAccessToken", currentAccessToken)
    if (!currentAccessToken || currentAccessToken.length === 0) {
        return
    }
// MOVE TO FRONT END

    const accessTokenEmail = currentAccessToken[0].email

    try {

        const payload = jwt.verify(currentAccessToken[0].token, process.env.ACCESS_TOKEN_SECRET)
        console.log('payloaf', payload)

        // keep current time stamp
        const currentTimestamp = Math.floor(Date.now() / 1000)
        console.log('payload.exp',payload.exp, "currentTimestamp", currentTimestamp)

        // keep this check, but it'll be in a slightly different format (no payload variable)
        // we only want to refresh the token if it's going to expire very soon (seconds away)
if (payload.exp > currentTimestamp ) {
            console.log('CALLED')
            console.log('payload', payload.exp,"Current", currentTimestamp, "access token email", accessTokenEmail )
            // this will be an API call
            // send email as a argument to the api call

    // on front end, have an array which stores the accessToken that exists in local storage
    // when generating a new access token, save the new token from local storage to the array
    // the array now has 2 tokens, one which is about to expire, and the new token
    // once the new token has been added to the array, delete index 0 (old token) from local storage and from the array
    // use the remaining token for api calls moving forward, until the process repeats when it's about to expire
             regenAccessTokenViaRefreshToken(accessTokenEmail)
        } else {
            return;
        }
    }
    catch (err) {
        console.log('Error verifying access token:', err);
    }
}
// no interval needed
setInterval(checkAccessTokenExpiry, 15000)


// sending up to date accessToken with every api call

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

const regenAccessTokenViaRefreshToken = async (email) => {
    // This will be called from the front end, thus we have access to req,res,next params
    console.log('REGEN CALLED',)
    const userEmail = email;

    const refreshToken = await RefreshToken.find({email: userEmail})

if (refreshToken == null) return res.status(401)

const currentRefreshToken = refreshToken[0].token
console.log('token list', currentRefreshToken)
if (currentRefreshToken.length === 0) return res.status(403).send("Invalid refresh token")

jwt.verify(currentRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, userEmail) => {

    if (err) return console.log("Invalid refresh token")

    // *** LOOK BELOW *** this deleting will occur before the api call made above in the checkAccessTokenExpiry function
    const deleteAccessTokensBelongingToUser = await AccessToken.deleteMany({email: userEmail.email})

    const accessToken = generateAccessToken(userEmail.email) 
    //instead of saving to DB, we do: res.json({accessToken: accessToken})
    const saveRefreshedAccessToken = new AccessToken({email: userEmail.email, token: accessToken})
    await saveRefreshedAccessToken.save()

// delete the access tokens according to the sequence of events in checkAccessTokenExpiry, takes place AFTER a new token is generated

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
 * STEP 1:
 *  Verify Access Token in createJWT
 *  Send Access Token and token.exp as json
 *  Save access token to local storage
 *  Save the expiry time to local storage
 *      
 * STEP 2:
 *  Move checkAccessTokenExpiry to front end
 *  Remove references to reading/writing to database
 *  Keep currentTimestamp variable
 *  Set up a conditional that checks if the access token is going to expire within 20 seconds (example time)
 * 
 *      *** FOLLOW DELETING PROCEDURES ***
 * 
 *  If true: call regenAccessTokenViaRefreshToken(userEmail)
 * 
 * 
 * ACCESS TOKEN EXPIRY TIME: 10 hours
 * REFRESH TOKEN EXPIRY TIME: 7 days
 * 
 * IF the time elapsed since accessToken issuing is between 9:00 hours and 9:59 hours AND an API call is made, then regenerateAccessToken...
 * IF 10 hours have elapsed with no API calls between 9:00 and 9:59 hours, sign the user out
 * 
 * 
 */