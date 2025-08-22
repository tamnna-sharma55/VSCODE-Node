const express = require("express")
const router = express.Router()
const {createUser,loginUser,getAllUser,getUserById,updateUserById,deleteUserById} = require("../api/user/userController")
const {createStudent} = require("../api/student/studentController")



router.post("/createuser",createUser)
router.post("/createstudent",createStudent)
router.post("/loginuser",loginUser)
router.post("/getalluser",getAllUser)
router.post("/getuserbyid",getUserById)
router.post("/updateUserById",updateUserById)
router.post("/deleteuserbyid",deleteUserById)
module.exports  = router

