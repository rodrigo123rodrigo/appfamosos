import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="bg-black-mid/95 border-b border-gold/30 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-copper rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-display text-2xl font-semibold text-white">ClarifyPro</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/clarifications" className="text-white hover:text-gray-light transition-colors">Aclaraciones</Link>
              <Link href="/categories" className="text-white hover:text-gray-light transition-colors">Categorías</Link>
              <Link href="/verified" className="text-white hover:text-gray-light transition-colors">Verificados</Link>
              <Link href="/media" className="text-white hover:text-gray-light transition-colors">Para Medios</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="bg-gold text-elite-black hover:bg-gold-light transition-colors px-6 py-2 rounded-lg font-semibold shadow-lg">
                Iniciar Sesión
              </Link>
              <Link href="/signup" className="bg-gold-dark text-white hover:bg-gold transition-all px-6 py-2 rounded-lg font-semibold">
                Unirse ahora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-tight">
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

        {/* Elegant Star Crown */}
        <div className="absolute top-0 left-0 w-full h-48 overflow-visible pointer-events-none">
          {/* Arco elegante de estrellas formando una corona */}
          
          {/* Estrella central superior - la más grande */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-gold" style={{fontSize: '32px', textShadow: '0 0 20px rgba(212, 175, 55, 0.9), 0 0 30px rgba(212, 175, 55, 0.6), 0 0 40px rgba(232, 196, 104, 0.4)'}}>★</div>
            <div className="font-display text-sm text-gold/90 mt-1 tracking-widest" style={{textShadow: '0 0 8px rgba(212, 175, 55, 0.6)'}}>ÉLITE</div>
          </div>
          
          {/* Arco izquierdo */}
          <div className="absolute top-12 left-1/2 -ml-24 text-gold/80" style={{fontSize: '20px', textShadow: '0 0 12px rgba(212, 175, 55, 0.8), 0 0 20px rgba(212, 175, 55, 0.4)'}}>★</div>
          <div className="absolute top-20 left-1/2 -ml-40 text-gold/70" style={{fontSize: '16px', textShadow: '0 0 10px rgba(212, 175, 55, 0.7)'}}>★</div>
          <div className="absolute top-28 left-1/2 -ml-52 text-gold/60" style={{fontSize: '12px', textShadow: '0 0 8px rgba(212, 175, 55, 0.6)'}}>★</div>
          
          {/* Arco derecho - espejo perfecto */}
          <div className="absolute top-12 left-1/2 ml-16 text-gold/80" style={{fontSize: '20px', textShadow: '0 0 12px rgba(212, 175, 55, 0.8), 0 0 20px rgba(212, 175, 55, 0.4)'}}>★</div>
          <div className="absolute top-20 left-1/2 ml-32 text-gold/70" style={{fontSize: '16px', textShadow: '0 0 10px rgba(212, 175, 55, 0.7)'}}>★</div>
          <div className="absolute top-28 left-1/2 ml-44 text-gold/60" style={{fontSize: '12px', textShadow: '0 0 8px rgba(212, 175, 55, 0.6)'}}>★</div>
          
          {/* Estrellas de detalle en esquinas superiores */}
          <div className="absolute top-4 left-8 text-gold/50" style={{fontSize: '10px', textShadow: '0 0 6px rgba(212, 175, 55, 0.5)'}}>★</div>
          <div className="absolute top-4 right-8 text-gold/50" style={{fontSize: '10px', textShadow: '0 0 6px rgba(212, 175, 55, 0.5)'}}>★</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-elite-charcoal/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-gold">
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
                <h3 className="font-display text-lg font-semibold text-gold mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray">{category.description}</p>
              </Link>
            ))}
          </div>
          
          {/* Botón centrado debajo de las categorías */}
          <div className="text-center mt-12">
            <Link href="/clarifications" className="btn-primary text-lg px-8 py-4 inline-block">
              Ver todas las aclaraciones
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Clarifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-teal">
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
                      <span className="text-black-deep font-semibold text-sm">
                        {clarification.celebrity.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gold">{clarification.celebrity}</h3>
                      <span className="text-sm text-gray">{clarification.category}</span>
                    </div>
                  </div>
                  {clarification.verified && (
                    <span className="verification-badge">Verificado</span>
                  )}
                </div>
                <h4 className="font-display text-lg font-semibold text-gold mb-3">
                  {clarification.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray">
                  <span>{clarification.timestamp}</span>
                  <span className="text-gold-light hover:text-gold transition-colors">
                    Leer completa →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-elite-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-gold">
              ¿Cómo funciona?
            </h2>
            <p className="mt-4 text-lg text-gray">
              Tres pasos simples para publicar tu aclaración oficial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black-deep font-bold text-2xl">1</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Verifica tu identidad
              </h3>
              <p className="text-gray">
                Proceso de verificación seguro con ID oficial, selfie y prueba de control de redes sociales
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black-deep font-bold text-2xl">2</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Publica tu aclaración
              </h3>
              <p className="text-gray">
                Redacta tu declaración oficial con opciones de privacidad, embargos y anexo de evidencias
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black-deep font-bold text-2xl">3</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Comparte y monitorea
              </h3>
              <p className="text-gray">
                Obtén métricas en tiempo real y descarga kits de prensa para tu equipo y los medios
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-black-mid to-black-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-5xl font-bold text-white mb-2">500+</div>
              <p className="text-gray-light text-lg">Figuras verificadas</p>
            </div>
            <div>
              <div className="font-display text-5xl font-bold text-white mb-2">2.5K</div>
              <p className="text-gray-light text-lg">Aclaraciones publicadas</p>
            </div>
            <div>
              <div className="font-display text-5xl font-bold text-white mb-2">15M</div>
              <p className="text-gray-light text-lg">Lecturas verificadas</p>
            </div>
            <div>
              <div className="font-display text-5xl font-bold text-white mb-2">99.9%</div>
              <p className="text-gray-light text-lg">Uptime garantizado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-elite-charcoal/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-gold">
              ¿Por qué ClarifyPro?
            </h2>
            <p className="mt-4 text-lg text-gray">
              La plataforma más confiable para proteger tu reputación
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="statement-card p-6">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Verificación robusta
              </h3>
              <p className="text-gray">
                Proceso de verificación multi-factor que garantiza la autenticidad de cada perfil
              </p>
            </div>
            <div className="statement-card p-6">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Publicación instantánea
              </h3>
              <p className="text-gray">
                Publica tu aclaración en segundos y llega a millones de personas inmediatamente
              </p>
            </div>
            <div className="statement-card p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Análisis detallado
              </h3>
              <p className="text-gray">
                Métricas en tiempo real sobre alcance, engagement y sentimiento de tu audiencia
              </p>
            </div>
            <div className="statement-card p-6">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Seguridad máxima
              </h3>
              <p className="text-gray">
                Cifrado end-to-end, autenticación de dos factores y auditorías de seguridad continuas
              </p>
            </div>
            <div className="statement-card p-6">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                API abierta
              </h3>
              <p className="text-gray">
                Integra con tu sitio web, app móvil o sistema de gestión de contenidos existente
              </p>
            </div>
            <div className="statement-card p-6">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                Multi-plataforma
              </h3>
              <p className="text-gray">
                Acceso desde web, iOS, Android y herramientas de gestión para equipos de PR
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-elite-charcoal/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-gold">
              Confían en nosotros
            </h2>
            <p className="mt-4 text-lg text-gray">
              Lo que dicen las figuras públicas sobre ClarifyPro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="statement-card p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black-deep font-bold">AG</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gold">Ana García</h4>
                  <p className="text-sm text-gray">Actriz y productora</p>
                </div>
              </div>
              <p className="text-gray italic">
                "ClarifyPro me devolvió el control sobre mi narrativa. Ahora puedo comunicar la verdad directamente sin intermediarios."
              </p>
            </div>
            <div className="statement-card p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black-deep font-bold">CR</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gold">Carlos Ruiz</h4>
                  <p className="text-sm text-gray">Director de cine</p>
                </div>
              </div>
              <p className="text-gray italic">
                "La verificación es instantánea y el proceso súper fácil. Una herramienta imprescindible para cualquier figura pública."
              </p>
            </div>
            <div className="statement-card p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-black-deep font-bold">ML</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gold">María López</h4>
                  <p className="text-sm text-gray">Deportista profesional</p>
                </div>
              </div>
              <p className="text-gray italic">
                "Las métricas en tiempo real me ayudan a entender el impacto real de mis aclaraciones. Transparencia total."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-black-deep/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray mb-8 text-sm uppercase tracking-wider font-semibold">
            Utilizado por medios y organizaciones líderes
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray">CNN</div>
            <div className="text-2xl font-bold text-gray">BBC</div>
            <div className="text-2xl font-bold text-gray">Reuters</div>
            <div className="text-2xl font-bold text-gray">Associated Press</div>
            <div className="text-2xl font-bold text-gray">El País</div>
            <div className="text-2xl font-bold text-gray">The Guardian</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black-light/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-semibold text-gold">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-lg text-gray">
              Todo lo que necesitas saber sobre ClarifyPro
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="statement-card p-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                ¿Cómo funciona el proceso de verificación?
              </h3>
              <p className="text-gray">
                El proceso incluye verificación de identidad mediante documento oficial, selfie en vivo, 
                y prueba de control de tus redes sociales. Nuestro equipo revisa manualmente cada solicitud 
                y el proceso suele completarse en menos de 24 horas.
              </p>
            </div>
            
            <div className="statement-card p-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                ¿Puedo programar una aclaración para publicarse más tarde?
              </h3>
              <p className="text-gray">
                Sí, ClarifyPro incluye funcionalidad de embargo que te permite programar la publicación 
                de tus aclaraciones. También puedes establecer un periodo de exclusividad para medios 
                específicos antes de la publicación general.
              </p>
            </div>
            
            <div className="statement-card p-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                ¿Qué tipo de métricas puedo ver?
              </h3>
              <p className="text-gray">
                Accede a métricas detalladas incluyendo vistas, engagement, alcance geográfico, 
                análisis de sentimiento, menciones en medios, y reportes de tráfico. Los planes 
                Pro y Enterprise incluyen dashboards avanzados y exportación de datos.
              </p>
            </div>
            
            <div className="statement-card p-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                ¿Puedo eliminar o modificar una aclaración después de publicarla?
              </h3>
              <p className="text-gray">
                Las aclaraciones son inmutables para garantizar integridad. Sin embargo, puedes 
                publicar una actualización o anexo a tu declaración original. Todo el historial 
                queda registrado con timestamps y hashes criptográficos para máxima transparencia.
              </p>
            </div>
            
            <div className="statement-card p-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                ¿Ofrecen soporte para equipos de relaciones públicas?
              </h3>
              <p className="text-gray">
                Sí, nuestros planes Pro y Enterprise incluyen acceso multi-usuario, permisos 
                granulares, flujos de aprobación, y herramientas de colaboración para equipos. 
                También ofrecemos capacitación y soporte prioritario.
              </p>
            </div>
            
            <div className="statement-card p-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-3">
                ¿Cómo protegen mi información personal?
              </h3>
              <p className="text-gray">
                Utilizamos cifrado end-to-end, autenticación de dos factores, y cumplimos con 
                GDPR y otras regulaciones internacionales de privacidad. Tus datos de verificación 
                nunca se comparten públicamente y están protegidos con los más altos estándares de seguridad.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/help" className="text-gold hover:text-gold-light font-semibold transition-colors">
              ¿Tienes más preguntas? Visita nuestro centro de ayuda →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black-mid to-gold/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl font-semibold text-white mb-6">
            ¿Listo para tomar control de tu narrativa?
          </h2>
          <p className="text-xl text-gray-light mb-10">
            Únete a las figuras públicas que ya confían en ClarifyPro para 
            comunicar la verdad de manera oficial y verificada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup?flow=verification" className="bg-gold text-black-deep hover:bg-gold-light transition-all px-8 py-4 rounded-lg font-semibold text-lg shadow-lg">
              Comenzar verificación
            </Link>
            <Link href="/demo" className="bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-black-deep transition-all px-8 py-4 rounded-lg font-semibold">
              Solicitar demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-elite-dark border-t border-gold/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                  <span className="text-black-deep font-bold text-sm">C</span>
                </div>
                <span className="font-display text-xl font-semibold text-gold">ClarifyPro</span>
              </div>
              <p className="text-gray">
                La plataforma oficial de aclaraciones verificadas para figuras públicas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray">
                <li><Link href="/clarifications" className="hover:text-gold transition-colors">Aclaraciones</Link></li>
                <li><Link href="/signup?flow=verification" className="hover:text-gold transition-colors">Verificación</Link></li>
                <li><Link href="/api" className="hover:text-gold transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray">
                <li><Link href="/help" className="hover:text-gold transition-colors">Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-gold transition-colors">Contacto</Link></li>
                <li><Link href="/docs" className="hover:text-gold transition-colors">Documentación</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray">
                <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-gold transition-colors">Términos</Link></li>
                <li><Link href="/security" className="hover:text-gold transition-colors">Seguridad</Link></li>
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