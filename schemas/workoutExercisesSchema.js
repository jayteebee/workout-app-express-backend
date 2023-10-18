const mongoose = require("mongoose")

const workoutExercisesSchema = new mongoose.Schema({
    exerciseID: {
        // this dictates that the type will be an object id
        type: mongoose.Schema.Types.ObjectId,
        // referencing the users model
        ref: "exercises",
        required: true
    },
    workoutID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workouts",
        required: true
    },
    sets: {
        type: Number
    },
    reps: {
        type: Number
    },
    weight: {
        type: Number
    },
    restTimer: {
        type: Number
    },
})

module.exports = mongoose.model("workoutExercises", workoutExercisesSchema, "workoutExercises")