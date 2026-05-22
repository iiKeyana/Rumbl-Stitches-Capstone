import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/navbar.css";
import { MdShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            setQuery("");
            setSearchOpen(false);
        }
    };

    useEffect(() => {
        const handleStorage = () => {
            setUser(JSON.parse(localStorage.getItem("user") || "null"));

        };

        window.addEventListener("storage", handleStorage);

        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");

    };

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const getCount = () => {
            if (user) {
                fetch("/api/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(data => {
                        const count = data.reduce((sum, item) => sum + item.quantity, 0);
                        setCartCount(count);

                    });
                    
            } else {
                const stored = JSON.parse(localStorage.getItem("cart") || "[]");
                const count = stored.reduce((sum, item) => sum + item.quantity, 0);

                setCartCount(count);
            }
        };

        getCount();
        window.addEventListener("storage", getCount);

        return () => window.removeEventListener("storage", getCount);
    }, [user]);



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

                <Link to="/cart" className="cart-icon">
                    <MdShoppingCart />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>

                {user ? (
                        <>
                            <span className="nav-user">Hi, {user.first_name}</span>

                            <button className="nav-logout" onClick={handleLogout}>
                                <IoLogOut />
                            </button>
                        </>

                    ) : (
                        <Link to="/login">Login</Link>

                )}

            </div>
        </nav>
    );
}