const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  value: { type: Number, required: true },
  items: [
    {
      productId: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

orderSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("Order", orderSchema);
