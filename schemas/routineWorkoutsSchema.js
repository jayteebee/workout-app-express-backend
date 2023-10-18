const mongoose = require("mongoose")

const routineWorkoutSchema = new mongoose.Schema({
    routineID: {
        // this dictates that the type will be an object id
        type: mongoose.Schema.Types.ObjectId,
        // referencing the users model
        ref: "routines",
        required: true
    },
    workoutID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workouts",
        required: true
    },
    order: {
        type: Number
    },
    day: {
        type: Array
    }
})

module.exports = mongoose.model("routineWorkouts", routineWorkoutSchema, "routineWorkouts")