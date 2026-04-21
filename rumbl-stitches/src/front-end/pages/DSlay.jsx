import { Link } from "react-router-dom";
import "../assets/css/co-collection.css";

const products = [
    { id: 10, name: "Breathing Form Tee", price: "$42" },
    { id: 11, name: "Tanjiro Hoodie", price: "$78" },
    { id: 12, name: "Flame Hashira Tee", price: "$42" },
    { id: 13, name: "Water Breathing Tee", price: "$42" },
    { id: 14, name: "Demon Corps Hoodie", price: "$78" },
    { id: 15, name: "Wisteria Tee", price: "$42" },
];

export default function DemonSlayer() {
    return (
        <div className="col-page">

            <section className="col-hero ds-hero">
                <div className="col-hero-content">
                    <span className="col-eyebrow">The Total Concentration Collection</span>
                    <h1 className="col-title">Demon Slayer</h1>
                    <p className="col-lore">
                        Every breath is a choice. Every stitch is intentional.
                        Built for those who train until it becomes as natural as breathing —
                        because greatness isn't given, it's earned cut by cut.
                    </p>
                    <span className="col-tag ds-tag">鬼 Total Concentration.</span>
                </div>
            </section>

            <section className="col-products">
                <div className="col-products-header">
                    <h2 className="col-products-title">The Drop</h2>
                    <span className="col-count">{products.length} pieces</span>
                </div>
                <div className="col-grid">
                    {products.map((p) => (
                        <Link key={p.id} to={`/products/${p.id}`} className="col-card">
                            <div className="col-card-image">
                                <span className="col-image-label">Image</span>
                            </div>
                            <div className="col-card-info">
                                <span className="col-card-name">{p.name}</span>
                                <span className="col-card-price">{p.price}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
}