import InfoPage from "../../components/InfoPage";

export default function DemoPage() {
  return (
    <InfoPage
      title="Solicitar demo"
      description="Coordina una presentacion privada con el equipo de ClarifyPro."
      primaryAction={{ label: "Contactar ahora", href: "/contact" }}
      secondaryAction={{ label: "Ver capacidades", href: "/media" }}
    >
      <div className="space-y-3 text-gray">
        <p>Incluye acceso a press kits, flujos de verificacion y reportes.</p>
        <p>Recibiras un enlace seguro con horarios disponibles.</p>
      </div>
    </InfoPage>
  );
}
