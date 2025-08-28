const User = require("./userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// CREATE USER
const createUser = async (req, res) => {
  try {
    const { name, email, address, contact, password } = req.body
    const image = req.file?.image?.[0]?.filename
    const pancard = req.file?.pancard?.[0]?.filename
    const aadharcard = req.file?.addharcard?.[0]?.filename

    const validation = []
    if (!name || typeof name !== "string") validation.push("name is required and must be string")
    if (!email || typeof email !== "string") validation.push("email is required and must be string")
    if (!address || typeof address !== "string") validation.push("address is required and must be string")
    if (!contact || typeof contact !== "string") validation.push("contact is required and must be string")
    if (!password || typeof password !== "string") validation.push("password is required and must be string")

    if (validation.length > 0) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        error: validation
      })
    }

    // check duplicate email
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword,
      address,
      contact,
      image,
      pancard,
      aadharcard
    })

    await user.save()
    res.status(201).json({
      success: true,
      message: "new user created successfully",
      data: user
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message
    })
  }
}

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or user not found"
      })
    }

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      })
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.name, userEmail: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    )

    res.json({
      success: true,
      message: "user logged in successfully",
      token
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "user login failed",
      error: err.message
    })
  }
}

// GET ALL USERS (with pagination)
const getAllUser = async (req, res) => {
  try {
    let { limit = 3, page = 1 } = req.query
    limit = parseInt(limit)
    page = parseInt(page)

    const skip = (page - 1) * limit
    const users = await User.find().skip(skip).limit(limit)
    const totalDocument = await User.countDocuments()

    res.json({
      success: true,
      message: "all users fetched successfully",
      data: users,
      pagination: {
        totalDocument,
        currentPage: page,
        totalPage: Math.ceil(totalDocument / limit),
        perPage: limit
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "could not fetch users",
      error: err.message
    })
  }
}

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    res.json({
      success: true,
      message: "user fetched successfully",
      data: user
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message
    })
  }
}

// UPDATE USER
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const user = await User.findByIdAndUpdate(id, data, { new: true })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    res.json({
      success: true,
      message: "user updated successfully",
      data: user
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message
    })
  }
}

// DELETE USER
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    res.json({
      success: true,
      message: "user deleted successfully",
      data: deletedUser
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message
    })
  }
}

module.exports = { createUser, loginUser, getAllUser, getUserById, updateUserById, deleteUserById }
