const express = require("express")
const router = express.Router()

const {
getAllRoutines
} = require("../controllers/routinesController")

router.route("/routines")
    .get(getAllRoutines)

module.exports = router
