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
  Input,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { fetchProductDetails, addProductRating } from "../api";
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState({ rate: 5, comment: "" });

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsLoggedIn(!!loggedInUser && !!loggedInUser.name);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductDetails(String(id));
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
    if (!product) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/products/${product._id}` // zmiana id_product -> _id
      );
      message.success("Produkt został usunięty!");
      navigate("/");
    } catch (error) {
      message.error("Wystąpił błąd podczas usuwania produktu.");
    }
  };

  const handleAddRating = async () => {
    if (!product) return;

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const newRating = {
      userName: loggedInUser.name,
      rate: userRating.rate,
      comment: userRating.comment,
    };

    const updatedProduct = await addProductRating(product._id, newRating);
    if (updatedProduct) {
      setProduct(updatedProduct);
      setShowRatingForm(false);
      message.success("Dodano ocenę!");
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
          <h3>Oceny:</h3>
          {product.ratings.length > 0 ? (
            <>
              <p>
                Średnia ocena:{" "}
                {(
                  product.ratings.reduce((sum, r) => sum + r.rate, 0) /
                  product.ratings.length
                ).toFixed(1)}{" "}
                ({product.ratings.length} opinii)
              </p>
              <Rate
                disabled
                allowHalf
                defaultValue={
                  product.ratings.reduce((sum, r) => sum + r.rate, 0) /
                  product.ratings.length
                }
              />
              <div style={{ marginTop: "1em" }}>
                {product.ratings.map((r, index) => (
                  <Card key={index} size="small" style={{ marginTop: "10px" }}>
                    <p>
                      <strong>{r.userName}</strong> ocenił na {r.rate}★
                    </p>
                    <p>{r.comment}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p>Brak ocen dla tego produktu.</p>
          )}
        </div>
        <br />
        <div className="product-quantity">
          <span>Ilość: </span>
          <InputNumber
            min={1}
            max={100}
            value={quantity}
            onChange={(value: number | null) => setQuantity(value || 1)}
          />
        </div>

        <br />
        {!showRatingForm ? (
          <Button
            type="primary"
            onClick={() => setShowRatingForm(true)}
            disabled={!isLoggedIn}
            style={{ marginTop: "20px" }}
          >
            Dodaj ocenę
          </Button>
        ) : (
          <Card size="small" style={{ marginTop: "20px" }}>
            <h3>Twoja ocena</h3>
            <Rate
              allowClear
              value={userRating.rate}
              onChange={(value) =>
                setUserRating({ ...userRating, rate: value })
              }
            />
            <br />
            <br />
            <Input.TextArea
              rows={4}
              placeholder="Komentarz"
              value={userRating.comment}
              onChange={(e) =>
                setUserRating({ ...userRating, comment: e.target.value })
              }
            />
            <div style={{ marginTop: "10px" }}>
              <Button type="primary" onClick={handleAddRating}>
                Zapisz ocenę
              </Button>
              <Button
                onClick={() => setShowRatingForm(false)}
                style={{ marginLeft: "10px" }}
              >
                Anuluj
              </Button>
            </div>
          </Card>
        )}
        <br />
        <br />
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
