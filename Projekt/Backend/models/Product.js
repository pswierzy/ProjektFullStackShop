const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
});

productSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Product", productSchema);
