import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
  Sequence,
  Easing,
  random,
} from "remotion";
import { noise2D, noise3D } from "@remotion/noise";
import { makeStar } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { makeTransform, rotate } from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { PulseRings } from "../components/PulseRings";
import { CharacterReveal } from "../components/CharacterReveal";
import { Rotating3DSphere, FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "700", "900"] });

const MODELS = [
  "GPT-4o", "Claude 3.5", "Midjourney 6", "Runway Gen-3",
  "Pika Art", "Suno v3", "ElevenLabs", "Gemini 1.5",
  "Llama 3", "Mistral Large", "Cohere", "Fal.ai",
  "Stable Video", "HuggingFace", "Flux Pro", "Ideogram",
  "Kling", "Luma Dream", "Sora", "DALL-E 3",
  "Whisper", "ControlNet", "AnimateDiff", "Jukebox",
];

const STARS = Array.from({ length: 15 }, (_, i) => ({
  x: random(`mstar-x-${i}`) * 1920,
  y: random(`mstar-y-${i}`) * 1080,
  size: random(`mstar-s-${i}`) * 12 + 4,
  delay: random(`mstar-d-${i}`) * 25,
}));

const ORBIT_RING_1 = "M 960 200 A 760 340 0 1 1 959 200";
const ORBIT_RING_2 = "M 960 140 A 820 400 0 1 0 959 140";

