import React, { useState, useEffect } from "react";
import { List, Button, Card, InputNumber, message } from "antd";
import { useCart } from "../context/CartContext";
import { Product } from "../types";
import { fetchProducts } from "../api/index.tsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const isLoggedIn = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const handleQuantityChange = (productID: number, quantity: number) => {
    if (quantity > 0) {
      const productInCart = cart.find(([product]) => product.id === productID);
      if (productInCart) {
        const [product, currentQuantity] = productInCart;
        const difference = quantity - currentQuantity;
        if (difference > 0) {
          for (let i = 0; i < difference; i++) {
            addToCart(product);
          }
        } else {
          for (let i = 0; i < Math.abs(difference); i++) {
            removeFromCart(product);
          }
        }
      }
    }
  };

  const removeAllQuantity = (productID: number) => {
    const productInCart = cart.find(([product]) => product.id === productID);
    if (productInCart) {
      const [product, currentQuantity] = productInCart;

      for (let i = 0; i < currentQuantity; i++) {
        removeFromCart(product);
      }
    }
  };

  const calculateTotal = () => {
    var result: number = 0;
    cart.map(([product, quantity]) => {
      result += product.price * quantity;
    });
    return result;
  };

  const handleBuyingCart = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId: number = loggedInUser.id_user;
    const totalValue = calculateTotal();

    const values = {
      userId,
      value: totalValue,
      items: cart.map(([product, quantity]) => ({
        product,
        quantity,
      })),
    };
    console.log(values);

    try {
      await axios.post("http://localhost:3000/api/orders", values, {
        headers: { "Content-Type": "application/json" },
      });

      message.success("Zamówienie zostało złożone!");

      cart.map(([product, _]) => {
        removeAllQuantity(product.id);
      });

      navigate("/");
    } catch (error) {
      message.error("Wystąpił błąd podczas składania zamówienia.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Koszyk</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={cart}
        renderItem={([product, quantity]) => {
          const isProductAvailable = products.some(
            (availableProduct) => availableProduct.id === product.id
          );
          return (
            <List.Item>
              <Card
                title={product.title}
                style={{
                  backgroundColor: isProductAvailable ? "white" : "#f8d7da",
                  border: isProductAvailable ? "none" : "2px solid red",
                }}
              >
                <p>Cena: ${product.price.toFixed(2)}</p>
                <p>Łączna wartość: ${(product.price * quantity).toFixed(2)}</p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span>Ilość:</span>
                  <InputNumber
                    min={1}
                    max={1000}
                    value={quantity}
                    onChange={(value: number) =>
                      handleQuantityChange(product.id, value || 1)
                    }
                    disabled={!isProductAvailable}
                  />
                </div>
                <Button
                  danger
                  onClick={() => removeAllQuantity(product.id)}
                  style={{ marginTop: "10px" }}
                >
                  Usuń z koszyka
                </Button>
              </Card>
            </List.Item>
          );
        }}
      />
      <div className="total-price">
        Suma całkowita: ${calculateTotal().toFixed(2)}
      </div>
      <Button
        disabled={!isLoggedIn}
        primal
        onClick={handleBuyingCart}
        style={{ marginTop: "10px" }}
      >
        {isLoggedIn ? "Kup" : "Aby kupić musisz się zalogować"}
      </Button>
    </div>
  );
};

export default CartPage;
