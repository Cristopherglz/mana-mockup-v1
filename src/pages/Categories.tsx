import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels, type Category } from '@/types';

const categoryImages: Record<Category, string> = {
  panes: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
  facturas: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
  tortas: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
  sandwiches: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&h=600&fit=crop',
  galletas: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop',
  especialidades: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop',
};

const categoryDescriptions: Record<Category, string> = {
  panes: 'Panes artesanales elaborados con masa madre y técnicas tradicionales. Desde baguettes hasta panes de campo.',
  facturas: 'Las clásicas facturas argentinas: medialunas, vigilantes, cañoncitos y más.',
  tortas: 'Tortas para toda ocasión: cumpleaños, aniversarios o simplemente para disfrutar.',
  sandwiches: 'Sándwiches de miga y otros preparados frescos para tus eventos o meriendas.',
  galletas: 'Galletas artesanales, desde las clásicas hasta opciones sin gluten.',
  especialidades: 'Nuestros productos especiales: brownies, alfajores, y delicias únicas.',
};

export function Categories() {
  const { products, categories } = useStore();

  const getProductCount = (category: Category) => {
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">
            Explora
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Nuestras Categorías
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Descubre nuestra variedad de productos artesanales organizados por categorías. 
            Cada uno elaborado con amor y dedicación.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category}
              to={`/productos?categoria=${category}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100"
            >
              {/* Image */}
              <img
                src={categoryImages[category]}
                alt={categoryLabels[category]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/90 group-hover:via-black/50" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                    {getProductCount(category)} productos
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-2">
                    {categoryLabels[category]}
                  </h2>
                  <p className="text-white/80 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {categoryDescriptions[category]}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-mana-green-light">
                    Ver productos
                    <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

              {/* Number Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="font-heading font-bold text-white">
                  {index + 1}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-16 bg-mana-green rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <span className="text-mana-green-light font-medium text-sm uppercase tracking-wider">
                Especial del Mes
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-3">
                Pan de Masa Madre
              </h2>
              <p className="text-white/80 mt-4 leading-relaxed">
                Nuestro pan estrella, elaborado con masa madre de más de 10 años de antigüedad. 
                Fermentación lenta de 24 horas para obtener ese sabor único y una miga perfecta.
              </p>
              <div className="mt-8">
                <Link
                  to="/productos?categoria=panes"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-mana-green rounded-xl font-semibold hover:bg-mana-cream transition-colors"
                >
                  Ver Panes
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-auto">
              <img
                src="/58fa6188-8127-4609-8bf0-4af3eb29401d.jpg"
                alt="Pan de masa madre"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            ¿No sabes qué elegir?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Explora todos nuestros productos y encuentra el perfecto para ti.
          </p>
          <Link
            to="/productos"
            className="btn-primary inline-flex items-center gap-2"
          >
            Ver Todos los Productos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
