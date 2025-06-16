const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  superset: { type: String },
});

module.exports = mongoose.model(
  "Category",
  categorySchema,
  "categories_embedded"
);
