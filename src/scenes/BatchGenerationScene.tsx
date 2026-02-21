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
import { makeStar } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import {
  makeTransform,
  translateY,
  scale as scaleTf,
} from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond, Rotating3DBox } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800", "900"],
  subsets: ["latin"],
});

const VARIANTS = [
  "director-board_800w.jpg",
  "ugc-product-story_800w.jpg",
  "launch-film-suite_800w.jpg",
  "surrealist-concept_800w.jpg",
  "character-performance_800w.jpg",
  "brand-identity-system_800w.jpg",
];

// Completion sparkles per card
const CARD_SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  angle: (i / 12) * Math.PI * 2,
  dist: random(`cs-d-${i}`) * 20 + 10,
  size: random(`cs-s-${i}`) * 4 + 2,
  speed: random(`cs-sp-${i}`) * 0.3 + 0.2,
}));

// Progress bar SVG path
const PROGRESS_PATH = "M 0 0 L 400 0";

export const BatchGenerationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance with scale + blur
  const titleSpr = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.5 },
  });
  const titleY = interpolate(titleSpr, [0, 1], [50, 0]);
  const titleBlur = interpolate(titleSpr, [0, 1], [10, 0]);

  // Grid glow with noise
  const gridGlow = 0.1 + 0.05 * noise2D("batchgrid", frame * 0.02, 0);

  // Progress bar path draw
  const progressCount = Math.min(
    6,
    Math.floor(
      interpolate(frame, [5, 25], [0, 6], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const progDraw = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedProgress = evolvePath(progDraw, PROGRESS_PATH);

  // Glow color cycling - now includes yellow
  const glowColor = interpolateColors(
    frame,
    [0, 35, 70, 105],
    [COLORS.brand, COLORS.primary, COLORS.secondary, COLORS.brand]
  );

  // Background watermark rotation with noise
  const watermarkRot =
    -15 + noise2D("wm-rot", frame * 0.005, 0) * 2;
  const watermarkOpacity = interpolate(
    titleSpr,
    [0, 1],
    [0, 0.025]
  );

  // Tagline entrance
  const taglineSpr = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 18, stiffness: 90, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Massive background watermark "BATCH" */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          fontFamily,
          fontWeight: 900,
          fontSize: 400,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: watermarkOpacity,
          transform: `translate(-50%, -50%) rotate(${watermarkRot}deg)`,
          whiteSpace: "nowrap",
          letterSpacing: "0.1em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        BATCH
      </div>

      {/* Background grid with noise opacity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.primary}08 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.primary}08 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: Math.max(0, gridGlow * 3),
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, transparent 70%)",
        }}
      />

      {/* Dynamic center glow - now yellow tinted */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 800,
          height: 400,
          background: `radial-gradient(circle, ${COLORS.brand}25 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />

      {/* 3D floating elements - FloatingDiamond top-left */}
      <FloatingDiamond
        size={50}
        color={`${COLORS.brand}30`}
        x={120}
        y={80}
        speed={0.8}
        delay={5}
        noiseId="batch-dia-tl"
        glow
        glowColor={COLORS.brand}
      />

      {/* 3D floating elements - FloatingDiamond bottom-right */}
      <FloatingDiamond
        size={35}
        color={`${COLORS.brand}25`}
        x={1700}
        y={850}
        speed={1.2}
        delay={10}
        noiseId="batch-dia-br"
        glow
        glowColor={COLORS.brand}
      />

      {/* 3D element - Rotating3DBox top-right */}
      <Rotating3DBox
        size={80}
        color={`${COLORS.brand}08`}
        accentColor={`${COLORS.brand}18`}
        speed={0.6}
        x={1720}
        y={60}
        delay={8}
        opacity={0.5}
        noiseId="batch-box-tr"
      />

      {/* 3D element - Rotating3DBox bottom-left */}
      <Rotating3DBox
        size={60}
        color={`${COLORS.brand}06`}
        accentColor={`${COLORS.brand}14`}
        speed={0.9}
        x={80}
        y={880}
        delay={12}
        opacity={0.4}
        noiseId="batch-box-bl"
      />

      {/* Stage 1: Title with split typography */}
      <Sequence from={0} layout="none">
        <div
          style={{
            marginBottom: 10,
            textAlign: "center",
            opacity: titleSpr,
            transform: makeTransform([
              translateY(titleY),
              scaleTf(interpolate(titleSpr, [0, 1], [0.85, 1])),
            ]),
            filter: `blur(${titleBlur}px)`,
          }}
        >
          {/* "Batch" - 60px italic */}
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 60,
              fontStyle: "italic",
              color: "white",
              letterSpacing: "0.05em",
              textShadow: `0 0 60px ${COLORS.brand}22`,
              lineHeight: 1.1,
            }}
          >
            <SplitText
              text="Batch"
              delay={0}
              stagger={3}
              direction="up"
              springConfig={{ damping: 16, stiffness: 130, mass: 0.5 }}
            />
          </div>

          {/* "GENERATION" - 130px bold */}
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 130,
              color: "white",
              letterSpacing: "-0.02em",
              textShadow: `0 0 80px ${glowColor}22, 0 4px 20px ${COLORS.brand}10`,
              lineHeight: 1.0,
            }}
          >
            <SplitText
              text="GENERATION"
              delay={2}
              stagger={2}
              direction="up"
              springConfig={{ damping: 16, stiffness: 130, mass: 0.5 }}
            />
          </div>

          {/* Tiny italic tagline */}
          <div
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 20,
              fontStyle: "italic",
              color: COLORS.textMuted,
              marginTop: 10,
              opacity: taglineSpr,
              transform: `translateY(${interpolate(taglineSpr, [0, 1], [12, 0])}px)`,
              letterSpacing: "0.15em",
            }}
          >
            mass produce, iterate fast
          </div>
        </div>
      </Sequence>

      {/* Stage 2: Progress indicator with evolvePath + dots */}
      <Sequence from={3} layout="none">
        <div
          style={{
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {VARIANTS.map((_, i) => {
              const generated = spring({
                frame: frame - i * 3 - 5,
                fps,
                config: { damping: 20, stiffness: 100 },
              });
              const dotColor = interpolateColors(
                generated,
                [0, 0.5, 1],
                [COLORS.textDim, COLORS.brand, COLORS.brand]
              );

              return (
                <div
                  key={i}
                  style={{
                    width: 40,
                    height: 6,
                    borderRadius: 3,
                    background: dotColor,
                    opacity: interpolate(generated, [0, 0.5], [0.3, 1]),
                    boxShadow:
                      generated > 0.5
                        ? `0 0 10px ${COLORS.brand}66`
                        : "none",
                    transform: `scaleX(${interpolate(generated, [0, 1], [0.5, 1])})`,
                  }}
                />
              );
            })}
            <div
              style={{
                fontFamily,
                fontSize: 16,
                fontWeight: 700,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                marginLeft: 12,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {progressCount}/6
            </div>
          </div>

          {/* SVG progress bar line - yellow */}
          <svg width="400" height="6" viewBox="-2 -3 404 6">
            <path
              d={PROGRESS_PATH}
              strokeDasharray={evolvedProgress.strokeDasharray}
              strokeDashoffset={evolvedProgress.strokeDashoffset}
              fill="none"
              stroke={COLORS.brand}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </svg>
        </div>
      </Sequence>

      {/* Stage 3: Grid reveal with staggered spring + blur + noise drift */}
      <Sequence from={5} layout="none">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 30,
            width: 1400,
          }}
        >
          {VARIANTS.map((img, i) => {
            const cardSpr = spring({
              frame: Math.max(0, frame - 5 - i * 4),
              fps,
              config: { stiffness: 140, damping: 16, mass: 0.5 },
            });
            const cardBlur = interpolate(cardSpr, [0, 1], [6, 0]);
            const cardScale = interpolate(cardSpr, [0, 1], [0.7, 1]);

            // Noise micro-drift per card
            const microX =
              noise2D(`batch-cx-${i}`, frame * 0.01, i * 3) * 3;
            const microY =
              noise2D(`batch-cy-${i}`, i * 3, frame * 0.01) * 3;

            return (
              <div
                key={i}
                style={{
                  aspectRatio: "16/9",
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  transform: `scale(${cardScale}) translate(${microX}px, ${microY}px)`,
                  opacity: cardSpr,
                  filter: `blur(${cardBlur}px)`,
                  boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${glowColor}11`,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <Img
                  src={staticFile(img)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Generation sweep with color */}
                {cardSpr < 0.98 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, transparent ${cardSpr * 100}%, ${COLORS.bg}dd ${cardSpr * 100 + 10}%, ${COLORS.bg} 100%)`,
                    }}
                  />
                )}

                {/* Version badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: glowColor,
                    padding: "4px 14px",
                    borderRadius: 8,
                    fontFamily,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                    boxShadow: `0 0 15px ${glowColor}44`,
                    opacity: cardSpr,
                  }}
                >
                  V{i + 1}
                </div>

                {/* Stage 4: Completion sparkles with noise */}
                {cardSpr > 0.9 &&
                  CARD_SPARKLES.slice(0, 4).map((sp, si) => {
                    const star = makeStar({
                      points: 4,
                      innerRadius: sp.size * 0.3,
                      outerRadius: sp.size,
                    });
                    const sparkOp =
                      Math.sin(frame * sp.speed * 2 + si * 4 + i * 2) *
                        0.4 +
                      0.4;
                    const noiseDx =
                      noise2D(`bsp-${i}-${si}`, frame * 0.03, si * 3) *
                      10;
                    const noiseDy =
                      noise2D(
                        `bspy-${i}-${si}`,
                        si * 3,
                        frame * 0.03
                      ) * 10;

                    return (
                      <svg
                        key={`sp-${si}`}
                        width={sp.size * 3}
                        height={sp.size * 3}
                        viewBox={`0 0 ${star.width} ${star.height}`}
                        style={{
                          position: "absolute",
                          right:
                            10 +
                            Math.cos(sp.angle) * sp.dist +
                            noiseDx,
                          top:
                            10 +
                            Math.sin(sp.angle) * sp.dist +
                            noiseDy,
                          opacity: sparkOp * 0.6,
                          transform: `rotate(${frame * sp.speed * 3}deg)`,
                          filter: `drop-shadow(0 0 3px ${COLORS.success})`,
                        }}
                      >
                        <path d={star.path} fill="white" />
                      </svg>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
