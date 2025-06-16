import React, { useState, useEffect } from "react";
import { Alert, Form, Input, InputNumber, Button, message, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../api";
import { Category } from "../types";

const { Option } = Select;

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/products", {
        title: values.title,
        price: values.price,
        description: values.description,
        category: values.category,
        image: values.image,
        stock: values.stock || 0,
      });

      message.success("Produkt został dodany!");
      navigate("/");
    } catch (error) {
      message.error("Wystąpił błąd podczas dodawania produktu.");
    } finally {
      setLoading(false);
    }
  };

  return isAdmin ? (
    <div className="add-product">
      <h2>Dodaj nowy produkt</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nazwa produktu"
          name="title"
          rules={[{ required: true, message: "Podaj nazwę produktu!" }]}
        >
          <Input placeholder="Wpisz nazwę produktu" />
        </Form.Item>

        <Form.Item
          label="Cena (w dolarach)"
          name="price"
          rules={[
            { required: true, message: "Podaj cenę!" },
            { type: "number", min: 0, message: "Cena musi być dodatnia!" },
          ]}
        >
          <InputNumber placeholder="Podaj cenę" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Opis"
          name="description"
          rules={[{ required: true, message: "Podaj opis produktu!" }]}
        >
          <Input.TextArea placeholder="Dodaj opis produktu" rows={4} />
        </Form.Item>

        <Form.Item
          label="Kategoria"
          name="category"
          rules={[{ required: true, message: "Wybierz kategorię!" }]}
        >
          <Select placeholder="Wybierz kategorię">
            {categories.map((category) => (
              <Option value={category.name}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Adres URL zdjęcia"
          name="image"
          rules={[{ required: true, message: "Podaj URL zdjęcia!" }]}
        >
          <Input placeholder="Wstaw link do zdjęcia produktu" />
        </Form.Item>

        <Form.Item
          label="Ilość w magazynie"
          name="stock"
          rules={[
            { required: true, message: "Podaj obecną ilość w magazynie!" },
          ]}
        >
          <Input placeholder="0" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Dodaj produkt
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <div className="auth-page">
      <Alert
        message="Brak dostępu do tej strony!"
        type="warning"
        showIcon
        style={{ textAlign: "center", fontSize: "18px" }}
      />
    </div>
  );
};

export default AddProduct;
