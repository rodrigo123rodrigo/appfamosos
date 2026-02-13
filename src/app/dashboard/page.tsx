import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function Dashboard() {
  const recentRumors = [
    {
      id: '1',
      source: 'Revista Ejemplo',
      claim: 'Supuesta separación de la pareja del año',
      severity: 'Alto',
      status: 'Pendiente'
    },
    {
      id: '2', 
      source: 'Portal Noticias',
      claim: 'Problemas financieros en nueva producción',
      severity: 'Medio',
      status: 'Respondido'
    }
  ];

  const myStatements = [
    {
      id: '1',
      title: 'Aclaración sobre rumores personales',
      category: 'Relaciones',
      status: 'Publicado',
      views: 15420,
      createdAt: '2026-02-10'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-light text-lg">
            Gestiona tus aclaraciones y monitorea rumores
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="statement-card p-6">
              <h2 className="font-display text-xl font-semibold text-white mb-4">
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <Link href="/dashboard/new" className="btn-primary w-full">
                  + Nueva Aclaración
                </Link>
                <Link href="/dashboard/metrics" className="btn-secondary w-full">
                  📊 Ver Métricas
                </Link>
                <Link href="/dashboard/press-kit" className="btn-secondary w-full">
                  📋 Descargar Kit de Prensa
                </Link>
              </div>
            </div>
            
            {/* Profile Status */}
            <div className="statement-card p-6 mt-6">
              <h3 className="font-semibold text-white mb-3">Estado del Perfil</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="verification-badge text-xs">Verificado</span>
                <span className="text-sm text-gray-light">Nivel Pro</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-light">Aclaraciones publicadas:</span>
                  <span className="font-semibold text-white">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-light">Vistas totales:</span>
                  <span className="font-semibold text-white">2.5M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Rumors to Address */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold text-black">
                  Rumores Detectados
                </h2>
                <Link href="/dashboard/rumors" className="text-gold hover:text-black transition-colors">
                  Ver todos →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentRumors.map((rumor) => (
                  <div key={rumor.id} className="statement-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm text-gray">{rumor.source}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            rumor.severity === 'Alto' ? 'bg-red-100 text-red-700' :
                            rumor.severity === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rumor.severity}
                          </span>
                        </div>
                        <p className="text-black font-medium mb-3">{rumor.claim}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rumor.status === 'Pendiente' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rumor.status}
                        </span>
                      </div>
                      <Link href={`/dashboard/rumors/${rumor.id}`} className="btn-primary text-sm px-4 py-2">
                        Aclarar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* My Recent Statements */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold text-black">
                  Mis Aclaraciones
                </h2>
                <Link href="/dashboard/statements" className="text-gold hover:text-black transition-colors">
                  Ver todas →
                </Link>
              </div>
              
              <div className="space-y-4">
                {myStatements.map((statement) => (
                  <Link key={statement.id} href={`/dashboard/statements/${statement.id}`} className="statement-card p-6 block">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-black">{statement.title}</h3>
                      <span className="verification-badge text-xs">{statement.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray">
                      <div className="flex items-center space-x-4">
                        <span>{statement.category}</span>
                        <span>👁 {statement.views.toLocaleString()} vistas</span>
                      </div>
                      <span>{new Date(statement.createdAt).toLocaleDateString('es')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}