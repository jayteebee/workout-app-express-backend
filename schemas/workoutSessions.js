const mongoose = require("mongoose")

const workoutSessionsSchema = new mongoose.Schema({
    routineWorkoutID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "routinesWorkouts",
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    date: {
        type: date
    },
    totalDuration: {
        type: Number
    }
})

module.exports = mongoose.model("workoutSessions", workoutSessionsSchema, "workoutSessions")