import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message, Select } from "antd";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    if (!values.role) values.role = "user";
    try {
      // Wyślij dane do backendu
      await axios.post("http://localhost:3000/api/users", values, {
        headers: { "Content-Type": "application/json" },
      });

      message.success("Uzytkownik został zarejestrowany!");
      navigate("/login");
    } catch (error) {
      message.error("Wystąpił błąd podczas rejestracji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Rejestracja</h1>
      <Form onFinish={onFinish}>
        <Form.Item
          label="Login"
          name="username"
          rules={[{ required: true, message: "Podaj nazwę użytkownika!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Hasło"
          name="password"
          rules={[{ required: true, message: "Podaj hasło!" }]}
        >
          <Input.Password />
        </Form.Item>

        {isAdmin ? (
          <Form.Item
            label="Rola"
            name="role"
            rules={[{ required: true, message: "Wybierz rolę!" }]}
          >
            <Select placeholder="Wybierz rolę" defaultValue="user">
              <Option value="user">Użytkownik</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        ) : (
          <></>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Zaloguj się
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
