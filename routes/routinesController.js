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

