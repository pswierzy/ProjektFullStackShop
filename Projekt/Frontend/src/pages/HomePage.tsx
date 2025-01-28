import React, { useEffect, useState } from "react";
import { Card, List, Spin, Rate, Button } from "antd";
import { fetchProducts } from "../api/index.tsx";
import { Product } from "../types/index.tsx";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`); // Przekieruj na stronę szczegółów produktu
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h1>Nasze produkty</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <Card
                title={product.title}
                cover={<img alt={product.title} src={product.image} />}
                onClick={() => handleProductClick(product.id)}
              >
                <p>Cena: ${product.price.toFixed(2)}</p>
                <div>
                  <Rate disabled allowHalf defaultValue={product.rating.rate} />
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
      <Button
        type="primary"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
        onClick={() => navigate("/add-product")}
      >
        Dodaj produkt
      </Button>
    </div>
  );
};

export default HomePage;
