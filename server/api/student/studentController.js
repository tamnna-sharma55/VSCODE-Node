const bcrypt = require("bcryptjs");
const Student = require("./studentModel");

const createStudent = async (req, res) => {
  try {
    const { name, email, address, phonenumber, studentClass, password } = req.body;
    const validation = [];

    if (!name || typeof name !== "string") {
      validation.push("name is required and type must be string");
    }
    if (!email || typeof email !== "string") {
      validation.push("email is required and type must be string");
    }
    if (!address || typeof address !== "string") {
      validation.push("address is required and type must be string");
    }
    if (!phonenumber || typeof phonenumber !== "string") {
      validation.push("phonenumber is required and type must be string");
    }
    if (!password || typeof password !== "string") {
      validation.push("password is required and type must be string");
    }
    if (!studentClass || typeof studentClass !== "string") {
      validation.push("studentClass is required and type must be string");
    }

    if (validation.length > 0) {
      return res.status(400).json({
        success: false,
        message: "validation error",
        errors: validation,
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      address,
      phonenumber,
      studentClass,
    });

    await student.save();

    return res.status(201).json({
      success: true,
      message: "new student is created successfully",
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

module.exports = { createStudent };
