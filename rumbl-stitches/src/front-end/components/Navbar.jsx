import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/css/navbar.css";
import { MdShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (query.trim()) {
            navigate(`./api/products?search=${encodeURIComponent(query)}`);
            setQuery("");
            setSearchOpen(false);
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                RUMBL STITCHES
            </Link>

            <div className="nav-links">
                <div className="dropdown">
                    <Link to="/collections" className="dropdown-toggle">Collections</Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/collections/one-piece">One Piece</Link></li>
                        <li><Link to="/collections/jujutsu-kaisen">Jujutsu Kaisen</Link></li>
                        <li><Link to="/collections/demon-slayer">Demon Slayer</Link></li>

                    </ul>
                </div>

                <Link to="/products">Products</Link>

            </div>

            <div className="nav-right">
                <div className= {`search-bar ${searchOpen ? "open" : ""}`}>
                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus={searchOpen}
                        />

                    </form>

                    <button className="search-btn" onClick={() => setSearchOpen((open) => !open)}>
                        <FaSearch />
                    </button>

                </div>

                <Link to="/cart">
                    <MdShoppingCart />
                </Link>

            </div>
        </nav>
    );
}