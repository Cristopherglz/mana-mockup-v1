import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, ChevronDown, Search, Filter } from 'lucide-react';
import { useStore } from '@/store';
import { orderStatusLabels, orderStatusColors, type OrderStatus } from '@/types';

export function Orders() {
  const navigate = useNavigate();
  const { user, orders, isAuthenticated } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const userOrders = orders
    .filter(o => o.userId === user?.id)
    .filter(o => {
      if (statusFilter === 'all') return true;
      return o.status === statusFilter;
    })
    .filter(o => {
      if (!searchQuery) return true;
      return (
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding max-w-4xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-mana-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Mis Pedidos
            </h1>
            <p className="text-gray-500 mt-1">
              {userOrders.length} {userOrders.length === 1 ? 'pedido' : 'pedidos'} realizados
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número o producto..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-mana-green focus:ring-2 focus:ring-mana-green/20"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="appearance-none w-full sm:w-48 pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-mana-green cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="preparing">En preparación</option>
              <option value="ready">Listo para retirar</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Orders List */}
        {userOrders.length > 0 ? (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full p-4 sm:p-6 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-mana-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-mana-green" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{order.id}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${orderStatusColors[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-lg text-mana-burgundy">
                      ${order.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                </button>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 p-4 sm:p-6 animate-slide-up">
                    {/* Items */}
                    <div className="space-y-3 mb-6">
                      <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} x ${item.unitPrice.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-medium text-mana-burgundy">
                            ${item.total.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Info */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Detalles del Pedido</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Subtotal:</span> ${order.subtotal.toLocaleString()}</p>
                          <p><span className="text-gray-500">Envío:</span> ${order.deliveryFee.toLocaleString()}</p>
                          <p><span className="text-gray-500">Total:</span> <span className="font-bold text-mana-burgundy">${order.total.toLocaleString()}</span></p>
                          <p><span className="text-gray-500">Pago:</span> {order.paymentMethod === 'cash' ? 'Efectivo' : order.paymentMethod === 'transfer' ? 'Transferencia' : 'Tarjeta'}</p>
                          <p><span className="text-gray-500">Entrega:</span> {order.deliveryType === 'pickup' ? 'Retiro en tienda' : 'Delivery'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Información de Contacto</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Nombre:</span> {order.userName}</p>
                          <p><span className="text-gray-500">Teléfono:</span> {order.userPhone}</p>
                          {order.deliveryAddress && (
                            <p><span className="text-gray-500">Dirección:</span> {order.deliveryAddress}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Notas</h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <div className="w-20 h-20 bg-mana-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-mana-green" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
              No tienes pedidos
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'No se encontraron pedidos con los filtros aplicados'
                : 'Aún no has realizado ningún pedido. ¡Explora nuestros productos!'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="btn-primary"
              >
                Limpiar filtros
              </button>
            ) : (
              <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
                Ver Productos
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
