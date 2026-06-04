import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/products.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";

const filters = {
    Collections: ["All", "One Piece", "Jujutsu Kaisen", "Demon Slayer"],
    Category: ["Tops", "Bottoms", "Outerwear", "Accessories"],
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState("All");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const search = searchParams.get("search");

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (selectedCollection !== "All") params.set("collection", selectedCollection);
        if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);

        const search = searchParams.get("search");
        if (search) params.set("search", search);

        fetch(`./api/products?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);

            })
            .catch(() => {
                setError("Failed to load products");
                setLoading(false);

            });

    }, [selectedCollection, selectedCategories, searchParams]);

    const handleCategoryChange = (option) => {
        setSelectedCategories((prev) => prev.includes(option) ? prev.filter((c) => c !== option) : [...prev, option]);

    };

    const displayed = selectedCategories.length > 1 ? products.filter((p) => selectedCategories.includes(p.category)) : products;

    return (
        <div className="prods-page">

            <div className="prods-header">
                <h1 className="prods-title">
                    {search ? `Results for "${search}"` : "Products"}
                </h1>

                {search && (
                    <button className="prods-reset" onClick={() => navigate("/products")}>
                        Clear Search <MdClose/>
                    </button>

                )}

            </div>

            <div className="prods-body">

                <aside className="sidebar">
                    <div className="filter-group">
                        <h3 className="sidebar-title">Collections</h3>

                        <ul className="filter-list">
                            {filters.Collections.map((f) => (
                                <li key={f}>
                                    <label className="filter-option">
                                        <input type="radio"
                                            name="collection"
                                            checked={selectedCollection === f}
                                            onChange={() => setSelectedCollection(f)}
                                        />
                                        {f}

                                    </label>

                                </li>
                            ))}

                        </ul>

                    </div>

                    <div className="filter-group">
                        <h3 className="sidebar-title">Category</h3>

                        <ul className="filter-list">
                            {filters.Category.map((f) => (
                                <li key={f}>
                                    <label className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(f)}
                                            onChange={() => handleCategoryChange(f)}
                                        />
                                        {f}

                                    </label>
                                </li>
                            ))}

                        </ul>

                    </div>

                </aside>

                <main className="prods-grid-area">
                    {loading && <p className="prods-status">Loading...</p>}
                    {error && <p className="prods-status">{error}</p>}

                    {!loading && !error && (
                        <div className="prods-grid">
                            {displayed.map((p) => (
                                <Link key={p._id} to={`/products/${p._id}`} className="product-card">
                                    <div className="product-image">
                                        {p.image ? <img src={p.image} alt={p.name} />
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