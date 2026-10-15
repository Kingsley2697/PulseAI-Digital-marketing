import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PulseAI Digital",
    short_name: "PulseAI",
    description: "PulseAI Digital autonomous AI marketing agency workspace.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbfaf8",
    theme_color: "#ff5b37",
    icons: [
      { src: "/pulseai-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
