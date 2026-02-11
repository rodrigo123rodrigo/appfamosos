import InfoPage from "../../components/InfoPage";

export default function ContactPage() {
  return (
    <InfoPage
      title="Contacto"
      description="Nuestro equipo responde solicitudes de verificacion, prensa y soporte."
      primaryAction={{ label: "Solicitar demo", href: "/demo" }}
      secondaryAction={{ label: "Ver API", href: "/api" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Email: soporte@clarifypro.example</p>
        <p>• SLA promedio: 15 minutos para aclaraciones urgentes.</p>
        <p>• Soporte prioritario para equipos Pro y Enterprise.</p>
      </div>
    </InfoPage>
  );
}
