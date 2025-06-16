const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ratingSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [0.01, "Cena musi być większa niż 0"],
    set: (v) => parseFloat(v.toFixed(2)),
  },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 },
  ratings: [ratingSchema],
});

module.exports = mongoose.model("Product", productSchema, "products_embedded");
