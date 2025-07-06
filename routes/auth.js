const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// === Login Admin ===
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari admin berdasarkan email
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Email salah atau tidak terdaftar" });
    }

    // Cek password
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }  // Token berlaku 7 hari
    );

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router;
