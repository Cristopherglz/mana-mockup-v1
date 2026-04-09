import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Clock, Mail, Award, Heart, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-section', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Pasión',
      description: 'Amamos lo que hacemos y eso se refleja en cada producto que sale de nuestro horno.',
    },
    {
      icon: Award,
      title: 'Calidad',
      description: 'Utilizamos solo los mejores ingredientes, seleccionados cuidadosamente.',
    },
    {
      icon: Users,
      title: 'Tradición',
      description: 'Más de 38 años de experiencia horneando con las recetas de la familia.',
    },
  ];

  return (
    <div ref={sectionRef} className="min-h-screen pt-24 pb-24 lg:pb-12">
      {/* Hero */}
      <div className="about-section relative h-[50vh] min-h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&h=800&fit=crop"
          alt="Panadería Maná"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mana-cream via-mana-cream/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-app section-padding pb-12">
            <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">
              Sobre Nosotros
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-2">
              El origen del pan <br />
              <span className="text-mana-green">artesanal</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="about-section py-16">
        <div className="container-app section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Todo comenzó en 1985, cuando la familia Maná decidió compartir su pasión 
                  por la panadería artesanal con los vecinos de Posadas, Misiones. Lo que 
                  empezó como un pequeño horno familiar, se convirtió en un referente de la 
                  panadería tradicional en la región.
                </p>
                <p>
                  Durante más de tres décadas, hemos mantenido vivas las recetas que nos 
                  enseñaron nuestros abuelos, combinándolas con técnicas modernas para 
                  ofrecer productos de la más alta calidad.
                </p>
                <p>
                  Cada madrugada, nuestros maestros panaderos se levantan para preparar 
                  el pan fresco del día, utilizando masa madre de más de 10 años de 
                  antigüedad y fermentaciones lentas que dan a nuestros productos ese 
                  sabor único e inconfundible.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=800&h=600&fit=crop"
                alt="Nuestro equipo"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-mana-green/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-mana-burgundy/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="about-section py-16 bg-white">
        <div className="container-app section-padding">
          <div className="text-center mb-12">
            <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">
              Nuestros Valores
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              Lo que nos define
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-mana-cream hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-mana-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-mana-green" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="about-section py-16">
        <div className="container-app section-padding">
          <div className="text-center mb-12">
            <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">
              Nuestro Proceso
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">
              De la masa a tu mesa
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Selección', desc: 'Elegimos los mejores ingredientes locales' },
              { step: '02', title: 'Preparación', desc: 'Mezclamos con nuestra masa madre' },
              { step: '03', title: 'Fermentación', desc: 'Dejamos reposar el tiempo necesario' },
              { step: '04', title: 'Horneado', desc: 'Horneamos a la temperatura perfecta' },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <span className="font-heading text-6xl font-bold text-mana-green/10">
                  {item.step}
                </span>
                <div className="relative -mt-8">
                  <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="about-section py-16 bg-mana-green">
        <div className="container-app section-padding">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-white">
              Visítanos
            </h2>
            <p className="text-white/80 mt-2">
              Estamos en el corazón de Posadas
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-white/80 text-sm">Av. Lavalle 1234, Posadas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-white/80 text-sm">+54 376 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-white/80 text-sm">info@manapanaderia.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">Horario</p>
                <p className="text-white/80 text-sm">Lun-Sáb: 6:00 - 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
