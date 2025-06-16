import axios from "axios";
import { Product, User, Order, Rating, Category } from "../types";

const API_URL = "http://localhost:3000/api";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania produktów:", error);
    return [];
  }
};

export const fetchProductDetails = async (
  id: string
): Promise<Product | null> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania produktu:", error);
    return null;
  }
};

export const loginUser = async (
  name: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await axios.post<{ user: User }>(
      `${API_URL}/users/login`,
      {
        name,
        password,
      }
    );
    return response.data.user;
  } catch (error) {
    return null;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania zamówień:", error);
    return [];
  }
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await axios.get<Order[]>(
      `${API_URL}/orders/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania zamówień:", error);
    return [];
  }
};

export const addProductRating = async (
  productId: string,
  rating: Omit<Rating, "id">
): Promise<Product | null> => {
  try {
    const response = await axios.post<Product>(
      `${API_URL}/products/${productId}/ratings`,
      rating
    );
    return response.data;
  } catch (error) {
    console.error("Błąd dodawania oceny:", error);
    return null;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get<Category[]>(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania kategorii:", error);
    return [];
  }
};

export const addCategory = async (
  name: string,
  superset: string | null
): Promise<Category | null> => {
  try {
    console.log(name, superset);
    const response = await axios.post<Category>(`${API_URL}/categories`, {
      name,
      superset: superset || undefined,
    });
    return response.data;
  } catch (error) {
    console.error("Błąd dodawania oceny:", error);
    return null;
  }
};
