const mongoose = require("mongoose")

const exerciseSessionsSchema = new mongoose.Schema({
    exerciseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exercises",
        required: true
    },
    workoutSessionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workoutSessions",
        required: true
    },
    setsCompleted: {
        type: Number
    },
    repsCompleted: {
        type: Number
    },
    weightUsed: {
        type: Number
    },
    setTimer: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("exerciseSessions", exerciseSessionsSchema, "exerciseSessions")