const express = require("express")
const router = express.Router()

const {
    getAllUsers,
    getOneUser
} = require("../controllers/usersController")

router.route("/users")
    .get(getAllUsers)


router.route("/users/:id")
    .get(getOneUser)


    
module.exports = router