import "dotenv/config";
import pool from "./db.js";

async function setup() {
  const host = process.env.DB_HOST || "";
  const isAiven = host.includes("aivencloud");
  console.log(
    isAiven
      ? "Connecting to: Aiven (cloud database)"
      : "Connecting to: LOCAL database (not Aiven!)"
  );
  console.log("SSL enabled:", process.env.DB_SSL === "true");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(50),
      stock INT NOT NULL DEFAULT 0
    )
  `);

  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM products");

  if (rows[0].count === 0) {
    await pool.query(
      "INSERT INTO products (name, price, category, stock) VALUES ?",
      [
        [
          ["Laptop", 15000, "Electronics", 5],
          ["Headphones", 800, "Electronics", 0],
          ["T-Shirt", 250, "Clothes", 20],
          ["Notebook", 30, "Stationery", 100],
        ],
      ]
    );
    console.log("Table created and 4 products inserted");
  } else {
    console.log("Table already has data, nothing inserted");
  }

  await pool.end();
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});