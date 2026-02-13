'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-teal border-b border-teal sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-copper rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-display text-2xl font-semibold text-white">ClarifyPro</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/clarifications" className="text-white hover:text-gray-light transition-colors">
              Aclaraciones
            </Link>
            <Link href="/categories" className="text-white hover:text-gray-light transition-colors">
              Categorías
            </Link>
            <Link href="/verified" className="text-white hover:text-gray-light transition-colors">
              Verificados
            </Link>
            <Link href="/media" className="text-white hover:text-gray-light transition-colors">
              Para Medios
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="bg-white text-teal hover:bg-gray-light transition-colors px-6 py-2 rounded-lg font-semibold">
              Iniciar Sesión
            </Link>
            <Link href="/signup" className="bg-copper text-white hover:opacity-90 transition-all px-6 py-2 rounded-lg font-semibold">
              Unirse ahora
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link 
              href="/clarifications" 
              className="block text-white hover:text-gray-light transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Aclaraciones
            </Link>
            <Link 
              href="/categories" 
              className="block text-white hover:text-gray-light transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categorías
            </Link>
            <Link 
              href="/verified" 
              className="block text-white hover:text-gray-light transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Verificados
            </Link>
            <Link 
              href="/media" 
              className="block text-white hover:text-gray-light transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Para Medios
            </Link>
            <div className="space-y-2 pt-2">
              <Link 
                href="/login" 
                className="block bg-white text-teal hover:bg-gray-light transition-colors px-6 py-2 rounded-lg font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/signup" 
                className="block bg-copper text-white hover:opacity-90 transition-all px-6 py-2 rounded-lg font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Unirse ahora
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}