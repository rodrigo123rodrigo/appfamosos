import VoiceCommanderProvider from "../VoiceCommanderProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <VoiceCommanderProvider />
    </>
  );
}
