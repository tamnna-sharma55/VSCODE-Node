const User = require("./userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("../../config/nodemailer")
require("dotenv").config()


const createUser = async (req, res) => {
  try {
    const { name, email, address, contact, password } = req.body;

    // Access files from req.files
    const image = req.files?.image?.[0]?.filename;
    const pancard = req.files?.pancard?.[0]?.filename;
    const addharcard = req.files?.addharcard?.[0]?.filename;

    const validation = [];

    if (!name || typeof name !== "string") {
      validation.push("name is required and type must be string ");
    }
    if (!email || typeof email !== "string") {
      validation.push("email is required and type must be string ");
    }
    if (!address || typeof address !== "string") {
      validation.push("address is required and type must be string ");
    }
    if (!contact || typeof contact !== "string") {
      validation.push("contact is required and type must be string ");
    }
    if (!password || typeof password !== "string") {
      validation.push("password is required and type must be string ");
    }
    if (validation.length > 0) {
      return res.json({
        status: 400,
        success: false,
        message: "validation error",
        error: validation,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      contact,
      image,
      pancard,
      addharcard,
    });

    await user.save();
    res.json({
      status: 201,
      success: true,
      message: "new user is created successfully",
      data: user,
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};


const loginUser = async (req,res) =>{
    try{
        const {name,email,password} = req.body
        const user = await User.findOne({name, email})
        if (!user){
            return res.json({
                status:404,
                success:g=false,
                message:"it is not a valid user"
            })
        }

        const matchPassword = await bcrypt.compare(password,user.password)
        if(!matchPassword){
            return res.json({
                status:404,
                success:false,
                message:"password is not valid"

            })
        }

        const token = jwt.sign(
            {userId:user._id,userName:user.name, userEmail:user.email},
            process.env.SECRET_KEY,
            {expiresIn:"1d"}
        )
        res.json({
            status:200,
            success:true,
            message:"user is login succesfully",
            token
        })
    }
    catch(err){
        res.json({
            status:500,
            success:false,
            message:"user is not login",
            error:err.message
        })

    }
}

//getalluer
const getAllUser = async(req,res) => {
    try{
        let {limit=3,page=1} = req.query

        limit = parseInt(limit)
        page = parseInt(page)

        //calculation of skip

        const skip = (page-1) * limit
        const user = await User.find().skip(skip).limit(limit)
        const totalDocument = await User.countDocuments()
        res.json({
            status:200,
            success:true,
            message:"all user is get successfully",
            data:user,
            pagination:{
                totalDocument,
                currentPage:page,
                totalPage:Math.ceil(totalDocument/limit),
                perPage:limit
            }
        })

    }
    catch(err){
        res.json({
            status:500,
            success:false,
            message:"user can not get successfully",
            error:err.message

        })



    }
}

// const getAllUser = async(req,res) =>{
//     try{
//         const user = await User.find()
//         res.json({
//             status:200,
//             success:true,
//             message:"all user get succesfully",
//             data:user
//         })

//     }
//     catch(err){
//         res.json({
//             status:500,
//             success:false,
//             message:"internal server error",err,
//             error:err.message
//         })

//     }
// }

// get user by id

const getUserById = async(req,res) =>{
    try{
        const{id} = req.body
            if(!id){
                return res.json({
                    status:400,
                    success:false,
                    message:"id is required"
                })
            }

        
        const user = await User.findById(id)
        if(!user){
             return res.json({
                    status:400,
                    success:false,
                    message:"id is wrong"
                })

        }
        res.json({
            status:200,
            success:true,
            message:"user is get successfully",
            data : user
        })

    }
    catch(err){
        res.json({
            status:500,
            success:false,
            message:"internal server error",
            error:err.message
        })

    }
}
//update user by id
const updateUserById = async (req,res) => {
    try{
        const {id,...data} = req.body
        if(!id){
            return res.json({
                status:400,
                success:false,
                message:"id is required"
            })
        }
        const user = await User.findByIdAndUpdate(id,data,{new:true})
        if(!user){
            res.json({
                status:400,
                success:false,
                message:"id is wrong"
            })
        }
        res.json({
            status:200,
            success:false,
            message:"user is updated successfully",
            data:user
        })

    }

    catch(err){
        res.json({
            status:500,
            success:false,
            message:"internal server error",
            error:err.message
        })

    }
}

//delete user by id

const deleteUserById = async(req,res) =>{
    try{
        const {id} = req.body
        if(!id){
            return res.json({
                status:400,
                success:false,
                message:"id is required"
            })
        }

        const deleteUser = await User.findByIdAndDelete(id)
        if(!deleteUser){
            res.json({
                status:400,
                success:false,
                message:"id is wrong or document is not exist"
            })
        }

        res.json({
            status:200,
            success:true,
            message:"user is deleted successfully",
            data:deleteUser
        })

    }
    catch(err){
        res.json({
            status:500,
            success:false,
            message:"internal server error",
            error:err.message
        }) 

    }
}

const sendOtp = async(req,res) => {
  try{
    const {email} = req.body
    const user  =await User.findOne({email})
    if(!user){
      return res.json({
        status:400,
        success:false,
        message:"invalid email id"
      })
    }

    const otp = Math.floor(100000+Math.random()*900000).toString()
    const expire = Date.now()+5*60*1000  //otp five minutes
    user.otp = otp
    user.otpExpire = expire

    await user.save()

    const subject = "your otp code"
    const message = `your otp code is ${otp}.it is expire in 5 minute`
    const result = await nodemailer(email,subject,message)
    console.log(otp)
    res.json({
      status:200,
      success:true,
      message:"otp is created successfully",
      data:result
    })
  
  }
  catch(err){
    res.json({
      status:500,
      success:false,
      message:"internal server error",
      error:err.message
    })

  }
}

const verifyOtp = async(req, res) => {
    try {
        const { email, otp, newpassword } = req.body
        const user = await User.findOne({ email })
        if (!user || user.otp.toString() !== otp.toString()) {
            return res.json({
                status: 400,
                success: false,
                message: "invalid user or invalid otp or expire otp"
            })
        }

        user.password = await bcrypt.hash(newpassword, 10)
        user.otp = null
        user.otpExpire = null
        await user.save()
        res.json({
            success: true,
            message: "password reset successfully"
        })
    } catch (err) {
        res.json({

            status: 500,
            success: false,
            message: "password is not reset",

        })
    }
}

module.exports = { createUser , loginUser, getAllUser ,getUserById, updateUserById,deleteUserById,sendOtp,verifyOtp}