import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  ArrowLeft,
  LogOut,
  X,
  CalendarIcon,
  Clock
} from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels, orderStatusLabels, orderStatusColors, type Order } from '@/types';

export function Admin() {
  const navigate = useNavigate();
  const { user, logout, products, orders, deleteProduct, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteProduct(id);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status as any);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12 bg-gray-50">
      <div className="container-app section-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-gray-500 text-sm">Bienvenido, {user.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-mana-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-[16px]" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="w-12 h-12 bg-mana-green/10 rounded-xl flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-mana-green" />
                </div>
                <p className="text-gray-500 text-sm">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900 font-mono">{stats.totalProducts}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="w-12 h-12 bg-mana-burgundy/10 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-mana-burgundy" />
                </div>
                <p className="text-gray-500 text-sm">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 font-mono">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-gray-500 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900 font-mono">{stats.pendingOrders}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-green-500 text-xl font-bold">$</span>
                </div>
                <p className="text-gray-500 text-sm">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900 font-mono">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-gray-900">Pedidos Recientes</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-mana-green hover:text-mana-burgundy text-sm font-medium"
                >
                  Ver todos
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Pedido</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cliente</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.userName}</td>
                        <td className="py-3 px-4 font-medium text-mana-burgundy">${order.total.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${orderStatusColors[order.status]}`}>
                            {orderStatusLabels[order.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-mana-green"
                />
              </div>
              <button
                onClick={() => navigate('/admin/productos/nuevo')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Producto</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Producto</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Categoría</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Precio</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Stock</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.title}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-mana-green/10 text-mana-green rounded-full text-xs">
                            {categoryLabels[product.category]}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-mana-burgundy">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-700' 
                              : product.stock > 0 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/productos/editar/${product.id}`)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="relative">
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-mana-green cursor-pointer"
                >
                   <option value="all">Todos los estados</option>
                   <option value="pending">Pendiente</option>
                   <option value="confirmed">Confirmado</option>
                   <option value="preparing">En preparación</option>
                   <option value="ready">Listo</option>
                   <option value="in_transit">En camino</option>
                   <option value="delivered">Entregado</option>
                   <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Pedido</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Cliente</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Total</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Estado</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <td className="py-4 px-4 font-medium">{order.id}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{order.userName}</p>
                            <p className="text-xs text-gray-500">{order.userPhone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-mana-burgundy">${order.total.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium text-white ${orderStatusColors[order.status as keyof typeof orderStatusColors]}`}>
                            {orderStatusLabels[order.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
