import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/auth.css";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const nameRegex = /^[a-zA-Z]+$/;
        if (!nameRegex.test(form.first_name) || !nameRegex.test(form.last_name)) {
            return setError("Names can only contain letters");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return setError("Please enter a valid email address");
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(form.password)) {
            return setError("Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character");
        }

        if (form.password !== form.confirm) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    email: form.email,
                    password: form.password,

                }),

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
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-sub">Join the Rumbl Stitches community</p>

                {error && <p className="auth-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-row">
                        <div className="auth-field">
                            <label className="auth-label">First Name</label>

                            <input className="auth-input"
                                type="text"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                placeholder="Monkey"
                                required
                            />

                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Last Name</label>

                            <input className="auth-input"
                                type="text"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                placeholder="Luffy"
                                required
                            />

                        </div>

                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Email</label>

                        <input className="auth-input"
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

                        <input className="auth-input"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                    </div>

                    <div className="auth-field">
                        <label className="auth-label">Confirm Password</label>

                        <input className="auth-input"
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                    </div>

                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>

            </div>

        </div>
    );
}