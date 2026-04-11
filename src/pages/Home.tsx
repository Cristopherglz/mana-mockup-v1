import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Search, MapPin, Truck, Phone } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels } from '@/types';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const { products, categories } = useStore();
  const navigate = useNavigate();
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const featuredProducts = products.slice(0, 8);
  const topProducts = products.slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.featured-card', { scrollTrigger: { trigger: featuredRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 80, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      gsap.from('.category-card', { scrollTrigger: { trigger: categoriesRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, x: 100, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      gsap.from('.about-image', { scrollTrigger: { trigger: aboutRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, x: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.about-content', { scrollTrigger: { trigger: aboutRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, x: 50, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden bg-mana-cream">

      {/* Search Bar */}
      <section className="px-5 pb-5">
        <div className="container-app">
          <button
            onClick={() => navigate('/buscar')}
            className="w-full flex items-center gap-3 px-5 py-3.5 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:border-mana-green/30 transition-colors shadow-sm my-[110px] mb-0"
          >
            <Search className="w-5 h-5" />
            <span className="text-sm">Buscar en Maná...</span>
          </button>
        </div>
      </section>

      {/* Delivery Banner */}
      <section className="px-5 pb-5">
        <div className="container-app">
          <div className="bg-mana-green rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/10 rounded-l-[60px]" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-lg">Envío a Domicilio</p>
                  <p className="text-white/80 text-sm mt-0.5">Av. Uruguay 2677</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    Posadas y alrededores
                  </span>
                </div>
                <Link to="/productos" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Truck className="w-5 h-5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="px-5 pb-6 shadow-none">
        <div className="container-app">
          <div className="relative bg-mana-cream rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="flex-1 p-5">
                <h2 className="font-heading text-xl font-bold text-foreground">Pan de Campo</h2>
                <p className="text-muted-foreground text-sm mt-1">¡Recién horneado!</p>
                <Link to="/producto/1" className="inline-block px-5 py-2 bg-mana-green text-white rounded-full text-sm font-medium hover:bg-mana-green-dark transition-colors mt-[12px]">
                  Pedir Ahora
                </Link>
              </div>
              <div className="w-32 h-28 sm:w-40 sm:h-32 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop"
                  alt="Pan de Campo"
                  className="w-full h-full object-cover rounded-l-[40px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top of Week - horizontal scroll like reference */}
      <section className="pb-8 ml-[16px]">
        <div className="container-app section-padding">
          <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2 -ml-[16px]">
            Lo más pedido
            <ArrowRight className="w-5 h-5 text-mana-green" />
          </h2>
        </div>
        <div className="flex overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory gap-[16px] px-[20px]">
          {topProducts.map((product) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              className="flex-shrink-0 w-36 snap-start rounded-sm shadow-none"
            >
              <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-card mb-2">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-sm text-foreground truncate">{product.title}</h3>
              <span className="text-mana-green font-bold text-sm">${product.price.toLocaleString()}</span>
            </Link>
          ))}
        </div>
      </section>


      {/* Categories */}
      <section ref={categoriesRef} className="py-14">
        <div className="container-app section-padding">
          <div className="text-center mb-8">
            <span className="text-mana-burgundy font-medium text-xs uppercase tracking-wider">Explora</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-1">Categorías</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((category) => {
              const categoryImages: Record<string, string> = { panes: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop', facturas: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop', tortas: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop', sandwiches: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&h=600&fit=crop', galletas: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop', especialidades: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop' };
              return (
                <Link key={category} to={`/productos?categoria=${category}`} className="category-card group relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <img src={categoryImages[category]} alt={categoryLabels[category]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="category-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-center">{categoryLabels[category]}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="py-14 bg-white">
        <div className="container-app section-padding">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="about-image relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=1000&fit=crop" alt="Panadero trabajando" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-mana-green/10 rounded-2xl -z-10" />
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="font-heading text-xl font-bold text-mana-green">40+</p><p className="text-[10px] text-muted-foreground">Años</p></div>
                  <div><p className="font-heading text-xl font-bold text-mana-burgundy">200+</p><p className="text-[10px] text-muted-foreground">Productos</p></div>
                  <div><p className="font-heading text-xl font-bold text-mana-green">1000+</p><p className="text-[10px] text-muted-foreground">Clientes</p></div>
                </div>
              </div>
            </div>
            <div className="about-content">
              <span className="text-mana-burgundy font-medium text-xs uppercase tracking-wider">Nuestra Historia</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mt-2">Más de 40 años de tradición</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">Desde 1986, en el corazón de Posadas, Misiones, la familia Maná ha mantenido viva la tradición de la panadería artesanal.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/nosotros" className="btn-primary inline-flex items-center gap-2 text-sm">Conocer Más <ArrowRight className="w-4 h-4" /></Link>
                <a href="tel:+543761234567" className="btn-secondary inline-flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /> Llamar</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="container-app section-padding">
          <div className="relative bg-mana-burgundy rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mana-burgundy to-mana-burgundy-dark" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-mana-green/20 skew-x-12 transform origin-top-right" />
            <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">¿Listo para disfrutar?</h2>
              <p className="text-white/80 text-sm max-w-xl mx-auto mb-6">Hacé tu pedido ahora y retiralo por el local o disfrutá de nuestro servicio a domicilio.</p>
              <Link to="/productos" className="px-6 py-3 bg-white text-mana-burgundy rounded-xl font-semibold hover:bg-mana-cream transition-colors inline-flex items-center gap-2 text-sm">
                Hacer Pedido <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
