import React from 'react';

interface StatementCardProps {
  id: string;
  celebrity: string;
  category: string;
  title: string;
  content: string;
  timestamp: string;
  verified: boolean;
  evidenceCount: number;
}

export default function StatementCard({
  celebrity,
  category,
  title,
  content,
  timestamp,
  verified,
  evidenceCount
}: StatementCardProps) {
  return (
    <article className="statement-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-copper rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {celebrity.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-teal text-lg">{celebrity}</h3>
            <span className="text-sm text-gray bg-gray-light px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>
        {verified && (
          <div className="flex items-center space-x-2">
            <span className="verification-badge">Verificado</span>
            <span className="text-xs text-gray">✓</span>
          </div>
        )}
      </div>
      
      <h4 className="font-display text-xl font-semibold text-teal mb-3">
        {title}
      </h4>
      
      <p className="text-gray mb-4 line-clamp-3">{content}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray">{timestamp}</span>
          {evidenceCount > 0 && (
            <span className="text-copper font-medium">
              📎 {evidenceCount} evidencia{evidenceCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button className="text-copper hover:text-teal transition-colors font-medium">
          Leer completa →
        </button>
      </div>
    </article>
  );
}