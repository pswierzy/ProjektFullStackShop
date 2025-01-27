import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { loginUser } from "../api";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    const user = await loginUser(values.username, values.password);
    setLoading(false);

    if (user) {
      message.success("Zalogowano pomyślnie!");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } else {
      message.error("Nieprawidłowa nazwa użytkownika lub hasło.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Logowanie</h1>
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Zaloguj się
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
