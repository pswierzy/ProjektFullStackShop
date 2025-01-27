export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: {
    rate: number;
    count: number;
  };
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: "user" | "admin";
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  email: string;
}
