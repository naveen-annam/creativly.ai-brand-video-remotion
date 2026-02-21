import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
  Easing,
  random,
  interpolateColors,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeTriangle, makeCircle } from "@remotion/shapes";
import { makeTransform, rotate } from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
});

const TEMPLATES = [
  { title: "Surrealist Concept Art", color: "#FF5F56", img: "surrealist-concept_800w.jpg" },
  { title: "Launch Film + Ad Suite", color: "#FFBD2E", img: "launch-film-suite_800w.jpg" },
  { title: "UGC Product Story", color: "#27C93F", img: "ugc-product-story_800w.jpg" },
  { title: "Director Storyboard", color: "#3357FF", img: "director-board_800w.jpg" },
  { title: "Character Perf Rig", color: "#A833FF", img: "character-performance_800w.jpg" },
  { title: "Brand Identity System", color: "#FF33A8", img: "brand-identity-system_800w.jpg" },
];

// Decorative shapes
const triangle = makeTriangle({ length: 60, direction: "up" });
const circle = makeCircle({ radius: 25 });

// Decorative shape particles
const DECO_SHAPES = Array.from({ length: 8 }, (_, i) => ({
  x: random(`deco-x-${i}`) * 1800 + 60,
  y: random(`deco-y-${i}`) * 950 + 60,
  type: i % 3,
  rotSpeed: (random(`deco-r-${i}`) - 0.5) * 2,
}));

// Floating diamond configs
const DIAMOND_CONFIGS = [
  { x: 80, y: 120, size: 40, speed: 0.8, delay: 5, noiseId: "d0" },
  { x: 1750, y: 200, size: 55, speed: 1.2, delay: 8, noiseId: "d1" },
  { x: 150, y: 850, size: 35, speed: 0.6, delay: 12, noiseId: "d2" },
  { x: 1680, y: 780, size: 50, speed: 1.0, delay: 10, noiseId: "d3" },
  { x: 960, y: 60, size: 30, speed: 1.5, delay: 15, noiseId: "d4" },
  { x: 1820, y: 520, size: 25, speed: 0.9, delay: 18, noiseId: "d5" },
  { x: 50, y: 500, size: 45, speed: 0.7, delay: 7, noiseId: "d6" },
];

