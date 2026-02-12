import InfoPage from "../../components/InfoPage";

export default function HelpPage() {
  return (
    <InfoPage
      title="Centro de ayuda"
      description="Guia rapida para equipos, verificadores y medios aliados."
      primaryAction={{ label: "Contactar soporte", href: "/contact" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Como publicar una aclaracion verificada.</p>
        <p>• Como adjuntar evidencia y firmar digitalmente.</p>
        <p>• Gestion de embargos y notificaciones.</p>
      </div>
    </InfoPage>
  );
}
