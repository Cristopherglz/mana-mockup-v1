import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store';

export function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12 flex items-center justify-center">
      <div className="container-app section-padding max-w-2xl">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando con mucho cariño.
          </p>

          {/* Order Details */}
          <div className="bg-mana-cream rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-mana-green" />
                <span className="font-semibold text-gray-900">{order.id}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                order.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                {order.status === 'pending' ? 'Pendiente' :
                 order.status === 'confirmed' ? 'Confirmado' :
                 order.status === 'preparing' ? 'En preparación' :
                 order.status === 'ready' ? 'Listo para retirar' :
                 order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Cliente:</span>
                <span className="font-medium">{order.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Teléfono:</span>
                <span className="font-medium">{order.userPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo de entrega:</span>
                <span className="font-medium">
                  {order.deliveryType === 'pickup' ? 'Retiro en tienda' : 'Delivery'}
                </span>
              </div>
              {order.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Dirección:</span>
                  <span className="font-medium">{order.deliveryAddress}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Método de pago:</span>
                <span className="font-medium">
                  {order.paymentMethod === 'cash' ? 'Efectivo' : 
                   order.paymentMethod === 'transfer' ? 'Transferencia' : 'Tarjeta'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-heading font-bold text-xl text-mana-burgundy">
                    ${order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Productos</h3>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
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
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-8 text-left">
            <h4 className="font-medium text-blue-900 mb-2 font-sans">¿Qué sigue?</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Te contactaremos para confirmar tu pedido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Prepararemos tu pedido con los productos más frescos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>
                  {order.deliveryType === 'pickup' 
                    ? 'Podrás retirar tu pedido en nuestra tienda' 
                    : 'Te lo llevamos a la puerta de tu casa'}
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>
            {user && (
              <Link
                to="/pedidos"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-mana-green text-white rounded-xl font-medium hover:bg-mana-green-dark transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Ver Mis Pedidos
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
