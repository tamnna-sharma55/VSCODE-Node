const mongoose = require("mongoose")
require("dotenv").config()
const createDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully")
    }
    catch(err){
        console.log("database is not connected successfully",err)
        process.exit(1)
    }
}
module.exports = createDB