export const ModelsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const centerSpr = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.5 },
  });
  const centerScale = interpolate(centerSpr, [0, 1], [0.3, 1]);
  const centerBlur = interpolate(centerSpr, [0, 1], [20, 0]);

  const centerGlow = 0.4 + 0.15 * noise2D("cglow", frame * 0.02, 0);

  const countProgress = interpolate(frame, [15, 45], [0, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const modelCount = Math.floor(countProgress);

  const orbitDraw1 = interpolate(frame, [5, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const orbitDraw2 = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const evolvedOrbit1 = evolvePath(orbitDraw1, ORBIT_RING_1);
  const evolvedOrbit2 = evolvePath(orbitDraw2, ORBIT_RING_2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        overflow: "hidden",
        perspective: 1000,
      }}
    >
      {/* Massive background watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-8deg)",
          fontFamily,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 500,
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
        MODELS
      </div>

      {/* 3D spheres */}
      <Rotating3DSphere size={120} color={`${COLORS.brand}25`} x={200} y={200} speed={0.8} delay={3} noiseId="ms1" />
      <Rotating3DSphere size={80} color={`${COLORS.primary}20`} x={1650} y={850} speed={1.1} delay={8} noiseId="ms2" />

      {/* Floating diamonds */}
      <FloatingDiamond size={30} color={`${COLORS.brand}35`} x={100} y={800} speed={0.9} delay={5} noiseId="md1" glow glowColor={COLORS.brand} />
      <FloatingDiamond size={25} color={`${COLORS.secondary}25`} x={1750} y={200} speed={1.2} delay={10} noiseId="md2" />

      {/* Star particles */}
      {STARS.map((s, i) => {
        const star = makeStar({ points: 4, innerRadius: s.size * 0.3, outerRadius: s.size });
        const drift = noise2D(`sdrift-${i}`, frame * 0.01, i * 3) * 20;
        const pulse = Math.sin(frame * 0.08 + i * 1.5) * 0.3 + 0.4;
        const starOp = interpolate(frame, [s.delay, s.delay + 12], [0, pulse * 0.25], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        return (
          <svg
            key={`star-${i}`}
            width={s.size * 2.5}
            height={s.size * 2.5}
            viewBox={`0 0 ${star.width} ${star.height}`}
            style={{
              position: "absolute",
              left: s.x + drift,
              top: s.y + noise2D(`sdrifty-${i}`, i * 3, frame * 0.01) * 20,
              opacity: starOp,
              transform: makeTransform([rotate(`${frame * (i % 2 === 0 ? 1 : -1)}deg`)]),
            }}
          >
            <path d={star.path} fill={i % 3 === 0 ? COLORS.brand : i % 2 === 0 ? COLORS.primary : COLORS.secondary} opacity="0.6" />
          </svg>
        );
      })}

      {/* Central glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, #3B82F625 0%, #06B6D418 20%, ${COLORS.primary}15 40%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${1 + centerGlow * 0.3})`,
          filter: "blur(60px)",
          opacity: centerGlow,
        }}
      />

      <PulseRings count={3} color={`${COLORS.brand}15`} maxSize={1400} speed={0.3} strokeWidth={1} />

      {/* Orbital ring paths */}
      <Sequence from={0} layout="none">
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <path d={ORBIT_RING_1} fill="none" stroke={`${COLORS.brand}30`} strokeWidth="1.5" strokeDasharray={evolvedOrbit1.strokeDasharray} strokeDashoffset={evolvedOrbit1.strokeDashoffset} />
          <path d={ORBIT_RING_2} fill="none" stroke={`${COLORS.secondary}25`} strokeWidth="1" strokeDasharray={evolvedOrbit2.strokeDasharray} strokeDashoffset={evolvedOrbit2.strokeDashoffset} />
        </svg>
      </Sequence>

      {/* Model badges orbiting */}
      <Sequence from={5} layout="none">
        {[1, -1].map((direction, ringIndex) => (
          <AbsoluteFill key={ringIndex}>
            {MODELS.map((model, i) => {
              if (i % 2 !== ringIndex) return null;

              const count = MODELS.length / 2;
              const indexInRing = Math.floor(i / 2);
              const angleOffset = (indexInRing / count) * Math.PI * 2;
              const radius = 600 + ringIndex * 250;
              const speed = 0.8 * direction;
              const angle = angleOffset + frame * speed * 0.01;

              const perturbX = noise3D(`orbit-x-${i}`, frame * 0.01, i * 0.5, ringIndex) * 30;
              const perturbY = noise3D(`orbit-y-${i}`, i * 0.5, frame * 0.01, ringIndex) * 30;

              const x = width / 2 + Math.cos(angle) * radius + perturbX;
              const z = Math.sin(angle) * radius;
              const yOffset = Math.sin(frame * 0.05 + i) * 50 + perturbY;

              const badgeScale = interpolate(z, [-radius, radius], [0.4, 1.4]);
              const opacity = interpolate(z, [-radius, radius], [0.08, 1]);
              const blur = interpolate(z, [-radius, radius], [8, 0]);
              const glowSize = interpolate(z, [-radius, radius], [0, 30]);

              const entranceSpr = spring({
                frame: Math.max(0, frame - 5 - i * 1.5),
                fps,
                config: { damping: 20, stiffness: 60 },
              });

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x - 100,
                    top: height / 2 + (ringIndex === 0 ? -180 : 180) + yOffset,
                    padding: "16px 32px",
                    borderRadius: 50,
                    background: `rgba(255,255,255,${ringIndex === 0 ? 0.08 : 0.04})`,
                    border: `1px solid ${ringIndex === 0 ? COLORS.brand : COLORS.secondary}`,
                    boxShadow: `0 0 ${glowSize}px ${ringIndex === 0 ? COLORS.brand : COLORS.secondary}55`,
                    color: COLORS.text,
                    fontFamily,
                    fontSize: 24,
                    fontWeight: 700,
                    opacity: opacity * entranceSpr,
                    transform: `scale(${badgeScale * entranceSpr})`,
                    filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
                    zIndex: Math.floor(z + 1000),
                    whiteSpace: "nowrap",
                  }}
                >
                  {model}
                </div>
              );
            })}
          </AbsoluteFill>
        ))}
      </Sequence>

      {/* Center badge */}
      <Sequence from={8} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              padding: "50px 100px",
              borderRadius: 40,
              border: `1px solid ${COLORS.brand}44`,
              textAlign: "center",
              boxShadow: `0 20px 80px rgba(0,0,0,0.8), 0 0 100px ${COLORS.brand}15`,
              transform: `scale(${centerScale})`,
              filter: centerBlur > 0.5 ? `blur(${centerBlur}px)` : undefined,
            }}
          >
            {/* "30+" huge yellow italic */}
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 120,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                lineHeight: 0.85,
                marginBottom: 5,
                fontVariantNumeric: "tabular-nums",
                filter: `drop-shadow(0 0 30px ${COLORS.brand}44)`,
              }}
            >
              {modelCount}+
            </div>
            {/* "AI" small */}
            <div
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: 28,
                color: COLORS.textMuted,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              AI
            </div>
            {/* "MODELS INCLUDED" - bold */}
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 44,
                color: "white",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              <CharacterReveal
                text="Models Included"
                delay={5}
                stagger={2}
                springConfig={{ damping: 16, stiffness: 120, mass: 0.4 }}
                offsetY={25}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
