import { Link } from "react-router-dom";
import "../assets/css/products.css";

const products = [
    { id: 1, name: "Straw Hat Tee", price: "$42", collection: "One Piece" },
    { id: 2, name: "Grand Line Hoodie", price: "$78", collection: "One Piece" },
    { id: 3, name: "Wanted Poster Tee", price: "$42", collection: "One Piece" },
    { id: 4, name: "Cursed Energy Tee", price: "$42", collection: "Jujutsu Kaisen" },
    { id: 5, name: "Gojo Fit Hoodie", price: "$78", collection: "Jujutsu Kaisen" },
    { id: 6, name: "Domain Expansion Tee", price: "$42", collection: "Jujutsu Kaisen" },
    { id: 7, name: "Breathing Form Tee", price: "$42", collection: "Demon Slayer" },
    { id: 8, name: "Tanjiro Hoodie", price: "$78", collection: "Demon Slayer" },
];

const filters = {
    Collections: ["All", "One Piece", "Jujutsu Kaisen", "Demon Slayer"],
    Category: ["Tops", "Bottoms", "Outerwear", "Accessories"],
};

export default function Products() {
    return (
        <div className="products-page">

            <div className="products-header">
                <h1 className="products-title">Products</h1>

            </div>

            <div className="products-body">

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

                <main className="products-grid-area">
                    <div className="products-grid">
                        {products.map((p) => (
                            <Link key={p.id} to={`/products/${p.id}`} className="product-card">
                                <div className="product-image">
                                    <span className="image-label">Image</span>
                                    
                                </div>
                                <div className="product-info">
                                    <span className="product-name">{p.name}</span>
                                    <span className="product-price">{p.price}</span>
                                
                                </div>
                            </Link>
                        ))}
                    
                    </div>
                </main>

            </div>

        </div>
    );
}