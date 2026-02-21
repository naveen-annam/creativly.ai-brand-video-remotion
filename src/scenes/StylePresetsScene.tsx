import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  Easing,
  random,
  interpolateColors,
  Img,
  staticFile,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond, Rotating3DBox } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const STYLES = [
  { name: "Cinematic", color: "#FF5F56", filter: "contrast(1.2) sepia(0.2)" },
  { name: "Anime", color: COLORS.brand, filter: "saturate(1.5) contrast(1.1)" },
  { name: "3D Render", color: "#27C93F", filter: "brightness(1.1)" },
  { name: "Claymation", color: "#3357FF", filter: "contrast(0.9) saturate(0.8)" },
  { name: "Line Art", color: "#A833FF", filter: "grayscale(1) contrast(1.5)" },
  { name: "Photographic", color: "#FF33A8", filter: "none" },
];

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  x: random(`sp-x-${i}`) * 100,
  y: random(`sp-y-${i}`) * 100,
  size: random(`sp-s-${i}`) * 3 + 1,
  speed: random(`sp-sp-${i}`) * 0.5 + 0.2,
}));

const INDICATOR_PATH = "M 0 0 L 200 0";

export const StylePresetsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeStyleIndex = Math.floor(frame / 20) % STYLES.length;
  const activeStyle = STYLES[activeStyleIndex];

  const glowPulse = 0.15 + 0.08 * noise2D("style-glow", frame * 0.02, 0);
  const styleTransition = (frame % 20) / 20;
  const bgBlur = interpolate(styleTransition, [0, 0.1, 0.9, 1], [0, 3, 3, 0]);

  const nextIndex = (activeStyleIndex + 1) % STYLES.length;
  const transColor = interpolateColors(
    styleTransition,
    [0, 0.5, 1],
    [activeStyle.color, activeStyle.color, STYLES[nextIndex].color]
  );

  const indicatorProg = interpolate(styleTransition, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const evolvedIndicator = evolvePath(indicatorProg, INDICATOR_PATH);

  // Title entrances
  const titleSpr = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const titleScale = interpolate(titleSpr, [0, 1], [0.5, 1]);
  const titleBlur = interpolate(titleSpr, [0, 1], [15, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Background watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-15deg)",
          fontFamily,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 400,
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: 0.025,
          letterSpacing: "-0.05em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        STYLES
      </div>

      {/* 3D boxes */}
      <Rotating3DBox size={60} color={`${COLORS.brand}08`} accentColor={`${COLORS.brand}18`} x={120} y={120} speed={0.5} delay={5} noiseId="spb1" />
      <Rotating3DBox size={45} color={`${COLORS.primary}06`} accentColor={`${COLORS.primary}15`} x={1700} y={850} speed={0.8} delay={10} noiseId="spb2" />

      {/* Floating diamonds */}
      <FloatingDiamond size={30} color={`${COLORS.brand}30`} x={200} y={850} speed={0.7} delay={5} noiseId="spd1" glow glowColor={COLORS.brand} />
      <FloatingDiamond size={20} color={`${transColor}25`} x={1650} y={200} speed={1} delay={12} noiseId="spd2" />

      {/* Particles */}
      {PARTICLES.map((p, i) => {
        const drift = noise2D(`spart-${i}`, frame * 0.015 * p.speed, i * 3) * 20;
        const driftY = noise2D(`sparty-${i}`, i * 3, frame * 0.015 * p.speed) * 20;
        const pulse = Math.sin(frame * 0.06 + i * 2) * 0.3 + 0.5;

        return (
          <div
            key={`p-${i}`}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: transColor,
              opacity: pulse * 0.25,
              transform: `translate(${drift}px, ${driftY}px)`,
            }}
          />
        );
      })}

      {/* Dynamic glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "120%",
          height: "120%",
          background: `radial-gradient(circle, ${transColor}${Math.floor(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(100px)",
        }}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Background image */}
        <div style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.35 }}>
          <Img
            src={staticFile("surrealist-concept_800w.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: `${activeStyle.filter} blur(${bgBlur}px)` }}
          />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 0%, #050505 100%)" }} />
        </div>

        <div style={{ zIndex: 10, textAlign: "center" }}>
          {/* "style" - tiny italic */}
          <Sequence from={0} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 24,
                color: COLORS.textMuted,
                letterSpacing: "0.2em",
                textTransform: "lowercase",
                marginBottom: 5,
                opacity: titleSpr,
                transform: `scale(${titleScale})`,
                filter: titleBlur > 0.5 ? `blur(${titleBlur}px)` : undefined,
              }}
            >
              curated
            </div>
          </Sequence>

          {/* "PRESETS" - MASSIVE */}
          <Sequence from={0} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 140,
                color: COLORS.text,
                marginBottom: 10,
                textShadow: `0 0 60px ${transColor}33`,
                opacity: titleSpr,
                transform: `scale(${titleScale})`,
                filter: titleBlur > 0.5 ? `blur(${titleBlur}px)` : undefined,
                letterSpacing: "-0.04em",
              }}
            >
              <SplitText
                text="Style Presets"
                delay={0}
                stagger={3}
                direction="up"
                springConfig={{ damping: 16, stiffness: 140, mass: 0.5 }}
              />
            </div>
          </Sequence>

          {/* "transform everything" tiny italic yellow */}
          <Sequence from={5} layout="none">
            {(() => {
              const subSpr = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 16, stiffness: 100 } });
              return (
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontSize: 20,
                    background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    padding: "0.15em 0.3em",
                    backgroundClip: "text",
                    letterSpacing: "0.1em",
                    marginBottom: 40,
                    opacity: subSpr,
                    transform: `translateY(${interpolate(subSpr, [0, 1], [10, 0])}px)`,
                  }}
                >
                  transform everything
                </div>
              );
            })()}
          </Sequence>

          {/* Style buttons */}
          <Sequence from={8} layout="none">
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", width: 1200 }}>
              {STYLES.map((style, i) => {
                const isActive = i === activeStyleIndex;
                const entranceSpr = spring({
                  frame: Math.max(0, frame - 8 - i * 4),
                  fps,
                  config: { stiffness: 180, damping: 18, mass: 0.5 },
                });
                const activeScale = isActive ? 1.12 + 0.02 * Math.sin(frame * 0.2) : 1;
                const entranceBlur = interpolate(entranceSpr, [0, 1], [8, 0]);
                const glowNoise = isActive ? noise2D(`btn-${i}`, frame * 0.03, i) * 5 : 0;

                return (
                  <div
                    key={i}
                    style={{
                      padding: "16px 40px",
                      borderRadius: 100,
                      background: isActive ? style.color : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isActive ? style.color : "rgba(255,255,255,0.1)"}`,
                      color: isActive ? "#000" : COLORS.textMuted,
                      fontFamily,
                      fontWeight: isActive ? 900 : 700,
                      fontStyle: isActive ? "italic" : "normal",
                      fontSize: 32,
                      transform: `scale(${activeScale * entranceSpr})`,
                      opacity: entranceSpr,
                      filter: entranceBlur > 0.5 ? `blur(${entranceBlur}px)` : undefined,
                      boxShadow: isActive
                        ? `0 0 ${40 + glowNoise}px ${style.color}66, 0 0 ${80 + glowNoise * 2}px ${style.color}22`
                        : "none",
                    }}
                  >
                    {style.name}
                  </div>
                );
              })}
            </div>
          </Sequence>

          {/* Indicator line */}
          <Sequence from={12} layout="none">
            <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
              <svg width="200" height="8" viewBox="-5 -4 210 8">
                <path
                  d={INDICATOR_PATH}
                  fill="none"
                  stroke={transColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.8"
                  strokeDasharray={evolvedIndicator.strokeDasharray}
                  strokeDashoffset={evolvedIndicator.strokeDashoffset}
                />
              </svg>
            </div>
          </Sequence>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
