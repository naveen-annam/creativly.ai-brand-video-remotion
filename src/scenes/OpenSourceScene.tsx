import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  Easing,
  interpolateColors,
  random,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeStar, makeCircle } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Inter";
import { MatrixRain } from "../components/MatrixRain";
import { CharacterReveal } from "../components/CharacterReveal";
import { FloatingDiamond } from "../components/Rotating3D";
import { COLORS } from "../constants";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "900"] });

// Decorative star particles
const STAR_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: random(`os-x-${i}`) * 100,
  y: random(`os-y-${i}`) * 100,
  size: random(`os-s-${i}`) * 5 + 2,
  speed: random(`os-sp-${i}`) * 0.3 + 0.15,
}));

// Yellow accent star particles
const YELLOW_STAR_PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  x: random(`osy-x-${i}`) * 100,
  y: random(`osy-y-${i}`) * 100,
  size: random(`osy-s-${i}`) * 6 + 3,
  speed: random(`osy-sp-${i}`) * 0.25 + 0.1,
}));

// SVG connection path between stats
const STATS_CONNECTION = "M 0 0 C 60 -30 120 -30 180 0";

// Ring around GitHub logo
const LOGO_RING = makeCircle({ radius: 75 });
const LOGO_RING_PATH = LOGO_RING.path;

