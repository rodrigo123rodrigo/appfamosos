import Link from "next/link";
import InfoPage from "../../../components/InfoPage";

const statements = [
  {
    id: "1",
    title: "Aclaracion sobre rumores personales",
    status: "Publicado",
    views: "15,420",
  },
  {
    id: "2",
    title: "Confirmacion de nueva pelicula",
    status: "Publicado",
    views: "9,120",
  },
];

export default function StatementsPage() {
  return (
    <InfoPage
      title="Mis aclaraciones"
      description="Historial de publicaciones con acceso a ediciones y diffs."
      primaryAction={{ label: "Nueva aclaracion", href: "/dashboard/new" }}
    >
      <div className="space-y-4">
        {statements.map((statement) => (
          <Link key={statement.id} href={`/dashboard/statements/${statement.id}`} className="statement-card p-4 block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black font-medium">{statement.title}</p>
                <p className="text-sm text-gray">{statement.status}</p>
              </div>
              <span className="text-sm text-gray">👁 {statement.views}</span>
            </div>
          </Link>
        ))}
      </div>
    </InfoPage>
  );
}
