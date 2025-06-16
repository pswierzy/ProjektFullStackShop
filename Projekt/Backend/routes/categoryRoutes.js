const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, superset } = req.body;

  const newCategory = new Category({
    name,
    superset,
  });

  try {
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Kategoria o tej nazwie już istnieje." });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
