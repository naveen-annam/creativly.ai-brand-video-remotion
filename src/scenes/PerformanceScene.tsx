import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  random,
  interpolateColors,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeTriangle } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { CharacterReveal } from "../components/CharacterReveal";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

// Speed arrow particles - more of them, faster
const SPEED_ARROWS = Array.from({ length: 14 }, (_, i) => ({
  y: random(`perf-ay-${i}`) * 90 + 5,
  speed: random(`perf-as-${i}`) * 80 + 40,
  size: random(`perf-sz-${i}`) * 14 + 8,
  delay: random(`perf-ad-${i}`) * 20,
  isYellow: random(`perf-yel-${i}`) > 0.5,
}));

// Radial burst particles - more density
const BURST_PARTICLES = Array.from({ length: 32 }, (_, i) => ({
  angle: (i / 32) * Math.PI * 2,
  dist: random(`perf-bd-${i}`) * 280 + 80,
  size: random(`perf-bs-${i}`) * 4 + 1.5,
  speed: random(`perf-bsp-${i}`) * 0.5 + 0.3,
  isYellow: random(`perf-byel-${i}`) > 0.4,
}));

// Floating diamond configs
const DIAMONDS = Array.from({ length: 7 }, (_, i) => ({
  x: random(`dia-x-${i}`) * 1800 + 60,
  y: random(`dia-y-${i}`) * 900 + 90,
  size: random(`dia-s-${i}`) * 40 + 25,
  speed: random(`dia-sp-${i}`) * 1.5 + 0.5,
  delay: Math.floor(random(`dia-d-${i}`) * 15),
  isYellow: random(`dia-yel-${i}`) > 0.35,
}));

// Progress bar SVG path
const BAR_PATH = "M 0 0 L 1000 0";

