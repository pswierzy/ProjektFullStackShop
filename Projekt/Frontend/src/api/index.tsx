import axios from "axios";
import { Product, User, Order } from "../types";

const API_URL = "http://localhost:3000/api";

// Pobierz wszystkie produkty
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania produktów:", error);
    return [];
  }
};

// Pobierz pojedynczy produkt
export const fetchProductDetails = async (
  id: number
): Promise<Product | null> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania produktu:", error);
    return null;
  }
};

// Logowanie użytkownika
export const loginUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users`);
    const correctUser = response.data.find(
      (user) => user.username === username && user.password === password
    );
    return correctUser || null; // Zwróć pierwsze dopasowanie lub null, jeśli brak wyników
  } catch (error) {
    console.error("Błąd logowania:", error);
    return null;
  }
};

// Pobierz wszystkie zamówienia
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania zamówień:", error);
    return [];
  }
};
