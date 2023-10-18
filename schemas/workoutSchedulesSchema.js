const mongoose = require("mongoose")

const workoutSchedulesSchema = new mongoose.Schema({
    userID: {
        // this dictates that the type will be an object id
        type: mongoose.Schema.Types.ObjectId,
        // referencing the users model
        ref: "users",
        required: true
    },
    routineWorkoutID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "routinesWorkouts",
        required: true
    },
    date: {
        type: date
    },
    completed: {
        type: Boolean
    }
})

module.exports = mongoose.model("workoutSchedules", workoutSchedulesSchema, "workoutSchedules")