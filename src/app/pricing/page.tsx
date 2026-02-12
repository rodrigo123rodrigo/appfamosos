import InfoPage from "../../components/InfoPage";

export default function PricingPage() {
  return (
    <InfoPage
      title="Planes"
      description="Elige el nivel de acceso segun tus necesidades."
      primaryAction={{ label: "Plan Pro", href: "/signup?plan=pro" }}
      secondaryAction={{ label: "Plan Enterprise", href: "/contact" }}
    >
      <div className="space-y-3 text-gray">
        <p>• Gratuito: lectura publica y notificaciones basicas.</p>
        <p>• Pro: publicaciones ilimitadas, metricas y embargos.</p>
        <p>• Enterprise: API completa y alertas en tiempo real.</p>
      </div>
    </InfoPage>
  );
}
