import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./js/database.js";
import Product from "./models/productModel.js";
import pool from "./js/postgres.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            const regex = { $regex: req.query.search, $options: "i" };

            filter.$or = [
                { name: regex },
                { collection: regex },
                { category: regex },
                { tags: regex }
            ];

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

app.put("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true });

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AUTH
app.post("/api/auth/register", async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    try {
        const existing = await pool.query(
            `SELECT id FROM users WHERE email = $1`, [email]
        );

        if (existing.rows.length > 0) {

            return res.status(400).json({ message: "Email already in use" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name`,
            [email, password_hash, first_name, last_name]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`, [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);

        if (!valid) {

            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};

//Get cart
app.get("/api/cart", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM cart_items WHERE user_id = $1 ORDER BY created_at ASC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Add to cart
app.post("/api/cart", authMiddleware, async (req, res) => {
    const { product_id, name, price, size, quantity, image, collection } = req.body;

    try {
        const existing = await pool.query(
            `SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2 AND size = $3`,
            [req.user.id, product_id, size]

        );

        if (existing.rows.length > 0) {
            const updated = await pool.query(
                `UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *`,
                [quantity, existing.rows[0].id]

            );

            return res.json(updated.rows[0]);
        }

        const result = await pool.query(
            `INSERT INTO cart_items (user_id, product_id, name, price, size, quantity, image, collection)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.user.id, product_id, name, price, size, quantity, image, collection]

        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update product quantity
app.patch("/api/cart/:id", authMiddleware, async (req, res) => {
    const { quantity } = req.body;
    try {
        if (quantity <= 0) {
            await pool.query(`DELETE FROM cart_items WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id]);

            return res.json({ deleted: true });
        }

        const result = await pool.query(
            `UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
            [quantity, req.params.id, req.user.id]

        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

//Remove item
app.delete("/api/cart/:id", authMiddleware, async (req, res) => {
    try {
        await pool.query(`DELETE FROM cart_items WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id]);

        res.json({ deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

//Clear cart
app.delete("/api/cart", authMiddleware, async (req, res) => {
    try {
        await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [req.user.id]);

        res.json({ deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//Orders
app.post("/api/orders", async (req, res) => {
    const { contact, address, cart } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    let user_id = null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            user_id = decoded.id;

        } catch {}
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 75 ? 0 : 8.99;
    const total = subtotal + shipping;

    try {
        // save order to postgres
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, status, subtotal, shipping, total, address, city, state, zip, country)
             VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [user_id, subtotal, shipping, total, address.address, address.city, address.state, address.zip, address.country]

        );

        const order = orderResult.rows[0];

        // save order items to postgres
        await Promise.all(cart.map((item) =>
            pool.query(
                `INSERT INTO order_items (order_id, product_id, name, price, size, quantity, image)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [order.id, item.product_id || item._id, item.name, item.price, item.size, item.quantity, item.image || null]
            )
        ));

        // Decreases stock in atlas
        await Promise.all(cart.map((item) =>
            Product.findByIdAndUpdate(
                item.product_id || item._id,
                { $inc: { [`stock_by_size.${item.size}`]: -item.quantity } }

            )
        ));

        //Clears db cart if logged in
        if (user_id) {
            await pool.query(`DELETE FROM cart_items WHERE user_id = $1`, [user_id]);

        }

        res.status(201).json({ order_id: order.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));