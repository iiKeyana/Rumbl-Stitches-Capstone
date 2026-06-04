import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/checkout.css";

export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (user) {
            fetch("/api/cart", {
                headers: { Authorization: `Bearer ${token}` }

            })
                .then(res => res.json())
                .then(data => setCart(data));
        } else {
            setCart(JSON.parse(localStorage.getItem("cart") || "[]"));

        }

    }, []);

    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const shipping = subtotal >= 175 ? 0 : 8.99;
    const total = subtotal + shipping;

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.address || !form.city || !form.state || !form.zip) {
            setError("Please fill in all required fields");

            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({
                    contact: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        email: form.email,
                        phone: form.phone,
                    },
                    address: {
                        address: form.address,
                        city: form.city,
                        state: form.state,
                        zip: form.zip,
                        country: form.country,
                    },
                    cart

                })

            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            if (!user) {
                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("storage"));

            }

            navigate(`/order-confirmation/${data.order_id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="co-page">
            <div className="co-form-side">
                <Link to="/cart" className="co-back">&#8592; Back to Cart</Link>
                <h1 className="co-title">Checkout</h1>

                {error && <p className="auth-error">{error}</p>}

                <section className="co-section">
                    <h2 className="co-section-title">Contact</h2>

                    <div className="co-row">
                        <div className="co-field">
                            <label className="co-label">First Name</label>

                            <input className="co-input"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Monkey"/>

                        </div>

                        <div className="co-field">
                            <label className="co-label">Last Name</label>

                            <input className="co-input"
                            name="lastName" value={form.lastName}
                            onChange={handleChange}
                            placeholder="D. Luffy"/>
                        
                        </div>

                    </div>

                    <div className="co-field">
                        <label className="co-label">Email</label>

                        <input className="co-input"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="luffy@grandline.com"/>

                    </div>

                    <div className="co-field">
                        <label className="co-label">Phone</label>

                        <input className="co-input"
                        name="phone"
                        type="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(555)-000-0000"/>
                        
                    </div>

                </section>

                <section className="co-section">
                    <h2 className="co-section-title">Shipping Address</h2>

                    <div className="co-field">
                        <label className="co-label">Address</label>

                        <input className="co-input"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="766 Grand Line Rd"/>
                    </div>

                    <div className="co-row">
                        <div className="co-field">
                            <label className="co-label">City</label>

                            <input className="co-input"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="East Blue"/>

                        </div>

                        <div className="co-field co-field-sm">
                            <label className="co-label">State</label>

                            <input className="co-input"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="TX"/>

                        </div>

                        <div className="co-field co-field-sm">
                            <label className="co-label">ZIP</label>

                            <input className="co-input"
                            name="zip"
                            value={form.zip}
                            onChange={handleChange}
                            placeholder="12345"/>

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

                    <div className="co-field">
                        <label className="co-label">Card Number</label>

                        <input
                            className="co-input co-input--card"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                e.target.value = val.replace(/(.{4})/g, "$1 ").trim();
                            }}/>

                    </div>

                    <div className="co-row">
                        <div className="co-field">
                            <label className="co-label">Expiry</label>

                            <input
                                className="co-input"
                                placeholder="MM / YY"
                                maxLength={7}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                    e.target.value = val.length > 2 ? val.slice(0,2) + " / " + val.slice(2) : val;
                                }}/>

                        </div>

                        <div className="co-field co-field-sm">
                            <label className="co-label">CVV</label>

                            <input
                                className="co-input"
                                placeholder="123"
                                maxLength={4}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                                }}/>
                                
                        </div>
                        
                    </div>

                    <div className="co-field">
                        <label className="co-label">Name on Card</label>
                        <input className="co-input" placeholder="Monkey D. Luffy" />

                    </div>

                </section>

                <button className="co-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order"}

                </button>

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

                    {shipping > 0 && subtotal > 0 && (
                        <p className="co-shipping-note">Add ${(175 - subtotal).toFixed(2)} more for free shipping</p>

                    )}

                </div>

            </div>
            
        </div>
    );
}