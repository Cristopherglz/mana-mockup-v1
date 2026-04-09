import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Products } from '@/pages/Products';
import { ProductDetail } from '@/pages/ProductDetail';
import { Categories } from '@/pages/Categories';
import { About } from '@/pages/About';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Profile } from '@/pages/Profile';
import { Orders } from '@/pages/Orders';
import { Admin } from '@/pages/Admin';
import { AdminProductForm } from '@/pages/AdminProductForm';
import { OrderSuccess } from '@/pages/OrderSuccess';
import { Search } from '@/pages/Search';
import { NotFound } from '@/pages/NotFound';
import { SplashScreen } from '@/components/SplashScreen';
import { useStore } from '@/store';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, user } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Products />} />
            <Route path="producto/:id" element={<ProductDetail />} />
            <Route path="categorias" element={<Categories />} />
            <Route path="nosotros" element={<About />} />
            <Route path="buscar" element={<Search />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="pedidos" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="pedido-exito" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="admin/productos/nuevo" element={<ProtectedRoute requireAdmin><AdminProductForm /></ProtectedRoute>} />
            <Route path="admin/productos/editar/:id" element={<ProtectedRoute requireAdmin><AdminProductForm /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
