import InfoPage from "../../components/InfoPage";

export default function VerifiedPage() {
  return (
    <InfoPage
      title="Verificados"
      description="Listado de perfiles con verificacion activa y sello de autenticidad."
      primaryAction={{ label: "Explorar feed", href: "/clarifications" }}
      secondaryAction={{ label: "Solicitar verificacion", href: "/signup?flow=verification" }}
    >
      <div className="space-y-3">
        <div className="statement-card p-4">
          <h3 className="font-semibold text-black">Ana Garcia</h3>
          <p className="text-gray text-sm">Verificacion activa · Nivel Pro</p>
        </div>
        <div className="statement-card p-4">
          <h3 className="font-semibold text-black">Carlos Ruiz</h3>
          <p className="text-gray text-sm">Verificacion activa · Nivel Pro</p>
        </div>
        <div className="statement-card p-4">
          <h3 className="font-semibold text-black">Maria Lopez</h3>
          <p className="text-gray text-sm">Verificacion activa · Nivel Pro</p>
        </div>
      </div>
    </InfoPage>
  );
}
