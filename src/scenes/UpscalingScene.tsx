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
  Img,
  staticFile,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeStar } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

// Sparkles along the scan edge
const SCAN_SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  yPct: random(`up-y-${i}`) * 100,
  size: random(`up-s-${i}`) * 6 + 3,
  offsetX: (random(`up-ox-${i}`) - 0.5) * 40,
  speed: random(`up-sp-${i}`) * 0.3 + 0.15,
  phase: random(`up-ph-${i}`) * Math.PI * 2,
}));

// Extra ambient sparkles scattered across the sharp (upscaled) side
const AMBIENT_SPARKLES = Array.from({ length: 10 }, (_, i) => ({
  xPct: random(`amb-x-${i}`) * 45,
  yPct: random(`amb-y-${i}`) * 100,
  size: random(`amb-sz-${i}`) * 4 + 2,
  speed: random(`amb-sp-${i}`) * 0.2 + 0.1,
  phase: random(`amb-ph-${i}`) * Math.PI * 2,
}));

// Scan line SVG path (vertical)
const SCAN_LINE_PATH = "M 0 0 L 0 1080";

// Diamond 3D elements configuration
const DIAMONDS = [
  { x: 80, y: 120, size: 40, speed: 0.8, delay: 5, noiseId: "up-d1" },
  { x: 1780, y: 200, size: 55, speed: 1.2, delay: 12, noiseId: "up-d2" },
  { x: 150, y: 850, size: 35, speed: 0.6, delay: 20, noiseId: "up-d3" },
  { x: 1700, y: 780, size: 48, speed: 1.0, delay: 8, noiseId: "up-d4" },
  { x: 960, y: 60, size: 30, speed: 1.4, delay: 25, noiseId: "up-d5" },
  { x: 1850, y: 500, size: 38, speed: 0.9, delay: 18, noiseId: "up-d6" },
];

