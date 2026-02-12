import InfoPage from "../../components/InfoPage";

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Politica de privacidad"
      description="Protegemos la identidad y la evidencia con cifrado y control granular."
      primaryAction={{ label: "Contactar", href: "/contact" }}
    >
      <div className="space-y-2 text-gray">
        <p>• Datos cifrados en reposo y en transito.</p>
        <p>• Accesos segmentados por rol y nivel de verificacion.</p>
        <p>• Retencion de datos ajustable por contrato.</p>
      </div>
    </InfoPage>
  );
}
