import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Truck, Store, MapPin, Phone, User, Check } from 'lucide-react';
import { useStore } from '@/store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, user, createOrder, isLoading } = useStore();
  const cartTotal = getCartTotal();
  
  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notes: '',
  });
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    navigate('/carrito');
    return null;
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    
    if (deliveryType === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'La dirección es requerida para delivery';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (paymentMethod !== 'card') return true;
    
    const newErrors: Record<string, string> = {};
    
    if (cardData.number.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    }
    if (cardData.expiry.length !== 5) {
      newErrors.cardExpiry = 'Fecha inválida';
    }
    if (cardData.cvc.length !== 3) {
      newErrors.cardCvc = 'CVC inválido';
    }
    if (!cardData.name.trim()) {
      newErrors.cardName = 'El nombre es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    try {
      const order = await createOrder({
        userId: user?.id || 'guest',
        userName: `${formData.name} ${formData.lastName}`,
        userEmail: user?.email || '',
        userPhone: formData.phone,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.title,
          productImage: item.product.images[0],
          quantity: item.quantity,
          unitPrice: item.product.price,
          total: item.product.price * item.quantity,
        })),
        subtotal: cartTotal,
        deliveryFee: deliveryType === 'delivery' ? 500 : 0,
        total: cartTotal + (deliveryType === 'delivery' ? 500 : 0),
        paymentMethod,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? formData.address : undefined,
        notes: formData.notes || undefined,
      });
      
      navigate('/pedido-exito', { state: { order } });
    } catch (error) {
      // Error handled in store
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding max-w-4xl">
        {/* Header */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/carrito')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-mana-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{step > 1 ? 'Volver' : 'Volver al carrito'}</span>
        </button>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Finalizar Compra
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  s === step
                    ? 'bg-mana-green text-white'
                    : s < step
                    ? 'bg-mana-green/20 text-mana-green'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm hidden sm:block ${
                s === step ? 'text-mana-green font-medium' : 'text-gray-500'
              }`}>
                {s === 1 ? 'Datos' : s === 2 ? 'Pago' : 'Confirmar'}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up">
                <h2 className="font-heading font-semibold text-xl text-gray-900 mb-6">
                  Datos de Contacto
                </h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Nombre</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: '' });
                          }}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                            errors.name ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                          }`}
                          placeholder="Juan"
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">Apellido</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({ ...formData, lastName: e.target.value });
                            if (errors.lastName) setErrors({ ...errors, lastName: '' });
                          }}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                            errors.lastName ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                          }`}
                          placeholder="Pérez"
                        />
                      </div>
                      {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                          errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                        }`}
                        placeholder="+54 376 123-4567"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Delivery Type */}
                  <div>
                    <label className="form-label">Tipo de Entrega</label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                          deliveryType === 'pickup'
                            ? 'border-mana-green bg-mana-green/5'
                            : 'border-gray-200 hover:border-mana-green/50'
                        }`}
                      >
                        <Store className={`w-6 h-6 ${deliveryType === 'pickup' ? 'text-mana-green' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className={`font-medium ${deliveryType === 'pickup' ? 'text-mana-green' : 'text-gray-700'}`}>
                            Retiro en Tienda
                          </p>
                          <p className="text-sm text-gray-500">Gratis</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                          deliveryType === 'delivery'
                            ? 'border-mana-green bg-mana-green/5'
                            : 'border-gray-200 hover:border-mana-green/50'
                        }`}
                      >
                        <Truck className={`w-6 h-6 ${deliveryType === 'delivery' ? 'text-mana-green' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className={`font-medium ${deliveryType === 'delivery' ? 'text-mana-green' : 'text-gray-700'}`}>
                            Delivery
                          </p>
                          <p className="text-sm text-gray-500">$500</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="animate-slide-up">
                      <label className="form-label">Dirección de Entrega</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData({ ...formData, address: e.target.value });
                            if (errors.address) setErrors({ ...errors, address: '' });
                          }}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                            errors.address ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                          }`}
                          placeholder="Av. Lavalle 1234, Posadas"
                        />
                      </div>
                      {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                    </div>
                  )}

                  <div>
                    <label className="form-label">Notas (opcional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-mana-green transition-all resize-none"
                      rows={3}
                      placeholder="Instrucciones especiales para tu pedido..."
                    />
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-6 btn-primary"
                >
                  Continuar
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up">
                <h2 className="font-heading font-semibold text-xl text-gray-900 mb-6">
                  Método de Pago
                </h2>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-mana-green bg-mana-green/5'
                        : 'border-gray-200 hover:border-mana-green/50'
                    }`}
                  >
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-mana-green' : 'text-gray-400'}`} />
                    <div className="text-left flex-1">
                      <p className={`font-medium ${paymentMethod === 'cash' ? 'text-mana-green' : 'text-gray-700'}`}>
                        Efectivo
                      </p>
                      <p className="text-sm text-gray-500">Pago al retirar o recibir</p>
                    </div>
                    {paymentMethod === 'cash' && <Check className="w-5 h-5 text-mana-green" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-mana-green bg-mana-green/5'
                        : 'border-gray-200 hover:border-mana-green/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${paymentMethod === 'transfer' ? 'bg-mana-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                      <span className="text-xs font-bold">$</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className={`font-medium ${paymentMethod === 'transfer' ? 'text-mana-green' : 'text-gray-700'}`}>
                        Transferencia Bancaria
                      </p>
                      <p className="text-sm text-gray-500">CBU/Alias</p>
                    </div>
                    {paymentMethod === 'transfer' && <Check className="w-5 h-5 text-mana-green" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
                      paymentMethod === 'card'
                        ? 'border-mana-green bg-mana-green/5'
                        : 'border-gray-200 hover:border-mana-green/50'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-mana-green' : 'text-gray-400'}`} />
                    <div className="text-left flex-1">
                      <p className={`font-medium ${paymentMethod === 'card' ? 'text-mana-green' : 'text-gray-700'}`}>
                        Tarjeta de Crédito/Débito
                      </p>
                      <p className="text-sm text-gray-500">Pago seguro con MercadoPago</p>
                    </div>
                    {paymentMethod === 'card' && <Check className="w-5 h-5 text-mana-green" />}
                  </button>

                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl animate-slide-up">
                      <div className="space-y-4">
                        <div>
                          <label className="form-label">Número de Tarjeta</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => {
                              setCardData({ ...cardData, number: formatCardNumber(e.target.value) });
                              if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
                            }}
                            maxLength={19}
                            className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.cardNumber ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                            }`}
                            placeholder="0000 0000 0000 0000"
                          />
                          {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Vencimiento</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={(e) => {
                                setCardData({ ...cardData, expiry: formatExpiry(e.target.value) });
                                if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: '' });
                              }}
                              maxLength={5}
                              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                                errors.cardExpiry ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                              }`}
                              placeholder="MM/AA"
                            />
                            {errors.cardExpiry && <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>}
                          </div>
                          <div>
                            <label className="form-label">CVC</label>
                            <input
                              type="text"
                              value={cardData.cvc}
                              onChange={(e) => {
                                setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) });
                                if (errors.cardCvc) setErrors({ ...errors, cardCvc: '' });
                              }}
                              maxLength={3}
                              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                                errors.cardCvc ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                              }`}
                              placeholder="123"
                            />
                            {errors.cardCvc && <p className="mt-1 text-sm text-red-500">{errors.cardCvc}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Nombre en la Tarjeta</label>
                          <input
                            type="text"
                            value={cardData.name}
                            onChange={(e) => {
                              setCardData({ ...cardData, name: e.target.value });
                              if (errors.cardName) setErrors({ ...errors, cardName: '' });
                            }}
                            className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                              errors.cardName ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                            }`}
                            placeholder="JUAN PEREZ"
                          />
                          {errors.cardName && <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 btn-primary"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 shadow-card animate-slide-up">
                <h2 className="font-heading font-semibold text-xl text-gray-900 mb-6">
                  Confirmar Pedido
                </h2>

                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.product.title}</p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x ${item.product.price.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-mana-burgundy">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium text-gray-900 mb-3">Detalles de Entrega</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Nombre:</span> {formData.name} {formData.lastName}</p>
                      <p><span className="text-gray-500">Teléfono:</span> {formData.phone}</p>
                      <p><span className="text-gray-500">Tipo:</span> {deliveryType === 'pickup' ? 'Retiro en tienda' : 'Delivery'}</p>
                      {deliveryType === 'delivery' && (
                        <p><span className="text-gray-500">Dirección:</span> {formData.address}</p>
                      )}
                      <p><span className="text-gray-500">Pago:</span> {paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'transfer' ? 'Transferencia' : 'Tarjeta'}</p>
                    </div>
                  </div>

                  {formData.notes && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium text-gray-900 mb-2">Notas</h3>
                      <p className="text-sm text-gray-600">{formData.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Confirmar Pedido'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">
                Resumen
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Envío</span>
                  <span className={deliveryType === 'pickup' ? 'text-green-600' : ''}>
                    {deliveryType === 'pickup' ? 'Gratis' : '$500'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-heading font-bold text-2xl text-mana-burgundy">
                    ${(cartTotal + (deliveryType === 'delivery' ? 500 : 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
