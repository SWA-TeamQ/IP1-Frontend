import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/Home.jsx";
import ProductsPage from "./pages/Products.jsx";
import ProductDetailPage from "./pages/ProductDetail.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import ContactPage from "./pages/Contact.jsx";
import AboutPage from "./pages/About.jsx";
import ServicesPage from "./pages/Services.jsx";
import ProfilePage from "./pages/Profile.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword.jsx";
import NotFoundPage from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;