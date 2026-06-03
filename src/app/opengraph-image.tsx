import { ImageResponse } from "next/og";
import { texts } from "@/data/texts";
import cvData from "@/data/cv-data.json";
import type { CVData } from "@/data/types";

const data = cvData as CVData;

export const runtime = "edge";
export const alt = texts.og.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#F9F6F0",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 360,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, #D4805F 0%, #B85F44 100%)",
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#F9F6F0",
              fontSize: 200,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 1,
              display: "flex",
            }}
          >
            {texts.og.monogram}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: 32,
              right: 32,
              color: "#F9F6F0",
              fontSize: 18,
              letterSpacing: "0.18em",
              opacity: 0.7,
              display: "flex",
            }}
          >
            {texts.og.location}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
          }}
        >
          <div
            style={{
              color: "#8D8D5A",
              fontSize: 22,
              letterSpacing: "0.22em",
              marginBottom: 20,
              display: "flex",
            }}
          >
            {texts.og.eyebrow}
          </div>

          <div
            style={{
              color: "#333333",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 24,
              display: "flex",
            }}
          >
            {data.personalInfo.fullName}
          </div>

          <div
            style={{
              color: "#C36B4D",
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: 40,
              display: "flex",
            }}
          >
            {data.personalInfo.mainPosition}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#8DB4AD",
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  background: "#22C55E",
                  borderRadius: 999,
                  display: "flex",
                }}
              />
              {texts.og.badge}
            </div>
            <div
              style={{
                color: "#666666",
                fontSize: 20,
                display: "flex",
              }}
            >
              {texts.og.stack}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
