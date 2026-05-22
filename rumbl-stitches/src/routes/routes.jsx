import {Routes, Route} from "react-router-dom";
import Layout from "../front-end/pages/Layout";

import Home from "../front-end/pages/Home";
import Products from "../front-end/pages/Products";
import SingleProduct from "../front-end/pages/SingleProd";
import Collection from "../front-end/pages/Collection";
import Cart from "../front-end/pages/Cart";
import Checkout from "../front-end/pages/Checkout";
import OnePiece from "../front-end/pages/OnePiece";
import JJK from "../front-end/pages/Juju";
import DemonSlayer from "../front-end/pages/DSlay";
import Register from "../front-end/pages/Register";
import Login from "../front-end/pages/Login";
import OrderConf from "../front-end/pages/OrderConf";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                
                <Route path="collections" element={<Collection />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<SingleProduct />} />

                <Route path="collections/one-piece" element={<OnePiece />} />
                <Route path="collections/jujutsu-kaisen" element={<JJK />} />
                <Route path="collections/demon-slayer" element={<DemonSlayer />} />

                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />

                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />

                <Route path="order-confirmation/:id" element={<OrderConf />} />

            </Route>

        </Routes>
    );
}