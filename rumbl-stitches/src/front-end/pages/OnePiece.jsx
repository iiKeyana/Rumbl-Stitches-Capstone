import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/co-collection.css";

// const products = [
//     { id: 1, name: "Straw Hat Tee", price: "$42" },
//     { id: 2, name: "Grand Line Hoodie", price: "$78" },
//     { id: 3, name: "Wanted Poster Tee", price: "$42" },
//     { id: 4, name: "Going Merry Tee", price: "$42" },
//     { id: 5, name: "Gear Fifth Hoodie", price: "$78" },
//     { id: 6, name: "Straw Hat Crew Tee", price: "$42" },
// ];


export default function OnePiece() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products?collection=${encodeURIComponent("One Piece")}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);

            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="col-page">

            <section className="col-hero op-hero">
                <div className="col-hero-content">
                    <span className="col-eyebrow">The Grand Line Collection</span>
                    <h1 className="col-title">One Piece</h1>

                    <p className="col-desc">
                        No map. No guarantee. Just a crew, a dream, and the will to see it through.
                        Every piece in this collection is stitched for those who've already 
                        decided — the ones who'd rather die than give up on their dream.
                    </p>

                    <span className="col-tag">Yohoho.</span>

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
                                        : <span className="img-label">Image</span>
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