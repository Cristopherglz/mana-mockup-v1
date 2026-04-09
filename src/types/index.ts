// User types
export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone: string;
  address?: string;
}

// Product types
export type DeliveryAvailability = 'pickup_only' | 'delivery_only' | 'both';

export const deliveryAvailabilityLabels: Record<DeliveryAvailability, string> = {
  pickup_only: 'Solo retiro en local',
  delivery_only: 'Solo envío a domicilio',
  both: 'Retiro y envío disponibles',
};

export type PriceType = 'unit';

export const priceTypeLabels: Record<PriceType, string> = {
  unit: 'Por unidad',
};

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: PriceType;
  images: string[];
  category: Category;
  features: string[];
  hasGluten: boolean;
  isAvailable: boolean;
  stock: number;
  deliveryAvailability: DeliveryAvailability;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = 
  | 'panes'
  | 'facturas'
  | 'tortas'
  | 'sandwiches'
  | 'galletas'
  | 'especialidades';

export const categoryLabels: Record<Category, string> = {
  panes: 'Panes',
  facturas: 'Facturas',
  tortas: 'Tortas',
  sandwiches: 'Sándwiches',
  galletas: 'Galletas',
  especialidades: 'Especialidades',
};

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order types
export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'En preparación',
  ready: 'Listo para retirar',
  in_transit: 'En camino',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  preparing: 'bg-purple-500',
  ready: 'bg-green-500',
  in_transit: 'bg-sky-500',
  delivered: 'bg-mana-green',
  cancelled: 'bg-mana-burgundy',
};

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'card' | 'transfer';
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Payment types
export interface PaymentData {
  method: 'cash' | 'card' | 'transfer';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
}

// Filter types
export interface ProductFilters {
  category?: Category;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  hasGluten?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}

// App state
export interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  
  // Products
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  
  // Orders
  orders: Order[];
  userOrders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  // UI
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
}
