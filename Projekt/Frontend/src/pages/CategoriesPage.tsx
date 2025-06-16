import React, { useEffect, useState } from "react";
import { Button, Tree, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../api";
import { Category } from "../types";
import { FolderOutlined } from "@ant-design/icons";

// Definicja typu dla węzła drzewa
interface TreeNode {
  title: React.ReactNode;
  key: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(loggedInUser?.role === "admin");
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  // Funkcja do przekształcenia kategorii w strukturę drzewa
  const buildTree = (
    categories: Category[],
    parent: string | null = null
  ): TreeNode[] => {
    return categories
      .filter(
        (category) =>
          category.superset === parent ||
          (category.superset === undefined && parent === null)
      )
      .map((category) => ({
        title: (
          <Link to={`/category/${category.name}`} style={{ fontSize: "16px" }}>
            {category.name}
          </Link>
        ),
        key: category._id,
        icon: <FolderOutlined />,
        children: buildTree(categories, category.name),
      }));
  };

  const treeData = buildTree(categories);

  return (
    <div className="orders-container">
      <div className="orders-page">
        <h1>Kategorie Produktów</h1>
        {loading ? (
          <Spin size="large" />
        ) : categories.length === 0 ? (
          <p>Brak kategorii do wyświetlenia</p>
        ) : (
          <Tree
            showIcon
            treeData={treeData}
            defaultExpandAll
            className="category-tree"
            style={{ backgroundColor: "transparent" }}
          />
        )}

        {isAdmin && (
          <Button
            type="primary"
            className="add-product-btn"
            onClick={() => navigate("/add-category")}
            style={{ marginTop: "20px" }}
          >
            Dodaj kategorię
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