export const OpenSourceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance with scale + blur
  const logoSpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.5 },
  });
  const logoBlur = interpolate(logoSpr, [0, 1], [10, 0]);
  const logoScale = interpolate(logoSpr, [0, 1], [0.6, 1]);

  // Logo ring draw
  const ringDraw = interpolate(frame, [5, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedRing = evolvePath(ringDraw, LOGO_RING_PATH);

  // Animated counters with easing
  const starCount = Math.floor(
    interpolate(frame, [20, 65], [0, 12400], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );
  const forkCount = Math.floor(
    interpolate(frame, [25, 70], [0, 1800], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  // Green glow color cycling with noise
  const glowGreen = interpolateColors(frame, [0, 50, 105], [
    "#30d158",
    "#4ade80",
    "#30d158",
  ]);

  // Glow pulse with noise
  const glowPulse = 0.12 + 0.06 * noise2D("os-glow", frame * 0.02, 0);

  // Stats connection path draw
  const statsDraw = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedStats = evolvePath(statsDraw, STATS_CONNECTION);

  // Logo float with noise
  const logoFloatX = noise2D("os-lx", frame * 0.015, 0) * 4;
  const logoFloatY = noise2D("os-ly", 0, frame * 0.015) * 4;

  // Background watermark animation
  const watermarkSpr = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 30, stiffness: 40, mass: 1.2 },
  });
  const watermarkScale = interpolate(watermarkSpr, [0, 1], [0.8, 1]);
  const watermarkOpacity = interpolate(watermarkSpr, [0, 1], [0, 0.025]);

  // Tagline entrance
  const taglineSpr = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.5 },
  });
  const taglineBlur = interpolate(taglineSpr, [0, 1], [6, 0]);



  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0D1117",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Matrix rain */}
      <MatrixRain color="#30d158" opacity={0.12} fontSize={16} />

      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(#30363d 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: 0.15,
        }}
      />

      {/* Massive background watermark "OPEN" */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(-15deg) scale(${watermarkScale})`,
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
          letterSpacing: "0.05em",
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        OPEN
      </div>

      {/* Central green glow with noise pulse */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${glowGreen}${Math.floor(glowPulse * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)",
        }}
      />

      {/* Yellow accent glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "55%",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${COLORS.brand}25 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />

      {/* Star-shaped decorative particles with noise drift (green) */}
      {STAR_PARTICLES.map((p, i) => {
        const star = makeStar({ points: 4, innerRadius: p.size * 0.3, outerRadius: p.size });
        const drift = noise2D(`ospart-${i}`, frame * 0.015 * p.speed, i * 3) * 15;
        const driftY = noise2D(`osparty-${i}`, i * 3, frame * 0.015 * p.speed) * 15;
        const pulse = Math.sin(frame * 0.06 + i * 2) * 0.3 + 0.4;

        return (
          <svg
            key={`star-${i}`}
            width={p.size * 3}
            height={p.size * 3}
            viewBox={`0 0 ${star.width} ${star.height}`}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: pulse * 0.25,
              transform: `translate(${drift}px, ${driftY}px) rotate(${frame * p.speed * 2}deg)`,
              filter: `drop-shadow(0 0 3px ${glowGreen})`,
            }}
          >
            <path d={star.path} fill={glowGreen} />
          </svg>
        );
      })}

      {/* Yellow accent star particles */}
      {YELLOW_STAR_PARTICLES.map((p, i) => {
        const star = makeStar({ points: 4, innerRadius: p.size * 0.35, outerRadius: p.size });
        const drift = noise2D(`osypart-${i}`, frame * 0.012 * p.speed, i * 5) * 18;
        const driftY = noise2D(`osyparty-${i}`, i * 5, frame * 0.012 * p.speed) * 18;
        const pulse = Math.sin(frame * 0.05 + i * 3 + 1.5) * 0.35 + 0.45;

        return (
          <svg
            key={`ystar-${i}`}
            width={p.size * 3}
            height={p.size * 3}
            viewBox={`0 0 ${star.width} ${star.height}`}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: pulse * 0.3,
              transform: `translate(${drift}px, ${driftY}px) rotate(${frame * p.speed * 1.8 + 45}deg)`,
              filter: `drop-shadow(0 0 4px ${COLORS.brand})`,
            }}
          >
            <path d={star.path} fill={COLORS.brand} />
          </svg>
        );
      })}

      {/* FloatingDiamond 3D elements */}
      <FloatingDiamond
        size={50}
        color="rgba(255,214,0,0.25)"
        x={120}
        y={150}
        speed={0.8}
        delay={5}
        noiseId="os-dia-1"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={35}
        color="rgba(48,209,88,0.2)"
        x={1700}
        y={200}
        speed={1.1}
        delay={8}
        noiseId="os-dia-2"
        glow
        glowColor="#30d158"
      />
      <FloatingDiamond
        size={45}
        color="rgba(255,214,0,0.2)"
        x={1600}
        y={800}
        speed={0.7}
        delay={12}
        noiseId="os-dia-3"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={30}
        color="rgba(48,209,88,0.25)"
        x={200}
        y={750}
        speed={1.3}
        delay={10}
        noiseId="os-dia-4"
        glow
        glowColor="#30d158"
      />
      <FloatingDiamond
        size={25}
        color="rgba(255,214,0,0.3)"
        x={960}
        y={100}
        speed={0.9}
        delay={15}
        noiseId="os-dia-5"
        glow
        glowColor={COLORS.brand}
      />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        {/* Stage 1: GitHub logo with ring draw + scale+blur entrance */}
        <Sequence from={0} layout="none">
          <div
            style={{
              width: 160,
              height: 160,
              margin: "0 auto 40px",
              position: "relative",
              transform: `scale(${logoScale}) translate(${logoFloatX}px, ${logoFloatY}px)`,
              filter: `blur(${logoBlur}px)`,
              opacity: logoSpr,
            }}
          >
            {/* Animated ring SVG */}
            <svg
              width="160"
              height="160"
              viewBox={`0 0 ${LOGO_RING.width} ${LOGO_RING.height}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <path d={LOGO_RING_PATH} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <path d={LOGO_RING_PATH} fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray={evolvedRing.strokeDasharray} strokeDashoffset={evolvedRing.strokeDashoffset} />
            </svg>

            {/* GitHub icon centered */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <svg viewBox="0 0 24 24" width="70" height="70" fill="white">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          </div>
        </Sequence>

        {/* Stage 2: Title with split typography - "Open" huge italic + "Source" regular */}
        <Sequence from={3} layout="none">
          <div
            style={{
              marginBottom: 8,
              textShadow: `0 0 60px ${glowGreen}22, 0 0 120px ${COLORS.brand}11`,
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 20,
            }}
          >
            {/* "Open" - huge 160px italic */}
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: 160,
                lineHeight: 1,
              }}
            >
              <CharacterReveal
                text="Open"
                delay={0}
                stagger={2}
                springConfig={{ damping: 14, stiffness: 100, mass: 0.5 }}
                offsetY={40}
                blur
              />
            </div>
            {/* "Source" - 100px regular weight */}
            <div
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: 100,
                lineHeight: 1,
              }}
            >
              <CharacterReveal
                text="Source"
                delay={6}
                stagger={2}
                springConfig={{ damping: 14, stiffness: 100, mass: 0.5 }}
                offsetY={30}
                blur
              />
            </div>
          </div>
        </Sequence>

        {/* Tiny italic tagline "community driven" in yellow */}
        <Sequence from={14} layout="none">
          <div
            style={{
              fontFamily,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 26,
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              padding: "0.15em 0.3em",
              backgroundClip: "text",
              letterSpacing: "0.15em",
              textTransform: "lowercase",
              opacity: taglineSpr,
              filter: `blur(${taglineBlur}px)`,
              transform: `translateY(${interpolate(taglineSpr, [0, 1], [10, 0])}px)`,
              marginBottom: 20,
            }}
          >
            community driven
          </div>
        </Sequence>

        {/* Stage 3: License info with staggered spring + blur */}
        <Sequence from={10} layout="none">
          <div
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 40,
              color: "#8b949e",
              display: "flex",
              justifyContent: "center",
              gap: 40,
            }}
          >
            {["MIT License", "|", "Self-Hostable"].map((text, i) => {
              const infoSpr = spring({
                frame: Math.max(0, frame - 12 - i * 4),
                fps,
                config: { damping: 16, stiffness: 120, mass: 0.5 },
              });
              const infoBlur = interpolate(infoSpr, [0, 1], [5, 0]);

              return (
                <span
                  key={i}
                  style={{
                    opacity: infoSpr,
                    filter: `blur(${infoBlur}px)`,
                    color: i === 1 ? "#30363d" : "#8b949e",
                  }}
                >
                  {text}
                </span>
              );
            })}
          </div>
        </Sequence>

        {/* Stage 4: GitHub stats with animated counters + connection path */}
        <Sequence from={20} layout="none">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 40,
              marginTop: 40,
              position: "relative",
            }}
          >
            {/* SVG connection line between stat boxes */}
            <svg
              width="180"
              height="60"
              viewBox="-5 -35 190 65"
              style={{
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                opacity: 0.2,
              }}
            >
              <path
                d={STATS_CONNECTION}
                fill="none"
                stroke={glowGreen}
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray={evolvedStats.strokeDasharray}
                strokeDashoffset={evolvedStats.strokeDashoffset}
              />
            </svg>

            {/* Stars stat */}
            {(() => {
              const statSpr = spring({
                frame: Math.max(0, frame - 22),
                fps,
                config: { damping: 14, stiffness: 100, mass: 0.5 },
              });
              const statBlur = interpolate(statSpr, [0, 1], [6, 0]);
              const statScale = interpolate(statSpr, [0, 1], [0.7, 1]);

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid #30363d",
                    padding: "14px 28px",
                    borderRadius: 14,
                    transform: `scale(${statScale})`,
                    opacity: statSpr,
                    filter: `blur(${statBlur}px)`,
                    boxShadow: `0 0 20px ${glowGreen}11`,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#f0c000">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                  </svg>
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 700,
                      fontSize: 24,
                      color: "white",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {starCount.toLocaleString()}
                  </span>
                </div>
              );
            })()}

            {/* Forks stat */}
            {(() => {
              const statSpr = spring({
                frame: Math.max(0, frame - 26),
                fps,
                config: { damping: 14, stiffness: 100, mass: 0.5 },
              });
              const statBlur = interpolate(statSpr, [0, 1], [6, 0]);
              const statScale = interpolate(statSpr, [0, 1], [0.7, 1]);

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid #30363d",
                    padding: "14px 28px",
                    borderRadius: 14,
                    transform: `scale(${statScale})`,
                    opacity: statSpr,
                    filter: `blur(${statBlur}px)`,
                    boxShadow: `0 0 20px ${glowGreen}11`,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#8b949e">
                    <path d="M12 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zm-3.25-8.25a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm12.5 0a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zM5.75 11.5h.5a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-.5a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75zm6.25-8a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM12 4.75a.75.75 0 01.75.75v5.75a.75.75 0 01-1.5 0V5.5a.75.75 0 01.75-.75z" />
                  </svg>
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 700,
                      fontSize: 24,
                      color: "white",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {forkCount.toLocaleString()}
                  </span>
                </div>
              );
            })()}

            {/* Contributors stat */}
            {(() => {
              const contribCount = Math.floor(
                interpolate(frame, [30, 75], [0, 340], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                })
              );
              const statSpr = spring({
                frame: Math.max(0, frame - 30),
                fps,
                config: { damping: 14, stiffness: 100, mass: 0.5 },
              });
              const statBlur = interpolate(statSpr, [0, 1], [6, 0]);
              const statScale = interpolate(statSpr, [0, 1], [0.7, 1]);

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid #30363d",
                    padding: "14px 28px",
                    borderRadius: 14,
                    transform: `scale(${statScale})`,
                    opacity: statSpr,
                    filter: `blur(${statBlur}px)`,
                    boxShadow: `0 0 20px ${glowGreen}11`,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={glowGreen}>
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span
                    style={{
                      fontFamily,
                      fontWeight: 700,
                      fontSize: 24,
                      color: "white",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {contribCount}+
                  </span>
                </div>
              );
            })()}
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
