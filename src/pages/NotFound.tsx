import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12 flex items-center justify-center">
      <div className="container-app section-padding text-center">
        {/* 404 Illustration */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 bg-mana-green/10 rounded-full" />
          <div className="absolute inset-4 bg-mana-green/20 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-6xl font-bold text-mana-green">404</span>
          </div>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida. 
          Por favor, verifica la URL o regresa al inicio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver atrás
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-mana-green text-white rounded-xl font-medium hover:bg-mana-green-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </Link>
          <Link
            to="/productos"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-mana-green text-mana-green rounded-xl font-medium hover:bg-mana-green hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
