import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/cart.css"

export default function Cart() {
    const [cart, setCart] = useState([]);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (user) {
            fetch("/api/cart", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setCart(data))
                .catch(err => console.error(err));

        } else {
            const stored = JSON.parse(localStorage.getItem("cart") || "[]");

            setCart(stored);
        }
    }, []);

    const updateCart = (updated) => {
        setCart(updated);
        if (!user) localStorage.setItem("cart", JSON.stringify(updated));

        window.dispatchEvent(new Event("storage"));

    };

    const changeQty = async (index, delta) => {
        const item = cart[index];
        const newQty = item.quantity + delta;

        if (user) {
            if (newQty <= 0) {
                await fetch(`/api/cart/${item.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });

                updateCart(cart.filter((_, i) => i !== index));
            } else {
                await fetch(`/api/cart/${item.id}`, {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity: newQty })
                });

                const updated = [...cart];

                updated[index].quantity = newQty;

                updateCart(updated);
            }
        } else {
            const updated = [...cart];

            updated[index].quantity = newQty;
            if (newQty <= 0) updated.splice(index, 1);

            updateCart(updated);
        }
    };

    const removeItem = async (index) => {
        const item = cart[index];

        if (user) {
            await fetch(`/api/cart/${item.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

        }

        updateCart(cart.filter((_, i) => i !== index));
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
                            <div key= {item.id ||index} className= "cart-item">
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
                        <span>${subtotal === 0 ? "—" : total}</span>
                        
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