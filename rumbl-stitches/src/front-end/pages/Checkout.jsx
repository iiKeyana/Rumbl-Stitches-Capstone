import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/checkout.css";

export default function Checkout() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 75 ? 0 : 8.99;
    const total = subtotal + shipping;

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "", state: "", zip: "", country: "US",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="co-page">
            <div className="co-form-side">
                <Link to="/cart" className="co-back">&#8592; Back to Cart</Link>

                <h1 className="co-title">Checkout</h1>

                <section className="co-section">
                    <h2 className="co-section-title">Contact</h2>

                    <div className="co-row">
                        <div className="co-field">
                            <label className="co-label">First Name</label>
                            <input className="co-input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Monkey" />
                        </div>

                        <div className="co-field">
                            <label className="co-label">Last Name</label>
                            <input className="co-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="D. Luffy" />
                        </div>

                    </div>

                    <div className="co-field">
                        <label className="co-label">Email</label>
                        <input className="co-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="luffy@grandline.com" />

                    </div>

                    <div className="co-field">
                        <label className="co-label">Phone</label>
                        <input className="co-input" name="phone" type="phone" value={form.phone} onChange={handleChange} placeholder="(555) 000-0000" />

                    </div>

                </section>


                <section className="co-section">
                    <h2 className="co-section-title">Shipping Address</h2>

                    <div className="co-field">
                        <label className="co-label">Address</label>
                        <input className="co-input" name="address" value={form.address} onChange={handleChange} placeholder="766 Grand Line Rd" />
                    
                    </div>

                    <div className="co-row">
                        <div className="co-field">
                            <label className="co-label">City</label>
                            <input className="co-input" name="city" value={form.city} onChange={handleChange} placeholder="East Blue" />
                        
                        </div>

                        <div className="co-field co-field--sm">
                            <label className="co-label">State</label>
                            <input className="co-input" name="state" value={form.state} onChange={handleChange} placeholder="TX" />
                        
                        </div>

                        <div className="co-field co-field--sm">
                            <label className="co-label">ZIP</label>
                            <input className="co-input" name="zip" value={form.zip} onChange={handleChange} placeholder="12345" />
                        
                        </div>

                    </div>

                    <div className="co-field">
                        <label className="co-label">Country</label>

                        <select className="co-input co-select" name="country" value={form.country} onChange={handleChange}>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="DI">Drum Island</option>
                            <option value="JP">Japan</option>

                        </select>

                    </div>

                </section>


                <section className="co-section">
                    <h2 className="co-section-title">Payment</h2>

                    <div className="co-payment-placeholder">
                        <p>Payment integration coming soon</p>
                    </div>
                </section>

                <button className="co-submit">Place Order</button>

            </div>


            <div className="co-summary-side">
                <div className="co-summary">
                    <h2 className="co-summary-title">Order Summary</h2>

                    <div className="co-items">
                        {cart.length === 0 ? (
                            <p className="co-empty">Your cart is empty.</p>
                        ) : (
                            cart.map((item, i) => (
                                <div key={i} className="co-item">
                                    <div className="co-item-image">
                                        {item.image ? <img src={item.image} alt={item.name} />
                                            : <span>IMG</span>
                                        }
                                        <span className="co-item-qty">{item.quantity}</span>

                                    </div>

                                    <div className="co-item-info">
                                        <p className="co-item-name">{item.name}</p>
                                        <p className="co-item-meta">Size: {item.size}</p>

                                    </div>

                                    <p className="co-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                
                                </div>
                            ))
                        )}
                    </div>

                    <div className="co-divider" />

                    <div className="co-totals">
                        <div className="co-total-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>

                        </div>

                        <div className="co-total-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                        
                        </div>

                        <div className="co-divider" />

                        <div className="co-total-row co-total-row--total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>

                        </div>
                    </div>

                    {shipping > 0 && (
                        <p className="co-shipping-note">Add ${(75 - subtotal).toFixed(2)} more for free shipping</p>
                    )}

                </div>
                
            </div>
        </div>
    );
}