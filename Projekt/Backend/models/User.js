const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

userSchema.plugin(AutoIncrement, { inc_field: "id_user" });

module.exports = mongoose.model("User", userSchema);
