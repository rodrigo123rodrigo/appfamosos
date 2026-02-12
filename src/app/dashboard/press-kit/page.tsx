import InfoPage from "../../../components/InfoPage";

export default function PressKitPage() {
  return (
    <InfoPage
      title="Kit de prensa"
      description="Descarga PDFs y assets optimizados por aclaracion."
      primaryAction={{ label: "Ver aclaraciones", href: "/dashboard/statements" }}
    >
      <div className="space-y-2 text-gray">
        <p>• PDF con statement verificado.</p>
        <p>• Imagenes con watermark sutil.</p>
        <p>• Enlaces con expiracion segura.</p>
      </div>
    </InfoPage>
  );
}
