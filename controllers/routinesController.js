const Routine = require("../schemas/routineSchema")

// GET REQUESTS
// Get All
const getAllRoutines = async (req,res) => {
    try {
        const routines = await Routine.find()
        res.json(routines)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

// POST REQUESTS
// Create One
const createRoutine = async (req,res) => {
    try {
        const routine = new Routine({
            name: req.body.name,
            frequency: req.body.frequency,
            id: req.body.user_id
        })
        const newRoutine = await routine.save()
        res.status(201).json(newRoutine)
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    getAllRoutines,
    createRoutine
}