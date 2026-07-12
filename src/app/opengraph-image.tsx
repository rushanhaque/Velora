import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Velora International — Métaux d'Art · Hand-raised metalware since 2021";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(150deg, #12100C 0%, #1A1711 60%, #0A0907 100%)",
          padding: "72px",
          color: "#F0EBE1",
          fontFamily: "sans-serif",
        }}
      >
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="58" height="58" viewBox="0 0 48 48">
            <rect
              x="24"
              y="6"
              width="25.5"
              height="25.5"
              transform="rotate(45 24 6)"
              fill="none"
              stroke="#D4B986"
              strokeWidth="1.6"
            />
            <path
              d="M17 18 L24 32 L31 18"
              fill="none"
              stroke="#D4B986"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 14,
              fontWeight: 600,
              color: "#F0EBE1",
            }}
          >
            VELORA
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, letterSpacing: 8, color: "#D4B986", marginBottom: 24 }}>
            MÉTAUX D&apos;ART · MORADABAD, SINCE 2021
          </div>
          <div style={{ display: "flex", fontSize: 88, lineHeight: 1.04, color: "#F0EBE1" }}>
            Heirloom objects in
          </div>
          <div style={{ display: "flex", fontSize: 88, lineHeight: 1.04, color: "#C8A765" }}>
            brass, bronze &amp; silver.
          </div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#A89C86",
            borderTop: "1px solid rgba(201,174,124,0.25)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex" }}>A trade atelier for the world&apos;s finest interiors</div>
          <div style={{ display: "flex" }}>velora.example</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
