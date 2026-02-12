import React from "react";
import Link from "next/link";
import Header from "./Header";

interface ActionLink {
  label: string;
  href: string;
}

interface InfoPageProps {
  title: string;
  description: string;
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
  children?: React.ReactNode;
}

export default function InfoPage({
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: InfoPageProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-black">
          {title}
        </h1>
        <p className="mt-4 text-lg text-gray">{description}</p>

        {(primaryAction || secondaryAction) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {primaryAction && (
              <Link href={primaryAction.href} className="btn-primary">
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link href={secondaryAction.href} className="btn-secondary">
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}

        {children && (
          <section className="mt-10 statement-card p-6">
            {children}
          </section>
        )}

        <div className="mt-8">
          <Link href="/" className="text-gold hover:text-black transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
