import "dotenv/config";

import express from "express";
import cors from "cors";
import connectDB from "./js/database.js";
import Product from "./models/productModel.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });

    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error" });

    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));