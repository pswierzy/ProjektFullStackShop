const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Pobierz wszystkich userów
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj nowego usera
router.post("/", async (req, res) => {
  const { username, password, role } = req.body;

  const newUser = new User({
    username,
    password,
    role,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Błąd zapisu:", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
