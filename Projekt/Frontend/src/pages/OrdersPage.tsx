import React, { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import { fetchOrders } from "../api"; // Import funkcji do pobierania zamówień
import { Order } from "../types"; // Upewnij się, że masz typ Order zdefiniowany

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
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
      dataIndex: "id_order",
      key: "id_order",
    },
    {
      title: "ID Użytkownika",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Wartość",
      dataIndex: "value",
      key: "value",
      render: (value: number) => `${value.toFixed(2)} zł`,
    },
    {
      title: "Produkty",
      dataIndex: "items",
      key: "items",
      render: (items: { product: any; quantity: number }[]) =>
        items.map(
          (item, index) =>
            `Produkt: ${item.product.title || item.product}, Ilość: ${
              item.quantity
            }${index < items.length - 1 ? ", " : ""}`
        ),
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
    <div style={{ padding: "20px" }}>
      <h1>Lista zamówień</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id_order" // Klucz dla identyfikacji wierszy
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default OrdersPage;
