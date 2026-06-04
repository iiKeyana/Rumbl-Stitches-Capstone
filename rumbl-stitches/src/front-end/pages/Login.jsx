import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/auth.css";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),

            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.dispatchEvent(new Event("storage"));
            
            window.location.href = "/";
        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-desc">Sign in to your account</p>

                {error && <p className="auth-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label className="auth-label">Email</label>

                        <input
                            className="auth-input"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="luffy@grandline.com"
                            required
                        />

                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Password</label>

                        <input
                            className="auth-input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}

                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>

            </div>
            
        </div>
    );
}