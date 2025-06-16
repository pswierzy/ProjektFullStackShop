import React, { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import { fetchOrders, fetchUserOrders } from "../api";
import { Order, ItemSnapshot } from "../types";

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = loggedInUser._id;

        if (loggedInUser.role === "admin") {
          const fetchedOrders = await fetchOrders();
          setOrders(fetchedOrders);
        } else if (userId) {
          const userOrders = await fetchUserOrders(userId);
          setOrders(userOrders);
        }
      } catch (err) {
        setError("Nie udało się pobrać zamówień.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Kolumny tabeli
  const columns = [
    {
      title: "ID Zamówienia",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Użytkownik",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: "Produkty",
      dataIndex: "items",
      key: "items",
      render: (items: ItemSnapshot[]) => (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.title} - {item.count} x ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Suma",
      key: "total",
      render: (record: Order) => {
        const total = record.items.reduce(
          (sum, item) => sum + item.price * item.count,
          0
        );
        return `$${total.toFixed(2)}`;
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div className="orders-container">
      <div className="orders-page">
        <h1>Lista zamówień</h1>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      </div>
    </div>
  );
};

export default OrdersPage;
