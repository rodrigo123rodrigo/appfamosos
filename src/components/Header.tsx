import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
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
            <Link href="/clarifications" className="text-gray hover:text-black transition-colors">
              Aclaraciones
            </Link>
            <Link href="/categories" className="text-gray hover:text-black transition-colors">
              Categorías
            </Link>
            <Link href="/verified" className="text-gray hover:text-black transition-colors">
              Verificados
            </Link>
            <Link href="/media" className="text-gray hover:text-black transition-colors">
              Para Medios
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="btn-secondary">
                Iniciar Sesión
              </button>
            </Link>
            <Link href="/signup">
              <button className="btn-primary">
                Unirse ahora
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}