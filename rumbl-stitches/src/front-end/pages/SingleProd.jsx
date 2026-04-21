import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../assets/css/single.css";

export default function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);

            })
            .catch(() => {
                setError("Failed to load product");
                setLoading(false);
            });

    }, [id]);



    if (loading) return <div className="prod-status">Loading...</div>;
    if (error) return <div className="prod-status">{error}</div>;
    if (!product) return null;

    return (
        <div className= "prod-page">
            <button className="prod-back" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className= "prod-layout">
                <div className= "prod-image-wrap">
                    {product.image ? <img src={product.image} alt={product.name} className="prod-image" />
                        : <div className="prod-image-placeholder"><span>No Image</span></div>
                    }
                </div>

                <div className= "prod-details">
                    {product.collection && (
                        <p className="prod-collection">{product.collection}</p>

                    )}

                    <h1 className= "prod-name">{product.name}</h1>
                    <p className= "prod-price">${product.price}</p>

                    {product.description && (
                        <p className= "prod-description">{product.description}</p>

                    )}

                    <div className= "prod-sizes-wrap">
                        <p className= {`prod-sizes-label ${sizeError ? "error" : ""}`}>
                            {sizeError ? "Please select a size" : "Select Size"}
                        </p>

                        <div className= "prod-sizes">
                            {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((size) => (
                                <button
                                    key={size}
                                    className={`prod-size-btn ${selectedSize === size ? "active" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}

                                </button>
                            ))}

                        </div>
                    </div>

                    <button
                        className= {`prod-add-btn ${added ? "added" : ""}`}
                    >
                        {added ? "Added to Cart ✓" : "Add to Cart"}
                    </button>

                </div>

            </div>
        </div>
    );
}