import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="bg-ivory border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-display text-2xl font-semibold text-black">ClarifyPro</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/clarifications" className="text-gray hover:text-black transition-colors">Aclaraciones</Link>
              <Link href="/categories" className="text-gray hover:text-black transition-colors">Categorías</Link>
              <Link href="/verified" className="text-gray hover:text-black transition-colors">Verificados</Link>
              <Link href="/media" className="text-gray hover:text-black transition-colors">Para Medios</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn-secondary">Iniciar Sesión</Link>
              <Link href="/signup" className="btn-primary">Unirse ahora</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-black leading-tight">
              La verdad,
              <span className="text-gold"> verificada</span>
            </h1>
            <p className="mt-6 text-xl text-gray max-w-3xl mx-auto font-body">
              La plataforma oficial donde figuras públicas publican aclaraciones verificadas, 
              con trazabilidad completa y evidencias que respaldan cada declaración.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/clarifications" className="btn-primary text-lg px-8 py-4">
                Explorar Aclaraciones
              </Link>
              <Link href="/signup" className="btn-secondary text-lg px-8 py-4">
                ¿Eres figura pública?
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gold opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold opacity-5 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-black">
              Categorías de Aclaraciones
            </h2>
            <p className="mt-4 text-lg text-gray">
              Organizamos las aclaraciones por los temas que más importan
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Relaciones", icon: "💕", description: "Vida personal y relaciones" },
              { name: "Proyectos", icon: "🎬", description: "Cine, música, deportes, marcas" },
              { name: "Salud", icon: "🌟", description: "Bienestar y salud personal" },
              { name: "Legal", icon: "⚖️", description: "Situaciones legales" },
              { name: "Filantropía", icon: "🤝", description: "Causas y donaciones" },
              { name: "Imagen", icon: "📸", description: "Campañas y colaboraciones" },
              { name: "Declaraciones", icon: "💬", description: "Citas mal interpretadas" },
              { name: "Otros", icon: "📋", description: "Otros temas importantes" }
            ].map((category, i) => (
              <Link
                key={i}
                href={`/categories?tag=${encodeURIComponent(category.name)}`}
                className="statement-card p-6 text-center block"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-display text-lg font-semibold text-black mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Clarifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-black">
              Aclaraciones Recientes
            </h2>
            <p className="mt-4 text-lg text-gray">
              Las últimas declaraciones oficiales verificadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: "ana-garcia-separacion",
                celebrity: "Ana García",
                category: "Relaciones",
                title: "Aclaración sobre rumores de separación",
                timestamp: "Hace 2 horas",
                verified: true
              },
              {
                id: "carlos-ruiz-nueva-pelicula",
                celebrity: "Carlos Ruiz",
                category: "Proyectos",
                title: "Confirmación de nueva película",
                timestamp: "Hace 5 horas",
                verified: true
              },
              {
                id: "maria-lopez-salud-accidente",
                celebrity: "María López",
                category: "Salud",
                title: "Estado de salud tras accidente",
                timestamp: "Hace 1 día",
                verified: true
              }
            ].map((clarification, i) => (
              <Link
                key={i}
                href={`/clarifications/${clarification.id}`}
                className="statement-card p-6 block"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {clarification.celebrity.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{clarification.celebrity}</h3>
                      <span className="text-sm text-gray">{clarification.category}</span>
                    </div>
                  </div>
                  {clarification.verified && (
                    <span className="verification-badge">Verificado</span>
                  )}
                </div>
                <h4 className="font-display text-lg font-semibold text-black mb-3">
                  {clarification.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray">
                  <span>{clarification.timestamp}</span>
                  <span className="text-gold hover:text-black transition-colors">
                    Leer completa →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/clarifications" className="btn-primary text-lg px-8 py-4">
              Ver todas las aclaraciones
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-semibold text-ivory mb-6">
            ¿Listo para tomar control de tu narrativa?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Únete a las figuras públicas que ya confían en ClarifyPro para 
            comunicar la verdad de manera oficial y verificada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?flow=verification" className="btn-primary text-lg px-8 py-4">
              Comenzar verificación
            </Link>
            <Link href="/demo" className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all px-8 py-4 rounded-lg font-semibold">
              Solicitar demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ivory border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-display text-xl font-semibold text-black">ClarifyPro</span>
              </div>
              <p className="text-gray">
                La plataforma oficial de aclaraciones verificadas para figuras públicas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray">
                <li><Link href="/clarifications" className="hover:text-black transition-colors">Aclaraciones</Link></li>
                <li><Link href="/signup?flow=verification" className="hover:text-black transition-colors">Verificación</Link></li>
                <li><Link href="/api" className="hover:text-black transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray">
                <li><Link href="/help" className="hover:text-black transition-colors">Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contacto</Link></li>
                <li><Link href="/docs" className="hover:text-black transition-colors">Documentación</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-4">Legal</h4>
              <ul className="space-y-2 text-gray">
                <li><Link href="/privacy" className="hover:text-black transition-colors">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-black transition-colors">Términos</Link></li>
                <li><Link href="/security" className="hover:text-black transition-colors">Seguridad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray">
            <p>&copy; 2026 ClarifyPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}