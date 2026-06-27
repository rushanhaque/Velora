import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Velora International — Métaux d'Art",
    short_name: "Velora",
    description:
      "A trade atelier of hand-raised heirloom metalware — brass, bronze & silver, Moradabad since 1972.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#211E17",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
