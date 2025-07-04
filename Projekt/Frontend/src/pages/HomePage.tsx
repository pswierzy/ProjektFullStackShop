import React, { useEffect, useState } from "react";
import { Card, List, Spin, Rate, Button } from "antd";
import { fetchProducts } from "../api/index.tsx";
import { Product, Rating } from "../types/index.tsx";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const calculateAverageRating = (ratings: Rating[]) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, r) => total + r.rate, 0);
    return sum / ratings.length;
  };

  return (
    <div className="home-page">
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
                className="product-card"
                onClick={() => handleProductClick(product._id)}
              >
                <p>Cena: ${product.price.toFixed(2)}</p>
                <div>
                  <Rate
                    disabled
                    value={calculateAverageRating(product.ratings)}
                  />
                  <span>({product.ratings.length})</span>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
      {isAdmin && (
        <Button
          type="primary"
          className="add-product-btn"
          onClick={() => navigate("/add-product")}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          Dodaj produkt
        </Button>
      )}
    </div>
  );
};

export default HomePage;
