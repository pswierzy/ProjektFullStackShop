const mongoose = require("mongoose");
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");
const Category = require("./models/Category");
require("dotenv").config();
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(uri, clientOptions)
  .then(() => {
    console.log("Połączono z MongoDB!");
  })
  .catch((err) => {
    console.error("Błąd połączenia z MongoDB:", err);
  });

// Endpointy
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
