export interface Rating {
  userName: string;
  rate: number;
  comment: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  ratings: Rating[];
}

export interface Category {
  _id: string;
  name: string;
  superset: string;
}

export interface User {
  _id: string;
  name: string;
  password: string;
  role: "user" | "admin";
}

export interface Order {
  _id: string;
  user: UserSnapshot;
  items: ItemSnapshot[];
  date: Date;
}

export interface ItemSnapshot {
  title: string;
  price: number;
  count: number;
}

export interface UserSnapshot {
  name: string;
  role: string;
}
