import { Menu, MenuProps } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import logo from "../resources/logo.jpg";

type MenuItem = Required<MenuProps>["items"][number];

const NavigationMenu = () => {
  const location = useLocation();
  const { cart } = useCart();
  const isLoggedIn = localStorage.getItem("user");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  const cartItemsCount = cart.reduce(
    (total, [_, quantity]) => total + quantity,
    0
  );

  const unfilteredItems = [
    {
      label: <Link to="/">Strona główna</Link>,
      key: "/",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/categories">Kategorie</Link>, // Dodany nowy element
      key: "/categories",
      icon: <FolderOutlined />,
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
    (isAdmin || !isLoggedIn) && {
      label: <Link to="/register">Rejestracja</Link>,
      key: "/register",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/orders">Zamówienia</Link>,
      key: "/orders",
      icon: <FileTextOutlined />,
    },
  ];

  const items: MenuItem[] = unfilteredItems.filter(Boolean) as MenuItem[];

  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="Logo" style={{ height: "80px" }} />
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        className="navigation-menu"
      />
    </div>
  );
};

export default NavigationMenu;
