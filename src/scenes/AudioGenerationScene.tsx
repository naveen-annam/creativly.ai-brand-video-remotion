import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  interpolateColors,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { SplitText } from "../components/SplitText";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

const BARS = 40;

// Waveform SVG path (sine wave)
const buildWavePath = (bars: number): string => {
  let d = `M 0 150`;
  for (let i = 0; i <= bars; i++) {
    const x = (i / bars) * 1200;
    const y = 150 - Math.sin(i * 0.3) * 60;
    d += ` L ${x} ${y}`;
  }
  return d;
};
const WAVE_PATH = buildWavePath(60);

export const AudioGenerationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Waveform path evolution
  const waveProg = interpolate(frame, [5, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedWave = evolvePath(waveProg, WAVE_PATH);

  // Background watermark entrance
  const watermarkOpacity = interpolate(frame, [0, 30], [0, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const watermarkRotate = interpolate(frame, [0, 60], [-18, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Yellow glow pulse behind audio bars
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.15, 0.35]
  );
  const glowScale = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.9, 1.1]
  );
  const glowEntrance = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgWhite,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ---- Background watermark "SOUND" ---- */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${watermarkRotate}deg)`,
          fontFamily,
          fontSize: 350,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: watermarkOpacity,
          letterSpacing: 30,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        SOUND
      </div>

      {/* Subtle waveform SVG in background */}
      <svg
        width="1920"
        height="300"
        viewBox="0 0 1200 300"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          opacity: 0.06,
        }}
      >
        <path
          d={WAVE_PATH}
          fill="none"
          stroke={COLORS.brand}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={evolvedWave.strokeDasharray}
          strokeDashoffset={evolvedWave.strokeDashoffset}
        />
      </svg>

      {/* ---- 3D Floating Diamonds ---- */}
      <FloatingDiamond
        size={50}
        color="rgba(255,214,0,0.18)"
        x={120}
        y={100}
        speed={0.7}
        delay={5}
        noiseId="dia-audio-1"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={35}
        color="rgba(255,214,0,0.14)"
        x={1700}
        y={150}
        speed={1.2}
        delay={12}
        noiseId="dia-audio-2"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={70}
        color="rgba(255,214,0,0.10)"
        x={200}
        y={800}
        speed={0.5}
        delay={8}
        noiseId="dia-audio-3"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={28}
        color="rgba(255,214,0,0.20)"
        x={1600}
        y={750}
        speed={1.5}
        delay={18}
        noiseId="dia-audio-4"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={45}
        color="rgba(255,214,0,0.12)"
        x={950}
        y={60}
        speed={0.9}
        delay={15}
        noiseId="dia-audio-5"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={55}
        color="rgba(255,214,0,0.08)"
        x={80}
        y={480}
        speed={0.6}
        delay={20}
        noiseId="dia-audio-6"
      />

      {/* ---- WILD Typographic Hierarchy ---- */}
      <Sequence from={0} layout="none">
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily,
          }}
        >
          {/* "Generative" - 60px italic black */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              fontStyle: "italic",
              color: COLORS.textBlack,
              letterSpacing: 6,
              marginBottom: -10,
            }}
          >
            <SplitText
              text="Generative"
              delay={0}
              stagger={2}
              direction="up"
              springConfig={{ damping: 16, stiffness: 130, mass: 0.5 }}
            />
          </div>

          {/* "AUDIO" - 200px weight 900 black */}
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: COLORS.textBlack,
              letterSpacing: -4,
              lineHeight: 0.9,
              marginBottom: -5,
            }}
          >
            <SplitText
              text="AUDIO"
              delay={4}
              stagger={3}
              direction="up"
              springConfig={{ damping: 14, stiffness: 110, mass: 0.6 }}
            />
          </div>

          {/* "& Music" - 80px italic yellow */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              fontStyle: "italic",
              letterSpacing: 3,
            }}
          >
            <SplitText
              text="& Music"
              delay={8}
              stagger={3}
              direction="up"
              springConfig={{ damping: 16, stiffness: 130, mass: 0.5 }}
              gradient
            />
          </div>
        </div>
      </Sequence>

      {/* ---- Yellow Glow Behind Audio Bars ---- */}
      <Sequence from={10} layout="none">
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 1100,
            height: 400,
            transform: `translate(-50%, -10%) scale(${glowScale})`,
            background: `radial-gradient(ellipse at center, ${COLORS.brand}${Math.round(glowPulse * 255)
              .toString(16)
              .padStart(2, "0")} 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
            borderRadius: "50%",
            opacity: glowEntrance,
            pointerEvents: "none",
          }}
        />
      </Sequence>

      {/* ---- Audio Bars with Noise-Driven Heights ---- */}
      <Sequence from={10} layout="none">
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -15%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              height: 280,
            }}
          >
            {new Array(BARS).fill(0).map((_, i) => {
              const barSpr = spring({
                frame: Math.max(0, frame - 10 - i * 0.8),
                fps,
                config: { damping: 18, stiffness: 80 },
              });
              const wave = Math.sin(frame * 0.2 + i * 0.5) * 0.5 + 0.5;
              // Noise for organic variation
              const noiseVal =
                noise2D(`bar-${i}`, frame * 0.03, i * 0.5) * 0.25;
              const barHeight = Math.max(10, (wave + noiseVal) * 240 * barSpr);

              // Bar color: gradient from dark to yellow at center then back
              const barColor = interpolateColors(
                i,
                [0, BARS * 0.3, BARS * 0.5, BARS * 0.7, BARS - 1],
                [
                  COLORS.textBlack,
                  COLORS.brand,
                  COLORS.brand,
                  COLORS.brand,
                  COLORS.textBlack,
                ]
              );

              const barOpacity = interpolate(barSpr, [0, 1], [0, 0.9]);

              return (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: barHeight,
                    background: `linear-gradient(to top, ${barColor}, ${barColor}cc)`,
                    borderRadius: 10,
                    opacity: barOpacity,
                    boxShadow:
                      barHeight > 100
                        ? `0 0 12px ${COLORS.brand}55, 0 2px 20px ${COLORS.brand}22`
                        : "none",
                  }}
                />
              );
            })}
          </div>

          {/* Reflection below bars */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              height: 60,
              transform: "scaleY(-1)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)",
            }}
          >
            {new Array(BARS).fill(0).map((_, i) => {
              const barSpr = spring({
                frame: Math.max(0, frame - 10 - i * 0.8),
                fps,
                config: { damping: 18, stiffness: 80 },
              });
              const wave = Math.sin(frame * 0.2 + i * 0.5) * 0.5 + 0.5;
              const noiseVal =
                noise2D(`bar-${i}`, frame * 0.03, i * 0.5) * 0.25;
              const barHeight = Math.max(4, (wave + noiseVal) * 50 * barSpr);

              const barColor = interpolateColors(
                i,
                [0, BARS * 0.3, BARS * 0.5, BARS * 0.7, BARS - 1],
                [
                  COLORS.textBlack,
                  COLORS.brand,
                  COLORS.brand,
                  COLORS.brand,
                  COLORS.textBlack,
                ]
              );

              return (
                <div
                  key={i}
                  style={{
                    width: 20,
                    height: barHeight,
                    background: `linear-gradient(to top, ${barColor}33, ${barColor}18)`,
                    borderRadius: 10,
                  }}
                />
              );
            })}
          </div>
        </div>
      </Sequence>

      {/* ---- Tech Badges ---- */}
      <Sequence from={25} layout="none">
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 40,
          }}
        >
          {["Suno", "Udio", "ElevenLabs", "Whisper"].map((tech, i) => {
            const techSpr = spring({
              frame: Math.max(0, frame - 30 - i * 5),
              fps,
              config: { damping: 14, stiffness: 120, mass: 0.5 },
            });
            const techBlur = interpolate(techSpr, [0, 1], [8, 0]);
            const techScale = interpolate(techSpr, [0, 1], [0.6, 1]);
            const techY = interpolate(techSpr, [0, 1], [30, 0]);

            // Subtle hover-like float
            const floatOffset =
              noise2D(`badge-${i}`, frame * 0.02, i) * 3 * techSpr;

            return (
              <div
                key={i}
                style={{
                  fontFamily,
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: COLORS.textBlack,
                  border: `2px solid ${COLORS.textBlack}18`,
                  padding: "16px 36px",
                  borderRadius: 14,
                  transform: `scale(${techScale}) translateY(${techY + floatOffset}px)`,
                  opacity: techSpr,
                  filter: `blur(${techBlur}px)`,
                  background: `linear-gradient(135deg, rgba(255,214,0,0.06) 0%, rgba(255,255,255,0.9) 50%, rgba(255,214,0,0.04) 100%)`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px ${COLORS.brand}15`,
                  backdropFilter: "blur(4px)",
                }}
              >
                {tech}
              </div>
            );
          })}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
