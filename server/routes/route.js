const express = require("express")
const router = express.Router()
const {createUser,loginUser} = require("../api/user/userController")
const {createStudent} = require("../api/student/studentController")



router.post("/createuser",createUser)
router.post("/createstudent",createStudent)
router.post("/loginuser",loginUser)

module.exports  = router

