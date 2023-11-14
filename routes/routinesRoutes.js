const express = require("express")
const router = express.Router()

const {
getAllRoutines,
createRoutine
} = require("../controllers/routinesController")

router.route("/routines")
    .get(getAllRoutines)

router.route("/routines")
    .post(createRoutine)

module.exports = router
