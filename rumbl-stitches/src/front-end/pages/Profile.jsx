import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import "../assets/css/profile.css";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!user) {
            navigate("/login");

            return;
        }

        fetch("/api/orders/my", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoadingOrders(false);
            })
            .catch(() => setLoadingOrders(false));

    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        window.dispatchEvent(new Event("storage"));

        navigate("/");
    };

    const handlePrint = (orderId) => {
    const elById = document.getElementById(`order-${orderId}`);
    const nodeclone = elById.cloneNode(true);

    const printWindow = window.open("", "_blank", "width=600,height=400");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Order #${orderId}</title>

                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        .prof-order-print { display: none; }
                    </style>

                </head>

                <body></body>
            </html>
        `);

        printWindow.document.body.appendChild(nodeclone);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        
    };

    if (!user) return null;

    return (
        <div className="prof-page">
            <div className="prof-header">
                <Link to="/" className="prof-logo">YOUR PROFILE</Link>

                <button className="prof-logout" onClick={handleLogout}>
                    <IoIosLogOut/> Logout
                </button>
                
            </div>

            <div className="prof-body">
                <aside className="prof-sidebar">
                    <div className="prof-avatar">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>

                    <p className="prof-name">{user.first_name} {user.last_name}</p>
                    <p className="prof-email">{user.email}</p>

                    <span className="prof-role-badge">{user.role || "User"}</span>

                    <nav className="prof-nav">
                        {user.role === "admin" && (
                            <Link to="/admin" className="prof-nav-link prof-admin-link">
                                Admin Dashboard

                            </Link>
                        )}

                    </nav>

                </aside>

                <main className="prof-main">
                    <section className="prof-section" id="info">
                        <h2 className="prof-section-title">Account Info</h2>

                        <div className="prof-info-grid">
                            <div className="prof-info-item">
                                <span className="prof-info-label">First Name</span>
                                <span className="prof-info-value">{user.first_name}</span>

                            </div>

                            <div className="prof-info-item">
                                <span className="prof-info-label">Last Name</span>
                                <span className="prof-info-value">{user.last_name}</span>

                            </div>

                            <div className="prof-info-item">
                                <span className="prof-info-label">Email</span>
                                <span className="prof-info-value">{user.email}</span>

                            </div>

                            <div className="prof-info-item">
                                <span className="prof-info-label">Password</span>
                                <span className="prof-info-value">••••••••</span>

                            </div>

                        </div>
                    </section>

                    <section className="prof-section" id="orders">
                        <h2 className="prof-section-title">Order History</h2>

                        {loadingOrders ? (
                            <p className="prof-empty">Loading orders...</p>

                        ) : orders.length === 0 ? (
                            <div className="prof-empty-orders">
                                <MdShoppingBag size={32}/>
                                <p>No orders yet.</p>

                            </div>

                        ) : (
                            <div className="prof-orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="prof-order-card">
                                        <div className="prof-order-top">
                                            <span className="prof-order-id">Order #{order.id}</span>
                                            <span className={`prof-order-status ${order.status}`}>{order.status}</span>

                                        </div>

                                        <div className="prof-order-meta">
                                            <span>${parseFloat(order.total).toFixed(2)}</span>
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>

                                        </div>

                                        <Link to={`/order-confirmation/${order.id}`} className="prof-order-link" onClick={() => handlePrint(order.id)}>
                                            View Order &#x2192;
                                        </Link>

                                    </div>

                                ))}

                            </div>
                        )}
                    </section>
                    
                </main>
            </div>
        </div>
    );
}