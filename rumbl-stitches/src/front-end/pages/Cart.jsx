import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/cart.css"

// const placeholder = [
//     { id: 1, name: "Straw Hat Tee", collection: "One Piece", price: 42, size: "M", qty: 1 },
//     { id: 2, name: "Infinity Hoodie", collection: "Jujutsu Kaisen", price: 78, size: "L", qty: 2 },
// ];

export default function Cart() {
    // const subtotal = placeholder.reduce((sum, item) => sum + item.price * item.qty, 0);

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(stored);
    }, []);

    const updateCart = (updated) => {
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));

    };

    const changeQty = (index, delta) => {
        const updated = [...cart];
        updated[index].quantity += delta;

        if (updated[index].quantity <= 0) {
            updated.splice(index, 1);

        }

        updateCart(updated);
    };

    const removeItem = (index) => {
        const updated = [...cart];
        updated.splice(index, 1);
        
        updateCart(updated);
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 75 ? 0 : 8;
    const total = subtotal + shipping;

    return (
        <div className= "cart-page">

            <div className= "cart-header">
                <h1 className= "cart-title">Cart</h1>

            </div>

            <div className= "cart-body">
                
                <div className= "cart-items">
                    {cart.length === 0 ? (
                        <div className= "cart-empty">
                            <p>Your cart is empty.</p>
                            <Link to= "/products" className= "btn btn-primary">Shop Now</Link>
                        </div>
                    ) : (

                        cart.map((item, index) => (
                            <div key= {index} className= "cart-item">
                                <div className= "cart-item-image">
                                    {item.image
                                        ? <img src={item.image} alt={item.name} />
                                        : <span className="cart-image-label">Image</span>
                                    }

                                </div>

                                <div className= "cart-item-details">
                                    {item.collection && (
                                        <span className= "cart-item-collection">{item.collection}</span>
                                    )}
                                    <h3 className= "cart-item-name">{item.name}</h3>
                                    <span className= "cart-item-size">Size: {item.size}</span>

                                </div>

                                <div className= "cart-item-right">
                                    <span className= "cart-item-price">${item.price * item.quantity}</span>

                                    <div className= "cart-item-qty">
                                        <button className= "qty-btn" onClick={() => changeQty(index, -1)}>−</button>
                                        <span className= "qty-num">{item.quantity}</span>
                                        <button className= "qty-btn" onClick={() => changeQty(index, 1)}>+</button>

                                    </div>

                                    <button className= "cart-remove" onClick={() => removeItem(index)}>
                                        Remove
                                    </button>

                                </div>
                                
                            </div>
                        ))

                    )}
                </div>


                <div className="cart-summary">
                    <h2 className="summary-title">Order Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>

                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{subtotal === 0 ? "—" : shipping === 0 ? "Free" : "$8"}</span>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span>${subtotal === 0 ? "—" : subtotal >= 75 ? subtotal : subtotal + 8}</span>
                    </div>

                    <Link to="/checkout"
                        className={`btn btn-primary checkout-btn ${cart.length === 0 ? "disabled" : ""}`}
                        onClick={(e) => cart.length === 0 && e.preventDefault()}
                    >
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