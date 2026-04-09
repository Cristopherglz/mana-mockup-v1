import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  User, 
  RegisterData, 
  Product, 
  Order, 
  ProductFilters,
  AppState 
} from '@/types';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Pan de Campo',
    description: 'Pan artesanal de masa madre con corteza crujiente y miga esponjosa. Elaborado con harina integral y fermentación lenta de 24 horas.',
    price: 450, priceType: 'unit',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop'],
    category: 'panes',
    features: ['Masa madre', 'Fermentación 24hs', 'Harina integral'],
    hasGluten: true,
    isAvailable: true,
    stock: 20,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Medialunas de Manteca',
    description: 'Medialunas mantecosas y dulces, elaboradas con la receta tradicional argentina. Perfectas para el desayuno o la merienda.',
    price: 380, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop'],
    category: 'facturas',
    features: ['Manteca de primera calidad', 'Glaseado artesanal', 'Receta tradicional'],
    hasGluten: true,
    isAvailable: true,
    stock: 50,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Brownie de Chocolate',
    description: 'Brownie húmedo y chocolatoso con nueces caramelizadas. El postre perfecto para los amantes del chocolate.',
    price: 520, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop'],
    category: 'especialidades',
    features: ['Chocolate belga', 'Nueces caramelizadas', 'Textura húmeda'],
    hasGluten: true,
    isAvailable: true,
    stock: 15,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    title: 'Sándwich de Miga Clásico',
    description: 'Triple decker con jamón, queso, lechuga y tomate. El clásico de las meriendas argentinas.',
    price: 650, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&h=800&fit=crop'],
    category: 'sandwiches',
    features: ['Pan de miga casero', 'Jamón cocido', 'Queso tybo'],
    hasGluten: true,
    isAvailable: true,
    stock: 30,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    title: 'Baguette Tradicional',
    description: 'Baguette francesa crujiente por fuera y airy por dentro. Ideal para acompañar comidas o hacer sándwiches.',
    price: 320, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1597079910443-60c43fc4f729?w=800&h=800&fit=crop'],
    category: 'panes',
    features: ['Receta francesa', 'Corteza crujiente', 'Miga airy'],
    hasGluten: true,
    isAvailable: true,
    stock: 25,
    deliveryAvailability: 'pickup_only',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    title: 'Torta de Chocolate',
    description: 'Torta de chocolate de tres capas con ganache y decoración artesanal. Perfecta para celebraciones.',
    price: 8500, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop'],
    category: 'tortas',
    features: ['Tres capas', 'Ganache de chocolate', 'Decoración artesanal'],
    hasGluten: true,
    isAvailable: true,
    stock: 5,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    title: 'Cookies de Avena',
    description: 'Cookies saludables de avena sin gluten, endulzadas con miel. Ideales para una merienda nutritiva.',
    price: 280, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=800&fit=crop'],
    category: 'galletas',
    features: ['Sin gluten', 'Endulzadas con miel', 'Avena integral'],
    hasGluten: false,
    isAvailable: true,
    stock: 40,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    title: 'Vigilantes',
    description: 'Facturas tradicionales argentinas, cubiertas con azúcar negra. Crujientes y deliciosas.',
    price: 350, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop'],
    category: 'facturas',
    features: ['Receta tradicional', 'Azúcar negra', 'Masa hojaldrada'],
    hasGluten: true,
    isAvailable: true,
    stock: 35,
    deliveryAvailability: 'pickup_only',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '9',
    title: 'Pan Sin Gluten',
    description: 'Pan artesanal elaborado con harinas alternativas. Ideal para personas con intolerancia al gluten.',
    price: 550, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&h=800&fit=crop'],
    category: 'panes',
    features: ['100% sin gluten', 'Harina de almendras', 'Semillas'],
    hasGluten: false,
    isAvailable: true,
    stock: 15,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
  {
    id: '10',
    title: 'Tarta de Frutas',
    description: 'Tarta de crema pastelera con frutas frescas de estación. Una explosión de sabor y color.',
    price: 4200, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=800&fit=crop'],
    category: 'tortas',
    features: ['Frutas frescas', 'Crema pastelera casera', 'Masa quebrada'],
    hasGluten: true,
    isAvailable: true,
    stock: 8,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '11',
    title: 'Sándwich de Pollo',
    description: 'Sándwich de miga con pollo desmenuzado, lechuga y mayonesa casera.',
    price: 720, priceType: 'unit' as const,
    images: ['https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=800&fit=crop'],
    category: 'sandwiches',
    features: ['Pollo desmenuzado', 'Mayonesa casera', 'Pan fresco'],
    hasGluten: true,
    isAvailable: true,
    stock: 20,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '12',
    title: 'Alfajores de Maicena',
    description: 'Alfajores tradicionales de maicena rellenos de dulce de leche y coco.',
    price: 450, priceType: 'unit',
    images: ['https://images.unsplash.com/photo-1602351447937-745cb720612f?w=800&h=800&fit=crop'],
    category: 'galletas',
    features: ['Dulce de leche casero', 'Coco rallado', 'Receta tradicional'],
    hasGluten: true,
    isAvailable: true,
    stock: 60,
    deliveryAvailability: 'both',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '2',
    userName: 'María González',
    userEmail: 'maria@example.com',
    userPhone: '+54 376 123-4567',
    items: [
      { productId: '1', productName: 'Pan de Campo', productImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop', quantity: 2, unitPrice: 450, total: 900 },
      { productId: '2', productName: 'Medialunas de Manteca', productImage: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=800&fit=crop', quantity: 6, unitPrice: 380, total: 2280 },
    ],
    subtotal: 3180, deliveryFee: 0, total: 3180, status: 'delivered', paymentMethod: 'cash', deliveryType: 'pickup',
    createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'ORD-002',
    userId: '2',
    userName: 'María González',
    userEmail: 'maria@example.com',
    userPhone: '+54 376 123-4567',
    items: [
      { productId: '6', productName: 'Torta de Chocolate', productImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop', quantity: 1, unitPrice: 8500, total: 8500 },
    ],
    subtotal: 8500, deliveryFee: 500, total: 9000, status: 'ready', paymentMethod: 'transfer', deliveryType: 'delivery',
    deliveryAddress: 'Av. Lavalle 567, Posadas',
    notes: 'Es para un cumpleaños, por favor poner velitas.',
    createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05'),
  },
];

const adminUser: User = {
  id: '1', email: 'admin@manapanaderia.com', name: 'Administrador', lastName: 'Maná',
  phone: '+54 376 123-4567', role: 'admin', createdAt: new Date(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      products: sampleProducts,
      filteredProducts: sampleProducts,
      categories: ['panes', 'facturas', 'tortas', 'sandwiches', 'galletas', 'especialidades'],
      filters: {},
      cart: [],
      favorites: [],
      orders: sampleOrders,
      userOrders: [],
      isLoading: false,
      notification: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (email === 'admin@manapanaderia.com' && password === 'admin123') {
          set({ user: adminUser, isAuthenticated: true, isLoading: false });
          get().showNotification('Bienvenido, Administrador', 'success');
          return;
        }
        const storedUsers = JSON.parse(localStorage.getItem('mana-users') || '[]');
        const user = storedUsers.find((u: User & { password: string }) => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
          get().showNotification(`Bienvenido, ${user.name}!`, 'success');
        } else {
          set({ isLoading: false });
          get().showNotification('Credenciales incorrectas', 'error');
          throw new Error('Credenciales incorrectas');
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const storedUsers = JSON.parse(localStorage.getItem('mana-users') || '[]');
        if (storedUsers.some((u: User) => u.email === data.email)) {
          set({ isLoading: false });
          get().showNotification('El email ya está registrado', 'error');
          throw new Error('El email ya está registrado');
        }
        const newUser: User & { password: string } = {
          id: Date.now().toString(), ...data, role: 'customer', createdAt: new Date(), password: data.password,
        };
        storedUsers.push(newUser);
        localStorage.setItem('mana-users', JSON.stringify(storedUsers));
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
        get().showNotification('Cuenta creada exitosamente', 'success');
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, cart: [] });
        get().showNotification('Sesión cerrada', 'info');
      },

      setFilters: (filters: ProductFilters) => {
        set({ filters });
        const { products } = get();
        let filtered = [...products];
        if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search));
        }
        if (filters.minPrice !== undefined) filtered = filtered.filter(p => p.price >= filters.minPrice!);
        if (filters.maxPrice !== undefined) filtered = filtered.filter(p => p.price <= filters.maxPrice!);
        if (filters.hasGluten !== undefined) filtered = filtered.filter(p => p.hasGluten === filters.hasGluten);
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
            case 'name-asc': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'name-desc': filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
            case 'newest': filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
          }
        }
        set({ filteredProducts: filtered });
      },

      addProduct: async (productData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        const newProduct: Product = { id: Date.now().toString(), ...productData, createdAt: new Date(), updatedAt: new Date() };
        set(state => ({ products: [...state.products, newProduct], filteredProducts: [...state.products, newProduct], isLoading: false }));
        get().showNotification('Producto agregado exitosamente', 'success');
      },

      updateProduct: async (id, productData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set(state => {
          const updatedProducts = state.products.map(p => p.id === id ? { ...p, ...productData, updatedAt: new Date() } : p);
          return { products: updatedProducts, filteredProducts: updatedProducts, isLoading: false };
        });
        get().showNotification('Producto actualizado exitosamente', 'success');
      },

      deleteProduct: async (id) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set(state => ({ products: state.products.filter(p => p.id !== id), filteredProducts: state.filteredProducts.filter(p => p.id !== id), isLoading: false }));
        get().showNotification('Producto eliminado exitosamente', 'success');
      },

      addToCart: (product, quantity = 1) => {
        set(state => {
          const existingItem = state.cart.find(item => item.product.id === product.id);
          if (existingItem) {
            return { cart: state.cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) };
          }
          return { cart: [...state.cart, { product, quantity }] };
        });
      },

      removeFromCart: (productId) => {
        set(state => ({ cart: state.cart.filter(item => item.product.id !== productId) }));
        get().showNotification('Producto eliminado del carrito', 'info');
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeFromCart(productId); return; }
        set(state => ({ cart: state.cart.map(item => item.product.id === productId ? { ...item, quantity } : item) }));
      },

      clearCart: () => { set({ cart: [] }); },

      toggleFavorite: (productId: string) => {
        set(state => {
          const isFav = state.favorites.includes(productId);
          return { favorites: isFav ? state.favorites.filter(id => id !== productId) : [...state.favorites, productId] };
        });
      },

      isFavorite: (productId: string) => {
        return get().favorites.includes(productId);
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      createOrder: async (orderData) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newOrder: Order = { id: `ORD-${Date.now().toString().slice(-6)}`, ...orderData, status: 'pending', createdAt: new Date(), updatedAt: new Date() };
        set(state => ({
          orders: [...state.orders, newOrder],
          userOrders: state.user?.id === orderData.userId ? [...state.userOrders, newOrder] : state.userOrders,
          isLoading: false,
        }));
        get().clearCart();
        get().showNotification('Pedido realizado exitosamente', 'success');
        return newOrder;
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        set(state => ({
          orders: state.orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o),
          userOrders: state.userOrders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o),
          isLoading: false,
        }));
        get().showNotification('Estado del pedido actualizado', 'success');
      },

      setIsLoading: (loading) => set({ isLoading: loading }),
      showNotification: (message, type) => {
        set({ notification: { message, type } });
        setTimeout(() => { set({ notification: null }); }, 3000);
      },
      clearNotification: () => set({ notification: null }),
    }),
    {
      name: 'mana-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, cart: state.cart }),
    }
  )
);
