const mongoose = require("mongoose")

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        // this dictates that the type will be an object id
        type: mongoose.Schema.Types.ObjectId,
        // referencing the users model
        ref: "users",
        required: true
    }
})

module.exports = mongoose.model("workouts", workoutSchema, "workouts")