const express = require("express")
const router = express.Router()
const {createUser} = require("../api/user/userController")



router.post("/createuser",createUser)

module.exports  = router

