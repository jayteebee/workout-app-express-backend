const mongoose = require("mongoose")

const routineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    frequency: {
        type: Number,
        required: true
    },
    user: {
        // this dictates that the type will be an object id
        type: mongoose.Schema.Types.ObjectId,
        // referencing the users model
        ref: "users",
        required: true
    }
})

module.exports = mongoose.model("routines", routineSchema, "routines")