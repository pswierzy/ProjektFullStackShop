const mongoose = require("mongoose");
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");

const uri =
  "mongodb+srv://admin:admin1!@projektwdai.auj77.mongodb.net/?retryWrites=true&w=majority&appName=ProjektWDAI";

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

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
