const User = require("../api/user/userModel")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const createAdmin = async(req,res) =>{
    try{
        const user = await User.findOne({email:process.env.ADMIN_EMAIL})
        if(user){
           console.log("admin already exist")
           return;
        }

        //hashed password
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
        const admin = new User({
            name:process.env.ADMIN_NAME, 
            email:process.env.ADMIN_EMAIL, 
            password:hashedPassword,
            contact:process.env.ADMIN_CONTACT, 
            address:process.env.ADMIN_ADDRESS
        })

        await admin.save()
       console.log("admin created successfully")

    }
    catch(err){
       console.log("admin is not created due to error:",err.message)

    }
}

module.exports = {createAdmin}