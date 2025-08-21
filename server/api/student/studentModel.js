const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        default:null
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        default:true
    },
    phonenumber:{
        type:String,
        required:true,
        default:""
    },
    address:{
        type:String,
        required:true,
        default:""
    },
    studentClass:{
        type:String,
        required:true,
        default:""

    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Student = mongoose.models.Student || mongoose.model("Student",studentSchema)
module.exports = Student