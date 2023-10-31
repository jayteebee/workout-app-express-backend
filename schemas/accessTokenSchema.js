const mongoose = require("mongoose")

const accessTokenSchema = new mongoose.Schema({
    token: {
        type: String,
    }
})

module.exports = mongoose.model("accessToken", accessTokenSchema, "accessToken")
