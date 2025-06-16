const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name: name,
    password: hashedPassword,
    role: role || "user",
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      role: savedUser.role,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Nazwa użytkownika jest już zajęta." });
    }
    console.error("Błąd zapisu:", err.message);
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) return res.status(401).json({ message: "Błędne dane" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(401).json({ message: "Błędne dane" });

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});

module.exports = router;
