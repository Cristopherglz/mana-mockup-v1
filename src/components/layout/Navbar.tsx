import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  LogOut,
  Package,
  Settings,
  Box,
  ShoppingCart
} from 'lucide-react';
import { useStore } from '@/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, logout, orders, getCartCount } = useStore();
  const isAdmin = user?.role === 'admin';
  const pendingOrdersCount = isAdmin ? orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length : 0;
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    setShowLogoutDialog(false);
  };

  const promptLogout = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutDialog(true);
  };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/categorias', label: 'Categorías' },
    { to: '/nosotros', label: 'Nosotros' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-0 my-0 py-[10px] bg-white shadow-lg pb-[10px] pt-[10px]"
        style={{ transitionTimingFunction: 'var(--ease-rise)' }}
      >
        <div className="container-app section-padding">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 transition-transform duration-300"
              style={{ transform: isScrolled ? 'scale(0.9)' : 'scale(1)' }}
            >
              <img
                src="/logo-mana-header.png"
                alt="Maná - El origen del pan"
                className="h-10 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-mana-burgundy'
                      : 'text-gray-700 hover:text-mana-burgundy'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search */}
              <button
                onClick={() => navigate('/buscar')}
                className="p-2 rounded-full hover:bg-mana-green/10 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Cart - Desktop only */}
              <button
                onClick={() => navigate('/carrito')}
                className="relative p-2 rounded-full hover:bg-mana-green/10 transition-colors hidden lg:flex"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-mana-burgundy text-white text-xs font-bold rounded-full flex items-center justify-center badge-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Admin Pending Orders Bell */}
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="relative p-2 rounded-full hover:bg-mana-green/10 transition-colors"
                >
                  <Box className="w-5 h-5 text-gray-700" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center badge-pulse">
                      {pendingOrdersCount > 9 ? '9+' : pendingOrdersCount}
                    </span>
                  )}
                </button>
              )}

              {/* User */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-mana-green/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-mana-green rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-foreground">{user?.name} {user?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      
                      <Link to="/perfil" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Mi Perfil</span>
                      </Link>
                      
                      <Link to="/pedidos" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Mis Pedidos</span>
                      </Link>
                      
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Panel Admin</span>
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={promptLogout} className="flex items-center gap-3 px-4 py-2.5 w-full hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-mana-green text-white rounded-lg text-sm font-medium hover:bg-mana-green-dark transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-mana-green/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-400 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-400 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl transition-transform duration-400 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ transitionTimingFunction: 'var(--ease-rise)' }}>
          <div className="flex flex-col h-full pt-20 pb-24 px-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-4 py-[12px] rounded-xl text-base font-medium transition-all ${location.pathname === link.to ? 'bg-mana-green/10 text-mana-green' : 'text-gray-700 hover:bg-gray-50'} mt-0`} style={{ animationDelay: `${index * 80}ms`, animation: isMobileMenuOpen ? 'slide-up 0.4s ease-out forwards' : 'none' }}>
                  {link.label}
                </Link>
              ))}
            </div>

            {!isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-mana-green text-white rounded-xl font-medium">
                  <User className="w-5 h-5" /><span>Iniciar Sesión</span>
                </Link>
                <Link to="/registro" className="flex items-center justify-center gap-2 w-full mt-3 py-3 border-2 border-mana-green text-mana-green rounded-xl font-medium">
                  <span>Crear Cuenta</span>
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Link to="/perfil" className="flex items-center gap-3 px-4 py-3 text-gray-700"><User className="w-5 h-5" /><span>Mi Perfil</span></Link>
                <Link to="/pedidos" className="flex items-center gap-3 px-4 py-3 text-gray-700"><Package className="w-5 h-5" /><span>Mis Pedidos</span></Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-mana-burgundy"><Settings className="w-5 h-5" /><span>Panel Admin</span></Link>
                )}
                <button onClick={promptLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 w-full"><LogOut className="w-5 h-5" /><span>Cerrar Sesión</span></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a salir de tu cuenta. ¿Estás seguro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="rounded-xl bg-red-600 hover:bg-red-700">
              Sí, salir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
