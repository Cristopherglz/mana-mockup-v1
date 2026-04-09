import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Store, Truck, Heart, Wheat, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels } from '@/types';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, toggleFavorite, isFavorite } = useStore();
  
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-24 lg:pb-12 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Producto no encontrado</h1>
          <Link to="/productos" className="btn-primary inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-5 h-5" /> Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const productIsFavorite = isFavorite(product.id);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-28 lg:pb-12 bg-mana-cream my-0 mb-0 -mt-[20px]">
      {/* Back button - absolute over carousel */}
      <div className="absolute top-24 left-4 z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Product Image Carousel - Full width, PedidosYa style */}
      <div className="relative w-full">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] overflow-hidden bg-gray-100">
          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="w-full h-full object-cover transition-opacity duration-300 mt-0 py-0 pb-0 mb-0"
          />
          {!product.hasGluten && (
            <span className="absolute top-4 right-4 gluten-free-badge px-3 py-1.5 text-xs rounded-full z-10">
              <Wheat className="w-3 h-3 inline mr-1" />
              Sin Gluten
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-4 right-4 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium z-10" style={{ right: !product.hasGluten ? 'auto' : undefined, left: !product.hasGluten ? '16px' : undefined }}>
              ¡Últimas unidades!
            </span>
          )}

          {/* Navigation arrows */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'bg-white w-5'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Info Card */}
      <div className="container-app section-padding -mt-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-card p-6 space-y-5">
          {/* Title + Favorite */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{product.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{categoryLabels[product.category]}</p>
              <p className="text-xs text-muted-foreground mt-1">${product.price.toLocaleString('es-AR')}/u</p>
            </div>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="mt-1 flex-shrink-0"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  productIsFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'
                }`}
              />
            </button>
          </div>

          {/* Quantity selector + Price */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-12 text-center font-semibold text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-9 h-9 rounded-full bg-mana-green flex items-center justify-center hover:bg-mana-green-dark transition-colors shadow-md"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <span className="font-heading text-2xl font-bold text-card-foreground">
              ${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Descripción</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.map((feat, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-mana-cream rounded-full text-xs text-gray-600 font-medium">
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* Delivery Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Disponibilidad</h3>
            {(product.deliveryAvailability === 'both' || product.deliveryAvailability === 'pickup_only') && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-mana-green/10 rounded-full flex items-center justify-center">
                  <Store className="w-4 h-4 text-mana-green" />
                </div>
                <span className="text-gray-600">Retiro en local</span>
              </div>
            )}
            {(product.deliveryAvailability === 'both' || product.deliveryAvailability === 'delivery_only') && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-mana-burgundy/10 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-mana-burgundy" />
                </div>
                <span className="text-gray-600">Envío a domicilio</span>
              </div>
            )}
            {product.deliveryAvailability === 'pickup_only' && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                ⚠ Solo disponible para retiro en el local
              </p>
            )}
          </div>

          {/* Gluten info */}
          <div className="flex items-center gap-2 text-sm">
            {product.hasGluten ? (
              <span className="contains-gluten-badge">
                <Wheat className="w-3 h-3" /> Contiene gluten
              </span>
            ) : (
              <span className="gluten-free-badge">
                <Wheat className="w-3 h-3" /> Sin gluten
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            product={product}
            quantity={quantity}
            variant="full"
            className="w-full py-4 text-base rounded-2xl shadow-lg"
            label={`Agregar al carrito ($${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Productos Relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/producto/${rp.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={rp.images[0]} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-semibold text-sm text-foreground truncate">{rp.title}</h3>
                    <span className="price-tag text-base">${rp.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
