import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import NavigationMenu from "./components/Menu";
import AddProduct from "./pages/AddProduct";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import CategoriesPage from "./pages/CategoriesPage";
import AddCategory from "./pages/AddCategory";
import CategoryProductsPage from "./pages/CategoryProductsPage";

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
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route
          path="/category/:categoryName"
          element={<CategoryProductsPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
