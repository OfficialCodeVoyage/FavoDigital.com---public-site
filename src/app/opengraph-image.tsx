import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name + " — " + site.tagline;
export const runtime = "nodejs";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0e14",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Honey radial glow */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "-220px",
            right: "-180px",
            width: "720px",
            height: "720px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(245,182,66,0.28) 0%, rgba(245,182,66,0.10) 38%, rgba(11,14,20,0) 70%)",
          }}
        />

        {/* Top eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f5b642",
            fontWeight: 600,
          }}
        >
          {site.serviceArea}
        </div>

        {/* Center wordmark + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 96,
              fontWeight: 800,
              color: "#eef1f6",
              lineHeight: 1,
            }}
          >
            Favo
            <span style={{ display: "flex", color: "#f5b642" }}>Digital</span>
            <span
              style={{
                display: "flex",
                width: "20px",
                height: "20px",
                marginLeft: "10px",
                borderRadius: "9999px",
                backgroundColor: "#f5b642",
                alignSelf: "flex-end",
                marginBottom: "14px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "#8b93a7",
              marginTop: "28px",
            }}
          >
            {site.tagline}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#f5b642",
            fontWeight: 700,
          }}
        >
          WEB · MARKETING · AI
        </div>
      </div>
    ),
    { ...size }
  );
}
