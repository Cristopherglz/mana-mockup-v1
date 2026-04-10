import { useState, useEffect, useRef } from 'react';
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
  Clock,
  Settings,
  Truck
} from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels, orderStatusLabels, orderStatusColors, paymentStatusLabels, paymentStatusColors, type Order } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function Admin() {
  const navigate = useNavigate();
  const { user, logout, products, orders, deleteProduct, updateOrderStatus, minDeliveryAmount, setMinDeliveryAmount } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deliveryAmountInput, setDeliveryAmountInput] = useState(minDeliveryAmount.toString());
  const prevOrderCountRef = useRef(orders.length);

  // Play bell sound when new order arrives
  useEffect(() => {
    if (orders.length > prevOrderCountRef.current) {
      // New order detected - play bell sound
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBell = (freq: number, startTime: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + 0.8);
        osc.start(audioCtx.currentTime + startTime);
        osc.stop(audioCtx.currentTime + startTime + 0.8);
      };
      playBell(830, 0);
      playBell(1050, 0.15);
      playBell(830, 0.3);
    }
    prevOrderCountRef.current = orders.length;
  }, [orders.length]);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Only show paid orders in admin
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

  const filteredOrders = paidOrders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const stats = {
    totalProducts: products.length,
    totalOrders: paidOrders.length,
    pendingOrders: paidOrders.filter(o => o.status === 'pending').length,
    totalRevenue: paidOrders.reduce((acc, o) => acc + o.total, 0),
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </AlertDialogTrigger>
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
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
            { id: 'settings', label: 'Ajustes', icon: Settings },
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

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="font-heading font-bold text-xl text-gray-900">Pedido {selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Items */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">{item.quantity} x ${item.unitPrice.toLocaleString()}</p>
                        </div>
                        <p className="font-medium text-mana-burgundy">${item.total.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client info */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Cliente</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Nombre:</span> {selectedOrder.userName}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedOrder.userEmail}</p>
                    <p><span className="text-gray-500">Teléfono:</span> {selectedOrder.userPhone}</p>
                  </div>
                </div>

                {/* Payment & delivery */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Pago y Entrega</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Método de pago:</span> {selectedOrder.paymentMethod === 'cash' ? 'Efectivo' : selectedOrder.paymentMethod === 'transfer' ? 'Transferencia' : 'Tarjeta'}</p>
                    <p><span className="text-gray-500">Tipo:</span> {selectedOrder.deliveryType === 'pickup' ? 'Retiro en tienda' : 'Delivery'}</p>
                    {selectedOrder.deliveryAddress && (
                      <p><span className="text-gray-500">Dirección:</span> {selectedOrder.deliveryAddress}</p>
                    )}
                    <p><span className="text-gray-500">Subtotal:</span> ${selectedOrder.subtotal.toLocaleString()}</p>
                    <p><span className="text-gray-500">Envío:</span> ${selectedOrder.deliveryFee.toLocaleString()}</p>
                    <p><span className="text-gray-500">Total:</span> <span className="font-bold text-mana-burgundy">${selectedOrder.total.toLocaleString()}</span></p>
                  </div>
                </div>

                {/* Scheduled date */}
                {(selectedOrder.scheduledDate || selectedOrder.scheduledTime) && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> Programado
                    </h3>
                    <div className="text-sm space-y-1">
                      {selectedOrder.scheduledDate && (
                        <p><span className="text-gray-500">Fecha:</span> {new Date(selectedOrder.scheduledDate + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      )}
                      {selectedOrder.scheduledTime && (
                        <p><span className="text-gray-500">Hora:</span> {selectedOrder.scheduledTime}</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-medium text-gray-900 mb-1">Notas</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                )}

                {/* Status change */}
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Cambiar Estado</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      handleUpdateOrderStatus(selectedOrder.id, e.target.value);
                      setSelectedOrder({ ...selectedOrder, status: e.target.value as any });
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-white border-0 cursor-pointer ${orderStatusColors[selectedOrder.status as keyof typeof orderStatusColors]}`}
                  >
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
