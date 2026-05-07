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
        const filter = {};

        if (req.query.collection) {
            filter.collection = req.query.collection;
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });

    }
});

app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));