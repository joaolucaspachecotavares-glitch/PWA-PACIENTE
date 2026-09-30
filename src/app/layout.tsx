import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import "./patient.css";
import { Providers } from "@/components/providers";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: {
    default: "Luvimind — cuidar de você começa encontrando o apoio certo",
    template: "%s | Luvimind",
  },
  description:
    "Responda algumas perguntas e encontre profissionais de saúde mental compatíveis com o que você procura.",
  applicationName: "Luvimind",
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Luvimind" },
  formatDetection: { telephone: false },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFCFB",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
        <PwaRegister />
      </body>
    </html>
  );
}
