import { Link } from "react-router-dom";
import "../assets/css/home.css";
import rumblModel from "../assets/images/rumblmodel.jpg";
import rumblLogo from "../assets/images/rumblLogo.svg";
import { useState, useEffect } from "react";

const collections = [
    { id: "one-piece",      name: "One Piece"      },
    { id: "jujutsu-kaisen", name: "Jujutsu Kaisen" },
    { id: "demon-slayer",   name: "Demon Slayer"   },
];

const RUMBL_ITEMS    = Array(10).fill("✦ RUMBL STITCHES ✦");
const PRODUCTS_ITEMS = Array(10).fill("✦ VIEW PRODUCTS ✦");

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("./api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch(() => {});
    }, []);

    const productTicker = products.length > 0
        ? [...products, ...products]
        : Array(8).fill(null);

    return (
        <div className="home">

            <section className="head">
                <img src={rumblModel} className="head-bg" />

                <div className="head-overlay"></div>

                <div className="head-content">
                    <div className="head-logo">
                        <img src={rumblLogo} className="head-logo-img" alt="Rumbl Stitches" />

                        <div className="head-logo-overlay">
                            <p className="head-desc">Every Rumble Ball unlocks a new point. Every stitch unlocks a new you.</p>

                            <div className="head-btn">
                                <Link to="/collections" className="btn btn-primary">Shop Collections</Link>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <section className="home-banner">
                <img src={rumblModel} className="home-banner-img" alt="" />
            </section>

            <section className="home-brand">
                <p className="home-brand-title">Born from the Grand Line. Stitched for the streets.</p>

                <p className="home-brand-desc">
                    An anime-inspired e-commerce website where users can browse, and purchase streetwear designed around their favorite anime. Anime fashion has recently gotten popular, and like Stitch Spring, Vees Clothing, and Gomu Clothing have shown there’s a lot of audience for it, so I wanted to build something in that same space.

                </p>

            </section>

            <div className="ticker-wrap">
                <div className="ticker-bar ticker-bar--dark ">
                    <div className="ticker-track ticker-track-left">
                        {RUMBL_ITEMS.concat(RUMBL_ITEMS).map((item, i) => (
                            <span key={i} className="ticker-item">{item}</span>

                        ))}

                    </div>

                </div>

                <div className="ticker-bar ticker-bar-dark">
                    <div className="ticker-track ticker-track-right">
                        {productTicker.map((p, i) => (
                            <Link key={i} to={p ? `/products/${p._id}` : "/products"} className="ticker-product">
                                <div className="ticker-product-img">
                                    {p?.image
                                        ? <img src={p.image} alt={p?.name} />
                                        : <span className="ticker-product-placeholder" />
                                    }
                                </div>

                            </Link>
                        ))}

                    </div>
                </div>

                <div className="ticker-bar ticker-bar-dark ticker-bar-last">
                    <div className="ticker-track ticker-track-left">
                        {PRODUCTS_ITEMS.concat(PRODUCTS_ITEMS).map((item, i) => (
                            <Link key={i} to="/products" className="ticker-item ticker-item-link">{item}</Link>

                        ))}

                    </div>
                </div>

            </div>

            <section className="home-collections-section">
                <div className="home-collections-header">
                    <h2 className="section-title">Featured Collections</h2>

                </div>

                <div className="home-collections-grid">
                    {collections.map((col) => (
                        <Link key={col.id} to={`/collections/${col.id}`} className="home-collection-card">
                            <span className="card-label">Collection</span>
                            <h3 className="card-name">{col.name}</h3>
                            <span className="card-btn">Explore &#8594;</span>

                        </Link>
                    ))}

                </div>

            </section>

        </div>
    );
}