const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model

const router = express.Router();

// 📄 Get User Medical History (Formatted Table)
router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Ensure correct token extraction
  if (!token) return res.status(401).json({ message: "❌ Unauthorized" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    // Return formatted data with Serial Number
    const formattedHistory = user.medicalHistory.map((entry, index) => ({
      "S.No": index + 1,
      date: entry.date,
      disease: entry.disease, 
      doctor: entry.doctor,
      hospital: entry.hospital,
      medication: entry.medication,
      ID: entry._id 
    }));

    res.json(formattedHistory);
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid token" });
  }
});

// ➕ Add New Medical History Record
router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Ensure correct token extraction
  if (!token) return res.status(401).json({ message: "❌ Unauthorized" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const { date, disease, doctor, hospital, medication } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    user.medicalHistory.push({ date, disease, doctor, hospital, medication });
    await user.save();

    res.status(201).json({ message: "✅ Medical history added successfully!" }); // Set correct status code
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid token" });
  }
});

module.exports = router;
