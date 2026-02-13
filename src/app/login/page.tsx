import Link from "next/link";
import InfoPage from "../../components/InfoPage";

export default function LoginPage() {
  return (
    <InfoPage
      title="Iniciar sesion"
      description="Accede al panel de aclaraciones con credenciales verificadas."
      primaryAction={{ label: "Entrar al dashboard", href: "/dashboard" }}
      secondaryAction={{ label: "Crear cuenta", href: "/signup" }}
    >
      <div className="space-y-3 text-gray">
        <p>Usa tu correo corporativo o passkey para un acceso seguro.</p>
        <div className="statement-card p-4">
          <p className="text-white font-semibold">Acceso rapido</p>
          <p className="text-sm text-gray-light">Simulacion de login para demo.</p>
          <Link href="/dashboard" className="btn-primary mt-3 inline-block">
            Continuar
          </Link>
        </div>
      </div>
    </InfoPage>
  );
}
