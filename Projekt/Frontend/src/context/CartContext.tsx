import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

interface CartContextType {
  cart: [Product, number][];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<[Product, number][]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const cartMap = new Map<string, [Product, number]>(
        prevCart.map(([item, quantity]) => [item._id, [item, quantity]])
      );

      if (cartMap.has(product._id)) {
        const [existingItem, quantity] = cartMap.get(product._id)!;
        cartMap.set(product._id, [existingItem, quantity + 1]);
      } else {
        cartMap.set(product._id, [product, 1]);
      }

      return Array.from(cartMap.values());
    });
  };

  const removeFromCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        ([item]) => item._id === product._id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        const [product, quantity] = updatedCart[existingItemIndex];

        if (quantity > 1) {
          updatedCart[existingItemIndex] = [product, quantity - 1];
        } else {
          updatedCart.splice(existingItemIndex, 1);
        }

        return updatedCart;
      }

      return prevCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart musi być użyty wewnątrz CartProvider");
  }
  return context;
};
