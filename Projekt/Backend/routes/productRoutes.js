const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, price, description, category, image, stock } = req.body;

  const newProduct = new Product({
    title,
    price: parseFloat(price),
    description,
    category,
    image,
    stock: parseInt(stock) || 0,
    ratings: [],
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Błąd zapisu:", err.message);
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/ratings", async (req, res) => {
  const { userName, rate, comment } = req.body;

  try {
    const result = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          ratings: { userName, rate: parseInt(rate), comment },
        },
      },
      { new: true, runValidators: true }
    );

    if (!result)
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    }
    res.json({ message: "Produkt został usunięty" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
