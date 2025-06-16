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
  const [allAvailable, setAllAvailable] = useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let result: boolean = true;
    cart.map(([product, _]) => {
      if (!products.some((someProduct) => someProduct._id === product._id))
        result = false;
    });
    setAllAvailable(result);
  });

  const handleQuantityChange = (productID: string, quantity: number) => {
    if (quantity > 0) {
      const productInCart = cart.find(([product]) => product._id === productID);
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

  const removeAllQuantity = (productID: string) => {
    const productInCart = cart.find(([product]) => product._id === productID);
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
    if (cart.length === 0) {
      message.warning("Dodaj coś do koszyka żeby kupić!");
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId: string = loggedInUser._id;
    const items = cart.map(([product, quantity]) => ({
      productId: product._id,
      count: quantity,
    }));

    console.log(items);

    try {
      await axios.post(
        "http://localhost:3000/api/orders",
        { userId, items },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success("Zamówienie zostało złożone!");
      cart.forEach(([product]) => removeAllQuantity(product._id));
      navigate("/");
    } catch (error) {
      message.error("Wystąpił błąd podczas składania zamówienia.");
    }
  };

  return (
    <div className="cart-page">
      <h1>Koszyk</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={cart}
        renderItem={([product, quantity]) => {
          const isProductAvailable = products.some(
            (availableProduct) => availableProduct._id === product._id
          );
          return (
            <List.Item>
              <Card
                title={product.title}
                className={isProductAvailable ? "" : "product-unavailable"}
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
                    onChange={(value: number | null) =>
                      handleQuantityChange(product._id, value || 1)
                    }
                    disabled={!isProductAvailable}
                  />
                </div>
                <Button
                  type="dashed"
                  onClick={() => removeAllQuantity(product._id)}
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
        disabled={!isLoggedIn || !allAvailable}
        type="primary"
        onClick={handleBuyingCart}
        style={{ marginTop: "10px", color: "white" }}
      >
        {isLoggedIn ? "Kup" : "Aby kupić musisz się zalogować"}
      </Button>
    </div>
  );
};

export default CartPage;
