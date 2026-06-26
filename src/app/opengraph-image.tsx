import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name + " — " + site.tagline;
export const runtime = "nodejs";
// Pure `site` data, no params/fetch — render once and let the CDN cache the PNG.
export const dynamic = "force-static";

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
          backgroundColor: "#0E0D0B",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Honey-amber radial glow */}
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
              "radial-gradient(circle, rgba(245,166,35,0.30) 0%, rgba(245,166,35,0.10) 38%, rgba(14,13,11,0) 70%)",
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
            color: "#F5A623",
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
              alignItems: "center",
              fontSize: 96,
              fontWeight: 800,
              color: "#F4EFE3",
              lineHeight: 1,
            }}
          >
            {/* "Fav" */}
            <span style={{ display: "flex" }}>Fav</span>
            {/* The 'o' rendered as an amber honeycomb hexagon cell */}
            <span
              style={{
                display: "flex",
                width: "72px",
                height: "82px",
                marginLeft: "8px",
                marginRight: "8px",
                background:
                  "linear-gradient(150deg, #FFC861 0%, #F5A623 55%, #C8881F 100%)",
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
            {/* "Digital" */}
            <span style={{ display: "flex" }}>Digital</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "#9A968C",
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
            color: "#F5A623",
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
