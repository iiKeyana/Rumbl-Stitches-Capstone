import { useParams, Link } from "react-router-dom";
import "../assets/css/order.css";

export default function OrderConf() {
    const { id } = useParams();

    return (
        <div className="conf-page">
            <div className="conf-card">
                <div className="conf-icon">✓</div>
                <h1 className="conf-title">Order Placed!</h1>
                <p className="conf-sub">Thank you for your order. We'll get it shipped out soon.</p>
                <p className="conf-order-id">Order #{id}</p>

                <Link to="/products" className="conf-btn">
                    Continue Shopping
                </Link>
                
            </div>
        </div>
    );
}