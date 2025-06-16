import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { addCategory, fetchCategories } from "../api";
import { Category } from "../types";

const { Option } = Select;

const AddCategory: React.FC = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
      await addCategory(values.name, values.superset || null);
      message.success("Kategoria dodana!");
      navigate("/categories");
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        message.error("Kategoria o tej nazwie już istnieje.");
      } else {
        message.error("Wystąpił błąd podczas dodawania kategorii.");
      }
    } finally {
      setLoading(false);
    }
  };

  return isAdmin ? (
    <div className="auth-page" style={{ padding: "20px", maxWidth: "600px" }}>
      <h1>Dodaj nową kategorię</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nazwa kategorii"
          name="name"
          rules={[{ required: true, message: "Podaj nazwę kategorii!" }]}
        >
          <Input placeholder="Wpisz nazwę kategorii" />
        </Form.Item>

        <Form.Item label="Kategoria nadrzędna" name="superset">
          <Select
            placeholder="Wybierz kategorię nadrzędną (opcjonalnie)"
            allowClear
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Dodaj kategorię
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <div className="auth-page" style={{ padding: "20px", textAlign: "center" }}>
      <h2>Brak dostępu do tej strony</h2>
      <p>Tylko administrator może dodawać nowe kategorie</p>
    </div>
  );
};

export default AddCategory;
