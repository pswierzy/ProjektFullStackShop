const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Pobierz wszystkie produkty
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Pobierz pojedynczy produkt
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product)
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj nowy produkt
router.post("/", async (req, res) => {
  console.log("Otrzymane dane:", req.body);

  const { title, price, description, category, image, rating } = req.body;

  const newProduct = new Product({
    title,
    price: parseFloat(price),
    description,
    category,
    image,
    rating: {
      rate: parseFloat(rating?.rate) || 0,
      count: parseInt(rating?.count) || 0,
    },
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Błąd zapisu:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Usuń produkt
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product)
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    console.log(product);

    await Product.deleteOne({ id: req.params.id });
    res.json({ message: "Produkt został usunięty" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
