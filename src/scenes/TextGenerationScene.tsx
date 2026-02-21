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
import { Typewriter } from "../components/Typewriter";
import { BrowserWindow } from "../components/BrowserWindow";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

const GENERATED_TEXT = `Certainly! Here is a script for a 30-second commercial:

[SCENE START]

INT. FUTURISTIC OFFICE - DAY

A young creative director sits at a holographic desk.

DIRECTOR
(To camera)
What if you could turn your wildest ideas into reality... instantly?`;

// Sparkle particles scattered across the scene
const SPARKLES = Array.from({ length: 24 }, (_, i) => ({
  x: random(`spark-x-${i}`) * 100,
  y: random(`spark-y-${i}`) * 100,
  size: random(`spark-s-${i}`) * 5 + 2,
  speed: random(`spark-sp-${i}`) * 0.5 + 0.3,
  delay: random(`spark-d-${i}`) * 40,
}));

// Typing indicator line path
const TYPING_LINE = "M 0 0 L 0 580";

export const TextGenerationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Background watermark "GENERATE" entrance ----
  const watermarkOpacity = interpolate(frame, [0, 30], [0, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const watermarkRotate = interpolate(frame, [0, 60], [-18, -15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ---- Browser entrance with scale + Y ----
  const entranceSpr = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.6 },
  });
  const entranceY = interpolate(entranceSpr, [0, 1], [60, 0]);
  const entranceScale = interpolate(entranceSpr, [0, 1], [0.88, 1]);
  const entranceBlur = interpolate(entranceSpr, [0, 1], [10, 0]);

  // ---- Typing indicator glow with noise ----
  const typingGlow = 0.3 + 0.3 * noise2D("typing", frame * 0.03, 0);

  // ---- Typing line path evolve ----
  const lineProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const evolvedLine = evolvePath(lineProgress, TYPING_LINE);

  // ---- Header accent color shift ----
  const accentColor = interpolateColors(
    frame,
    [0, 50, 105],
    [COLORS.brand, COLORS.brandDark, COLORS.brand]
  );

  // ---- Yellow glow pulse behind browser ----
  const glowPulse = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.08, 0.22]
  );
  const glowScale = interpolate(
    Math.sin(frame * 0.04),
    [-1, 1],
    [0.92, 1.08]
  );
  const glowEntrance = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 22, stiffness: 60 },
  });

  // ---- Header text entrances ----
  const headerSmallSpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.5 },
  });
  const headerSmallY = interpolate(headerSmallSpr, [0, 1], [30, 0]);
  const headerSmallBlur = interpolate(headerSmallSpr, [0, 1], [8, 0]);

  const headerBigSpr = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 12, stiffness: 90, mass: 0.7 },
  });
  const headerBigY = interpolate(headerBigSpr, [0, 1], [50, 0]);
  const headerBigScale = interpolate(headerBigSpr, [0, 1], [0.85, 1]);
  const headerBigBlur = interpolate(headerBigSpr, [0, 1], [12, 0]);

  // ---- Floating side label ----
  const sideLabelSpr = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.5 },
  });
  const sideLabelX = interpolate(sideLabelSpr, [0, 1], [-40, 0]);
  const sideLabelFloat =
    noise2D("side-label", frame * 0.012, 0) * 8 * sideLabelSpr;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgWhite,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ---- Background watermark "GENERATE" ---- */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${watermarkRotate}deg)`,
          fontFamily,
          fontSize: 250,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: watermarkOpacity,
          letterSpacing: 20,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        GENERATE
      </div>

      {/* ---- Yellow radial glow behind browser ---- */}
      <Sequence from={0} layout="none">
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            width: 1200,
            height: 600,
            transform: `translate(-50%, -30%) scale(${glowScale})`,
            background: `radial-gradient(ellipse at center, ${COLORS.brand}${Math.round(
              glowPulse * 255
            )
              .toString(16)
              .padStart(2, "0")} 0%, ${COLORS.brandCyan}15 40%, transparent 70%)`,
            borderRadius: "50%",
            opacity: glowEntrance,
            pointerEvents: "none",
          }}
        />
      </Sequence>

      {/* ---- Subtle accent radial ---- */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 900,
          height: 900,
          background: `radial-gradient(circle, ${accentColor}08 0%, ${COLORS.brandCyan}05 40%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* ---- Sparkle particles with noise drift ---- */}
      {SPARKLES.map((s, i) => {
        const sparkleFrame = frame - s.delay;
        const pulse = Math.sin(sparkleFrame * 0.1 * s.speed) * 0.5 + 0.5;
        const drift =
          noise2D(`sparkle-${i}`, sparkleFrame * 0.02, i * 3) * 15;
        const op = sparkleFrame > 0 ? pulse * 0.3 : 0;

        const star = makeStar({
          points: 4,
          innerRadius: s.size * 0.3,
          outerRadius: s.size,
        });

        return (
          <svg
            key={`sparkle-${i}`}
            width={s.size * 3}
            height={s.size * 3}
            viewBox={`0 0 ${star.width} ${star.height}`}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: op,
              transform: `translateY(${drift}px) rotate(${frame * s.speed * 2}deg)`,
              pointerEvents: "none",
            }}
          >
            <path
              d={star.path}
              fill={i % 3 === 0 ? COLORS.brand : i % 3 === 1 ? COLORS.textBlack : COLORS.brandDark}
              opacity="0.4"
            />
          </svg>
        );
      })}

      {/* ---- 3D Floating Diamonds ---- */}
      <FloatingDiamond
        size={55}
        color="rgba(255,214,0,0.18)"
        x={100}
        y={80}
        speed={0.7}
        delay={3}
        noiseId="dia-text-1"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={38}
        color="rgba(255,214,0,0.14)"
        x={1720}
        y={120}
        speed={1.2}
        delay={10}
        noiseId="dia-text-2"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={72}
        color="rgba(255,214,0,0.10)"
        x={160}
        y={820}
        speed={0.5}
        delay={6}
        noiseId="dia-text-3"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={30}
        color="rgba(255,214,0,0.22)"
        x={1640}
        y={780}
        speed={1.4}
        delay={16}
        noiseId="dia-text-4"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={48}
        color="rgba(255,214,0,0.12)"
        x={920}
        y={40}
        speed={0.9}
        delay={13}
        noiseId="dia-text-5"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={40}
        color="rgba(255,214,0,0.08)"
        x={60}
        y={450}
        speed={0.6}
        delay={20}
        noiseId="dia-text-6"
      />
      <FloatingDiamond
        size={25}
        color="rgba(255,214,0,0.16)"
        x={1780}
        y={500}
        speed={1.1}
        delay={8}
        noiseId="dia-text-7"
        glow
        glowColor={COLORS.brand}
      />

      {/* ---- Dramatic Header ABOVE browser ---- */}
      <Sequence from={0} layout="none">
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily,
            pointerEvents: "none",
          }}
        >
          {/* "Text" - small italic */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              fontStyle: "italic",
              color: COLORS.textBlack,
              letterSpacing: 8,
              textTransform: "uppercase",
              marginBottom: -8,
              opacity: headerSmallSpr,
              transform: `translateY(${headerSmallY}px)`,
              filter: `blur(${headerSmallBlur}px)`,
            }}
          >
            Text
          </div>

          {/* "GENERATION" - huge weight 900 */}
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: COLORS.textBlack,
              letterSpacing: -2,
              lineHeight: 0.95,
              opacity: headerBigSpr,
              transform: `translateY(${headerBigY}px) scale(${headerBigScale})`,
              filter: `blur(${headerBigBlur}px)`,
            }}
          >
            GENERATION
          </div>
        </div>
      </Sequence>

      {/* ---- Floating side label ---- */}
      <Sequence from={10} layout="none">
        <div
          style={{
            position: "absolute",
            left: 55,
            top: 420,
            fontFamily,
            opacity: sideLabelSpr * 0.7,
            transform: `translateX(${sideLabelX}px) translateY(${sideLabelFloat}px) rotate(-90deg)`,
            transformOrigin: "left center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: 6,
              textTransform: "uppercase",
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              padding: "0.15em 0.3em",
              backgroundClip: "text",
            }}
          >
            AI POWERED
          </div>
          <div
            style={{
              width: 60,
              height: 2,
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              marginTop: 6,
              opacity: 0.5,
            }}
          />
        </div>
      </Sequence>

      {/* ---- Browser window with typewriter content ---- */}
      <Sequence from={5} layout="none">
        <div
          style={{
            width: 1100,
            height: 620,
            marginTop: 160,
            transform: makeTransform([
              translateY(entranceY),
              scaleTf(entranceScale),
            ]),
            opacity: entranceSpr,
            filter: `blur(${entranceBlur}px) drop-shadow(0 0 60px ${COLORS.brand}18)`,
          }}
        >
          <BrowserWindow
            title="LLM Screenplay Assistant"
            style={{
              boxShadow: `0 40px 80px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,214,0,0.08) inset, 0 0 120px -40px ${COLORS.brand}15`,
            }}
          >
            <div
              style={{
                padding: 50,
                fontFamily,
                color: COLORS.textBlack,
                fontSize: 22,
                lineHeight: 1.6,
                background: "#fff",
                height: "100%",
              }}
            >
              {/* User prompt */}
              <Sequence from={10} layout="none">
                <div
                  style={{
                    marginBottom: 32,
                    color: accentColor,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 20,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${COLORS.brand}, ${COLORS.brandCyan})`,
                      boxShadow: `0 0 20px ${COLORS.brand}40`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: COLORS.textBlack, fontWeight: 600 }}>
                    User:
                  </span>{" "}
                  <span style={{ color: COLORS.textMutedDark, fontWeight: 400 }}>
                    Write a script for a 30s tech commercial
                  </span>
                </div>
              </Sequence>

              {/* Typewriter response with evolving side line */}
              <Sequence from={20} layout="none">
                <div
                  style={{
                    paddingLeft: 44,
                    position: "relative",
                    color: COLORS.textBlack,
                  }}
                >
                  {/* Evolving typing indicator line */}
                  <svg
                    width="4"
                    height="580"
                    viewBox="-2 0 4 580"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                    }}
                  >
                    <path
                      d={TYPING_LINE}
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity={0.5}
                      strokeDasharray={evolvedLine.strokeDasharray}
                      strokeDashoffset={evolvedLine.strokeDashoffset}
                    />
                  </svg>

                  {/* Typing glow on the line */}
                  <div
                    style={{
                      position: "absolute",
                      left: -4,
                      top: 0,
                      width: 8,
                      height: "100%",
                      background: `linear-gradient(to bottom, ${accentColor}00, ${accentColor}${Math.floor(
                        typingGlow * 255
                      )
                        .toString(16)
                        .padStart(2, "0")}, ${accentColor}00)`,
                      filter: "blur(4px)",
                    }}
                  />

                  <Typewriter
                    text={GENERATED_TEXT}
                    speed={3}
                    delay={5}
                    style={{ whiteSpace: "pre-wrap", fontSize: 20 }}
                    cursorColor={COLORS.brand}
                    pauseAfter={50}
                    pauseDuration={10}
                  />
                </div>
              </Sequence>
            </div>

            {/* Model badges with staggered springs */}
            <Sequence from={40} layout="none">
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  right: 30,
                  display: "flex",
                  gap: 16,
                }}
              >
                {["GPT-5", "Claude Opus", "Gemini"].map((model, i) => {
                  const badgeSpr = spring({
                    frame: Math.max(0, frame - 45 - i * 6),
                    fps,
                    config: { damping: 14, stiffness: 120, mass: 0.5 },
                  });
                  const badgeScale = interpolate(badgeSpr, [0, 1], [0.5, 1]);
                  const badgeBlur = interpolate(badgeSpr, [0, 1], [6, 0]);
                  const badgeY = interpolate(badgeSpr, [0, 1], [20, 0]);
                  const badgeFloat =
                    noise2D(`badge-${i}`, frame * 0.02, i) * 2 * badgeSpr;

                  return (
                    <div
                      key={i}
                      style={{
                        background: `linear-gradient(135deg, rgba(255,214,0,0.06) 0%, rgba(255,255,255,0.95) 50%, rgba(255,214,0,0.04) 100%)`,
                        border: `1.5px solid ${COLORS.brand}30`,
                        padding: "10px 20px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontFamily,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: COLORS.textBlack,
                        opacity: badgeSpr,
                        transform: `scale(${badgeScale}) translateY(${badgeY + badgeFloat}px)`,
                        filter: `blur(${badgeBlur}px)`,
                        boxShadow: `0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px ${COLORS.brand}10`,
                      }}
                    >
                      {model}
                    </div>
                  );
                })}
              </div>
            </Sequence>
          </BrowserWindow>
        </div>
      </Sequence>

      {/* ---- Bottom yellow accent line ---- */}
      <Sequence from={12} layout="none">
        {(() => {
          const lineSpr = spring({
            frame: Math.max(0, frame - 12),
            fps,
            config: { damping: 20, stiffness: 80 },
          });
          const lineWidth = interpolate(lineSpr, [0, 1], [0, 300]);

          return (
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: "50%",
                transform: "translateX(-50%)",
                width: lineWidth,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${COLORS.brand}, ${COLORS.brandCyan}, transparent)`,
                borderRadius: 2,
                opacity: lineSpr * 0.6,
              }}
            />
          );
        })()}
      </Sequence>
    </AbsoluteFill>
  );
};
