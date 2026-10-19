const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "baju", price: 150000, stock: 8 },
  { id: 2, name: "sepatu", price: 230000, stock: 17 },
  { id: 3, name: "handuk", price: 50000, stock: 2 },
  { id: 4, name: "lampu", price: 30000, stock: 6 },
];
let nextId = 5;

// GET semua produk
app.get("/api/products", (req, res) => {
  res.json({ data: products });
});

// GET satu produk
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });
  res.json({ data: product });
});

// POST tambah produk
app.post("/api/products", (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: "name, price dan stock wajib terisi" });
  }
  const product = { id: nextId++, name, price, stock };
  products.push(product);
  res.status(201).json({ message: "Produk dibuat", data: product });
});

// PUT update produk
app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

  const { name, price, stock } = req.body;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.json({ message: "Produk berhasil diperbarui", data: product });
});

// DELETE hapus produk
app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Produk tidak ditemukan" });

  products.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log("Server jalan di http://localhost:3000"));