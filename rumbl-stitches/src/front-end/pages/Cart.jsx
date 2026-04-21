import { Link } from "react-router-dom";
import "../assets/css/cart.css"

const placeholderItems = [
    { id: 1, name: "Straw Hat Tee", collection: "One Piece", price: 42, size: "M", qty: 1 },
    { id: 2, name: "Infinity Hoodie", collection: "Jujutsu Kaisen", price: 78, size: "L", qty: 2 },
];

export default function Cart() {
    const subtotal = placeholderItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="cart-page">

            <div className="cart-header">
                <h1 className="cart-title">Cart</h1>
            </div>

            <div className="cart-body">

                {/* Items */}
                <div className="cart-items">
                    {placeholderItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                <span className="cart-image-label">Image</span>
                            </div>
                            <div className="cart-item-details">
                                <span className="cart-item-collection">{item.collection}</span>
                                <h3 className="cart-item-name">{item.name}</h3>
                                <span className="cart-item-size">Size: {item.size}</span>
                            </div>
                            <div className="cart-item-right">
                                <span className="cart-item-price">${item.price * item.qty}</span>
                                <div className="cart-item-qty">
                                    <button className="qty-btn">−</button>
                                    <span className="qty-num">{item.qty}</span>
                                    <button className="qty-btn">+</button>
                                </div>
                                <button className="cart-remove">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="cart-summary">
                    <h2 className="summary-title">Order Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{subtotal >= 75 ? "Free" : "$8"}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>${subtotal >= 75 ? subtotal : subtotal + 8}</span>
                    </div>

                    <Link to="/checkout" className="btn btn-primary checkout-btn">
                        Checkout
                    </Link>
                    <Link to="/products" className="btn btn-ghost continue-btn">
                        Continue Shopping
                    </Link>
                </div>

            </div>

        </div>
    );
}