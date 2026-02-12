import InfoPage from "../../components/InfoPage";

export default function DocsPage() {
  return (
    <InfoPage
      title="Documentacion"
      description="Lineamientos oficiales para comunicados, evidencia y verificaciones."
      primaryAction={{ label: "Ver API", href: "/api" }}
      secondaryAction={{ label: "Centro de ayuda", href: "/help" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Formato recomendado de aclaraciones.</p>
        <p>• Buenas practicas de evidencia y trazabilidad.</p>
        <p>• Politicas de moderacion interna.</p>
      </div>
    </InfoPage>
  );
}
