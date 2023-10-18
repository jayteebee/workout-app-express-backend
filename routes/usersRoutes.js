const express = require("express")
const router = express.Router()

const {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser,
    login,
    handleJWT
} = require("../controllers/usersController")

router.route("/register")
    .post(createOneUser)

router.route("/login")
    .post([login, handleJWT])

router.route("/users")
    .get(getAllUsers)

router.route("/users/:id")
    .get(getOneUser)
    .put(updateOneUser)
    .delete(deleteOneUser)

module.exports = router