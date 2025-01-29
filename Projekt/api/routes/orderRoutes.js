const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// Pobierz wszystkie zamówienia
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj nowe zamówienie
router.post("/", async (req, res) => {
  const { userId, value, items } = req.body;

  console.log(req.body);

  const newOrder = new Order({
    userId,
    value,
    items,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Błąd zapisu:", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