export const UpscalingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scan sweep with cinematic easing ──
  const scan = interpolate(frame, [15, 85], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // ── Scan line path draw ──
  const scanDraw = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedScan = evolvePath(scanDraw, SCAN_LINE_PATH);

  // ── Pixel grid opacity with noise ──
  const pixelGridBase = interpolate(scan, [0, 40], [0.5, 0.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pixelGridOp =
    pixelGridBase + noise2D("pixgrid", frame * 0.02, 0) * 0.05;

  // ── Counter: 1x -> 8x with easing ──
  const counterRaw = interpolate(frame, [20, 80], [1, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const enhancementPct = Math.floor(counterRaw * 100);

  // ── Scan glow color shift (yellow-themed) ──
  const scanColor = interpolateColors(
    frame,
    [15, 50, 85],
    [COLORS.brand, "#06B6D4", COLORS.brand]
  );

  // ── Badge entrance spring ──
  const badgeSpr = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.5 },
  });
  const badgeBlur = interpolate(badgeSpr, [0, 1], [12, 0]);
  const badgeScale = interpolate(badgeSpr, [0, 1], [0.6, 1]);

  // ── "8K" text entrance ──
  const eightKSpr = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const eightKScale = interpolate(eightKSpr, [0, 1], [0.3, 1]);
  const eightKGlow = interpolate(eightKSpr, [0, 1], [0, 80]);

  // ── "HD" text fade-out as scan progresses ──
  const hdOpacity = interpolate(scan, [0, 60], [0.5, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── "UPSCALE" watermark entrance ──
  const watermarkSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 40, mass: 1.2 },
  });
  const watermarkScale = interpolate(watermarkSpr, [0, 1], [0.85, 1]);
  const watermarkOp = interpolate(watermarkSpr, [0, 1], [0, 0.04]);

  // ── Counter section entrance ──
  const counterSpr = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  // ── "pixel perfect" text entrance ──
  const pixelPerfectSpr = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.4 },
  });

  // ── Pulsing glow on 8K text ──
  const pulseGlow =
    eightKGlow + Math.sin(frame * 0.12) * 15 * eightKSpr;

  // ── Scan line shimmer ──
  const scanLineWidth = 6 + Math.sin(frame * 0.2) * 2;

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bgWhite, overflow: "hidden" }}
    >
      {/* ── "UPSCALE" background watermark ── */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 350,
            fontStyle: "italic",
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            padding: "0.15em 0.3em",
            backgroundClip: "text",
            opacity: watermarkOp,
            transform: `scale(${watermarkScale})`,
            letterSpacing: -8,
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          UPSCALE
        </div>
      </AbsoluteFill>

      {/* ── FloatingDiamond 3D elements ── */}
      {DIAMONDS.map((d, i) => (
        <FloatingDiamond
          key={`diamond-${i}`}
          x={d.x}
          y={d.y}
          size={d.size}
          speed={d.speed}
          delay={d.delay}
          noiseId={d.noiseId}
          color={`rgba(255,214,0,${0.15 + (i % 3) * 0.08})`}
          glow
          glowColor={COLORS.brand}
        />
      ))}

      {/* ── Full-width before/after comparison ── */}
      <Sequence from={0} layout="none">
        <AbsoluteFill>
          {/* Blurry base (full width - the "before") */}
          <Img
            src={staticFile("character-performance_800w.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(10px)",
              transform: "scale(1.1)",
            }}
          />

          {/* Pixel grid overlay on blurry side with noise */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              opacity: Math.max(0, pixelGridOp),
              clipPath: `polygon(${scan}% 0, 100% 0, 100% 100%, ${scan}% 100%)`,
            }}
          />

          {/* Sharp overlay sweeping across (the "after") */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: `${scan}%`,
              overflow: "hidden",
            }}
          >
            <Img
              src={staticFile("character-performance_800w.jpg")}
              style={{
                width: 1920,
                height: 1080,
                maxWidth: "none",
                objectFit: "cover",
                transform: "scale(1.1)",
                filter: "contrast(1.2) saturate(1.1)",
              }}
            />
          </div>

          {/* ── Scan line with evolvePath SVG ── */}
          <Sequence from={8} layout="none">
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${scan}%`,
                transform: "translateX(-3px)",
                zIndex: 10,
              }}
            >
              {/* Wide glow behind line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: -30,
                  width: 66,
                  background: `linear-gradient(90deg, transparent, ${scanColor}33, ${scanColor}99, ${scanColor}33, transparent)`,
                  filter: "blur(12px)",
                }}
              />
              {/* SVG scan line path draw */}
              <svg
                width="8"
                height="1080"
                viewBox="0 0 8 1080"
                style={{ position: "absolute", left: 0, top: 0 }}
              >
                <path
                  d={SCAN_LINE_PATH}
                  strokeDasharray={evolvedScan.strokeDasharray}
                  strokeDashoffset={evolvedScan.strokeDashoffset}
                  fill="none"
                  stroke={scanColor}
                  strokeWidth={scanLineWidth}
                  strokeLinecap="round"
                  transform="translate(4,0)"
                />
              </svg>
            </div>
          </Sequence>

          {/* ── Star sparkles along scan edge with noise drift ── */}
          <Sequence from={12} layout="none">
            {SCAN_SPARKLES.map((s, i) => {
              const star = makeStar({
                points: 4,
                innerRadius: s.size * 0.3,
                outerRadius: s.size,
              });
              const sparkleOp =
                Math.sin(frame * s.speed * 2 + s.phase + i * 3) * 0.5 + 0.5;
              const drift =
                noise2D(`updrift-${i}`, frame * 0.02, i * 5) * s.offsetX;
              const driftY =
                noise2D(`updrifty-${i}`, i * 5, frame * 0.02) * 10;

              return (
                <svg
                  key={`sparkle-${i}`}
                  width={s.size * 3}
                  height={s.size * 3}
                  viewBox={`0 0 ${star.width} ${star.height}`}
                  style={{
                    position: "absolute",
                    left: `calc(${scan}% + ${drift}px)`,
                    top: `calc(${s.yPct}% + ${driftY}px)`,
                    opacity: sparkleOp * 0.85,
                    transform: `translate(-50%, -50%) rotate(${frame * s.speed * 3}deg)`,
                    zIndex: 11,
                    filter: `drop-shadow(0 0 ${s.size + 2}px ${scanColor})`,
                  }}
                >
                  <path d={star.path} fill="white" />
                </svg>
              );
            })}
          </Sequence>

          {/* ── Ambient sparkles on the upscaled side ── */}
          <Sequence from={20} layout="none">
            {AMBIENT_SPARKLES.map((s, i) => {
              const star = makeStar({
                points: 4,
                innerRadius: s.size * 0.25,
                outerRadius: s.size,
              });
              const sparkleOp =
                Math.sin(frame * s.speed * 2 + s.phase) * 0.5 + 0.5;
              const isVisible = s.xPct < scan;

              if (!isVisible) return null;

              return (
                <svg
                  key={`amb-sparkle-${i}`}
                  width={s.size * 3}
                  height={s.size * 3}
                  viewBox={`0 0 ${star.width} ${star.height}`}
                  style={{
                    position: "absolute",
                    left: `${s.xPct}%`,
                    top: `${s.yPct}%`,
                    opacity: sparkleOp * 0.4,
                    transform: `translate(-50%, -50%) rotate(${frame * s.speed * 4 + i * 45}deg)`,
                    zIndex: 5,
                    filter: `drop-shadow(0 0 ${s.size}px ${COLORS.brand}88)`,
                  }}
                >
                  <path d={star.path} fill={COLORS.brand} />
                </svg>
              );
            })}
          </Sequence>
        </AbsoluteFill>
      </Sequence>

      {/* ── Text overlays layer ── */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {/* HD (small, muted) and 8K (MASSIVE, yellow, glowing) labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            width: "80%",
            fontFamily,
          }}
        >
          {/* HD - small and muted */}
          <div
            style={{
              fontWeight: 900,
              fontSize: 100,
              color: COLORS.textMuted,
              opacity: hdOpacity,
              textShadow: "0 4px 20px rgba(0,0,0,0.2)",
              letterSpacing: 2,
            }}
          >
            HD
          </div>

          {/* 8K - MASSIVE, yellow, italic, weight 900, glow */}
          <div
            style={{
              fontWeight: 900,
              fontSize: 240,
              fontStyle: "italic",
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              padding: "0.15em 0.3em",
              backgroundClip: "text",
              opacity: eightKSpr,
              transform: `scale(${eightKScale})`,
              filter: `drop-shadow(0 0 ${pulseGlow}px ${COLORS.brand}88) drop-shadow(0 0 ${pulseGlow * 2}px ${COLORS.brand}44)`,
              letterSpacing: -6,
              lineHeight: 0.85,
            }}
          >
            8K
          </div>
        </div>

        {/* ── "AI Upscaling" badge - dramatic with yellow border accent ── */}
        <Sequence from={8} layout="none">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                padding: "28px 80px",
                borderRadius: 100,
                border: `3px solid ${COLORS.brand}`,
                fontFamily,
                fontWeight: 900,
                fontSize: 52,
                color: COLORS.textBlack,
                transform: `scale(${badgeScale})`,
                opacity: badgeSpr,
                filter: `blur(${badgeBlur}px)`,
                boxShadow: `
                  0 25px 70px rgba(0,0,0,0.15),
                  0 0 40px ${COLORS.brand}15,
                  inset 0 1px 0 rgba(255,255,255,0.8),
                  0 0 0 1px ${COLORS.brand}22
                `,
                letterSpacing: 1,
              }}
            >
              <SplitText
                text="AI Upscaling"
                delay={4}
                stagger={2}
                direction="up"
                springConfig={{ damping: 16, stiffness: 140, mass: 0.5 }}
              />
            </div>

            {/* "pixel perfect" tiny italic text below the badge */}
            <div
              style={{
                marginTop: 14,
                fontFamily,
                fontWeight: 700,
                fontSize: 18,
                fontStyle: "italic",
                color: COLORS.textMutedDark,
                opacity: pixelPerfectSpr * 0.7,
                transform: `translateY(${interpolate(pixelPerfectSpr, [0, 1], [10, 0])}px)`,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              pixel perfect
            </div>
          </div>
        </Sequence>

        {/* ── Counter with BIG yellow italic enhancement value ── */}
        <Sequence from={30} layout="none">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 30,
              opacity: counterSpr,
              transform: `translateY(${interpolate(counterSpr, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Big yellow italic percentage */}
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 72,
                fontStyle: "italic",
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 15px ${COLORS.brand}44)`,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {enhancementPct}%
            </div>

            {/* Label below the big number */}
            <div
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 22,
                color: COLORS.textMutedDark,
                marginTop: 4,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Enhancement
            </div>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
