import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Product } from "./types";

// Carga diferida (Lazy Loading) para mejorar rendimiento
const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Manejo seguro de `localStorage`
  const getStoredProducts = () => {
    try {
      const savedProducts = localStorage.getItem("localProducts");
      return savedProducts ? JSON.parse(savedProducts) : [];
    } catch {
      return [];
    }
  };

  const [localProducts, setLocalProducts] = useState<Product[]>(getStoredProducts);

  // Guardar productos locales en `localStorage`
  useEffect(() => {
    localStorage.setItem("localProducts", JSON.stringify(localProducts));
  }, [localProducts]);

  // Memoizar la función para evitar renders innecesarios
  const handleProductCreated = useCallback((newProduct: Product) => {
    setLocalProducts((prev) => [...prev, newProduct]);
  }, []);

  // Memoizar `localProducts` para mejorar rendimiento
  const memoizedLocalProducts = useMemo(() => localProducts, [localProducts]);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar onSearch={(query) => setSearchQuery(query)} />
          <Suspense fallback={<p className="text-center text-gray-500">Cargando...</p>}>
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} localProducts={memoizedLocalProducts} />} />
              <Route path="/product/:id" element={<ProductDetail localProducts={memoizedLocalProducts} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts onProductCreated={handleProductCreated} />
                  </AdminRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
