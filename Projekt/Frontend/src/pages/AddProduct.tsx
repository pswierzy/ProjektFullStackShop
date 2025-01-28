import React, { useState } from "react";
import { Form, Input, InputNumber, Button, message, Select } from "antd";
import axios from "axios";

const { Option } = Select;

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Wyślij dane do backendu
      await axios.post("http://localhost:3000/api/products", values, {
        headers: { "Content-Type": "application/json" },
      });

      message.success("Produkt został dodany!");
    } catch (error) {
      message.error("Wystąpił błąd podczas dodawania produktu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
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
            <Option value="electronics">Elektronika</Option>
            <Option value="fashion">Moda</Option>
            <Option value="home">Dom</Option>
            <Option value="beauty">Uroda</Option>
            <Option value="sports">Sport</Option>
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
          label="Ocena (wartość)"
          name={["rating", "rate"]}
          rules={[
            {
              type: "number",
              min: 0,
              max: 5,
              message: "Ocena musi być między 0 a 5!",
            },
          ]}
        >
          <InputNumber placeholder="Podaj ocenę" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ocena (liczba opinii)"
          name={["rating", "count"]}
          rules={[
            {
              type: "number",
              min: 0,
              message: "Liczba opinii musi być dodatnia!",
            },
          ]}
        >
          <InputNumber
            placeholder="Podaj liczbę opinii"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Dodaj produkt
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
