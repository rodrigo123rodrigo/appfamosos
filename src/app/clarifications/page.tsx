import Link from "next/link";
import InfoPage from "../../components/InfoPage";

const clarifications = [
  {
    id: "ana-garcia-separacion",
    celebrity: "Ana Garcia",
    category: "Relaciones",
    title: "Aclaracion sobre rumores de separacion",
    summary: "Declaracion oficial sobre la situacion actual de la relacion.",
  },
  {
    id: "carlos-ruiz-nueva-pelicula",
    celebrity: "Carlos Ruiz",
    category: "Proyectos",
    title: "Confirmacion de nueva pelicula",
    summary: "Anuncio oficial del proyecto y cronograma inicial.",
  },
  {
    id: "maria-lopez-salud-accidente",
    celebrity: "Maria Lopez",
    category: "Salud",
    title: "Estado de salud tras accidente",
    summary: "Actualizacion medica verificada por el equipo.",
  },
];

export default function ClarificationsPage() {
  return (
    <InfoPage
      title="Aclaraciones Verificadas"
      description="Feed oficial con aclaraciones publicadas por equipos verificados."
      primaryAction={{ label: "Nueva aclaracion", href: "/dashboard/new" }}
      secondaryAction={{ label: "Dashboard", href: "/dashboard" }}
    >
      <div className="space-y-4">
        {clarifications.map((item) => (
          <Link
            key={item.id}
            href={`/clarifications/${item.id}`}
            className="statement-card p-4 block"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray">{item.celebrity} · {item.category}</p>
              </div>
              <span className="verification-badge">Verificado</span>
            </div>
            <p className="text-gray">{item.summary}</p>
          </Link>
        ))}
      </div>
    </InfoPage>
  );
}
