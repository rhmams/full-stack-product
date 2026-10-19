import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //state untuk form
  const [form, setForm] = useState({name: "", price: "", stock: ""});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  //ambil semua produk
  const fetchProducts = () => {
    fetch(API_URL)
    .then((res) => res.json())
    .then((json) => {
      setProducts(json.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //update state form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value});
  };

  //kirm data ke api post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

  if (!form.name || form.price === "" || form.stock === "") {
  setError("Nama, harga dan stok wajib diisi");
  return;
  }

  setSaving(true);
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.message || "Gagal menambahkan produk");
    } else {
      setForm({ name: "", price: "", stock: "" });
      fetchProducts();
    }
  } catch (err) {
    setError ("Tidak bisa terhubung ke server");
  } finally {
    setSaving(false);
  }
};

if (loading) return <p>Loading..</p>;


    return (
    <div style={{ padding: 20 }}>
      <h1>Daftar Produk</h1>

      <h2>Tambah Produk</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            name="name"
            placeholder="Nama produk"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "+ Tambah Produk"}
        </button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Stok</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>Rp {p.price.toLocaleString("id-ID")}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;