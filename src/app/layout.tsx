import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { JourneyProvider } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: {
    default: "Luvimind — seu cuidado, no seu tempo",
    template: "%s | Luvimind",
  },
  description:
    "Encontre um espaço de escuta que combina com você. PWA Paciente da Luvimind.",
  applicationName: "Luvimind",
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Luvimind" },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFCFB",
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo
        </a>
        <JourneyProvider>{children}</JourneyProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
