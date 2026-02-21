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
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeStar } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { makeTransform, scale, translateY, rotate } from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { PulseRings } from "../components/PulseRings";
import { Rotating3DSphere, FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const STAR_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: random(`star-x-${i}`) * 1920,
  y: random(`star-y-${i}`) * 1080,
  size: random(`star-s-${i}`) * 20 + 8,
  speed: random(`star-sp-${i}`) * 0.4 + 0.1,
  delay: random(`star-d-${i}`) * 30,
}));

const UNDERLINE_PATH = "M 0 0 Q 200 -20 400 0 Q 600 20 800 0";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stage 1: Logo blur-to-sharp
  const logoSpr = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.6 },
  });
  const logoScaleVal = interpolate(logoSpr, [0, 1], [1.8, 1]);
  const logoBlur = interpolate(logoSpr, [0, 1], [25, 0]);
  const logoOpacity = interpolate(logoSpr, [0, 1], [0, 1]);

  const logoNoiseX = noise2D("logo-x", frame * 0.01, 0) * 8;
  const logoNoiseY = noise2D("logo-y", 0, frame * 0.01) * 6;

  const sceneScale = interpolate(frame, [0, 105], [1, 1.06], {
    easing: Easing.out(Easing.quad),
  });

  const underlineProgress = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const underlinePath = evolvePath(underlineProgress, UNDERLINE_PATH);

  const haloOpacity = interpolate(frame, [0, 25], [0, 0.4], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const haloRotation = frame * 0.8;



  // "VISUAL" word - massive, kinetic entrance
  const visualSpr = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.6 },
  });
  const visualScale = interpolate(visualSpr, [0, 1], [3, 1]);
  const visualBlur = interpolate(visualSpr, [0, 1], [20, 0]);
  const visualRotation = interpolate(visualSpr, [0, 1], [-8, 0]);

  // "AI" word - giant italic, slides from right
  const aiSpr = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 12, stiffness: 60, mass: 0.5 },
  });
  const aiX = interpolate(aiSpr, [0, 1], [400, 0]);
  const aiBlur = interpolate(aiSpr, [0, 1], [15, 0]);

  // "The Generative" - small caps, elegant entrance
  const subSpr = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.5 },
  });
  const subY = interpolate(subSpr, [0, 1], [30, 0]);

  // "Playground" - yellow highlighted, bouncy
  const playSpr = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 8, stiffness: 120, mass: 0.4 },
  });
  const playScale = interpolate(playSpr, [0, 1], [0.3, 1]);

  // "For Creators" - italic, small
  const creatorsSpr = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        overflow: "hidden",
        transform: `scale(${sceneScale})`,
      }}
    >
      {/* Ambient glow - now yellow-tinted */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80%",
          height: "80%",
          background: `radial-gradient(circle, ${COLORS.brand}25 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />

      {/* 3D Rotating spheres in corners */}
      <Rotating3DSphere
        size={160}
        color={`${COLORS.brand}30`}
        x={150}
        y={120}
        speed={0.7}
        delay={5}
        noiseId="intro-s1"
      />
      <Rotating3DSphere
        size={100}
        color={`${COLORS.primary}25`}
        x={1650}
        y={800}
        speed={1.2}
        delay={10}
        noiseId="intro-s2"
      />

      {/* Floating 3D diamonds */}
      <FloatingDiamond size={40} color={`${COLORS.brand}35`} x={300} y={750} speed={0.8} delay={8} noiseId="d1" glow glowColor={COLORS.brand} />
      <FloatingDiamond size={25} color={`${COLORS.primary}30`} x={1500} y={200} speed={1.3} delay={12} noiseId="d2" />
      <FloatingDiamond size={55} color={`${COLORS.secondary}25`} x={1700} y={500} speed={0.6} delay={15} noiseId="d3" glow glowColor={COLORS.secondary} />
      <FloatingDiamond size={30} color={`${COLORS.brand}40`} x={200} y={350} speed={1} delay={20} noiseId="d4" />

      {/* Star particles */}
      {STAR_PARTICLES.map((s, i) => {
        const starPath = makeStar({
          points: 4,
          innerRadius: s.size * 0.3,
          outerRadius: s.size,
        });
        const drift = noise2D(`drift-${i}`, frame * 0.015 * s.speed, i * 10);
        const pulse = Math.sin(frame * 0.08 + i * 2) * 0.4 + 0.4;
        const starOpacity = interpolate(frame, [s.delay, s.delay + 15], [0, pulse * 0.3], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const starRotation = frame * s.speed * 2;

        return (
          <svg
            key={`star-${i}`}
            width={s.size * 2.5}
            height={s.size * 2.5}
            viewBox={`0 0 ${starPath.width} ${starPath.height}`}
            style={{
              position: "absolute",
              left: s.x + drift * 20,
              top: s.y + noise2D(`drifty-${i}`, i * 10, frame * 0.015 * s.speed) * 20,
              opacity: starOpacity,
              transform: makeTransform([rotate(`${starRotation}deg`)]),
            }}
          >
            <path
              d={starPath.path}
              fill="none"
              stroke={i % 3 === 0 ? COLORS.brand : i % 3 === 1 ? COLORS.primary : COLORS.secondary}
              strokeWidth="1"
            />
          </svg>
        );
      })}

      <PulseRings count={5} color={`${COLORS.brand}15`} maxSize={1400} speed={0.3} strokeWidth={1} />

      {/* Rotating halo rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 500,
          height: 500,
          transform: translate(-250, -320) + ` rotate(${haloRotation}deg)`,
          border: `2px solid ${COLORS.brand}22`,
          borderTop: `2px solid ${COLORS.brand}88`,
          borderRadius: "50%",
          opacity: haloOpacity,
          filter: `drop-shadow(0 0 20px ${COLORS.brand}44)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 600,
          height: 600,
          transform: translate(-300, -370) + ` rotate(${-haloRotation * 0.7}deg)`,
          border: `1px solid ${COLORS.secondary}15`,
          borderBottom: `1px solid ${COLORS.secondary}55`,
          borderRadius: "50%",
          opacity: haloOpacity,
        }}
      />
      {/* Third halo ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 380,
          height: 380,
          transform: translate(-190, -260) + ` rotate(${haloRotation * 1.3}deg)`,
          border: `1px solid ${COLORS.primary}18`,
          borderLeft: `2px solid ${COLORS.primary}66`,
          borderRadius: "50%",
          opacity: haloOpacity * 0.6,
        }}
      />

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            textAlign: "center",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo entrance */}
          <Sequence from={0} layout="none">
            <Img
              src={staticFile("logo-white.png")}
              style={{
                width: 220,
                height: "auto",
                marginBottom: 30,
                transform: makeTransform([
                  scale(logoScaleVal),
                  translateY(logoNoiseY),
                ]),
                opacity: logoOpacity,
                filter: `blur(${logoBlur}px) drop-shadow(0 0 40px ${COLORS.brand}55)`,
                marginLeft: logoNoiseX,
              }}
            />
          </Sequence>

          {/* VISUAL - massive, kinetic */}
          <Sequence from={8} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 200,
                color: COLORS.text,
                letterSpacing: "-0.06em",
                lineHeight: 0.8,
                transform: `scale(${visualScale}) rotate(${visualRotation}deg)`,
                opacity: visualSpr,
                filter: visualBlur > 0.5 ? `blur(${visualBlur}px)` : undefined,
                textShadow: `0 0 80px ${COLORS.brand}33`,
              }}
            >
              VISUAL
            </div>
          </Sequence>

          {/* AI - giant italic yellow, slides from right */}
          <Sequence from={18} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 280,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.08em",
                lineHeight: 0.7,
                padding: "0.15em 0.3em",
                margin: "calc(-0.15em - 30px) -0.3em -0.15em",
                transform: `translateX(${aiX}px) skewX(-5deg)`,
                opacity: aiSpr,
                filter: aiBlur > 0.5 ? `blur(${aiBlur}px) drop-shadow(0 0 60px ${COLORS.brand}44)` : `drop-shadow(0 0 60px ${COLORS.brand}44)`,
              }}
            >
              AI
            </div>
          </Sequence>

          {/* SVG underline */}
          <Sequence from={10} layout="none">
            <svg
              width="800"
              height="30"
              viewBox="-10 -25 820 50"
              style={{ marginTop: -5, opacity: underlineProgress }}
            >
              <path
                d={UNDERLINE_PATH}
                fill="none"
                stroke={COLORS.brand}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={underlinePath.strokeDasharray}
                strokeDashoffset={underlinePath.strokeDashoffset}
              />
            </svg>
          </Sequence>

          {/* "The Generative" - small elegant caps */}
          <Sequence from={35} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: 28,
                color: COLORS.textMuted,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginTop: 15,
                transform: `translateY(${subY}px)`,
                opacity: subSpr,
              }}
            >
              The Generative
            </div>
          </Sequence>

          {/* "Playground" - BIG yellow italic */}
          <Sequence from={45} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 90,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
                transform: `scale(${playScale}) skewX(-3deg)`,
                opacity: playSpr,
                filter: `drop-shadow(0 0 30px ${COLORS.brand}33)`,
                marginTop: -5,
              }}
            >
              Playground
            </div>
          </Sequence>

          {/* "for creators" - tiny italic */}
          <Sequence from={60} layout="none">
            <div
              style={{
                fontFamily,
                fontWeight: 700,
                fontStyle: "italic",
                fontSize: 22,
                color: `${COLORS.textMuted}cc`,
                letterSpacing: "0.1em",
                textTransform: "lowercase",
                marginTop: 10,
                opacity: creatorsSpr,
                transform: `translateY(${interpolate(creatorsSpr, [0, 1], [15, 0])}px)`,
              }}
            >
              for creators
            </div>
          </Sequence>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

function translate(x: number, y: number) {
  return `translate(${x}px, ${y}px)`;
}
