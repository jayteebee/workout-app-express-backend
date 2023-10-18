const express = require("express")
const router = express.Router()

const {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser,
    login,
    createJWT,
    authenticateToken
} = require("../controllers/usersController")

router.route("/register")
    .post(createOneUser)

router.route("/login")
    .post([login, createJWT])

router.route("/users")
    .get(getAllUsers)

router.route("/users/:id")
    .get(getOneUser)
    .put([authenticateToken, updateOneUser])
    .delete(deleteOneUser)

module.exports = router