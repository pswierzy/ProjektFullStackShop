import React, { useEffect, useState } from "react";
import { Card, List, Spin, Rate, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api";
import { Category, Product } from "../types";

const lookForParent = (
  itemCategory: Category,
  ourCategory: string | undefined,
  allCategories: Category[]
): boolean => {
  if (itemCategory.name === ourCategory) {
    return true;
  }

  if (itemCategory.superset) {
    const parentCategory = allCategories.find(
      (c) => c.name === itemCategory.superset
    );
    if (parentCategory) {
      return lookForParent(parentCategory, ourCategory, allCategories);
    }
  }
  return false;
};

const CategoryProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { categoryName } = useParams<{ categoryName: string }>();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      const filteredProducts = productsData.filter((product) => {
        const productCategory = categoriesData.find(
          (c) => c.name === product.category
        );
        return (
          productCategory &&
          lookForParent(productCategory, categoryName, categoriesData)
        );
      });

      setProducts(filteredProducts);
      setLoading(false);
    };

    loadData();
  }, [categoryName]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const calculateAverageRating = (ratings: any[]) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, r) => total + r.rate, 0);
    return sum / ratings.length;
  };

  return (
    <div className="home-page" style={{ padding: "20px" }}>
      <h1>Produkty w kategorii: {categoryName}</h1>
      {loading ? (
        <Spin size="large" />
      ) : products.length === 0 ? (
        <p>Brak produktów w tej kategorii</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <Card
                hoverable
                title={product.title}
                cover={
                  <img
                    alt={product.title}
                    src={product.image}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                }
                onClick={() => handleProductClick(product._id)}
              >
                <p>Cena: ${product.price.toFixed(2)}</p>
                <div>
                  <Rate
                    disabled
                    allowHalf
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

export default CategoryProductsPage;
