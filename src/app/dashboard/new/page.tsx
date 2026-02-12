"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../../components/Header";

interface Draft {
  content: string;
  tone: string;
  createdAt: string;
}

export default function NewClarificationPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("profesional");
  const [category, setCategory] = useState("Relaciones");
  const [rumorSource, setRumorSource] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("clarifypro_draft");
    if (stored) {
      try {
        const parsed: Draft = JSON.parse(stored);
        setDraft(parsed);
        setContent(parsed.content);
        setTone(parsed.tone);
        localStorage.removeItem("clarifypro_draft");
      } catch { /* ignore */ }
    }
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-black mb-2">
            Nueva Aclaración
          </h1>
          <p className="text-gray text-lg">
            Editor guiado: rumor, aclaración, evidencia y categoría.
          </p>
          {draft && (
            <p className="text-sm text-gold mt-2">
              ✨ Borrador cargado por Voice Commander ({draft.createdAt.slice(0, 10)})
            </p>
          )}
        </div>

        <div className="space-y-6">
          {/* Step 1: Rumor source */}
          <div className="statement-card p-6">
            <h2 className="font-display text-xl font-semibold text-black mb-3">
              1. ¿Qué se dijo?
            </h2>
            <input
              type="url"
              value={rumorSource}
              onChange={(e) => setRumorSource(e.target.value)}
              placeholder="Pega el enlace o escribe la cita del rumor"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition bg-white text-black"
            />
          </div>

          {/* Step 2: Clarification text */}
          <div className="statement-card p-6">
            <h2 className="font-display text-xl font-semibold text-black mb-3">
              2. Tu Aclaración Oficial
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu comunicado oficial aquí…"
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition bg-white text-black resize-y"
            />
            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm text-gray">Tono:</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-black text-sm focus:border-gold outline-none"
              >
                <option value="profesional">Profesional</option>
                <option value="defensivo">Defensivo</option>
                <option value="neutral">Neutral</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          {/* Step 3: Evidence */}
          <div className="statement-card p-6">
            <h2 className="font-display text-xl font-semibold text-black mb-3">
              3. Evidencia Adjunta
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray mb-2">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray">
                Documentos, imágenes, audio (máx. 25MB por archivo)
              </p>
              <button className="btn-secondary mt-4 text-sm">
                Seleccionar archivos
              </button>
            </div>
          </div>

          {/* Step 4: Category & embargo */}
          <div className="statement-card p-6">
            <h2 className="font-display text-xl font-semibold text-black mb-3">
              4. Categoría y Embargo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-black text-sm focus:border-gold outline-none"
                >
                  <option>Relaciones</option>
                  <option>Proyectos</option>
                  <option>Salud</option>
                  <option>Legal</option>
                  <option>Filantropía</option>
                  <option>Imagen</option>
                  <option>Declaraciones</option>
                  <option>Otros</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray block mb-1">Embargo (opcional)</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-black text-sm focus:border-gold outline-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link href="/dashboard" className="btn-secondary text-center">
              Cancelar
            </Link>
            <button className="btn-secondary">
              Guardar borrador
            </button>
            <button className="btn-primary">
              Enviar a verificación
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
