import { COLORS } from "../constants";

export const BrowserWindow: React.FC<{
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  style?: React.CSSProperties;
}> = ({ children, title, active = true, style }) => {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "rgba(15, 15, 17, 0.6)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${active ? COLORS.borderBright : COLORS.border}`,
        boxShadow: active
          ? "0 40px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 20px 40px rgba(0,0,0,0.5)"
          : "0 20px 40px -10px rgba(0,0,0,0.8)",
        display: "flex",
        flexDirection: "column" as const,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 16,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0))",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 8, opacity: active ? 1 : 0.5 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FF5F56",
              boxShadow: "0 0 10px rgba(255,95,86,0.3)",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#FFBD2E",
              boxShadow: "0 0 10px rgba(255,189,46,0.3)",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#27C93F",
              boxShadow: "0 0 10px rgba(39,201,63,0.3)",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            height: 24,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {title && (
            <div
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                opacity: 0.8,
                letterSpacing: "0.02em",
              }}
            >
              <span style={{ opacity: 0.5 }}>creativly.ai / </span>
              <span style={{ color: COLORS.text }}>
                {title}
              </span>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          background: "rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
