import React from "react";
import { List, Button, Card, InputNumber } from "antd";
import { useCart } from "../context/CartContext";

const CartPage: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCart();

  const handleQuantityChange = (productID: number, quantity: number) => {
    if (quantity > 0) {
      // Aktualizujemy ilość przez dodanie do koszyka brakujących produktów
      const productInCart = cart.find(([product]) => product.id === productID);
      if (productInCart) {
        const [product, currentQuantity] = productInCart;
        const difference = quantity - currentQuantity;
        if (difference > 0) {
          // Dodajemy brakujące sztuki
          for (let i = 0; i < difference; i++) {
            addToCart(product);
          }
        } else {
          // Usuwamy nadmiarowe sztuki
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Koszyk</h1>
      <List
        dataSource={cart}
        renderItem={([product, quantity]) => (
          <List.Item>
            <Card title={product.title}>
              <p>Cena: ${product.price}</p>
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
        )}
      />
      <div className="total-price">
        Suma całkowita: ${calculateTotal().toFixed(2)}
      </div>
    </div>
  );
};

export default CartPage;
