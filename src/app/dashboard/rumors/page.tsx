import Link from "next/link";
import InfoPage from "../../../components/InfoPage";

const rumors = [
  {
    id: "1",
    source: "Revista Ejemplo",
    claim: "Supuesta separacion de la pareja del ano",
    severity: "Alto",
  },
  {
    id: "2",
    source: "Portal Noticias",
    claim: "Problemas financieros en nueva produccion",
    severity: "Medio",
  },
];

export default function RumorsPage() {
  return (
    <InfoPage
      title="Rumores detectados"
      description="Listado de rumores priorizados para aclaracion rapida."
      primaryAction={{ label: "Crear aclaracion", href: "/dashboard/new" }}
    >
      <div className="space-y-4">
        {rumors.map((rumor) => (
          <Link key={rumor.id} href={`/dashboard/rumors/${rumor.id}`} className="statement-card p-4 block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray">{rumor.source}</p>
                <p className="text-black font-medium">{rumor.claim}</p>
              </div>
              <span className="text-xs bg-gold-light text-black px-2 py-1 rounded-full">
                {rumor.severity}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </InfoPage>
  );
}
