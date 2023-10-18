const express = require("express")
const router = express.Router()

const {
    getAllUsers,
    getOneUser,
    createOneUser
} = require("../controllers/usersController")

router.route("/users/register")
    .post(createOneUser)

router.route("/users")
    .get(getAllUsers)

router.route("/users/:id")
    .get(getOneUser)


module.exports = router