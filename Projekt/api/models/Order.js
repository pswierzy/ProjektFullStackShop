const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  value: { type: Number, required: true },
  items: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

orderSchema.plugin(AutoIncrement, { inc_field: "id_order" });

module.exports = mongoose.model("Order", orderSchema);
