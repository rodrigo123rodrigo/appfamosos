import InfoPage from "../../components/InfoPage";

export default function SecurityPage() {
  return (
    <InfoPage
      title="Seguridad"
      description="Firmas digitales, QR de trazabilidad y watermarks sutiles."
      primaryAction={{ label: "Ver documentacion", href: "/docs" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Verificacion de identidad con ID y selfie.</p>
        <p>• Passkeys para equipos y accesos sensibles.</p>
        <p>• Hash opcional en red publica para integridad.</p>
      </div>
    </InfoPage>
  );
}
