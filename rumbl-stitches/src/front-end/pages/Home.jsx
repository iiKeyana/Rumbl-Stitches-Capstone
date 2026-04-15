import { Link } from "react-router-dom";
import "../assets/css/home.css";

const collections = [
    { id: "one-piece",
        name: "One Piece"
    },

    { id: "jujutsu-kaisen",
        name: "Jujutsu Kaisen"
    },

    { id: "demon-slayer",
        name: "Demon Slayer"
    },

];

export default function Home() {
    return (
        <div className="home">

            <section className="head">
                <h1 className="head-title">Wear the Anime.</h1>
                <p className="head-sub">Anime-inspired streetwear.</p>
                <div className="head-cta">
                    <Link to="/collections" className="btn btn-primary">Shop Collections</Link>
                    <Link to="/products" className="btn btn-ghost">All Products</Link>
                </div>
            </section>

            <section className="collections-section">
                <div className="collections-header">
                    <h2 className="section-title">Featured Collections</h2>
                    <Link to="/collections" className="view-all">View All →</Link>
                </div>

                <div className="collections-grid">
                    {collections.map((col) => (
                        <Link key={col.id} to="/collections" className="collection-card">
                            <span className="card-label">Collection</span>
                            <h3 className="card-name">{col.name}</h3>
                            <span className="card-cta">Explore →</span>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
}