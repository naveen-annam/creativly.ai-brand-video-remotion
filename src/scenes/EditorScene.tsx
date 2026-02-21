import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import {
  makeTransform,
  translateY,
  scale as scaleTf,
  rotateX,
} from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS, EASING } from "../constants";
import { BrowserWindow } from "../components/BrowserWindow";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "800", "900"],
  subsets: ["latin"],
});

// Playhead path (vertical line)
const PLAYHEAD_PATH = "M 0 -120 L 0 950";

export const EditorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Entrance: scale + blur + Y ──
  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 70, mass: 0.6 },
  });
  const y = interpolate(entrance, [0, 1], [150, 0]);
  const entranceScale = interpolate(entrance, [0, 1], [0.8, 1]);
  const entranceBlur = interpolate(entrance, [0, 1], [12, 0]);

  // ── Layer separation with easing ──
  const layerSep = interpolate(frame, [20, 100], [0, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING.cinematic,
  });

  // ── Playhead position ──
  const playheadX = interpolate(frame, [0, 100], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // ── Playhead glow with noise ──
  const playheadGlow = 20 + 10 * noise2D("playhead", frame * 0.03, 0);

  // ── Playhead path draw ──
  const playheadProg = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedPlayhead = evolvePath(playheadProg, PLAYHEAD_PATH);

  // ── Track clip colors ──
  const clipColors = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.secondary];

  // ── Background "EDIT" text animation ──
  const bgTextEntrance = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 30, stiffness: 40, mass: 1.2 },
  });
  const bgTextScale = interpolate(bgTextEntrance, [0, 1], [0.7, 1]);
  const bgTextRotation = interpolate(bgTextEntrance, [0, 1], [-8, -6]);
  const bgTextY = interpolate(bgTextEntrance, [0, 1], [80, 0]);

  // ── Yellow accent glow under browser window ──
  const glowEntrance = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 20, stiffness: 50, mass: 0.8 },
  });
  const glowOpacity = interpolate(glowEntrance, [0, 1], [0, 0.35]);
  const glowScale = interpolate(glowEntrance, [0, 1], [0.6, 1]);
  const glowPulse = 1 + noise2D("glow-pulse", frame * 0.02, 0) * 0.08;

  // ── Secondary label animation ──
  const secondaryLabelSpr = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.5 },
  });
  const secondaryLabelY = interpolate(secondaryLabelSpr, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgWhite,
        justifyContent: "center",
        alignItems: "center",
        perspective: 1500,
        overflow: "hidden",
      }}
    >
      {/* ── Massive background "EDIT" text ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${bgTextScale}) rotate(${bgTextRotation}deg) translateY(${bgTextY}px)`,
          fontFamily,
          fontSize: 400,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: 0.04 * bgTextEntrance,
          letterSpacing: "0.05em",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        EDIT
      </div>

      {/* ── Floating Diamonds scattered around ── */}
      <FloatingDiamond
        x={120}
        y={80}
        size={45}
        color="rgba(255,214,0,0.18)"
        speed={0.7}
        delay={5}
        noiseId="dia-tl"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        x={1680}
        y={150}
        size={35}
        color="rgba(255,214,0,0.14)"
        speed={1.1}
        delay={8}
        noiseId="dia-tr"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        x={1750}
        y={750}
        size={50}
        color="rgba(255,214,0,0.2)"
        speed={0.5}
        delay={12}
        noiseId="dia-br"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        x={80}
        y={800}
        size={30}
        color="rgba(255,214,0,0.12)"
        speed={0.9}
        delay={15}
        noiseId="dia-bl"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        x={950}
        y={50}
        size={25}
        color="rgba(255,214,0,0.1)"
        speed={1.3}
        delay={10}
        noiseId="dia-tc"
        glow
        glowColor={COLORS.brandLight}
      />
      <FloatingDiamond
        x={200}
        y={450}
        size={20}
        color="rgba(255,214,0,0.08)"
        speed={1.5}
        delay={20}
        noiseId="dia-ml"
      />
      <FloatingDiamond
        x={1600}
        y={500}
        size={28}
        color="rgba(255,214,0,0.15)"
        speed={0.6}
        delay={18}
        noiseId="dia-mr"
        glow
        glowColor={COLORS.brandDark}
      />

      {/* ── Stage 1: 3D editor entrance ── */}
      <Sequence from={0} layout="none">
        <div
          style={{
            width: 1500,
            height: 900,
            transform: makeTransform([
              translateY(y),
              scaleTf(entranceScale),
              rotateX("15deg"),
            ]),
            transformStyle: "preserve-3d",
            position: "relative",
            filter: `blur(${entranceBlur}px)`,
          }}
        >
          {/* ── Yellow accent glow under browser window ── */}
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: "15%",
              right: "15%",
              height: 180,
              background: `radial-gradient(ellipse at center, ${COLORS.brand}25 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
              opacity: glowOpacity * glowPulse,
              transform: `scaleX(${glowScale * 1.2}) scaleY(${glowScale * 0.8})`,
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: -1,
            }}
          />

          {/* ── Base layer: browser window ── */}
          <div
            style={{
              transform: "translateZ(0px)",
              width: "100%",
              height: "100%",
            }}
          >
            <BrowserWindow title="Pro Video Editor">
              <Img
                src={staticFile("timeline-editor.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))",
                }}
              />
            </BrowserWindow>
          </div>

          {/* ── Stage 2: Floating timeline layer with staggered clip reveals ── */}
          <Sequence from={15} layout="none">
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "45%",
                background: "rgba(20,20,20,0.8)",
                borderTop: `1px solid ${COLORS.accent}`,
                transform: `translateZ(${layerSep}px)`,
                boxShadow: `0 -20px 50px rgba(0,0,0,0.5), 0 0 40px ${COLORS.accent}11`,
                backdropFilter: "blur(8px)",
                pointerEvents: "none",
                borderRadius: "0 0 16px 16px",
              }}
            >
              {[0, 1, 2, 3].map((track) => (
                <div
                  key={track}
                  style={{
                    position: "absolute",
                    left: 120,
                    right: 40,
                    top: 20 + track * 80,
                    height: 60,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  {[0, 1, 2].map((clip) => {
                    const clipWidth =
                      80 + Math.sin(track * 3 + clip * 7) * 40;
                    const clipLeft = clip * 160 + track * 20;
                    const clipColor = clipColors[track];

                    // Staggered clip entrance
                    const clipSpr = spring({
                      frame: Math.max(
                        0,
                        frame - 20 - track * 6 - clip * 3,
                      ),
                      fps,
                      config: {
                        damping: 16,
                        stiffness: 120,
                        mass: 0.4,
                      },
                    });
                    const clipOp = interpolate(clipSpr, [0, 1], [0, 0.6]);
                    const clipScale = interpolate(
                      clipSpr,
                      [0, 1],
                      [0.5, 1],
                    );

                    // Noise micro-drift
                    const microDrift =
                      noise2D(
                        `clip-${track}-${clip}`,
                        frame * 0.01,
                        track * 3 + clip,
                      ) * 2;

                    return (
                      <div
                        key={clip}
                        style={{
                          position: "absolute",
                          left: clipLeft + microDrift,
                          width: clipWidth,
                          height: 40,
                          top: 10,
                          background: `${clipColor}33`,
                          border: `1px solid ${clipColor}55`,
                          borderRadius: 6,
                          opacity: clipOp,
                          transform: `scaleX(${clipScale})`,
                          transformOrigin: "left center",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </Sequence>

          {/* ── Stage 3: Playhead with path draw ── */}
          <Sequence from={10} layout="none">
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "30%",
                transform: `translateX(${playheadX}px) translateZ(${layerSep + 40}px)`,
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <svg
                width="20"
                height="1050"
                viewBox="-10 -120 20 1070"
                style={{ position: "absolute", left: -10, top: 0 }}
              >
                <path
                  d={PLAYHEAD_PATH}
                  fill="none"
                  stroke={COLORS.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={evolvedPlayhead.strokeDasharray}
                  strokeDashoffset={evolvedPlayhead.strokeDashoffset}
                />
              </svg>
              {/* Playhead diamond */}
              <div
                style={{
                  position: "absolute",
                  top: -8,
                  left: -8,
                  width: 19,
                  height: 19,
                  background: COLORS.accent,
                  transform: "rotate(45deg)",
                  boxShadow: `0 0 ${playheadGlow}px ${COLORS.accent}`,
                  opacity: playheadProg,
                }}
              />
            </div>
          </Sequence>

          {/* ── Stage 4: Dramatic floating label with SplitText ── */}
          <Sequence from={8} layout="none">
            {(() => {
              const labelSpr = spring({
                frame: Math.max(0, frame - 8),
                fps,
                config: { damping: 16, stiffness: 80 },
              });
              const labelScale = interpolate(
                labelSpr,
                [0, 1],
                [0.85, 1],
              );
              const labelRotateY = interpolate(
                labelSpr,
                [0, 1],
                [-20, -10],
              );
              return (
                <div
                  style={{
                    position: "absolute",
                    left: -100,
                    bottom: 180,
                    transform: `translateZ(100px) rotateY(${labelRotateY}deg) scale(${labelScale})`,
                    background: COLORS.bgWhite,
                    padding: "36px 56px 28px",
                    borderRadius: 28,
                    border: `1px solid ${COLORS.borderDark}`,
                    boxShadow: `0 30px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)`,
                    opacity: labelSpr,
                  }}
                >
                  {/* "PROFESSIONAL" small italic label */}
                  <div
                    style={{
                      fontFamily,
                      fontSize: 24,
                      fontStyle: "italic",
                      background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      padding: "0.15em 0.3em",
                      backgroundClip: "text",
                      marginBottom: 4,
                      letterSpacing: "0.15em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      opacity: interpolate(labelSpr, [0, 1], [0, 0.9]),
                    }}
                  >
                    PROFESSIONAL
                  </div>

                  {/* "Video Editing" HUGE dramatic text */}
                  <div
                    style={{
                      fontFamily,
                      fontSize: 70,
                      fontStyle: "italic",
                      color: COLORS.textBlack,
                      fontWeight: 900,
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    <SplitText
                      text="Video Editing"
                      delay={2}
                      stagger={3}
                      direction="up"
                      springConfig={{
                        damping: 16,
                        stiffness: 140,
                        mass: 0.5,
                      }}
                    />
                  </div>

                  {/* "timeline precision" secondary tiny label */}
                  <div
                    style={{
                      fontFamily,
                      fontSize: 15,
                      fontStyle: "italic",
                      background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      padding: "0.15em 0.3em",
                      backgroundClip: "text",
                      fontWeight: 400,
                      letterSpacing: "0.2em",
                      textTransform: "lowercase",
                      marginTop: 10,
                      opacity: secondaryLabelSpr * 0.7,
                      transform: `translateY(${secondaryLabelY}px)`,
                    }}
                  >
                    timeline precision
                  </div>
                </div>
              );
            })()}
          </Sequence>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
