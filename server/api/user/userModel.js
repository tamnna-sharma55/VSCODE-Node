const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        default:"null"
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    image:{
        type:String,
        
    },
    pancard:{
        type:String
    },
    addharcard:{
        type:String
    },
    password:{
        type:String,
        required:true,
        default:true
    },
    contact:{
        type:String,
        require:true,
        default:""
    },
    address:{
        type:String,
        require:true,
        default:""
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const User = mongoose.models.User || mongoose.model("User",userSchema)
module.exports = User