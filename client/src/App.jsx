import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import Navbar from "../src/components/Navbar.jsx";
import ProductForm from "./components/ProductForm.jsx";
import ProductList from "./components/ProductList.jsx";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  console.log(products);
  async function handleDelete(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");

    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (editingProduct && editingProduct.id === id) {
      setEditingProduct(null);
    }
  } catch (err) {
    console.error(err);
    alert("Could not delete the product");
  }
}
  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  console.log(editingProduct);

  const handleSave = async (product) => {
  try {
    if (editingProduct) {
      
      const res = await fetch(`${API_URL}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...product, id: editingProduct.id }
            : p
        )
      );
      setEditingProduct(null);
    } else {
     
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to add product");

      const data = await res.json();
      const newId = data.id ?? data.insertId;

      setProducts((prev) => [...prev, { ...product, id: newId }]);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong, please try again");
  }
};
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

useEffect(() => {
  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await res.json();

      const list = Array.isArray(result) ? result : result.data;

      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  fetchProducts();
}, []);

  return (
    <>
      <Navbar count={products.length} />

      <ProductForm
        key={editingProduct ? editingProduct.id : "new"}
        editingProduct={editingProduct}
        onSave={handleSave}
        onCancel={() => setEditingProduct(null)}
      />
      <div className="container mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredProducts.length > 0 ? (
        <ProductList
          products={filteredProducts}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ) : (
        <p className="text-center mt-4 text-muted">No products found</p>
      )}
    </>
  );
}

export default App;
