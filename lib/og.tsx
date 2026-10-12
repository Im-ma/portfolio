import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogImage(title: string, eyebrow: string) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f5f7fb",
        color: "#0b1b3f",
        padding: "72px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 22, height: 22, background: "#2f5bff" }} />
        <div style={{ fontSize: 28, letterSpacing: 1 }}>Immanuel Mensah</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ color: "#2f5bff", fontSize: 22, letterSpacing: 3 }}>{eyebrow}</div>
        <div style={{ fontSize: 64, lineHeight: 1.08, letterSpacing: -1, maxWidth: 980 }}>
          {title}
        </div>
      </div>
      <div style={{ width: 148, height: 8, background: "#2f5bff" }} />
    </div>,
    { ...ogSize },
  );
}
