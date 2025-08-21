const express = require("express")
const router = express.Router()
const {createUser} = require("../api/user/userController")
const {createStudent} = require("../api/student/studentController")



router.post("/createuser",createUser)
router.post("/createstudent",createStudent)

module.exports  = router

