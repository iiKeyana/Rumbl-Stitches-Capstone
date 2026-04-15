import {Routes, Route} from "react-router-dom";
import Layout from "../front-end/pages/Layout";

import Home from "../front-end/pages/Home";
import Products from "../front-end/pages/Products";
import SingleProduct from "../front-end/pages/SingleProduct";
import Collection from "../front-end/pages/Collection";
import Cart from "../front-end/pages/Cart";
import Checkout from "../front-end/pages/Checkout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                
                <Route path="collections" element={<Collection />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<SingleProduct />} />

                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />

            </Route>

        </Routes>
    );
}