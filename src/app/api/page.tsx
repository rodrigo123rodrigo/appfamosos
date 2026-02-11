import InfoPage from "../../components/InfoPage";

export default function ApiPage() {
  return (
    <InfoPage
      title="API para medios"
      description="Endpoints verificados para consumo de feeds, alertas y press kits."
      primaryAction={{ label: "Solicitar acceso", href: "/contact" }}
      secondaryAction={{ label: "Ver docs", href: "/docs" }}
    >
      <div className="space-y-2 text-gray">
        <p>• /clarifications: feed oficial con hash de integridad.</p>
        <p>• /media-kits: assets optimizados y descargables.</p>
        <p>• /alerts: notificaciones segmentadas en tiempo real.</p>
      </div>
    </InfoPage>
  );
}
