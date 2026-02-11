import InfoPage from "../../components/InfoPage";

export default function SignupPage() {
  return (
    <InfoPage
      title="Crear cuenta"
      description="Onboarding con verificacion de identidad y control de redes sociales."
      primaryAction={{ label: "Iniciar verificacion", href: "/signup?flow=verification" }}
      secondaryAction={{ label: "Ver planes", href: "/pricing" }}
    >
      <div className="space-y-3 text-gray">
        <p>Completa el proceso en minutos: ID, selfie y prueba de control.</p>
        <p>El equipo interno revisa las evidencias antes de activar la cuenta.</p>
      </div>
    </InfoPage>
  );
}
