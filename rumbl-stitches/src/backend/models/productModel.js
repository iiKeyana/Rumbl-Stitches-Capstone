import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    collection:  { type: String, default: "" },
    category:    { type: String, default: "" },
    sizes:       { type: [String], default: ["S", "M", "L", "XL", "XXL"] },
});

export default mongoose.model("Product", productSchema);