export const PerformanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();

  // Main progress spring
  const progress = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 50, mass: 0.5 },
  });

  const widthPct = interpolate(progress, [0, 1], [0, 100]);
  const counter = Math.floor(interpolate(progress, [0, 1], [0, 100]));

  // Shake with noise (organic, decays as progress completes)
  const shakeIntensity = interpolate(progress, [0, 0.5, 1], [1, 0.6, 0]);
  const shakeX = noise2D("perf-shake", frame * 0.1, 0) * shakeIntensity * 14;
  const shakeY = noise2D("perf-shakey", 0, frame * 0.1) * shakeIntensity * 8;

  // Progress bar path evolution
  const barDraw = interpolate(frame, [8, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedBar = evolvePath(barDraw, BAR_PATH);

  // Bar gradient: yellow-dominant
  const barColorStart = interpolateColors(frame, [0, 35, 75], [
    COLORS.brand,
    COLORS.brandDark,
    COLORS.brand,
  ]);
  // Counter color: bright yellow
  const counterColor = interpolateColors(frame, [5, 40, 75], [
    COLORS.brandDark,
    COLORS.brand,
    COLORS.brand,
  ]);

  // Background watermark rotation and drift
  const watermarkRotate = interpolate(frame, [0, 90], [-8, -6], {
    extrapolateRight: "clamp",
  });
  const watermarkY = interpolate(frame, [0, 90], [0, -15], {
    extrapolateRight: "clamp",
  });
  const watermarkOpacity = interpolate(frame, [0, 10, 70, 90], [0, 0.03, 0.03, 0.01], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "FAST" horizontal offset spring
  const fastOffset = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });
  const fastX = interpolate(fastOffset, [0, 1], [-60, 120]);

  // "blazing speed" entrance
  const blazingSpr = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.5 },
  });
  const blazingBlur = interpolate(blazingSpr, [0, 1], [10, 0]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bgWhite, overflow: "hidden" }}
    >
      {/* Background watermark "SPEED" */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, calc(-50% + ${watermarkY}px)) rotate(${watermarkRotate}deg)`,
          fontFamily,
          fontSize: 500,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: watermarkOpacity,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-0.02em",
        }}
      >
        SPEED
      </div>

      {/* Speed lines with noise variation - yellow palette added */}
      <Sequence from={0} layout="none">
        {new Array(40).fill(0).map((_, i) => {
          const baseSpeed = (i + 1) * 45;
          const noiseSpeed = noise2D(`spd-${i}`, frame * 0.02, i * 2) * 18;
          const x =
            ((frame * (baseSpeed + noiseSpeed * 10) + i * 100) %
              (width + 600)) -
            300;
          const lineOpacity =
            0.25 + noise2D(`spdo-${i}`, frame * 0.03, i) * 0.18;
          const isYellow = i % 3 === 0;
          const lineColor = isYellow ? COLORS.brand : COLORS.primary;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${(i / 40) * 100}%`,
                left: x,
                width:
                  450 + noise2D(`spdw-${i}`, i * 2, frame * 0.01) * 250,
                height: isYellow ? 3 : 2,
                background: `linear-gradient(90deg, transparent, ${lineColor}50, transparent)`,
                opacity: lineOpacity,
              }}
            />
          );
        })}
      </Sequence>

      {/* Speed arrow triangles along edges - yellow mix */}
      <Sequence from={3} layout="none">
        {SPEED_ARROWS.map((arrow, i) => {
          const tri = makeTriangle({
            length: arrow.size,
            direction: "right",
          });
          const x =
            ((frame * arrow.speed + arrow.delay * 30) % (width + 200)) - 100;
          const arrowOp = interpolate(
            Math.sin(frame * 0.12 + i * 3),
            [-1, 1],
            [0.08, 0.45]
          );
          const arrowColor = arrow.isYellow ? COLORS.brand : COLORS.primary;

          return (
            <svg
              key={`arrow-${i}`}
              width={arrow.size}
              height={arrow.size}
              viewBox={`0 0 ${tri.width} ${tri.height}`}
              style={{
                position: "absolute",
                top: `${arrow.y}%`,
                left: x,
                opacity: arrowOp,
                filter: `drop-shadow(0 0 6px ${arrowColor}55)`,
              }}
            >
              <path d={tri.path} fill={arrowColor} opacity="0.35" />
            </svg>
          );
        })}
      </Sequence>

      {/* Radial energy rings with noise perturbation */}
      <Sequence from={0} layout="none">
        {new Array(5).fill(0).map((_, i) => {
          const ringFrame = frame - i * 8;
          const ringScale = interpolate(ringFrame, [0, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const ringOp = interpolate(
            ringFrame,
            [0, 8, 45],
            [0, 0.22, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          const wobbleX =
            noise2D(`ring-${i}`, frame * 0.02, i * 5) * 6;
          const wobbleY =
            noise2D(`ringy-${i}`, i * 5, frame * 0.02) * 6;
          const ringColor = i % 2 === 0 ? barColorStart : COLORS.brand;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 1800 * ringScale,
                height: 1800 * ringScale,
                borderRadius: "50%",
                border: `2px solid ${ringColor}`,
                transform: `translate(calc(-50% + ${wobbleX}px), calc(-50% + ${wobbleY}px))`,
                opacity: ringOp,
              }}
            />
          );
        })}
      </Sequence>

      {/* Burst particles radiating outward */}
      <Sequence from={8} layout="none">
        {BURST_PARTICLES.map((p, i) => {
          const burstProg = interpolate(frame, [8, 55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const dist = p.dist * burstProg;
          const noiseDist =
            noise2D(`burst-${i}`, frame * 0.02, i * 3) * 20;
          const x = Math.cos(p.angle) * (dist + noiseDist);
          const y = Math.sin(p.angle) * (dist + noiseDist);
          const particleOp = interpolate(
            burstProg,
            [0, 0.25, 1],
            [0, 0.55, 0]
          );
          const particleColor = p.isYellow
            ? COLORS.brand
            : barColorStart;
          const particleBg = p.isYellow
            ? "linear-gradient(135deg, #3B82F6, #06B6D4)"
            : barColorStart;

          return (
            <div
              key={`burst-${i}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: particleBg,
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                opacity: particleOp,
                boxShadow: `0 0 6px ${particleColor}`,
              }}
            />
          );
        })}
      </Sequence>

      {/* FloatingDiamond 3D elements flying across the scene */}
      <Sequence from={2} layout="none">
        {DIAMONDS.map((d, i) => (
          <FloatingDiamond
            key={`diamond-${i}`}
            x={d.x}
            y={d.y}
            size={d.size}
            speed={d.speed}
            delay={d.delay}
            noiseId={`perf-dia-${i}`}
            color={
              d.isYellow
                ? "rgba(255,214,0,0.25)"
                : "rgba(59,130,246,0.15)"
            }
            glow={d.isYellow}
            glowColor={COLORS.brand}
          />
        ))}
      </Sequence>

      {/* Main content area with shake */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Kinetic typography block */}
        <Sequence from={0} layout="none">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* "LIGHTNING" - 220px, italic, skewed -18deg, weight 900 */}
            <div
              style={{
                fontFamily,
                fontSize: 220,
                fontStyle: "italic",
                fontWeight: 900,
                color: COLORS.textBlack,
                transform: `skewX(-18deg) scale(${interpolate(progress, [0, 1], [0.75, 1])})`,
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
              }}
            >
              <CharacterReveal
                text="LIGHTNING"
                delay={0}
                stagger={1.5}
                springConfig={{ damping: 11, stiffness: 120, mass: 0.35 }}
                offsetY={60}
                blur
              />
            </div>

            {/* "FAST" - 300px, yellow, italic, bold, offset right */}
            <div
              style={{
                fontFamily,
                fontSize: 300,
                fontStyle: "italic",
                fontWeight: 900,
                transform: `skewX(-18deg) translateX(${fastX}px) scale(${interpolate(progress, [0, 1], [0.7, 1])})`,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                overflow: "visible",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.2em 0.4em",
                backgroundClip: "text",
              }}
            >
              FAST
            </div>

            {/* "blazing speed" tiny text */}
            <div
              style={{
                fontFamily,
                fontSize: 18,
                fontStyle: "italic",
                fontWeight: 700,
                color: COLORS.textMutedDark,
                opacity: blazingSpr,
                filter: blazingBlur > 0.2 ? `blur(${blazingBlur}px)` : undefined,
                transform: `skewX(-18deg) translateX(${interpolate(fastOffset, [0, 1], [-40, 140])}px)`,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              blazing speed
            </div>
          </div>
        </Sequence>

        {/* Progress Bar with yellow gradient */}
        <Sequence from={5} layout="none">
          <div style={{ position: "relative" }}>
            {/* SVG outline path draw */}
            <svg
              width="1000"
              height="6"
              viewBox="-2 -3 1004 6"
              style={{ position: "absolute", top: -10, left: 0 }}
            >
              <path
                d={BAR_PATH}
                strokeDasharray={evolvedBar.strokeDasharray}
                strokeDashoffset={evolvedBar.strokeDashoffset}
                fill="none"
                stroke={COLORS.brand}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>

            <div
              style={{
                width: 1000,
                height: 36,
                background: COLORS.bgSurfaceLight,
                borderRadius: 18,
                padding: 6,
                border: `1px solid ${COLORS.borderDark}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${widthPct}%`,
                  background: `linear-gradient(90deg, ${COLORS.brandDark}, ${COLORS.brand}, ${COLORS.brandCyan})`,
                  borderRadius: 12,
                  boxShadow: `0 0 40px ${COLORS.brand}55, 0 0 12px ${COLORS.brandDark}44`,
                  position: "relative",
                }}
              >
                {/* Shimmer with noise variation */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) ${50 + noise2D("shimmer", frame * 0.06, 0) * 30}%, transparent 100%)`,
                    borderRadius: 12,
                  }}
                />
              </div>
            </div>

            {/* Glowing dot at the bar's leading edge */}
            {widthPct > 2 && (
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: `${widthPct * 0.1 - 0.6}%`,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  opacity: interpolate(
                    Math.sin(frame * 0.3),
                    [-1, 1],
                    [0.4, 0.9]
                  ),
                  boxShadow: `0 0 20px ${COLORS.brand}, 0 0 40px ${COLORS.brand}88`,
                  transform: "translateX(-50%)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </Sequence>

        {/* Counter text: "Rendered in" small, percentage BIG yellow italic */}
        <Sequence from={8} layout="none">
          {(() => {
            const textSpr = spring({
              frame: Math.max(0, frame - 8),
              fps,
              config: { damping: 14, stiffness: 100 },
            });
            const textBlur = interpolate(textSpr, [0, 1], [8, 0]);

            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 16,
                  opacity: textSpr,
                  filter:
                    textBlur > 0.2 ? `blur(${textBlur}px)` : undefined,
                }}
              >
                <span
                  style={{
                    fontFamily,
                    fontSize: 36,
                    fontWeight: 700,
                    color: COLORS.textMutedDark,
                  }}
                >
                  Rendered in
                </span>
                <span
                  style={{
                    fontFamily,
                    fontSize: 80,
                    fontWeight: 900,
                    fontStyle: "italic",
                    color: counterColor,
                    fontVariantNumeric: "tabular-nums",
                    textShadow: `0 0 30px ${COLORS.brand}44`,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {counter}%
                </span>
                <span
                  style={{
                    fontFamily,
                    fontSize: 36,
                    fontWeight: 700,
                    color: COLORS.textMutedDark,
                  }}
                >
                  Real-time
                </span>
              </div>
            );
          })()}
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
