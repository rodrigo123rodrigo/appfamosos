import Link from "next/link";
import InfoPage from "../../../../components/InfoPage";

const rumorDetails: Record<string, {
  source: string;
  claim: string;
  severity: string;
  context: string;
}> = {
  "1": {
    source: "Revista Ejemplo",
    claim: "Supuesta separacion de la pareja del ano",
    severity: "Alto",
    context: "Rumor viral en redes, se recomienda aclaracion urgente.",
  },
  "2": {
    source: "Portal Noticias",
    claim: "Problemas financieros en nueva produccion",
    severity: "Medio",
    context: "Se puede aclarar con documento contractual.",
  },
};

export default function RumorDetail({ params }: { params: { id: string } }) {
  const rumor = rumorDetails[params.id] ?? {
    source: "Fuente no identificada",
    claim: "Rumor en revision",
    severity: "Bajo",
    context: "El equipo esta evaluando el contexto.",
  };

  return (
    <InfoPage
      title="Detalle del rumor"
      description={`${rumor.source} · Severidad ${rumor.severity}`}
      primaryAction={{ label: "Crear aclaracion", href: "/dashboard/new" }}
      secondaryAction={{ label: "Volver", href: "/dashboard/rumors" }}
    >
      <div className="space-y-3">
        <p className="text-black font-medium">{rumor.claim}</p>
        <p className="text-gray">{rumor.context}</p>
        <Link href="/dashboard/new" className="btn-primary inline-block">
          Aclarar ahora
        </Link>
      </div>
    </InfoPage>
  );
}
