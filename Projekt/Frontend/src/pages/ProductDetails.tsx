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
    <div style={{ padding: "20px" }}>
      <Card
        title={product.title}
        cover={<img alt={product.title} src={product.image} />}
      >
        <p>{product.description}</p>
        <p>Cena: ${product.price.toFixed(2)}</p>
        <div>
          Ocena: {product.rating.rate} ({product.rating.count} opinii)
          <br></br>
          <Rate disabled allowHalf defaultValue={product.rating.rate} />
        </div>

        <div style={{ marginTop: "10px" }}>
          <span>Ilość: </span>
          <InputNumber
            min={1}
            max={100}
            value={quantity}
            onChange={(value: number) => setQuantity(value || 1)}
            style={{ width: "60px", marginRight: "10px" }}
          />
        </div>
        <br></br>
        <Button type="primary" onClick={handleAddToCart}>
          Dodaj do koszyka
        </Button>
      </Card>
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
    </div>
  );
};

export default ProductDetails;
