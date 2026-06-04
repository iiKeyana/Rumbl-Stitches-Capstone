import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRuler } from "react-icons/fa";
import "../assets/css/single.css";
import { MdLocalShipping } from "react-icons/md";
import { HiArrowUturnLeft } from "react-icons/hi2";
import { PiSparkleFill } from "react-icons/pi";

const SIZE_CHART = [
    { size: "S",   chest: "34–36", waist: "28–30", hip: "36–38" },
    { size: "M",   chest: "38–40", waist: "32–34", hip: "40–42" },
    { size: "L",   chest: "42–44", waist: "36–38", hip: "44–46" },
    { size: "XL",  chest: "46–48", waist: "40–42", hip: "48–50" },
    { size: "XXL", chest: "50–52", waist: "44–46", hip: "52–54" },
];

export default function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [sizeChart, setSizeChart] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => { setProduct(data); setLoading(false); })
            .catch(() => { setError("Failed to load product"); setLoading(false); });
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            setSizeError(true);
            setTimeout(() => setSizeError(false), 2000);

            return;
        }

        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("token");

        if (user) {
            try {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        product_id: product._id,
                        name: product.name,
                        price: product.price,
                        size: selectedSize,
                        quantity: 1,
                        image: product.image || null,
                        collection: product.collection || null
                    })
                });

                window.dispatchEvent(new Event("storage"));
            } catch (err) {
                console.error("Failed to add to cart", err);
                return;
            }
        } else {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const existing = cart.find((i) => i._id === product._id && i.size === selectedSize);

            if (existing) { existing.quantity += 1; }
            else { cart.push({ ...product, size: selectedSize, quantity: 1 }); }

            localStorage.setItem("cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("storage"));
        }

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="prod-status">Loading...</div>;
    if (error)   return <div className="prod-status">{error}</div>;
    if (!product) return null;

    return (
        <div className="prod-page">

            {sizeChart && (
                <div className="prod-popup-backdrop" onClick={() => setSizeChart(false)}>
                    <div className="prod-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="prod-popup-header">
                            <h2 className="prod-popup-title">Size Chart</h2>

                            <button className="prod-popup-close" onClick={() => setSizeChart(false)}>
                                &#x2716;
                            </button>

                        </div>

                        <p className="prod-popup-note">
                            All measurements in inches. Sizes are general guidelines. Fit may vary by style.
                        </p>

                        <table className="prod-size-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Chest</th>
                                    <th>Waist</th>
                                    <th>Hip</th>
                                </tr>
                            </thead>

                            <tbody>
                                {SIZE_CHART.map((row) => (
                                    <tr key={row.size} className={selectedSize === row.size ? "prod-size-table-active" : ""}>
                                        <td>{row.size}</td>
                                        <td>{row.chest}"</td>
                                        <td>{row.waist}"</td>
                                        <td>{row.hip}"</td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                </div>
            )}

            <button className="prod-back" onClick={() => navigate(-1)}>&#8592; Back</button>

            <div className="prod-layout">
                <div className="prod-image-wrap">
                    {product.image ? <img src={product.image} alt={product.name} className="prod-image"/>
                        : <div className="prod-image-placeholder"><span>No Image</span></div>
                    }

                </div>

                <div className="prod-details">
                    {product.collection && <p className="prod-collection">{product.collection}</p>}

                    <h1 className="prod-name">{product.name}</h1>
                    <p className="prod-price">${product.price}</p>

                    {product.description && <p className="prod-description">{product.description}</p>}

                    {product.tags && product.tags.length > 0 && (
                        <div className="prod-tags">
                            {product.tags.map((tag) => (
                                <span key={tag} className="prod-tag" onClick={() => navigate(`/products?search=${encodeURIComponent(tag)}`)}>
                                    #{tag}
                                </span>

                            ))}

                        </div>
                    )}

                    <div className="prod-sizes-wrap">
                        <p className={`prod-sizes-label ${sizeError ? "error" : ""}`}>
                            {sizeError ? "Please select a size" : "Select Size"}
                        </p>

                        <div className="prod-sizes">
                            {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((size) => (
                                <button
                                    className={`prod-size-btn ${selectedSize === size ? "active" : ""}`}
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                    
                                </button>
                            ))}

                        </div>

                    </div>

                    <button className={`prod-add-btn ${added ? "added" : ""} ${selectedSize && (product.stock_by_size?.[selectedSize] ?? 0) === 0 ? "out-of-stock" : ""}`}
                        onClick={handleAddToCart}
                        disabled={added || (selectedSize && (product.stock_by_size?.[selectedSize] ?? 0) === 0)}
                    >
                        {selectedSize && (product.stock_by_size?.[selectedSize] ?? 0) === 0 ? "Out of Stock" : added ? "Added to Cart ✓" : "Add to Cart"}

                    </button>

                    <button className="prod-size-chart-link" onClick={() => setSizeChart(true)}>
                        <FaRuler/> Size Chart
                    </button>

                    <div className="prod-shipping">
                        <div className="prod-shipping-row">
                            <span className="prod-shipping-icon">
                                <MdLocalShipping />
                            </span>

                            <div>
                                <p className="prod-shipping-label">Free Shipping over $75</p>
                                <p className="prod-shipping-sub">Standard delivery 5–8 business days</p>
                            </div>

                        </div>

                        <div className="prod-shipping-row">
                            <span className="prod-shipping-icon">
                                <HiArrowUturnLeft />
                            </span>

                            <div>
                                <p className="prod-shipping-label">Easy Returns</p>
                                <p className="prod-shipping-sub">30-day return window on unworn items</p>
                            </div>

                        </div>

                        <div className="prod-shipping-row">
                            <span className="prod-shipping-icon">
                                <PiSparkleFill />
                            </span>

                            <div>
                                <p className="prod-shipping-label">Limited Drops</p>
                                <p className="prod-shipping-sub">Once it's gone, it's gone</p>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}