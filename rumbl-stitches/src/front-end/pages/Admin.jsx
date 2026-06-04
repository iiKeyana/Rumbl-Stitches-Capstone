import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import "../assets/css/profile.css";

export default function Admin() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const [tab, setTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState({
        name: "",
        price: "",
        image: "",
        description:"",
        collection: "",
        category: "",
        sizes: "S,M,L,XL,XXL",
        tags: ""
    });
    const [stockEdits, setStockEdits] = useState({});

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");

            return;
        }

        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);

        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });

    };

    const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const openAdd = () => {
        setEditingProduct(null);
        setForm({ name: "", price: "", image: "", description: "", collection: "", category: "", sizes: "S,M,L,XL,XXL", tags: "" });
        setShowForm(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            price: product.price,
            image: product.image || "",
            description: product.description || "",
            collection: product.collection || "",
            category: product.category || "",
            sizes: (product.sizes || []).join(","),
            tags: (product.tags || []).join(",")

        });

        setShowForm(true);
    };

    const handleSubmit = async () => {
        const body = {...form,
            price: parseFloat(form.price),
            sizes: form.sizes.split(",").map(s => s.trim()),
            tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)

        };

        const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
        const method = editingProduct ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)

        });

        setShowForm(false);
        fetchProducts();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchProducts();
    };

    const handleStockChange = (productId, size, value) => {
        setStockEdits(prev => ({ ...prev, [productId]: { ...(prev[productId] || {}), [size]: value }}));
        
    };

    const saveStock = async (product) => {
        const updates = stockEdits[product._id] || {};
        const merged = { ...(product.stock_by_size || {}) };

        Object.keys(updates).forEach(size => { merged[size] = parseInt(updates[size]); });

        await fetch(`/api/products/${product._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ stock_by_size: merged })
            
        });

        setStockEdits(prev => ({ ...prev, [product._id]: {} }));
        fetchProducts();
    };

    return (
        <div className="prof-page">
            <div className="prof-header">
                <Link to="/" className="prof-logo">ADMIN</Link>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Link to="/profile" className="prof-back">&#8592; Profile</Link>

                </div>

            </div>

            <div className="prof-body">
                <aside className="prof-sidebar">
                    <div className="prof-avatar" style={{ background: "black", color: "white" }}>
                        {user.first_name?.[0]}{user.last_name?.[0]}

                    </div>

                    <p className="prof-name">{user.first_name} {user.last_name}</p>
                    <p className="prof-email">{user.email}</p>

                    <nav className="prof-nav">
                        <button className={`prof-nav-link ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
                            Products

                        </button>

                        <button className={`prof-nav-link ${tab === "inventory" ? "active" : ""}`} onClick={() => setTab("inventory")}>
                            Inventory

                        </button>

                    </nav>

                </aside>

                <main className="prof-main">
                    {tab === "products" && (
                        <section className="prof-section">
                            <div className="prof-section-top">
                                <h2 className="prof-section-title">Products</h2>

                                <button className="admin-add-btn" onClick={openAdd}>
                                    <MdAdd/> Add Product

                                </button>

                            </div>

                            {showForm && (
                                <div className="admin-form">
                                    <h3 className="admin-form-title">{editingProduct ? "Edit Product" : "Add Product"}</h3>

                                    <div className="admin-form-grid">
                                        {[
                                            { name: "name", placeholder: "Product Name" },
                                            { name: "price", placeholder: "Price" },
                                            { name: "image", placeholder: "Image URL" },
                                            { name: "collection", placeholder: "Collection" },
                                            { name: "category", placeholder: "Category" },
                                            { name: "sizes", placeholder: "Sizes (S,M,L,XL,XXL)" },
                                            { name: "tags", placeholder: "Tags" },

                                        ].map(field => (
                                            <input
                                                key={field.name}
                                                className="admin-form-input"
                                                name={field.name}
                                                value={form[field.name]}
                                                onChange={handleFormChange}
                                                placeholder={field.placeholder}
                                            />

                                        ))}

                                        <textarea
                                            className="admin-form-textarea"
                                            name="description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            placeholder="Description"
                                        />

                                    </div>

                                    <div className="admin-form-actions">
                                        <button className="admin-save-btn" onClick={handleSubmit}>
                                            {editingProduct ? "Save Changes" : "Add Product"}

                                        </button>

                                        <button className="admin-cancel-btn" onClick={() => setShowForm(false)}>
                                            Cancel
                                            
                                        </button>

                                    </div>

                                </div>
                            )}

                            {loading ? <p className="prof-empty">Loading...</p> : (
                                <div className="admin-prod-list">

                                    {products.map(product => (
                                        <div key={product._id} className="admin-prod-row">
                                            <div className="admin-prod-img">
                                                {product.image ? <img src={product.image} alt={product.name} /> : <span>IMG</span>}

                                            </div>

                                            <div className="admin-prod-info">
                                                <span className="admin-prod-name">{product.name}</span>
                                                <span className="admin-prod-meta">{product.collection} &#183; ${product.price}</span>

                                            </div>

                                            <div className="admin-prod-actions">
                                                <button className="admin-edit-btn" onClick={() => openEdit(product)}>
                                                    <MdEdit />

                                                </button>

                                                <button className="admin-delete-btn" onClick={() => handleDelete(product._id)}>
                                                    <MdDelete />

                                                </button>

                                            </div>

                                        </div>

                                    ))}
                                </div>

                            )}
                        </section>

                    )}

                    {tab === "inventory" && (
                        <section className="prof-section">
                            <h2 className="prof-section-title">Inventory</h2>

                            {loading ? <p className="prof-empty">Loading...</p> : (
                                <div className="admin-inv-list">

                                    {products.map(product => (
                                        <div key={product._id} className="admin-inv-card">
                                            <div className="admin-inv-header">
                                                <span className="admin-prod-name">{product.name}</span>
                                                <span className="admin-prod-meta">{product.collection}</span>

                                            </div>

                                            <div className="admin-inv-grid">
                                                {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map(size => (
                                                    <div key={size} className="admin-inv-item">
                                                        <label className="admin-inv-label">{size}</label>

                                                        <input
                                                            className="admin-inv-input"
                                                            type="number"
                                                            min="0"
                                                            defaultValue={product.stock_by_size?.[size] ?? 0}
                                                            onChange={(e) => handleStockChange(product._id, size, e.target.value)}
                                                        />

                                                    </div>

                                                ))}
                                            </div>

                                            <button className="admin-save-btn" onClick={() => saveStock(product)}>
                                                Save Stock

                                            </button>

                                        </div>

                                    ))}
                                    
                                </div>

                            )}
                        </section>

                    )}
                </main>
            </div>
        </div>
    );
}