import { useParams, Link, useNavigate } from "react-router-dom";
import "../assets/css/order.css";
import { useEffect, useState } from "react";

export default function OrderConf() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setOrder);

        fetch(`/api/orders/${id}/items`)
            .then(res => res.json())
            .then(setItems);

    }, [id]);

    return (
        <div className="conf-page">
            <div className="conf-card">
                <div className="conf-icon">&#x2713;</div>
                <h1 className="conf-title">Order Placed!</h1>

                <p className="conf-desc">Thank you for your order. We'll get it shipped out soon.</p>
                <p className="conf-order-id">Order #{id}</p>

                {order && (
                    <div className="conf-info">
                        {order.name && (
                            <div className="conf-info-row">
                                <span className="conf-info-label">Name</span>
                                <span>{order.name}</span>

                            </div>
                        )}

                        {order.email && (
                            <div className="conf-info-row">
                                <span className="conf-info-label">Email</span>
                                <span>{order.email}</span>
                            </div>

                        )}

                        {order.address && (
                            <div className="conf-info-row">
                                <span className="conf-info-label">Ship to</span>
                                <span>
                                    {[order.address, order.city, order.state, order.zip]
                                        .filter(Boolean)
                                        .join(", ")}
                                </span>

                            </div>
                        )}

                    </div>
                )}

                <table className="conf-items">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Size</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>

                    </thead>

                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.size}</td>
                                <td>{item.quantity}</td>
                                <td>${parseFloat(item.price).toFixed(2)}</td>

                            </tr>
                        ))}

                    </tbody>

                </table>

                {order && (
                    <p className="conf-total-row">
                        <span className="conf-total-label">Total:</span>
                        <span>${parseFloat(order.total).toFixed(2)}</span>

                    </p>

                )}

                <div className="conf-actions">
                    <button onClick={() => window.print()} className="print-btn">Print Order</button>

                    <Link to="/products" className="conf-btn">Continue Shopping</Link>

                </div>
                
            </div>
            
        </div>
    );
}