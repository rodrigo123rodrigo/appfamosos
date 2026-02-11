import InfoPage from "../../../components/InfoPage";

export default function NewClarificationPage() {
  return (
    <InfoPage
      title="Nueva aclaracion"
      description="Editor guiado: rumor, aclaracion, evidencia y categoria."
      primaryAction={{ label: "Guardar borrador", href: "/dashboard" }}
      secondaryAction={{ label: "Volver al dashboard", href: "/dashboard" }}
    >
      <div className="space-y-3 text-gray">
        <p>1. Que se dijo (link o cita).</p>
        <p>2. Tu aclaracion oficial.</p>
        <p>3. Evidencia adjunta (doc, imagen, audio).</p>
        <p>4. Categoria y embargo.</p>
      </div>
    </InfoPage>
  );
}
