const User = require("./userModel")



const createUser = async(req, res) => {
    try {
        const { name, email, address, contact, password } = req.body
        const validation = []

        if (!name || typeof name !== "string") {
            validation.push("name is required and type must be string ")
        }
        if (!email || typeof email !== "string") {
            validation.push("email is required and type must be string ")
        }
        if (!address || typeof address !== "string") {
            validation.push("address is required and type must be string ")
        }
        if (!contact || typeof contact !== "string") {
            validation.push("contact is required and type must be string ")
        }
        if (!password || typeof password !== "string") {
            validation.push("password is required and type must be string ")
        }
        if (validation.length > 0) {
            return res.json({
                status: 400,
                success: false,
                message: "validation error",
                error: validation
            })
        }


        const user = new User({
            name: name,
            email: email,
            password: password,
            address: address,
            contact: contact
        })

        await user.save()
        res.json({
            status: 201,
            success: true,
            message: "new user is create successfully",
            data: user
        })
    } catch (err) {
        res.json({
            status: 500,
            success: false,
            message: "interval server error",
            error: err.message
        })

    }
}
module.exports = { createUser }