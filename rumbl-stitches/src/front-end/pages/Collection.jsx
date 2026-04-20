import { Link } from "react-router-dom";
import "../assets/css/collection.css";

export default function Collection() {
    return (
        <div className="collection-page">
            <h1 className="collection-title">Collections</h1>
            <p className="collection-sub">Choose a collection to explore</p>

            <div className="collection-grid">
                <Link to="/collections/one-piece" className="collection-card">
                    <h2>One Piece</h2>
                    <p>Streetwear inspired by the Grand Line</p>
                </Link>

                <Link to="/collections/jujutsu-kaisen" className="collection-card">
                    <h2>Jujutsu Kaisen</h2>
                    <p>Cursed energy, elevated style</p>
                </Link>

                <Link to="/collections/demon-slayer" className="collection-card">
                    <h2>Demon Slayer</h2>
                    <p>Total concentration. Total style.</p>
                </Link>
            </div>
        </div>
    );
}