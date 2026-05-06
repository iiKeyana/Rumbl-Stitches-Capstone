import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/co-collection.css";

// const products = [
//     { id: 4, name: "Cursed Energy Tee", price: "$42" },
//     { id: 5, name: "Gojo Fit Hoodie", price: "$78" },
//     { id: 6, name: "Domain Expansion Tee", price: "$42" },
//     { id: 7, name: "Sukuna Fingers Tee", price: "$42" },
//     { id: 8, name: "Infinity Hoodie", price: "$78" },
//     { id: 9, name: "Jujutsu High Tee", price: "$42" },
// ];

export default function JJK() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products?collection=${encodeURIComponent("Jujutsu Kaisen")}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="col-page">

            <section className="col-hero jjk-hero">
                <div className="col-hero-content">
                    <span className="col-eyebrow">The Cursed Energy Collection</span>
                    <h1 className="col-title">Jujutsu Kaisen</h1>

                    <p className="col-desc">
                        Cursed energy doesn't discriminate. Neither does style.
                        Built for those who walk into danger with their hands in their pockets —
                        because when you're that strong, you don't need to rush.
                    </p>

                    <span className="col-tag jjk-tag">Divergent Fist.</span>
                </div>
            </section>

            <section className="col-products">
                <div className="col-products-header">
                    <h2 className="col-products-title">The Drop</h2>
                    <span className="col-count">{products.length} pieces</span>
                </div>

                {loading ? (
                    <p className="status">Loading...</p>
                ) : (

                    <div className="col-grid">
                        {products.map((p) => (
                            <Link key={p._id} to={`/products/${p._id}`} className="col-card">

                                <div className="col-card-image">
                                    {p.image ? <img src={p.image} alt={p.name} />
                                        : <span className="col-image-label">Image</span>
                                    }
                                </div>

                                <div className="col-card-info">
                                    <span className="col-card-name">{p.name}</span>
                                    <span className="col-card-price">${p.price}</span>
                                </div>

                            </Link>
                        ))}
                    </div>

                )}
            </section>
                        
        </div>
    );
}