const mongoose = require("mongoose")

const accessTokenSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    token: {
        type: String,
    }
})

module.exports = mongoose.model("accessToken", accessTokenSchema, "accessToken")
