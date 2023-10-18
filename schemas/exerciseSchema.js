const mongoose = require("mongoose")

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number
    },
    personalBest: {
        type: Number
    },
    equipmentUsed: {
        type: String,
        required: true
    },
    primaryMuscles: {
        type: Array,
        required: true
    },
    secondaryMuscles: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("exercises", exerciseSchema, "exercises")