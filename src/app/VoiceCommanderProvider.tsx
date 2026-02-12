"use client";

import dynamic from "next/dynamic";

const VoiceCommander = dynamic(
  () => import("../components/VoiceCommander"),
  { ssr: false },
);

export default function VoiceCommanderProvider() {
  return <VoiceCommander />;
}
