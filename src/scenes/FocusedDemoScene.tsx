import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { FloatingDiamond } from "../components/Rotating3D";
import { PulseRings } from "../components/PulseRings";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
});

// Filmstrip thumbnail images
const THUMBS = [
  "surrealist-concept_800w.jpg",
  "brand-identity-system_800w.jpg",
  "character-performance_800w.jpg",
  "launch-film-suite_800w.jpg",
  "director-board_800w.jpg",
  "ugc-product-story_800w.jpg",
];

// ═══════════════════════════════════
//  FOCUSED DEMO SCENE
//  Shows the studio/focused editing
//  experience: hero preview, tools,
//  comparison slider, prompt bar
// ═══════════════════════════════════
export const FocusedDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Hero Image entrance ───
  const heroSpr = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.7 },
  });
  const heroScale = interpolate(heroSpr, [0, 1], [1.08, 1]);
  const heroBlur = interpolate(heroSpr, [0, 1], [16, 0]);

  // ─── Action toolbar entrance ───
  const toolbarSpr = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.5 },
  });
  const toolbarX = interpolate(toolbarSpr, [0, 1], [60, 0]);

  // ─── Filmstrip entrance ───
  const filmSpr = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.5 },
  });
  const filmY = interpolate(filmSpr, [0, 1], [40, 0]);

  // ─── Comparison slider ───
  const sliderPos = interpolate(frame, [48, 78], [0, 48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const sliderOpacity = interpolate(frame, [48, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Prompt bar entrance ───
  const promptSpr = spring({
    frame: Math.max(0, frame - 62),
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.6 },
  });
  const promptY = interpolate(promptSpr, [0, 1], [50, 0]);

  // ─── Mode toggle animation (IMG → VID) ───
  const modeToggle = interpolate(frame, [85, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0, 1),
  });

  // ─── Generation progress ring on generate button ───
  const genProgress = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const genGlowIntensity = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Negative prompt entrance ───
  const negPromptSpr = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 200, stiffness: 80, mass: 0.6 },
  });

  // ─── Image counter badge fade ───
  const counterOpacity = interpolate(frame, [18, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Edit mode brush cursor ───
  const brushAppear = interpolate(frame, [90, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brushX = interpolate(frame, [90, 110], [650, 780], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const brushY = interpolate(frame, [90, 110], [420, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // ─── Title text ───
  const titleSpr = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 16, stiffness: 70, mass: 0.6 },
  });
  const subSpr = spring({
    frame: Math.max(0, frame - 88),
    fps,
    config: { damping: 16, stiffness: 70, mass: 0.6 },
  });

  // ─── Watermark ───
  const watermarkOp = interpolate(Math.sin(frame * 0.02), [-1, 1], [0.012, 0.025]);

  // ─── Active thumbnail tracking ───
  const activeThumb = Math.floor(interpolate(frame, [40, 105], [0, 5.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  // ─── Parameter sliders panel ───
  const paramSpr = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.5 },
  });

  const paramSliders = [
    { label: "CFG Scale", value: "7.5", target: 60 },
    { label: "Steps", value: "28", target: 70 },
    { label: "Sampler", value: "DPM++", target: 45 },
  ];

  // ─── Prompt typing animation ───
  const promptText = "A serene mountain lake at golden hour, cinematic lighting";
  const promptChars = Math.floor(interpolate(frame, [64, 92], [0, promptText.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  // ─── Token counter ───
  const tokenCount = Math.min(12, Math.floor(promptChars / 5) + (promptChars > 0 ? 1 : 0));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* ═══ ATMOSPHERE ═══ */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: 800,
          height: 600,
          background: `radial-gradient(circle, ${COLORS.brand}12 0%, transparent 70%)`,
          filter: "blur(100px)",
          transform: `translate(${noise2D("fg1", frame * 0.005, 0) * 25}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${COLORS.brandCyan}0a 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      <FloatingDiamond size={28} color={`${COLORS.brand}20`} x={100} y={150} speed={0.8} delay={5} noiseId="foc1" glow glowColor={COLORS.brand} />
      <FloatingDiamond size={20} color={`${COLORS.brandCyan}18`} x={1800} y={200} speed={1.1} delay={10} noiseId="foc2" />
      <FloatingDiamond size={35} color={`${COLORS.secondary}14`} x={1700} y={850} speed={0.5} delay={15} noiseId="foc3" glow glowColor={COLORS.secondary} />

      <PulseRings count={3} color={`${COLORS.brand}06`} maxSize={1000} speed={0.2} strokeWidth={1} />

      {/* ═══ WATERMARK ═══ */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-12deg)",
          fontFamily,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 420,
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          backgroundClip: "text",
          opacity: watermarkOp,
          whiteSpace: "nowrap",
          letterSpacing: "0.06em",
          userSelect: "none",
          pointerEvents: "none",
          padding: "0.15em 0.3em",
        }}
      >
        FOCUS
      </div>

      {/* ═══ HERO IMAGE STAGE ═══ */}
      <div
        style={{
          position: "absolute",
          left: 340,
          top: 55,
          width: 1140,
          height: 660,
          borderRadius: 20,
          overflow: "hidden",
          opacity: heroSpr,
          transform: `scale(${heroScale})`,
          filter: heroBlur > 0.5 ? `blur(${heroBlur}px)` : undefined,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Img
          src={staticFile("focused-editor.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* ─── Aspect Ratio Badge (top-left) ─── */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(0,0,0,0.5)",
            borderRadius: 6,
            padding: "3px 8px",
            opacity: heroSpr,
            zIndex: 12,
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            16:9
          </span>
        </div>

        {/* ─── Image Counter Badge (top-right) ─── */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(0,0,0,0.5)",
            borderRadius: 6,
            padding: "3px 8px",
            opacity: counterOpacity,
            zIndex: 12,
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            3 / 8
          </span>
        </div>

        {/* ─── Comparison Slider Overlay ─── */}
        {frame >= 48 && (
          <>
            {/* "Before" region (desaturated) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                backdropFilter: "grayscale(100%) brightness(0.65) contrast(1.3)",
                opacity: sliderOpacity,
              }}
            />

            {/* Divider line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${sliderPos}%`,
                width: 2,
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 60px rgba(0,0,0,0.5)",
                opacity: sliderOpacity,
                zIndex: 10,
              }}
            />

            {/* Divider handle */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: `${sliderPos}%`,
                transform: "translate(-50%, -50%)",
                width: 32,
                height: 48,
                borderRadius: 8,
                background: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: sliderOpacity,
                zIndex: 11,
              }}
            >
              {/* Grip dots */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {[0, 1, 2].map((j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.3)" }} />
                    <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.3)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* "Before" label */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(15,15,17,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                opacity: sliderOpacity,
                zIndex: 12,
              }}
            >
              Before
            </div>

            {/* "After" label */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(15,15,17,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.brand,
                opacity: sliderOpacity,
                zIndex: 12,
              }}
            >
              After
            </div>
          </>
        )}

        {/* ─── Brush Cursor (edit mode hint) ─── */}
        {frame >= 90 && (
          <div
            style={{
              position: "absolute",
              left: brushX,
              top: brushY,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.8)",
              boxShadow: `0 0 15px ${COLORS.brand}55, inset 0 0 8px ${COLORS.brand}22`,
              opacity: brushAppear,
              transform: "translate(-50%, -50%)",
              zIndex: 15,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "white",
              }}
            />
          </div>
        )}
      </div>

      {/* ═══ GLASS ACTION TOOLBAR (right side) ═══ */}
      {frame >= 20 && (
        <div
          style={{
            position: "absolute",
            right: 90,
            top: "50%",
            transform: `translateY(-50%) translateX(${toolbarX}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 10,
            borderRadius: 20,
            background: "rgba(10, 10, 12, 0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            opacity: toolbarSpr,
            zIndex: 20,
          }}
        >
          {/* Edit button (blue accent) */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${COLORS.brand}22`,
              border: `1px solid ${COLORS.brand}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 20px ${COLORS.brand}33`,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>

          {/* Download button */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>

          {/* Delete button */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
        </div>
      )}

      {/* ═══ FILMSTRIP (bottom thumbnails) ═══ */}
      {frame >= 33 && (
        <div
          style={{
            position: "absolute",
            bottom: 178,
            left: "50%",
            transform: `translateX(-50%) translateY(${filmY}px)`,
            display: "flex",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 18,
            background: "rgba(10, 10, 12, 0.65)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            opacity: filmSpr,
            zIndex: 20,
          }}
        >
          {THUMBS.map((thumb, i) => {
            const thumbSpr = spring({
              frame: Math.max(0, frame - 36 - i * 3),
              fps,
              config: { damping: 14, stiffness: 120, mass: 0.4 },
            });
            const isActive = i === activeThumb;

            return (
              <div
                key={i}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: isActive
                    ? `2px solid ${COLORS.brand}`
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive
                    ? `0 0 16px ${COLORS.brand}44`
                    : "0 4px 12px rgba(0,0,0,0.3)",
                  transform: `scale(${isActive ? 1.12 : 0.7 + thumbSpr * 0.3})`,
                  opacity: thumbSpr,
                }}
              >
                <Img
                  src={staticFile(thumb)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ PROMPT BAR (stacked glass card) ═══ */}
      {frame >= 60 && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: `translateX(-50%) translateY(${promptY}px)`,
            width: 860,
            borderRadius: 22,
            background: "rgba(10, 10, 12, 0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
            opacity: promptSpr,
            fontFamily,
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          {/* Top deck — textarea */}
          <div style={{ padding: "14px 18px 10px", position: "relative" }}>
            {promptChars > 0 ? (
              <span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.75)",
                    fontFamily,
                  }}
                >
                  {promptText.slice(0, promptChars)}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: COLORS.brand,
                    opacity: Math.sin(frame * 0.3) > 0 ? 0.8 : 0.2,
                    fontFamily,
                  }}
                >
                  |
                </span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.3)",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                Describe your image or make changes...
              </span>
            )}
            {/* Token counter */}
            {promptChars > 0 && (
              <span
                style={{
                  position: "absolute",
                  right: 18,
                  top: 14,
                  fontSize: 9,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "monospace",
                }}
              >
                {tokenCount}/75 tokens
              </span>
            )}
          </div>

          {/* ─── Negative Prompt Row ─── */}
          <div
            style={{
              padding: "0 18px 8px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: negPromptSpr,
              transform: `translateY(${interpolate(negPromptSpr, [0, 1], [10, 0])}px)`,
            }}
          >
            {/* NEG pill */}
            <div
              style={{
                background: "rgba(244,63,94,0.15)",
                border: "1px solid rgba(244,63,94,0.25)",
                borderRadius: 8,
                padding: "2px 8px",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#f43f5e",
                  letterSpacing: "0.05em",
                }}
              >
                NEG
              </span>
            </div>
            {/* Negative prompt hint text */}
            <span
              style={{
                fontFamily,
                fontSize: 12,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              blur, watermark, low quality...
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.05)",
              margin: "0 14px",
            }}
          />

          {/* Bottom deck — controls */}
          <div
            style={{
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left: Mode toggle + frame slots */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* IMG/VID toggle */}
              <div
                style={{
                  display: "flex",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  padding: 3,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Sliding indicator */}
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 3 + modeToggle * 52,
                    width: 50,
                    height: 28,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.1)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                />
                <div
                  style={{
                    padding: "5px 14px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: modeToggle < 0.5 ? COLORS.brand : "rgba(255,255,255,0.35)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  IMG
                </div>
                <div
                  style={{
                    padding: "5px 14px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: modeToggle >= 0.5 ? "#10b981" : "rgba(255,255,255,0.35)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  VID
                </div>
              </div>

              {/* Frame reference slots */}
              <div style={{ display: "flex", gap: 6 }}>
                {/* Slot 1: empty (dashed border with + icon) */}
                <div
                  style={{
                    width: 32,
                    height: 40,
                    borderRadius: 8,
                    border: "1px dashed rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 1.5,
                        background: "rgba(255,255,255,0.2)",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%) rotate(90deg)",
                          width: 6,
                          height: 1.5,
                          background: "rgba(255,255,255,0.2)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Slot 2: filled reference thumbnail */}
                <div
                  style={{
                    width: 32,
                    height: 40,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.12)",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
                  }}
                />
              </div>
            </div>

            {/* Right: Model + Settings + Generate */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Seed display */}
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                seed: 42891
              </span>

              {/* Model chip */}
              <div
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                nano-banana
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Settings */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>

              {/* Generate button with progress ring */}
              <div
                style={{
                  position: "relative",
                  width: 42,
                  height: 34,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 34,
                    borderRadius: 10,
                    background: modeToggle < 0.5 ? COLORS.brand : "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: modeToggle < 0.5
                      ? `0 4px 16px ${COLORS.brand}44`
                      : frame >= 100
                        ? `0 4px ${interpolate(genGlowIntensity, [0, 1], [16, 32])}px rgba(16,185,129,${interpolate(genGlowIntensity, [0, 1], [0.35, 0.7])})`
                        : "0 4px 16px rgba(16,185,129,0.35)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </div>

                {/* SVG progress ring overlay */}
                {frame >= 100 && (
                  <svg
                    width="50"
                    height="42"
                    viewBox="0 0 50 42"
                    style={{
                      position: "absolute",
                      top: -4,
                      left: -4,
                      pointerEvents: "none",
                    }}
                  >
                    <rect
                      x="2"
                      y="2"
                      width="46"
                      height="38"
                      rx="12"
                      ry="12"
                      fill="none"
                      stroke={modeToggle < 0.5 ? COLORS.brand : "#10b981"}
                      strokeWidth="2"
                      strokeDasharray="168"
                      strokeDashoffset={interpolate(genProgress, [0, 1], [168, 0])}
                      strokeLinecap="round"
                      opacity={interpolate(genProgress, [0, 0.05, 0.95, 1], [0, 0.8, 0.8, 0.5], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LEFT TOOLBAR (edit mode) ═══ */}
      {frame >= 85 && (
        <div
          style={{
            position: "absolute",
            left: 50,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 8,
            borderRadius: 18,
            background: "rgba(10, 10, 12, 0.7)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: spring({
              frame: Math.max(0, frame - 85),
              fps,
              config: { damping: 200 },
            }),
            zIndex: 20,
          }}
        >
          {[
            { active: false, label: "view" },
            { active: true, label: "brush" },
            { active: false, label: "compare" },
          ].map((tool, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: tool.active ? `${COLORS.brand}25` : "transparent",
                border: tool.active ? `1px solid ${COLORS.brand}44` : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: tool.label === "brush" ? "50%" : 3,
                  border: `1.5px solid ${tool.active ? COLORS.brand : "rgba(255,255,255,0.25)"}`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ═══ PARAMETER SLIDERS PANEL ═══ */}
      {frame >= 70 && (
        <div
          style={{
            position: "absolute",
            left: 75,
            bottom: 310,
            zIndex: 22,
            background: "rgba(10, 10, 12, 0.75)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            padding: 16,
            width: 200,
            boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
            opacity: paramSpr,
            transform: `translateY(${interpolate(paramSpr, [0, 1], [20, 0])}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontFamily,
          }}
        >
          {paramSliders.map((slider, i) => {
            const fillPct = interpolate(
              frame,
              [72 + i * 5, 72 + i * 5 + 15],
              [0, slider.target],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {/* Label row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {slider.label}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.55)",
                      fontFamily: "monospace",
                    }}
                  >
                    {slider.value}
                  </span>
                </div>
                {/* Track */}
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.06)",
                    position: "relative",
                  }}
                >
                  {/* Fill */}
                  <div
                    style={{
                      width: `${fillPct}%`,
                      height: 4,
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${COLORS.brand}, ${COLORS.brandCyan})`,
                    }}
                  />
                  {/* Thumb */}
                  {fillPct > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: -2,
                        left: `${fillPct}%`,
                        transform: "translateX(-50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "white",
                        boxShadow: `0 0 8px ${COLORS.brand}66`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ TITLE OVERLAY ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: 175,
          left: 75,
          zIndex: 25,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 18,
            color: COLORS.textMuted,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            opacity: titleSpr,
            transform: `translateY(${interpolate(titleSpr, [0, 1], [18, 0])}px)`,
            marginBottom: 6,
          }}
        >
          AI-Powered
        </div>
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 60,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            backgroundClip: "text",
            padding: "0.15em 0.3em",
            margin: "-0.15em -0.3em",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            opacity: subSpr,
            transform: `translateY(${interpolate(subSpr, [0, 1], [25, 0])}px)`,
          }}
        >
          Creative Studio
        </div>
      </div>
    </AbsoluteFill>
  );
};
