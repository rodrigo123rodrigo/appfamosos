import InfoPage from "../../../components/InfoPage";

export default function MetricsPage() {
  return (
    <InfoPage
      title="Metricas de reputacion"
      description="Alcance, sentimiento y evolucion de rumores en tiempo real."
      primaryAction={{ label: "Ver dashboard", href: "/dashboard" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Alcance total: 156,890 vistas.</p>
        <p>• Sentimiento neto: +23% positivo.</p>
        <p>• Rumores activos: 2 (1 alto, 1 medio).</p>
      </div>
    </InfoPage>
  );
}
