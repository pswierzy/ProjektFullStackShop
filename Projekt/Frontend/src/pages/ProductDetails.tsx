import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Rate, Button, InputNumber } from "antd";
import { fetchProductDetails } from "../api";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

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
        <p>Cena: ${product.price}</p>
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

        <Button type="primary" onClick={() => handleAddToCart()}>
          Dodaj do koszyka
        </Button>
      </Card>
    </div>
  );
};

export default ProductDetails;
