import InfoPage from "../../components/InfoPage";

export default function MediaPage() {
  return (
    <InfoPage
      title="Para Medios"
      description="Acceso a press kits verificados, feeds compactos y descargas optimizadas."
      primaryAction={{ label: "Solicitar demo", href: "/demo" }}
      secondaryAction={{ label: "Ver API", href: "/api" }}
    >
      <div className="space-y-4 text-gray">
        <p>• Feed verificado con hashes de integridad.</p>
        <p>• Kits de prensa descargables por aclaracion.</p>
        <p>• Notificaciones segmentadas y alertas en tiempo real.</p>
      </div>
    </InfoPage>
  );
}
