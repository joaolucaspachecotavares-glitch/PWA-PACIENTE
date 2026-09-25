import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Luvimind — Paciente",
    short_name: "Luvimind",
    description: "Seu espaço de cuidado, no seu tempo.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FAFCFB",
    theme_color: "#FAFCFB",
    lang: "pt-BR",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
