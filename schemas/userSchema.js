const mongoose = require("mongoose")

// used to structure the data for a user entry
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: false
    },
    weight: {
        type: Number,
        required: false
    }
})

module.exports = mongoose.model("users", userSchema, "users")