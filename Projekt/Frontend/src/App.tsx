import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import NavigationMenu from "./components/Menu";
import AddProduct from "./pages/AddProduct";
import RegisterPage from "./pages/RegisterPage";

const App: React.FC = () => {
  return (
    <Router>
      <NavigationMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
