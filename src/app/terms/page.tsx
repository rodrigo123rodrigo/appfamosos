import InfoPage from "../../components/InfoPage";

export default function TermsPage() {
  return (
    <InfoPage
      title="Terminos y condiciones"
      description="Reglas de uso, moderacion y responsabilidades de contenido."
      primaryAction={{ label: "Contactar", href: "/contact" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Las aclaraciones deben ser verificables y consistentes.</p>
        <p>• El equipo interno puede solicitar evidencia adicional.</p>
        <p>• Los cambios quedan registrados en historial inmutable.</p>
      </div>
    </InfoPage>
  );
}
