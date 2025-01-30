import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Spin,
  Rate,
  Button,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { fetchProductDetails } from "../api";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import axios from "axios";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductDetails(Number(id));
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) addToCart(product);
      setQuantity(1);
    }
  };

  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      console.log(id);
      message.success("Produkt został usunięty!");
      navigate("/");
    } catch (error) {
      message.error("Wystąpił błąd podczas usuwania produktu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!product) {
    return <div>Produkt nie został znaleziony.</div>;
  }

  return (
    <div className="product-details">
      <Card
        title={product.title}
        cover={<img alt={product.title} src={product.image} />}
        className="big-product-card"
      >
        <p>{product.description}</p>
        <p>Cena: ${product.price.toFixed(2)}</p>
        <div>
          Ocena: {product.rating.rate} ({product.rating.count} opinii)
          <Rate disabled allowHalf defaultValue={product.rating.rate} />
        </div>
        <br></br>
        <div className="product-quantity">
          <span>Ilość: </span>
          <InputNumber
            min={1}
            max={100}
            value={quantity}
            onChange={(value: number | null) => setQuantity(value || 1)}
          />
        </div>
        <br></br>
        <Button type="primary" onClick={handleAddToCart}>
          Dodaj do koszyka
        </Button>
      </Card>
      {isAdmin && (
        <Popconfirm
          title="Na pewno chcesz usunąć produkt?"
          onConfirm={handleDeleteProduct}
          okText="Tak"
          cancelText="Nie"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            className="delete-product-btn"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            Usuń produkt
          </Button>
        </Popconfirm>
      )}
    </div>
  );
};

export default ProductDetails;
