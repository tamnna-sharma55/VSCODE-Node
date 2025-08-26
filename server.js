const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json()); // parse JSON body

// API route for registration
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  console.log("Received data:", req.body);

  // Example: you’d normally save to DB here
  res.json({ message: `User ${name} registered successfully!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
