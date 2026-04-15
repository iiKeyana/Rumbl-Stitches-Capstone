import { Link } from "react-router-dom";
import "../assets/css/navbar.css";

export default function Navbar() {
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
                        <li><Link to="/collections/jjk">Jujutsu Kaisen</Link></li>
                        <li><Link to="/collections/demon-slayer">Demon Slayer</Link></li>
                    </ul>
                </div>
                <Link to="/products">Products</Link>
            </div>

            <div className="nav-right">
                <Link to="/cart">Cart</Link>
            </div>
        </nav>
    );
}