const express = require("express")
const router = express.Router()

const {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser
} = require("../controllers/usersController")

router.route("/users/register")
    .post(createOneUser)

router.route("/users")
    .get(getAllUsers)

router.route("/users/:id")
    .get(getOneUser)
    .put(updateOneUser)
    .delete(deleteOneUser)
    
module.exports = router