import InfoPage from "../../../../components/InfoPage";

const statementDetails: Record<string, {
  title: string;
  status: string;
  body: string;
  updatedAt: string;
}> = {
  "1": {
    title: "Aclaracion sobre rumores personales",
    status: "Publicado",
    body: "Declaracion oficial con evidencia adjunta y sello verificado.",
    updatedAt: "2026-02-10",
  },
  "2": {
    title: "Confirmacion de nueva pelicula",
    status: "Publicado",
    body: "Se confirma la participacion y se adjuntan contratos verificados.",
    updatedAt: "2026-02-08",
  },
};

export default function StatementDetail({ params }: { params: { id: string } }) {
  const statement = statementDetails[params.id] ?? {
    title: "Aclaracion",
    status: "En revision",
    body: "Aclaracion en proceso de verificacion.",
    updatedAt: "2026-02-10",
  };

  return (
    <InfoPage
      title={statement.title}
      description={`Estado: ${statement.status}`}
      primaryAction={{ label: "Volver", href: "/dashboard/statements" }}
      secondaryAction={{ label: "Dashboard", href: "/dashboard" }}
    >
      <div className="space-y-3">
        <p className="text-black">{statement.body}</p>
        <p className="text-gray text-sm">Ultima actualizacion: {statement.updatedAt}</p>
      </div>
    </InfoPage>
  );
}
