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

const authTokenMiddleware = authenticateToken

router.route("/register")
    .post(createOneUser)

router.route("/login")
    .post([login, createJWT])

router.use(authTokenMiddleware)

router.route("/users")
    .get(getAllUsers)

router.route("/users/:id")
    .get(getOneUser)
    .put(updateOneUser)
    .delete(deleteOneUser)

module.exports = router