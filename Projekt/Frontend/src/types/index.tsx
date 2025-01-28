export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
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

export interface Order {
  id: number;
  userId: number;
  value: number;
  items: {
    product: Product;
    quantity: number;
  }[];
}
