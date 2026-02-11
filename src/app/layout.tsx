import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ClarifyPro - Plataforma Oficial de Aclaraciones Verificadas",
  description: "La plataforma donde figuras públicas publican aclaraciones oficiales verificadas con trazabilidad completa y evidencias.",
  keywords: "aclaraciones, verificación, figuras públicas, declaraciones oficiales, ClarifyPro",
  authors: [{ name: "ClarifyPro" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${crimsonText.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
