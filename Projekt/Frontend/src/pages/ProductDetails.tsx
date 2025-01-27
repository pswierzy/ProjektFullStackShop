import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Rate } from "antd";
import { fetchProductDetails } from "../api";
import { Product } from "../types";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductDetails(Number(id));
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

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
        <p>
          Ocena: {product.rating.rate} ({product.rating.count} opinii)
          <br></br>
          <Rate disabled allowHalf defaultValue={product.rating.rate} />
        </p>
      </Card>
    </div>
  );
};

export default ProductDetails;
