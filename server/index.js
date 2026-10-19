import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

// الروابط المسموح لها تكلّم الباك (ممكن أكتر من رابط بينهم فاصلة)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Render بيحدد البورت بنفسه
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.json({
    message: `Server is listening at port: ${port}`,
  });
});

// عرض الكل (بيرجّع مصفوفة مباشرة)
app.get("/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id");
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "error finding data",
      error: err.message,
      code: err.code,
    });
  }
});

// بحث بالاسم (اختياري، لازم قبل أي route فيه :id)
app.get("/products/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE name LIKE ? ORDER BY id",
      [`%${q}%`],
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error searching products" });
  }
});

// إضافة
app.post("/products", async (req, res) => {
  const { name, price, category, stock } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Product name is required",
    });
  }

  try {
    // التأكد إن الاسم مش مكرر
    const [existing] = await pool.query(
      "SELECT id FROM products WHERE name = ?",
      [name],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "This product already exists",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)",
      [name, price, category, stock],
    );

    return res.status(201).json({
      message: "Product created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error adding product",
      error: err.message,
    });
  }
});

// حذف
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product does not exist",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error deleting product",
      error: err.message,
    });
  }
});

// تعديل
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;

  if (!name || price == null || !category || stock == null) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (
    typeof name !== "string" ||
    typeof category !== "string" ||
    !Number.isFinite(Number(price)) ||
    !Number.isInteger(Number(stock)) ||
    Number(price) < 0 ||
    Number(stock) < 0
  ) {
    return res.status(400).json({
      message: "Invalid product data",
    });
  }

  try {
    const [result] = await pool.query(
      "UPDATE products SET name = ?, price = ?, category = ?, stock = ? WHERE id = ?",
      [name, Number(price), category, Number(stock), id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error updating product",
      error: err.message,
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is listening at port: ${port}`);
  });
}

export default app;