export const TemplatesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance spring
  const headerSpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const headerY = interpolate(headerSpr, [0, 1], [60, 0]);

  // Subtitle color transition
  const subColor = interpolateColors(frame, [0, 45, 90], [
    COLORS.textMutedDark,
    COLORS.brand,
    COLORS.textMutedDark,
  ]);

  // Background mega text entrance
  const bgTextSpr = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 30, stiffness: 40, mass: 1.5 },
  });
  const bgTextScale = interpolate(bgTextSpr, [0, 1], [0.8, 1]);
  const bgTextOpacity = interpolate(bgTextSpr, [0, 1], [0, 0.06]);

  // Tagline entrance
  const taglineSpr = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const taglineY = interpolate(taglineSpr, [0, 1], [20, 0]);

  // Yellow accent line that sweeps across behind the header
  const accentLineSpr = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const accentLineWidth = interpolate(accentLineSpr, [0, 1], [0, 400]);
  const accentLineOpacity = interpolate(accentLineSpr, [0, 1], [0, 0.35]);

  // Pulsing glow for active card (cycles through cards)
  const activeCardIndex = Math.floor(
    interpolate(frame, [30, 90], [0, 5.99], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Global breathing for dot grid
  const dotPulse = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.25, 0.45]
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bgWhite, overflow: "hidden" }}
    >
      {/* Subtle dot grid with breathing opacity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${COLORS.borderDark} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: dotPulse,
        }}
      />

      {/* Massive background TEMPLATES text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(-8deg) scale(${bgTextScale})`,
          fontFamily,
          fontSize: 320,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: bgTextOpacity,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        TEMPLATES
      </div>

      {/* Secondary ghost text layer offset for depth */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: "51%",
          transform: `translate(-50%, -50%) rotate(-6deg) scale(${bgTextScale * 0.95})`,
          fontFamily,
          fontSize: 340,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: bgTextOpacity * 0.4,
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
        }}
      >
        TEMPLATES
      </div>

      {/* Decorative geometric shapes with noise + rotation */}
      {DECO_SHAPES.map((d, i) => {
        const noiseX = noise2D(`shape-x-${i}`, frame * 0.01, i) * 15;
        const noiseY = noise2D(`shape-y-${i}`, i, frame * 0.01) * 15;
        const rot = frame * d.rotSpeed;
        const shapeOp = interpolate(frame, [0, 20], [0, 0.12], {
          extrapolateRight: "clamp",
        });
        const shape = d.type === 0 ? triangle : circle;

        // Some shapes get yellow stroke
        const strokeColor =
          i % 4 === 0
            ? COLORS.brand
            : TEMPLATES[i % TEMPLATES.length].color;

        return (
          <svg
            key={`deco-${i}`}
            width={60}
            height={60}
            viewBox={`0 0 ${shape.width} ${shape.height}`}
            style={{
              position: "absolute",
              left: d.x + noiseX,
              top: d.y + noiseY,
              opacity: shapeOp,
              transform: makeTransform([rotate(`${rot}deg`)]),
            }}
          >
            <path
              d={shape.path}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
            />
          </svg>
        );
      })}

      {/* 3D Floating Diamonds */}
      {DIAMOND_CONFIGS.map((cfg, i) => (
        <FloatingDiamond
          key={`diamond-${i}`}
          size={cfg.size}
          color={
            i % 3 === 0
              ? `rgba(255, 214, 0, 0.25)`
              : i % 3 === 1
                ? `rgba(255, 214, 0, 0.15)`
                : `rgba(255, 214, 0, 0.1)`
          }
          x={cfg.x}
          y={cfg.y}
          speed={cfg.speed}
          delay={cfg.delay}
          noiseId={cfg.noiseId}
          glow={i < 3}
          glowColor={COLORS.brand}
        />
      ))}

      {/* Stage 1: Header slides up */}
      <Sequence from={0} layout="none">
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 10,
            opacity: headerSpr,
            transform: `translateY(${headerY}px)`,
          }}
        >
          {/* Workflow label - italic, smaller */}
          <div
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: 400,
              fontStyle: "italic",
              color: subColor,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Workflow
          </div>

          {/* Templates title - HUGE 120px italic */}
          <div
            style={{
              fontFamily,
              fontSize: 120,
              fontWeight: 900,
              fontStyle: "italic",
              color: COLORS.textBlack,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              position: "relative",
              display: "inline-block",
            }}
          >
            <SplitText
              text="Templates"
              delay={5}
              stagger={3}
              direction="up"
              springConfig={{ damping: 16, stiffness: 140, mass: 0.5 }}
            />

            {/* Yellow accent underline sweep */}
            <div
              style={{
                position: "absolute",
                bottom: -2,
                left: "50%",
                transform: "translateX(-50%)",
                width: accentLineWidth,
                height: 4,
                background: `linear-gradient(90deg, transparent, ${COLORS.brand}, ${COLORS.brandCyan}, transparent)`,
                opacity: accentLineOpacity,
                borderRadius: 2,
              }}
            />
          </div>

          {/* Curated collection tagline */}
          <div
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 400,
              fontStyle: "italic",
              color: COLORS.textMutedDark,
              letterSpacing: "0.35em",
              textTransform: "lowercase",
              marginTop: 10,
              opacity: taglineSpr,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            curated collection
          </div>

          {/* Tiny yellow diamond separator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 10,
              opacity: interpolate(taglineSpr, [0.5, 1], [0, 0.5], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                width: 30,
                height: 1,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                transform: `rotate(45deg)`,
              }}
            />
            <div
              style={{
                width: 30,
                height: 1,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              }}
            />
          </div>
        </div>
      </Sequence>

      {/* Stage 2: Staggered card grid with 3D tilt + yellow glow */}
      <Sequence from={8} layout="none">
        <AbsoluteFill
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 20,
            padding: "220px 80px 60px",
          }}
        >
          {TEMPLATES.map((t, i) => {
            const delay = i * 5;
            const spr = spring({
              frame: Math.max(0, frame - 8 - delay),
              fps,
              config: { damping: 14, stiffness: 80, mass: 0.6 },
            });

            const cardScale = interpolate(spr, [0, 1], [0.6, 1]);
            const opacity = interpolate(spr, [0, 1], [0, 1]);
            const yOffset = interpolate(spr, [0, 1], [100, 0]);

            // 3D tilt based on grid position
            const col = i % 3;
            const row = Math.floor(i / 3);
            const tiltX = interpolate(row, [0, 1], [4, -4]);
            const tiltY = interpolate(col, [0, 2], [-5, 5]);
            const tiltProgress = interpolate(
              frame,
              [8 + delay + 10, 8 + delay + 35],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            // Shimmer sweep
            const shimmerX = interpolate(
              frame,
              [8 + delay + 15, 8 + delay + 50],
              [-120, 220],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Noise micro-movement
            const microX = noise2D(`card-x-${i}`, frame * 0.008, i) * 3;
            const microY = noise2D(`card-y-${i}`, i, frame * 0.008) * 3;

            // SVG border draw animation
            const borderDraw = interpolate(
              frame,
              [8 + delay + 5, 8 + delay + 30],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            // Yellow glow for active card
            const isActive = i === activeCardIndex;
            const glowSpr = spring({
              frame: isActive ? Math.max(0, frame - 30) : 0,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const glowIntensity = isActive
              ? interpolate(glowSpr, [0, 1], [0, 1])
              : 0;
            const yellowGlow = isActive
              ? `0 0 ${20 * glowIntensity}px ${COLORS.brand}66, 0 0 ${40 * glowIntensity}px ${COLORS.brand}33`
              : "none";

            // Card border color blends with yellow when active
            const borderColor = isActive
              ? interpolateColors(
                  glowIntensity,
                  [0, 1],
                  ["rgba(255,255,255,0.05)", COLORS.brand]
                )
              : "rgba(255,255,255,0.05)";

            // Title text color with yellow accent for active card
            const titleColor = isActive
              ? interpolateColors(
                  glowIntensity,
                  [0, 0.5, 1],
                  [COLORS.text, COLORS.text, COLORS.brandLight]
                )
              : COLORS.text;

            return (
              <div
                key={i}
                style={{
                  borderRadius: 20,
                  transform: `scale(${cardScale}) translateY(${yOffset}px) translateX(${microX}px) translateY(${microY}px) perspective(800px) rotateX(${tiltX * tiltProgress}deg) rotateY(${tiltY * tiltProgress}deg)`,
                  opacity,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 20px 60px -15px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)${isActive ? `, ${yellowGlow}` : ""}`,
                  border: `2px solid ${borderColor}`,
                }}
              >
                <Img
                  src={staticFile(t.img)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                  }}
                />

                {/* Shimmer sweep */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 70%)`,
                    transform: `translateX(${shimmerX}%)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Color accent line at top with draw animation */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: `linear-gradient(to right, ${t.color}, ${COLORS.brand}, ${COLORS.brandCyan}, transparent)`,
                    transform: `scaleX(${borderDraw})`,
                    transformOrigin: "left",
                  }}
                />

                {/* Yellow corner accent for active cards */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: `0 ${30 * glowIntensity}px ${30 * glowIntensity}px 0`,
                      borderColor: `transparent ${COLORS.brand} transparent transparent`,
                      opacity: glowIntensity * 0.6,
                    }}
                  />
                )}

                {/* Title with stagger */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    zIndex: 2,
                  }}
                >
                  {/* Card category index */}
                  <div
                    style={{
                      fontFamily,
                      background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      padding: "0.15em 0.3em",
                      backgroundClip: "text",
                      fontSize: 11,
                      fontWeight: 600,
                      fontStyle: "italic",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                      opacity: interpolate(spr, [0.6, 1], [0, 0.7], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                      transform: `translateY(${interpolate(spr, [0.6, 1], [10, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}px)`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontFamily,
                      color: titleColor,
                      fontSize: 22,
                      fontWeight: 700,
                      fontStyle: "italic",
                      textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                      opacity: interpolate(spr, [0.5, 1], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                      transform: `translateY(${interpolate(spr, [0.5, 1], [15, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}px)`,
                    }}
                  >
                    {t.title}
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
