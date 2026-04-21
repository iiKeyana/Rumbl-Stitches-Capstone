import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/products.css";

// const products = [
//     { id: 1, name: "Straw Hat Tee", price: "$42", collection: "One Piece" },
//     { id: 2, name: "Grand Line Hoodie", price: "$78", collection: "One Piece" },
//     { id: 3, name: "Wanted Poster Tee", price: "$42", collection: "One Piece" },
//     { id: 4, name: "Cursed Energy Tee", price: "$42", collection: "Jujutsu Kaisen" },
//     { id: 5, name: "Gojo Fit Hoodie", price: "$78", collection: "Jujutsu Kaisen" },
//     { id: 6, name: "Domain Expansion Tee", price: "$42", collection: "Jujutsu Kaisen" },
//     { id: 7, name: "Breathing Form Tee", price: "$42", collection: "Demon Slayer" },
//     { id: 8, name: "Tanjiro Hoodie", price: "$78", collection: "Demon Slayer" },
// ];

const filters = {
    Collections: ["All", "One Piece", "Jujutsu Kaisen", "Demon Slayer"],
    Category: ["Tops", "Bottoms", "Outerwear", "Accessories"],
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("./api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);

            })
            .catch(() => {
                setError("Failed to load products");
                setLoading(false);

            });

    }, []);

    return (
        <div className="prods-page">

            <div className="prods-header">
                <h1 className="prods-title">Products</h1>

            </div>

            <div className="prods-body">

                <aside className="sidebar">
                    {Object.entries(filters).map(([group, options]) => (
                        <div key={group} className="filter-group">
                            <h3 className="sidebar-title">{group}</h3>

                            <ul className="filter-list">
                                {options.map((f) => (
                                    <li key={f}>
                                        <label className="filter-option">
                                            <input type="checkbox" defaultChecked={f === "All"} />
                                            {f}
                                        </label>

                                    </li>
                                ))}

                            </ul>
                        </div>
                    ))}
                </aside>

                <main className="prods-grid-area">
                    {loading && <p className="prods-status">Loading...</p>}
                    {error && <p className="prods-status">{error}</p>}
                    {!loading && !error && (

                        <div className="prods-grid">
                            {products.map((p) => (
                                <Link key={p._id} to={`/products/${p._id}`} className="product-card">
                                    <div className="product-image">
                                        {p.image
                                            ? <img src={p.image} alt={p.name} />
                                            : <span className="image-label">Image</span>
                                        }
                                        
                                    </div>
                                    <div className="product-info">
                                        <span className="product-name">{p.name}</span>
                                        <span className="product-price">${p.price}</span>
                                    
                                    </div>
                                </Link>
                            ))}
                        
                        </div>
                    )}
                </main>

            </div>

        </div>
    );
}