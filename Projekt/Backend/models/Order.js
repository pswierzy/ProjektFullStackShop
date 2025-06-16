const mongoose = require("mongoose");

const userSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
  },
  { _id: false }
);

const itemSnapshotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  user: { type: userSnapshotSchema, required: true },
  items: [itemSnapshotSchema],
  date: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema, "orders_embedded");
