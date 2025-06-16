const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router();

// Pobierz wszystkie zamówienia
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj nowe zamówienie
router.post("/", async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Nieprawidłowe dane zamówienia." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });
    }

    const userSnapshot = {
      name: user.name,
      role: user.role,
    };

    const itemsSnapshot = [];
    const productIds = items.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
    })
      .session(session)
      .select("+__v");

    for (const item of items) {
      const product = products.find((p) => p._id.equals(item.productId));
      if (!product) {
        throw new Error(
          `Produkt o ID ${item.productId} nie został znaleziony.`
        );
      }
      if (product.stock < item.count) {
        throw new Error(
          `Niewystarczająca ilość produktu "${product.title}" w magazynie.`
        );
      }

      product.stock -= item.count;

      itemsSnapshot.push({
        title: product.title,
        price: product.price,
        count: item.count,
      });
    }

    await Promise.all(
      products.map((product) =>
        Product.updateOne(
          { _id: product._id, __v: product.__v },
          { $set: { stock: product.stock }, $inc: { __v: 1 } }
        ).session(session)
      )
    );

    const newOrder = new Order({
      user: userSnapshot,
      items: itemsSnapshot,
      date: new Date(),
    });

    await newOrder.save({ session });
    await session.commitTransaction();
    res.status(201).json(newOrder);
  } catch (err) {
    await session.abortTransaction();
    console.error("Błąd tworzenia zamówienia:", err.message);
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// Pobierz zamówienia dla konkretnego użytkownika
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowy format ID użytkownika." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Użytkownik o podanym ID nie został znaleziony." });
    }

    const userOrders = await Order.find({ "user.name": user.name }).sort({
      date: -1,
    });

    res.json(userOrders);
  } catch (err) {
    console.error("Błąd pobierania zamówień użytkownika:", err.message);
    res.status(500).json({ message: "Wystąpił błąd serwera." });
  }
});

module.exports = router;
