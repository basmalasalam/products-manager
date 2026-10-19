import db from "./db.js";
import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
const port = 5000;
app.get("/", (req, res) => {
  return res.json({
    message: `Server is listening at port: ${port}`,
  });
});
app.get("/products", (req, res) => {
  db.execute("SELECT * FROM products", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "error finding data" });
    }
    return res.status(200).json({data });
  });
});

app.post("/products", (req, res) => {
  const { name, price, category, stock } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Product name is required",
    });
  }

  db.execute("SELECT * FROM Products WHERE name = ?", [name], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error checking product",
      });
    }

    if (data.length > 0) {
      return res.status(409).json({
        message: "This product already exists",
      });
    }

    db.execute(
      "INSERT INTO Products (name, price, category, stock) VALUES (?, ?, ?, ?)",
      [name, price, category, stock],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error adding product",
            error: err.message,
          });
        }

        return res.status(201).json({
          message: "Product created successfully",
          id: result.insertId,
        });
      },
    );
  });
});
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.execute("DELETE FROM Products WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting product",
        error: err.message,
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product is nott exist",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  });
});

app.put("/products/:id", (req, res) => {
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

  db.execute(
    "UPDATE Products SET name = ?, price = ?, category = ?, stock = ? WHERE id = ?",
    [name, Number(price), category, Number(stock), id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error updating product",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.status(200).json({
        message: "Product updated successfully",
      });
    },
  );
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Server is listening at port: ${port}`);
});
