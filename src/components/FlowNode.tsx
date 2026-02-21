import React from "react";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const TYPE_CONFIG = {
  image: { label: "Image", color: "#3B82F6" },
  video: { label: "Video", color: "#8B5CF6" },
  llm: { label: "LLM", color: "#F59E0B" },
  audio: { label: "Audio", color: "#10B981" },
} as const;

interface FlowNodeProps {
  type: keyof typeof TYPE_CONFIG;
  model: string;
  prompt?: string;
  promptChars?: number;
  showResult?: boolean;
  resultOpacity?: number;
  resultGradient?: string;
  resultText?: string;
  resultTextChars?: number;
  selected?: boolean;
  selectionGlow?: number;
  processing?: boolean;
  scanLinePos?: number;
  entrance?: number;
  entranceBlur?: number;
  width?: number;
  height?: number;
  showPlayButton?: boolean;
  galleryLabel?: string;
  galleryLabelOpacity?: number;
  showActionDock?: boolean;
  actionDockOpacity?: number;
  processingLabel?: string;
  handleLeftGlow?: number;
  handleRightGlow?: number;
  style?: React.CSSProperties;
}

export const FlowNode: React.FC<FlowNodeProps> = ({
  type,
  model,
  prompt,
  promptChars,
  showResult = false,
  resultOpacity = 1,
  resultGradient,
  resultText,
  resultTextChars,
  selected = false,
  selectionGlow = 0,
  processing = false,
  scanLinePos = 0,
  entrance = 1,
  entranceBlur = 0,
  width = 300,
  height = 380,
  showPlayButton = false,
  galleryLabel,
  galleryLabelOpacity = 0,
  showActionDock = false,
  actionDockOpacity = 0,
  processingLabel,
  handleLeftGlow = 0,
  handleRightGlow = 0,
  style,
}) => {
  const cfg = TYPE_CONFIG[type];
  const displayPrompt =
    prompt && promptChars !== undefined
      ? prompt.slice(0, promptChars)
      : prompt;
  const displayResult =
    resultText && resultTextChars !== undefined
      ? resultText.slice(0, resultTextChars)
      : resultText;

  const imgH = type === "llm" ? 0 : Math.max(0, height - 150);

  const showGalleryLabel = galleryLabel && !selected && showResult;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      {/* ── Node Card ── */}
      <div
        style={{
          width,
          height,
          borderRadius: 16,
          background: "rgba(18, 18, 18, 0.95)",
          border: selected
            ? `2px solid ${cfg.color}cc`
            : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: selected
            ? `0 0 ${40 * selectionGlow}px ${cfg.color}4d, 0 0 ${80 * selectionGlow}px ${cfg.color}1a, 0 8px 40px rgba(0,0,0,0.6)`
            : "0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
          opacity: entrance,
          filter: entranceBlur > 0.3 ? `blur(${entranceBlur}px)` : undefined,
          transform: `scale(${0.7 + entrance * 0.3}) translateY(${20 * (1 - entrance)}px)`,
          overflow: "hidden",
          position: "relative",
          fontFamily,
          ...style,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            height: 46,
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: cfg.color,
                boxShadow: `0 0 10px ${cfg.color}88`,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              {cfg.label}
            </span>
          </div>
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.04em",
            }}
          >
            {model}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: 12 }}>
          {/* Image / Video result area */}
          {type !== "llm" && (
            <div
              style={{
                width: "100%",
                height: imgH,
                borderRadius: 10,
                overflow: "hidden",
                position: "relative",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {/* Result gradient */}
              {showResult && resultGradient && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: resultGradient,
                    opacity: resultOpacity,
                    transition: undefined,
                  }}
                />
              )}

              {/* Play button overlay for video */}
              {showPlayButton && showResult && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid rgba(255,255,255,0.25)",
                    opacity: resultOpacity,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "16px solid white",
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      marginLeft: 4,
                    }}
                  />
                </div>
              )}

              {/* Scan line for processing */}
              {processing && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${scanLinePos}%`,
                      width: 4,
                      height: "100%",
                      background: cfg.color,
                      boxShadow: `0 0 30px ${cfg.color}, 0 0 60px ${cfg.color}88, 0 0 10px white`,
                      zIndex: 5,
                    }}
                  />
                  {/* Scanned region tint */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${scanLinePos}%`,
                      height: "100%",
                      background: `${cfg.color}08`,
                      zIndex: 4,
                    }}
                  />
                </>
              )}

              {/* Processing Label overlay */}
              {processing && processingLabel && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 6,
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 6,
                    padding: "3px 10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase" as const,
                      color: cfg.color,
                      fontFamily,
                    }}
                  >
                    {processingLabel}
                  </span>
                </div>
              )}

              {/* Empty state placeholder lines */}
              {!showResult && !processing && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      height: 2,
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  />
                  <div
                    style={{
                      width: "25%",
                      height: 2,
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* LLM text result */}
          {type === "llm" && (
            <div
              style={{
                padding: 14,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 10,
                minHeight: height - 150,
                border: "1px solid rgba(255,255,255,0.04)",
                position: "relative",
              }}
            >
              {displayResult ? (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.7,
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    letterSpacing: "0.01em",
                  }}
                >
                  {displayResult}
                  {resultTextChars !== undefined &&
                    resultTextChars < (resultText?.length ?? 0) && (
                      <span
                        style={{
                          color: cfg.color,
                          opacity: 0.8,
                        }}
                      >
                        {"\u2588"}
                      </span>
                    )}
                </span>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    paddingTop: 8,
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      height: 2,
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  />
                  <div
                    style={{
                      width: "40%",
                      height: 2,
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.03)",
                    }}
                  />
                </div>
              )}

              {/* Processing Label overlay for LLM */}
              {processing && processingLabel && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 6,
                    background: "rgba(0,0,0,0.6)",
                    borderRadius: 6,
                    padding: "3px 10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase" as const,
                      color: cfg.color,
                      fontFamily,
                    }}
                  >
                    {processingLabel}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Prompt */}
          {displayPrompt && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.025)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.4,
                }}
              >
                &quot;{displayPrompt}
                {promptChars !== undefined &&
                  promptChars < (prompt?.length ?? 0) && (
                    <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
                  )}
                &quot;
              </span>
            </div>
          )}
        </div>

        {/* ── Handles ── */}
        {/* Left Handle */}
        <div
          style={{
            position: "absolute",
            left: -6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#1a1a1a",
            border: handleLeftGlow > 0
              ? `2.5px solid ${cfg.color}${Math.round(40 + 215 * handleLeftGlow).toString(16).padStart(2, "0")}`
              : "2.5px solid rgba(255,255,255,0.15)",
            boxShadow: handleLeftGlow > 0
              ? `0 0 ${12 * handleLeftGlow}px ${cfg.color}66, 0 2px 6px rgba(0,0,0,0.4)`
              : "0 2px 6px rgba(0,0,0,0.4)",
          }}
        />
        {/* Right Handle */}
        <div
          style={{
            position: "absolute",
            right: -6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#1a1a1a",
            border: handleRightGlow > 0
              ? `2.5px solid ${cfg.color}${Math.round(102 + 153 * handleRightGlow).toString(16).padStart(2, "0")}`
              : `2.5px solid ${cfg.color}66`,
            boxShadow: handleRightGlow > 0
              ? `0 0 ${12 * handleRightGlow}px ${cfg.color}66, 0 2px 6px rgba(0,0,0,0.4)`
              : selected
                ? `0 0 10px ${cfg.color}44, 0 2px 6px rgba(0,0,0,0.4)`
                : "0 2px 6px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* ── Gallery Label (below the card) ── */}
      {showGalleryLabel && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "center",
            opacity: galleryLabelOpacity,
          }}
        >
          <div
            style={{
              background: "rgba(10, 10, 12, 0.75)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "6px 12px",
              maxWidth: width,
              overflow: "hidden",
              whiteSpace: "nowrap" as const,
              textOverflow: "ellipsis",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 400,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.35)",
                fontFamily,
              }}
            >
              {galleryLabel}
            </span>
          </div>
        </div>
      )}

      {/* ── Action Dock (right side) ── */}
      {showActionDock && (
        <div
          style={{
            position: "absolute",
            right: -52,
            top: "50%",
            transform: `translateY(-50%) translateX(${10 * (1 - actionDockOpacity)}px)`,
            opacity: actionDockOpacity,
          }}
        >
          <div
            style={{
              background: "rgba(10, 10, 12, 0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: 5,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* Edit button (accent) */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${cfg.color}18`,
                border: `1px solid ${cfg.color}33`,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M10.08 1.92a1.5 1.5 0 0 1 2.12 2.12L5.13 11.1l-2.83.71.71-2.83L10.08 1.92Z"
                  stroke={cfg.color}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Upscale button (muted) */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 1h4v4M5 13H1V9M13 1L8.5 5.5M1 13l4.5-4.5"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Remix button (muted) */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1.5 4.5h8.25a2.75 2.75 0 0 1 0 5.5H9M1.5 4.5l2-2M1.5 4.5l2 2M12.5 10H4.25a2.75 2.75 0 0 1 0-5.5H5M12.5 10l-2 2M12.5 10l-2-2"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Animate button (muted) */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect
                  x="1.5"
                  y="2.5"
                  width="11"
                  height="9"
                  rx="1.5"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.2"
                />
                <path
                  d="M5.5 5v4l3.5-2-3.5-2Z"
                  fill="rgba(255,255,255,0.4)"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
