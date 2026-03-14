import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ReviewProvider } from "./context/ReviewContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CompareProvider, useCompare } from "./context/CompareContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import CompareBar from "./components/ui/CompareBar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ShippingPolicy from "./pages/ShippingPolicy";
import FAQ from "./pages/FAQ";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex items-center justify-center py-32 text-gray-400">Cargando...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  const { compareList } = useCompare();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-1 ${compareList.length > 0 ? "pb-20" : ""}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/favoritos" element={<Wishlist />} />
          <Route path="/comparar" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/quienes-somos" element={<AboutUs />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/politica-de-envios" element={<ShippingPolicy />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="ordenes" element={<AdminOrders />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
      <Footer />
      <WhatsAppButton />
      <CompareBar />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ReviewProvider>
                <ToastProvider>
                  <CompareProvider>
                    <AppContent />
                  </CompareProvider>
                </ToastProvider>
              </ReviewProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
