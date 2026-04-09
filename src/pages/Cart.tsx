import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useStore } from '@/store';

export function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useStore();
  const cartTotal = getCartTotal();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-24 lg:pb-12 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-mana-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-mana-green" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Parece que aún no has agregado productos a tu carrito. ¡Explora nuestros productos!
          </p>
          <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
            Ver Productos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              Mi Carrito
            </h1>
            <p className="text-gray-500 mt-1">
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Vaciar
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-card flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-semibold text-gray-900 truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        ${item.product.price.toLocaleString()} c/u
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {!item.product.hasGluten && (
                    <span className="inline-block mt-2 gluten-free-badge text-xs">
                      Sin Gluten
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-mana-green hover:text-mana-green transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-mana-green hover:text-mana-green transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Total */}
                    <p className="font-heading font-bold text-lg text-mana-burgundy">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="font-heading font-semibold text-xl text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600">A calcular</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-heading font-bold text-2xl text-mana-burgundy">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Continuar con el Pedido
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/productos"
                className="w-full mt-3 py-3 text-center text-mana-green hover:text-mana-burgundy font-medium transition-colors block"
              >
                Seguir comprando
              </Link>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Package className="w-5 h-5 text-mana-green" />
                  <span>Retiro en tienda disponible</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span>Productos frescos garantizados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scale-in">
              <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">
                ¿Vaciar carrito?
              </h3>
              <p className="text-gray-500 mb-6">
                Se eliminarán todos los productos de tu carrito. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Vaciar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
