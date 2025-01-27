// src/components/NavigationMenu.tsx
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useCart } from "../context/CartContext";

const NavigationMenu = () => {
  const location = useLocation();
  const { cart } = useCart();
  const isLoggedIn = localStorage.getItem("user"); // Prosta weryfikacja logowania

  // Liczba produktów w koszyku
  const cartItemsCount = cart.reduce(
    (total, [_, quantity]) => total + quantity,
    0
  );

  const items = [
    {
      label: <Link to="/">Strona główna</Link>,
      key: "/",
      icon: <HomeOutlined />,
    },
    {
      label: (
        <Link to="/cart">
          Koszyk {cartItemsCount > 0 && `(${cartItemsCount})`}
        </Link>
      ),
      key: "/cart",
      icon: <ShoppingCartOutlined />,
    },
    {
      label: isLoggedIn ? (
        <span
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          Wyloguj
        </span>
      ) : (
        <Link to="/login">Logowanie</Link>
      ),
      key: isLoggedIn ? "/logout" : "/login",
      icon: <UserOutlined />,
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        padding: "0 20px",
        backgroundColor: "#f0f2f5",
      }}
    />
  );
};

export default NavigationMenu;
