const express = require("express")
const router = express.Router()
const { verifyOtp ,sendOtp, createUser,loginUser,getAllUser,getUserById,updateUserById,deleteUserById} = require("../api/user/userController")
const {createStudent} = require("../api/student/studentController")
const {createPost,getAllPost} = require("../api/post/postController")
const upload = require("../middleware/multer")
const auth = require("../middleware/auth")


router.post("/createuser",upload.fields([{name:"image",maxCount:2},{name:"pancard",maxCount:2},{name:"addharcard",maxCount:2}]),createUser)
router.post("/createstudent",createStudent)
router.post("/loginuser",loginUser)
router.get("/getalluser",auth,getAllUser)
router.get("/getuserbyid",getUserById)
router.post("/updateUserById",updateUserById)
router.post("/deleteuserbyid",deleteUserById)
router.post("/createpost",createPost)
router.post("/getallpost",getAllPost)
router.post("/sendotp",sendOtp)
router.post("/verifyOtp",verifyOtp)

module.exports  = router

