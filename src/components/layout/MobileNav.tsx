import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Croissant, ShoppingCart, User } from 'lucide-react';
import { useStore } from '@/store';

export function MobileNav() {
  const location = useLocation();
  const { getCartCount, isAuthenticated } = useStore();
  const cartCount = getCartCount();

  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/productos', icon: ShoppingBag, label: 'Productos' },
    { to: '/categorias', icon: Croissant, label: 'Categorías' },
    { to: '/carrito', icon: ShoppingCart, label: 'Carrito', badge: cartCount },
    { to: isAuthenticated ? '/perfil' : '/login', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`mobile-nav-item relative px-3 py-2 ${
                isActive ? 'active' : ''
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-mana-green' : 'text-gray-400'
                }`} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-mana-burgundy text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-mana-green' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-mana-green rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
