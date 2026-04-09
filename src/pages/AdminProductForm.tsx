import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels, deliveryAvailabilityLabels, type Category, type DeliveryAvailability } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const categories: Category[] = ['panes', 'facturas', 'tortas', 'sandwiches', 'galletas', 'especialidades'];

export function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, products, addProduct, updateProduct, isLoading } = useStore();
  
  const isEditing = !!id;
  const existingProduct = products.find(p => p.id === id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'unit' as const,
    category: '' as Category | '',
    stock: '',
    hasGluten: true,
    isAvailable: true,
    deliveryAvailability: 'both' as DeliveryAvailability,
    features: [] as string[],
    images: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && existingProduct) {
      setFormData({
        title: existingProduct.title,
        description: existingProduct.description,
        price: existingProduct.price.toString(),
        priceType: 'unit',
        category: existingProduct.category,
        stock: existingProduct.stock.toString(),
        hasGluten: existingProduct.hasGluten,
        isAvailable: existingProduct.isAvailable,
        deliveryAvailability: existingProduct.deliveryAvailability || 'both',
        features: existingProduct.features,
        images: existingProduct.images,
      });
    }
  }, [isEditing, existingProduct]);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Precio inválido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = 'Stock inválido';
    if (formData.images.length === 0) newErrors.images = 'Al menos una imagen es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      priceType: 'unit' as const,
      category: formData.category as Category,
      stock: Number(formData.stock),
      hasGluten: formData.hasGluten,
      isAvailable: formData.isAvailable,
      deliveryAvailability: formData.deliveryAvailability,
      features: formData.features,
      images: formData.images,
    };

    if (isEditing) {
      await updateProduct(id!, productData);
    } else {
      await addProduct(productData);
    }
    
    navigate('/admin');
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const addImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
      if (errors.images) setErrors({ ...errors, images: '' });
    }
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl && !formData.images.includes(dataUrl)) {
          setFormData(prev => ({ ...prev, images: [...prev.images, dataUrl] }));
          if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12 bg-gray-50">
      <div className="container-app section-padding max-w-3xl">
        {/* Header */}
        <button
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-mana-green transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al panel</span>
        </button>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          {/* Title */}
          <div>
            <label className="form-label">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                errors.title ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
              }`}
              placeholder="Ej: Pan de Campo"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
              }`}
              placeholder="Describí el producto..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Precio por unidad ($) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    if (errors.price) setErrors({ ...errors, price: '' });
                  }}
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
                    errors.price ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className="form-label">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => {
                  setFormData({ ...formData, stock: e.target.value });
                  if (errors.stock) setErrors({ ...errors, stock: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                  errors.stock ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Categoría *</label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value as Category });
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all appearance-none ${
                errors.category ? 'border-red-300' : 'border-gray-200 focus:border-mana-green'
              }`}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          {/* Features */}
          <div>
            <label className="form-label">Características</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-mana-green"
                placeholder="Agregar característica..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-3 bg-mana-green text-white rounded-xl hover:bg-mana-green-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-mana-green/10 text-mana-green rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="hover:text-mana-burgundy"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="form-label">Imágenes *</label>
            
            {/* File upload */}
            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-mana-green hover:bg-mana-green/5 transition-all"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 text-sm">Subir imágenes desde tu dispositivo</span>
              </label>
            </div>

            {/* URL input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-mana-green"
                placeholder="O pegar URL de imagen..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-3 bg-mana-green text-white rounded-xl hover:bg-mana-green-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={image} alt={`Producto ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Availability */}
          <div>
            <label className="form-label">Disponibilidad de entrega *</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {(['both', 'pickup_only', 'delivery_only'] as DeliveryAvailability[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryAvailability: opt })}
                  className={`p-3 border-2 rounded-xl text-sm font-medium transition-all text-center ${
                    formData.deliveryAvailability === opt
                      ? 'border-mana-green bg-mana-green/5 text-mana-green'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {deliveryAvailabilityLabels[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasGluten}
                onChange={(e) => setFormData({ ...formData, hasGluten: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-mana-green focus:ring-mana-green"
              />
              <span className="text-gray-700">Contiene gluten</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-mana-green focus:ring-mana-green"
              />
              <span className="text-gray-700">Disponible</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
