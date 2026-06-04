import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/collection.css";

const collections = [
    {
        id: "one-piece",
        name: "One Piece",
        sub: "Streetwear inspired by the Grand Line",
        gif: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTFtZ2w5cGlueGo2czJhc3JjOHp6YnNkNzZydjcyZTMzOTViN3ZhaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kprByMkudw8s8/giphy.gif",
    },
    {
        id: "jujutsu-kaisen",
        name: "Jujutsu Kaisen",
        sub: "Cursed energy, elevated style",
        gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExang2cXI2bmRqM2hrMmx5ZmNtN2E4YzdldzQycHFlNmVsaHRwODZrdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vOJE2GSxvy3AJwtJKd/giphy.gif",
    },
    {
        id: "demon-slayer",
        name: "Demon Slayer",
        sub: "Total concentration. Total style.",
        gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTNhNGZiaDVsZXltb3FxMHVubzV4YjZpcXQxOGFjaTk4d2F5OWNreSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YpJML8vjoydbQPFvUo/giphy.gif",
    }

];

export default function Collection() {
    const [activeGif, setActiveGif] = useState(null);

    const active = collections.find((c) => c.id === activeGif);

    return (
        <div className="collection-page">

            <div
                className="collection-gif-bg"
                style={{
                    backgroundImage: active ? `url(${active.gif})` : "none",
                    opacity: active ? 1 : 0,
                }}
            />
            
            <div className={`collection-gif-overlay${active ? " collection-gif-overlay--on" : ""}`} />

            <h1 className="collection-title">Collections</h1>
            <p className="collection-sub">Choose a collection to explore</p>

            <div className="collection-grid">
                <Link
                    to="/collections/one-piece"
                    className="collection-card"
                    onMouseEnter={() => setActiveGif("one-piece")}
                    onMouseLeave={() => setActiveGif(null)}
                >
                    <h2>One Piece</h2>
                    <p>Streetwear inspired by the Grand Line</p>

                </Link>

                <Link
                    to="/collections/jujutsu-kaisen"
                    className="collection-card"
                    onMouseEnter={() => setActiveGif("jujutsu-kaisen")}
                    onMouseLeave={() => setActiveGif(null)}
                >
                    <h2>Jujutsu Kaisen</h2>
                    <p>Cursed energy, elevated style</p>

                </Link>

                <Link
                    to="/collections/demon-slayer"
                    className="collection-card"
                    onMouseEnter={() => setActiveGif("demon-slayer")}
                    onMouseLeave={() => setActiveGif(null)}
                >
                    <h2>Demon Slayer</h2>
                    <p>Total concentration. Total style.</p>

                </Link>
                
            </div>
        </div>
    );
}