import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, LogOut, Edit2, Save, ArrowRight } from 'lucide-react';
import { useStore } from '@/store';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout, orders } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const userOrders = orders.filter(o => o.userId === user.id);
  const recentOrders = userOrders.slice(0, 3);

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Mi Perfil
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona tu información y pedidos
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="text-center">
                <div className="w-24 h-24 bg-mana-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-heading font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="font-heading font-semibold text-xl text-gray-900">
                  {user.name} {user.lastName}
                </h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-mana-burgundy/10 text-mana-burgundy' 
                    : 'bg-mana-green/10 text-mana-green'
                }`}>
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-mana-green" />
                  <span className="text-gray-600">{user.phone}</span>
                </div>
                {user.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-mana-green" />
                    <span className="text-gray-600">{user.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-mana-green" />
                  <span className="text-gray-600">{userOrders.length} pedidos realizados</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-medium text-gray-900 mb-3">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Link
                  to="/productos"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Ver Productos</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  to="/pedidos"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700">Mis Pedidos</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-mana-burgundy/5 transition-colors"
                  >
                    <span className="text-mana-burgundy">Panel de Administración</span>
                    <ArrowRight className="w-4 h-4 text-mana-burgundy" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-gray-900">
                  Información Personal
                </h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-2 text-mana-green hover:text-mana-burgundy transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nombre</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-mana-green disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Apellido</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-mana-green disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-mana-green disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Dirección</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Agregar dirección..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-mana-green disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-semibold text-xl text-gray-900">
                  Pedidos Recientes
                </h2>
                <Link
                  to="/pedidos"
                  className="text-mana-green hover:text-mana-burgundy text-sm font-medium transition-colors"
                >
                  Ver todos
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-12 h-12 bg-mana-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-mana-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                            order.status === 'delivered' ? 'bg-green-500' :
                            order.status === 'cancelled' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}>
                            {order.status === 'delivered' ? 'Entregado' :
                             order.status === 'cancelled' ? 'Cancelado' :
                             order.status === 'pending' ? 'Pendiente' :
                             order.status === 'preparing' ? 'En preparación' :
                             order.status === 'ready' ? 'Listo' : 'Confirmado'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-AR')} • ${order.total.toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to={`/pedidos/${order.id}`}
                        className="p-2 text-mana-green hover:bg-mana-green/10 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aún no has realizado pedidos</p>
                  <Link
                    to="/productos"
                    className="inline-block mt-3 text-mana-green hover:text-mana-burgundy font-medium"
                  >
                    Hacer mi primer pedido
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
