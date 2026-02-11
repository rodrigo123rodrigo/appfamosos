import Link from "next/link";
import InfoPage from "../../components/InfoPage";

const categories = [
  "Relaciones",
  "Proyectos",
  "Salud",
  "Legal",
  "Filantropia",
  "Imagen",
  "Declaraciones",
  "Otros",
];

export default function CategoriesPage() {
  return (
    <InfoPage
      title="Categorias"
      description="Explora las aclaraciones por tema y accede al contexto completo."
      primaryAction={{ label: "Ver aclaraciones", href: "/clarifications" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/clarifications?category=${encodeURIComponent(category)}`}
            className="statement-card p-4 block text-center"
          >
            <span className="font-display text-lg text-black">{category}</span>
          </Link>
        ))}
      </div>
    </InfoPage>
  );
}
