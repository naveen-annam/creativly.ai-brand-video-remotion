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
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800", "900"],
  subsets: ["latin"],
});

// Sparkle shapes along scan line
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  yPct: random(`inp-y-${i}`) * 100,
  size: random(`inp-s-${i}`) * 6 + 2,
  offsetX: (random(`inp-ox-${i}`) - 0.5) * 40,
  speed: random(`inp-sp-${i}`) * 0.3 + 0.1,
}));

export const InpaintingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scan position with easing
  const scanPos = interpolate(frame, [20, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Text entrance
  const textSpr = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const textY = interpolate(textSpr, [0, 1], [50, 0]);
  const textBlur = interpolate(textSpr, [0, 1], [10, 0]);

  // Scan glow color shift - now includes yellow accent
  const scanColor = interpolateColors(frame, [20, 40, 65, 90], [
    COLORS.success,
    COLORS.brand,
    "#4ade80",
    COLORS.success,
  ]);

  // Background watermark rotation driven by frame
  const watermarkRotation = interpolate(frame, [0, 120], [-12, -12], {
    extrapolateRight: "clamp",
  });

  // Watermark subtle opacity pulse
  const watermarkOpacity = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [0.02, 0.03]
  );

  // Tagline entrance
  const taglineSpr = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        overflow: "hidden",
      }}
    >
      {/* Massive background watermark "FILL" */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${watermarkRotation}deg)`,
          fontFamily,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 450,
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: watermarkOpacity,
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        FILL
      </div>

      {/* FloatingDiamond 3D elements */}
      <FloatingDiamond
        size={45}
        color="rgba(255,214,0,0.25)"
        x={80}
        y={120}
        speed={0.7}
        delay={10}
        noiseId="inp-dia-1"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={30}
        color="rgba(255,214,0,0.18)"
        x={1750}
        y={80}
        speed={1.1}
        delay={18}
        noiseId="inp-dia-2"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={55}
        color="rgba(255,214,0,0.2)"
        x={150}
        y={850}
        speed={0.5}
        delay={5}
        noiseId="inp-dia-3"
        glow
        glowColor={COLORS.brandDark}
      />
      <FloatingDiamond
        size={25}
        color="rgba(255,214,0,0.3)"
        x={1680}
        y={900}
        speed={1.3}
        delay={22}
        noiseId="inp-dia-4"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={38}
        color="rgba(255,214,0,0.15)"
        x={950}
        y={50}
        speed={0.9}
        delay={15}
        noiseId="inp-dia-5"
      />

      {/* Stage 1: Text column with SplitText + blur entrance */}
      <Sequence from={0} layout="none">
        <div
          style={{
            width: 600,
            opacity: textSpr,
            transform: `translateY(${textY}px)`,
            filter: `blur(${textBlur}px)`,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily,
              lineHeight: 1,
              marginBottom: 30,
            }}
          >
            {/* "Generative" - 50px italic */}
            <div
              style={{
                fontFamily,
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: 50,
                color: COLORS.text,
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              <SplitText
                text="Generative"
                delay={0}
                stagger={3}
                direction="up"
                springConfig={{ damping: 14, stiffness: 100, mass: 0.5 }}
              />
            </div>
            {/* "Fill & Fix" - 120px bold with yellow gradient */}
            <span
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 120,
                lineHeight: 1,
              }}
            >
              <SplitText
                text="Fill & Fix"
                delay={8}
                stagger={3}
                direction="up"
                springConfig={{ damping: 14, stiffness: 100, mass: 0.5 }}
                gradient
              />
            </span>
          </div>

          {/* Description fade */}
          <Sequence from={12} layout="none">
            <div
              style={{
                fontFamily,
                fontSize: 30,
                color: COLORS.textMuted,
                lineHeight: 1.5,
                opacity: interpolate(frame, [12, 30], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              Modify any video frame with natural language prompts.
            </div>
          </Sequence>

          {/* Tiny italic tagline */}
          <Sequence from={20} layout="none">
            <div
              style={{
                fontFamily,
                fontStyle: "italic",
                fontSize: 16,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                opacity: taglineSpr * 0.7,
                transform: `translateY(${interpolate(taglineSpr, [0, 1], [12, 0])}px)`,
                marginTop: 10,
                letterSpacing: "0.15em",
                textTransform: "lowercase",
              }}
            >
              ai-powered editing
            </div>
          </Sequence>

          {/* Stage 2: Feature pills with staggered spring + blur */}
          <Sequence from={35} layout="none">
            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              {["Object Removal", "Style Transfer", "Background Replace"].map(
                (feat, i) => {
                  const pillSpr = spring({
                    frame: Math.max(0, frame - 38 - i * 6),
                    fps,
                    config: { damping: 14, stiffness: 120, mass: 0.5 },
                  });
                  const pillBlur = interpolate(pillSpr, [0, 1], [6, 0]);
                  const pillScale = interpolate(pillSpr, [0, 1], [0.7, 1]);

                  return (
                    <div
                      key={i}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 100,
                        background: `${scanColor}15`,
                        border: `1px solid ${scanColor}33`,
                        color: scanColor,
                        fontFamily,
                        fontSize: 18,
                        fontWeight: 600,
                        opacity: pillSpr,
                        transform: `scale(${pillScale})`,
                        filter: `blur(${pillBlur}px)`,
                      }}
                    >
                      {feat}
                    </div>
                  );
                }
              )}
            </div>
          </Sequence>
        </div>
      </Sequence>

      {/* Stage 3: Image with scan line + sparkles */}
      <Sequence from={5} layout="none">
        <div style={{ width: 1000, height: 700, position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Img
              src={staticFile("focused-editor.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Before region (grayscale) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `polygon(0 0, ${scanPos}% 0, ${scanPos}% 100%, 0 100%)`,
                backdropFilter: "grayscale(100%) contrast(1.2) brightness(0.7)",
              }}
            />

            {/* Scan line with yellow accent glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${scanPos}%`,
                width: 6,
                background: scanColor,
                boxShadow: `0 0 60px ${scanColor}, 0 0 20px white, 0 0 90px ${COLORS.brand}44`,
                zIndex: 10,
              }}
            />

            {/* Star-shaped sparkles along scan with noise drift */}
            {SPARKLES.map((s, i) => {
              const star = makeStar({ points: 4, innerRadius: s.size * 0.3, outerRadius: s.size });
              const sparkleOp = Math.sin(frame * s.speed * 2 + i * 3) * 0.5 + 0.5;
              const drift = noise2D(`spdrift-${i}`, frame * 0.02, i * 5) * s.offsetX;
              const driftY = noise2D(`spdrifty-${i}`, i * 5, frame * 0.02) * 10;

              return (
                <svg
                  key={`sparkle-${i}`}
                  width={s.size * 3}
                  height={s.size * 3}
                  viewBox={`0 0 ${star.width} ${star.height}`}
                  style={{
                    position: "absolute",
                    left: `calc(${scanPos}% + ${drift}px)`,
                    top: `calc(${s.yPct}% + ${driftY}px)`,
                    opacity: sparkleOp * 0.7,
                    transform: `translate(-50%, -50%) rotate(${frame * s.speed * 3}deg)`,
                    zIndex: 11,
                    filter: `drop-shadow(0 0 ${s.size}px ${scanColor})`,
                  }}
                >
                  <path d={star.path} fill="white" />
                </svg>
              );
            })}
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
