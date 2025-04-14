import { Route, Routes, Navigate } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import HomePagelink from "./Route/HomePagelink/HomePagelink";
import Userlink from "./Route/Userlink/Userlink";
import Registration from "./User/Registration";
import CatalogPagelink from "./Route/CatalogPagelink/CatalogPagelink";
import ProductPagelink from "./Route/ProductPagelink/ProductPagelink";
import BasketPagelink from "./Route/BasketPagelink/BasketPagelink";
import { CartProvider } from './CartContext'
import AboutUslink from "./Route/AboutUslink/AboutUslink";
import AdminPanel from "./Admin/AdminPanel";
import AdminLogin from "./Admin/AdminLogin";
import Aboutpaymentlink from "./Route/Aboutpaymentlink/Aboutpaymentlink";


export default function MainRouter() {
    return (
        <>
            <CartProvider>
                <HashRouter>

                    <Routes>

                        <Route path="/" index element={<HomePagelink />} />
                        <Route path="/Главная" element={<HomePagelink />} />
                        <Route path="/login" element={<Userlink />} />
                        <Route path="/registration" element={<Registration />} />
                        <Route path="/Каталог" element={<CatalogPagelink />} />
                        <Route path="/Каталог" element={<CatalogPagelink />} />
                        <Route path="/product/:id" element={<ProductPagelink />} />
                        <Route path="/basket" element={<BasketPagelink />} />
                        <Route path="/basket" element={<BasketPagelink />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/О нас" element={<AboutUslink />} />
                        <Route path="/Об оплате" element={<Aboutpaymentlink />} />

                    </Routes>

                </HashRouter>
            </CartProvider>
        </>
    )
}