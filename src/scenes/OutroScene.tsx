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
import { makeStar } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { makeTransform, scale as scaleTf } from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { CreativlyLogo } from "../components/CreativlyLogo";
import { AuroraBackground } from "../components/AuroraBackground";
import { PulseRings } from "../components/PulseRings";
import { CharacterReveal } from "../components/CharacterReveal";
import { Rotating3DSphere, FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

const SPARKLES = Array.from({ length: 40 }, (_, i) => ({
  x: random(`out-x-${i}`) * 100,
  y: random(`out-y-${i}`) * 100,
  size: random(`out-s-${i}`) * 4 + 1.5,
  speed: random(`out-sp-${i}`) * 0.5 + 0.2,
}));

const CTA_UNDERLINE = "M 0 0 L 500 0";
const HALO_PATH = "M 200 0 A 200 200 0 1 1 -200 0 A 200 200 0 1 1 200 0";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60, mass: 0.5 },
  });
  const logoScale = interpolate(logoSpr, [0, 1], [0.6, 1]);
  const logoBlur = interpolate(logoSpr, [0, 1], [12, 0]);

  const logoFloatX = noise2D("out-lx", frame * 0.012, 0) * 5;
  const logoFloatY = noise2D("out-ly", 0, frame * 0.012) * 5;

  const breathe = 0.6 + 0.15 * noise2D("out-breathe", frame * 0.02, 0);

  const haloDraw = interpolate(frame, [5, 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const evolvedHalo = evolvePath(haloDraw, HALO_PATH);

  const ctaDraw = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const evolvedCta = evolvePath(ctaDraw, CTA_UNDERLINE);

  const auroraAccent = interpolateColors(frame, [0, 60, 120], [
    COLORS.brand,
    COLORS.primary,
    COLORS.brand,
  ]);

  const ringColor = interpolateColors(frame, [0, 40, 80, 120], [
    COLORS.brand,
    COLORS.primary,
    COLORS.secondary,
    COLORS.brand,
  ]);

  // "creativly" split entrance
  const nameSpr = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.5 },
  });

  // ".ai" yellow italic entrance
  const aiSpr = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.4 },
  });
  const aiScale = interpolate(aiSpr, [0, 1], [0.3, 1]);

  // "Start Creating" entrance
  const ctaSpr = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.5 },
  });
  const ctaBlur = interpolate(ctaSpr, [0, 1], [8, 0]);
  const ctaScale = interpolate(ctaSpr, [0, 1], [0.8, 1]);
  const ctaPulse = 1 + 0.01 * noise2D("cta-pulse", frame * 0.03, 0);

  // "free" tiny italic
  const freeSpr = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AuroraBackground
        colors={[COLORS.brand, COLORS.primary, COLORS.secondary]}
        speed={0.3}
        opacity={0.2}
      />

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, ${COLORS.bgSurface} 0%, ${COLORS.bg} 100%)`,
          opacity: 0.7,
        }}
      />

      {/* 3D spheres */}
      <Rotating3DSphere size={140} color={`${COLORS.brand}20`} x={200} y={200} speed={0.5} delay={3} noiseId="os1" />
      <Rotating3DSphere size={90} color={`${COLORS.primary}15`} x={1650} y={800} speed={0.8} delay={8} noiseId="os2" />

      {/* Floating diamonds */}
      <FloatingDiamond size={40} color={`${COLORS.brand}30`} x={300} y={800} speed={0.6} delay={5} noiseId="od1" glow glowColor={COLORS.brand} />
      <FloatingDiamond size={25} color={`${COLORS.secondary}25`} x={1500} y={250} speed={1} delay={10} noiseId="od2" />
      <FloatingDiamond size={35} color={`${COLORS.brand}20`} x={150} y={400} speed={0.8} delay={15} noiseId="od3" glow glowColor={COLORS.brand} />

      {/* Star sparkles */}
      {SPARKLES.map((p, i) => {
        const star = makeStar({ points: 4, innerRadius: p.size * 0.3, outerRadius: p.size });
        const drift = noise2D(`outpart-${i}`, frame * 0.015 * p.speed, i * 3) * 20;
        const driftY = noise2D(`outparty-${i}`, i * 3, frame * 0.015 * p.speed) * 20;
        const pulse = Math.sin(frame * 0.05 + i * 2) * 0.3 + 0.5;

        return (
          <svg
            key={`p-${i}`}
            width={p.size * 3}
            height={p.size * 3}
            viewBox={`0 0 ${star.width} ${star.height}`}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: pulse * 0.2,
              transform: `translate(${drift}px, ${driftY}px) rotate(${frame * p.speed * 2}deg)`,
              filter: `drop-shadow(0 0 2px ${auroraAccent})`,
            }}
          >
            <path d={star.path} fill={i % 3 === 0 ? COLORS.brand : auroraAccent} />
          </svg>
        );
      })}

      <PulseRings count={5} color={`${COLORS.brand}12`} maxSize={1600} speed={0.25} strokeWidth={1} />

      {/* Central breathing glow */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${COLORS.brand}25 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
          transform: `translate(-50%, -50%) scale(${breathe})`,
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          transform: makeTransform([scaleTf(logoScale)]),
          opacity: logoSpr,
          filter: logoBlur > 0.5 ? `blur(${logoBlur}px)` : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          zIndex: 10,
        }}
      >
        {/* Logo with halo ring */}
        <Sequence from={0} layout="none">
          <div
            style={{
              position: "relative",
              transform: `translate(${logoFloatX}px, ${logoFloatY}px)`,
            }}
          >
            <svg
              width="420"
              height="420"
              viewBox="-210 -210 420 420"
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.3 }}
            >
              <path d={HALO_PATH} fill="none" stroke={ringColor} strokeWidth="1" opacity="0.3" />
              <path d={HALO_PATH} fill="none" stroke={ringColor} strokeWidth="2" strokeLinecap="round" strokeDasharray={evolvedHalo.strokeDasharray} strokeDashoffset={evolvedHalo.strokeDashoffset} />
            </svg>
            <div style={{ filter: `drop-shadow(0 0 80px ${COLORS.brand}66) drop-shadow(0 0 40px ${COLORS.primary}33)` }}>
              <CreativlyLogo size={300} mode="assemble" />
            </div>
          </div>
        </Sequence>

        {/* "creativly" + ".ai" - dramatic split */}
        <Sequence from={5} layout="none">
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            {/* "creativly" - huge white */}
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 130,
                color: COLORS.text,
                letterSpacing: "-0.05em",
                textShadow: `0 0 80px ${auroraAccent}33`,
                opacity: nameSpr,
                transform: `translateY(${interpolate(nameSpr, [0, 1], [30, 0])}px)`,
              }}
            >
              <CharacterReveal
                text="creativly"
                delay={0}
                stagger={2}
                springConfig={{ damping: 14, stiffness: 100, mass: 0.5 }}
                offsetY={40}
                blur
              />
            </div>
            {/* ".ai" - yellow italic bouncy */}
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 130,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                letterSpacing: "-0.05em",
                filter: `drop-shadow(0 0 30px ${COLORS.brand}55)`,
                opacity: aiSpr,
                transform: `scale(${aiScale}) translateY(${interpolate(aiSpr, [0, 1], [20, 0])}px)`,
              }}
            >
              .ai
            </div>
          </div>
        </Sequence>

        {/* "the future of creation" tiny italic */}
        <Sequence from={18} layout="none">
          {(() => {
            const tagSpr = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 16, stiffness: 100 } });
            return (
              <div
                style={{
                  fontFamily,
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: 22,
                  color: COLORS.textMuted,
                  letterSpacing: "0.15em",
                  opacity: tagSpr,
                  transform: `translateY(${interpolate(tagSpr, [0, 1], [10, 0])}px)`,
                  marginTop: -15,
                }}
              >
                the future of creation
              </div>
            );
          })()}
        </Sequence>

        {/* CTA button */}
        <Sequence from={25} layout="none">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 15 }}>
              <div
                style={{
                  padding: "32px 80px",
                  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                  borderRadius: 100,
                  color: "#000",
                  fontFamily,
                  fontWeight: 900,
                  fontSize: 42,
                  boxShadow: `0 0 80px ${COLORS.brand}55, 0 0 160px ${COLORS.brand}22`,
                  transform: `scale(${ctaScale * ctaPulse})`,
                  opacity: ctaSpr,
                  filter: ctaBlur > 0.5 ? `blur(${ctaBlur}px)` : undefined,
                }}
              >
                Start Creating
              </div>
              {/* "free" tiny italic */}
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
                  opacity: freeSpr,
                  transform: `translateY(${interpolate(freeSpr, [0, 1], [10, 0])}px)`,
                }}
              >
                free
              </div>
            </div>

            <svg width="500" height="6" viewBox="-2 -3 504 6" style={{ marginTop: 12, opacity: 0.4 }}>
              <path
                d={CTA_UNDERLINE}
                fill="none"
                stroke={ringColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={evolvedCta.strokeDasharray}
                strokeDashoffset={evolvedCta.strokeDashoffset}
              />
            </svg>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
