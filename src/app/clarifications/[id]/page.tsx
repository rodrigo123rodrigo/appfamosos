import InfoPage from "../../../components/InfoPage";

const clarificationById: Record<string, {
  title: string;
  celebrity: string;
  category: string;
  body: string;
  evidence: string[];
}> = {
  "ana-garcia-separacion": {
    title: "Aclaracion sobre rumores de separacion",
    celebrity: "Ana Garcia",
    category: "Relaciones",
    body: "Este comunicado confirma que la informacion difundida recientemente es inexacta. La situacion personal permanece estable y agradecemos el respeto a la privacidad.",
    evidence: ["Contrato de representacion", "Comunicado oficial", "Captura verificada"],
  },
  "carlos-ruiz-nueva-pelicula": {
    title: "Confirmacion de nueva pelicula",
    celebrity: "Carlos Ruiz",
    category: "Proyectos",
    body: "Se confirma la participacion en el nuevo largometraje, con rodaje previsto para el segundo trimestre del ano.",
    evidence: ["Carta de intencion", "Acuerdo preliminar"],
  },
  "maria-lopez-salud-accidente": {
    title: "Estado de salud tras accidente",
    celebrity: "Maria Lopez",
    category: "Salud",
    body: "El equipo medico confirma una evolucion favorable. Agradecemos las muestras de apoyo y se compartiran nuevas actualizaciones si corresponde.",
    evidence: ["Parte medico", "Declaracion del manager"],
  },
};

export default function ClarificationDetail({
  params,
}: {
  params: { id: string };
}) {
  const data = clarificationById[params.id] ?? {
    title: "Aclaracion",
    celebrity: "Equipo verificado",
    category: "General",
    body: "Esta aclaracion se encuentra en revision o no existe en el feed actual.",
    evidence: ["Registro interno"],
  };

  return (
    <InfoPage
      title={data.title}
      description={`${data.celebrity} · ${data.category} · Verificado`}
      primaryAction={{ label: "Volver al feed", href: "/clarifications" }}
      secondaryAction={{ label: "Dashboard", href: "/dashboard" }}
    >
      <div className="space-y-4">
        <p className="text-black">{data.body}</p>
        <div>
          <h3 className="font-semibold text-black mb-2">Evidencia adjunta</h3>
          <ul className="space-y-1 text-gray">
            {data.evidence.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </InfoPage>
  );
}
