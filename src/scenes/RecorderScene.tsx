import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  interpolateColors,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeCircle } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";
import { makeTransform, translateY, scale as scaleTf } from "@remotion/animation-utils";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { BrowserWindow } from "../components/BrowserWindow";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", { weights: ["400", "700", "800"] });

// Recording progress ring path (circle)
const REC_RING = makeCircle({ radius: 12 });
const REC_RING_PATH = REC_RING.path;

export const RecorderScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // REC blink with noise variation
  const blinkBase = Math.sin(frame * 0.2) > 0 ? 1 : 0.3;
  const blinkNoise = noise2D("blink", frame * 0.05, 0) * 0.1;
  const blink = Math.max(0, Math.min(1, blinkBase + blinkNoise));

  // Timer
  const seconds = Math.floor(frame / fps);
  const centiseconds = Math.floor(((frame % fps) / fps) * 100);
  const timerStr = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;

  // Entrance with scale + blur
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.6 },
  });
  const entranceY = interpolate(entrance, [0, 1], [80, 0]);
  const entranceScale = interpolate(entrance, [0, 1], [0.85, 1]);
  const entranceBlur = interpolate(entrance, [0, 1], [10, 0]);

  // Recording progress ring
  const recProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const evolvedRing = evolvePath(recProgress, REC_RING_PATH);

  // Waveform bars with noise
  const WAVE_BARS = 24;

  // Accent glow color shift - now includes yellow
  const glowColor = interpolateColors(frame, [0, 30, 60, 90], [
    COLORS.accent,
    "#ff6b35",
    COLORS.brand,
    COLORS.accent,
  ]);

  // Floating label entrance
  const labelSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 70, mass: 0.8 },
  });
  const labelX = interpolate(labelSpring, [0, 1], [-60, 0]);
  const labelOpacity = labelSpring;

  // Tagline entrance
  const taglineSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 16, stiffness: 60 },
  });

  // Background watermark drift
  const watermarkDriftX = noise2D("wm-x", frame * 0.003, 0) * 20;
  const watermarkDriftY = noise2D("wm-y", 0, frame * 0.003) * 15;
  const watermarkOpacity = interpolate(
    entrance,
    [0, 0.5, 1],
    [0, 0, 0.025],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ===== MASSIVE BACKGROUND WATERMARK "REC" ===== */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(-10deg) translate(${watermarkDriftX}px, ${watermarkDriftY}px)`,
          fontSize: 500,
          fontFamily,
          fontWeight: 800,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: watermarkOpacity,
          letterSpacing: "0.05em",
          userSelect: "none",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        REC
      </div>

      {/* ===== Accent glows with noise position + yellow accent ===== */}
      <div
        style={{
          position: "absolute",
          top: -100 + noise2D("glow1", frame * 0.01, 0) * 30,
          left: -100 + noise2D("glow1x", 0, frame * 0.01) * 30,
          width: 600,
          height: 600,
          background: glowColor,
          filter: "blur(150px)",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100 + noise2D("glow2", frame * 0.01, 5) * 20,
          right: -100 + noise2D("glow2x", 5, frame * 0.01) * 20,
          width: 500,
          height: 500,
          background: COLORS.primary,
          filter: "blur(150px)",
          opacity: 0.08,
        }}
      />
      {/* Yellow accent glow */}
      <div
        style={{
          position: "absolute",
          top: 200 + noise2D("glow3", frame * 0.008, 3) * 40,
          right: 100 + noise2D("glow3x", 3, frame * 0.008) * 30,
          width: 400,
          height: 400,
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          filter: "blur(180px)",
          opacity: interpolate(
            Math.sin(frame * 0.04),
            [-1, 1],
            [0.03, 0.07]
          ),
        }}
      />

      {/* ===== FLOATING DIAMOND 3D ELEMENTS ===== */}
      <FloatingDiamond
        size={45}
        color="rgba(255,214,0,0.25)"
        x={120}
        y={180}
        speed={0.8}
        delay={5}
        noiseId="dia-rec-1"
        glow
        glowColor={COLORS.brand}
      />
      <FloatingDiamond
        size={30}
        color="rgba(255,214,0,0.15)"
        x={1700}
        y={120}
        speed={1.2}
        delay={10}
        noiseId="dia-rec-2"
      />
      <FloatingDiamond
        size={55}
        color="rgba(244,63,94,0.2)"
        x={1650}
        y={800}
        speed={0.6}
        delay={15}
        noiseId="dia-rec-3"
        glow
        glowColor={COLORS.accent}
      />
      <FloatingDiamond
        size={25}
        color="rgba(255,214,0,0.3)"
        x={200}
        y={850}
        speed={1.5}
        delay={12}
        noiseId="dia-rec-4"
      />
      <FloatingDiamond
        size={38}
        color="rgba(59,130,246,0.2)"
        x={80}
        y={520}
        speed={0.9}
        delay={20}
        noiseId="dia-rec-5"
      />
      <FloatingDiamond
        size={20}
        color="rgba(255,214,0,0.35)"
        x={1780}
        y={480}
        speed={1.8}
        delay={8}
        noiseId="dia-rec-6"
        glow
        glowColor={COLORS.brand}
      />

      {/* ===== DRAMATIC FLOATING LABEL ===== */}
      <Sequence from={8} layout="none">
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 340,
            transform: `translateX(${labelX}px)`,
            opacity: labelOpacity,
            display: "flex",
            flexDirection: "column",
            gap: 0,
            zIndex: 10,
          }}
        >
          {/* "Screen" tiny italic */}
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontStyle: "italic",
              fontWeight: 400,
              color: COLORS.textMuted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            Screen
          </div>
          {/* "RECORDER" huge bold */}
          <div
            style={{
              fontFamily,
              fontSize: 80,
              fontWeight: 800,
              color: COLORS.text,
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              textShadow: `0 0 60px ${COLORS.brand}22, 0 4px 20px rgba(0,0,0,0.5)`,
            }}
          >
            RECORDER
          </div>
          {/* Tiny italic tagline "capture everything" */}
          <Sequence from={10} layout="none">
            <div
              style={{
                fontFamily,
                fontSize: 14,
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                padding: "0.15em 0.3em",
                backgroundClip: "text",
                letterSpacing: "0.3em",
                textTransform: "lowercase",
                marginTop: 8,
                opacity: taglineSpring,
                transform: `translateY(${interpolate(taglineSpring, [0, 1], [10, 0])}px)`,
              }}
            >
              capture everything
            </div>
          </Sequence>
        </div>
      </Sequence>

      {/* ===== BROWSER WINDOW + ALL EXISTING UI ===== */}
      {/* Stage 1: Browser window entrance with scale + blur */}
      <Sequence from={0} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: makeTransform([
              translateY(entranceY),
              scaleTf(entranceScale),
            ]),
            opacity: entrance,
            filter: `blur(${entranceBlur}px)`,
            paddingLeft: 280,
          }}
        >
          <div style={{ width: 1200, height: 720, position: "relative" }}>
            <BrowserWindow title="Screen Recorder">
              <div
                style={{
                  flex: 1,
                  background: "#111",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: COLORS.textMuted,
                    fontFamily,
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 40,
                      background: "#222",
                      borderRadius: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                      padding: 40,
                    }}
                  >
                    <div style={{ width: "40%", height: 40, background: "#333", borderRadius: 8 }} />
                    <div style={{ width: "100%", height: 20, background: "#333", borderRadius: 4 }} />
                    <div style={{ width: "90%", height: 20, background: "#333", borderRadius: 4 }} />
                    <div style={{ width: "70%", height: 20, background: "#333", borderRadius: 4 }} />

                    {/* Cursor with noise-based movement */}
                    <div
                      style={{
                        position: "absolute",
                        left: `${30 + noise2D("cursor-x", frame * 0.015, 0) * 25}%`,
                        top: `${40 + noise2D("cursor-y", 0, frame * 0.015) * 18}%`,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: COLORS.primary,
                        boxShadow: `0 0 20px ${COLORS.primary}88`,
                        opacity: 0.8,
                      }}
                    />
                  </div>

                  {/* Camera overlay */}
                  <Sequence from={15} layout="none">
                    {(() => {
                      const camSpr = spring({
                        frame: Math.max(0, frame - 15),
                        fps,
                        config: { damping: 14, stiffness: 100 },
                      });
                      return (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 60,
                            right: 60,
                            width: 300,
                            height: 180,
                            borderRadius: 20,
                            background: COLORS.bgSurface,
                            border: `4px solid ${COLORS.accent}`,
                            overflow: "hidden",
                            boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${COLORS.accent}33`,
                            transform: `scale(${interpolate(camSpr, [0, 1], [0.5, 1])})`,
                            opacity: camSpr,
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "linear-gradient(45deg, #333, #444)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              color: "white",
                              fontFamily,
                              fontWeight: 800,
                              fontSize: 18,
                            }}
                          >
                            USER CAM
                          </div>
                        </div>
                      );
                    })()}
                  </Sequence>
                </div>
              </div>
            </BrowserWindow>

            {/* Stage 2: REC indicator with ring progress */}
            <Sequence from={5} layout="none">
              <div
                style={{
                  position: "absolute",
                  top: 60,
                  left: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(0,0,0,0.6)",
                  padding: "8px 16px",
                  borderRadius: 100,
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Recording ring */}
                <div style={{ position: "relative", width: 28, height: 28 }}>
                  <svg width="28" height="28" viewBox={`0 0 ${REC_RING.width} ${REC_RING.height}`}>
                    <path d={REC_RING_PATH} fill="none" stroke="rgba(255,0,0,0.2)" strokeWidth="2" />
                    <path d={REC_RING_PATH} fill="none" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" strokeDasharray={evolvedRing.strokeDasharray} strokeDashoffset={evolvedRing.strokeDashoffset} />
                  </svg>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#ff0000",
                      transform: "translate(-50%, -50%)",
                      opacity: blink,
                      boxShadow: `0 0 10px rgba(255,0,0,${blink * 0.5})`,
                    }}
                  />
                </div>
                <div style={{ color: "white", fontFamily, fontWeight: 700, fontSize: 16 }}>
                  REC
                </div>
                <div
                  style={{
                    color: COLORS.textMuted,
                    fontFamily,
                    fontWeight: 400,
                    fontSize: 14,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timerStr}
                </div>
              </div>
            </Sequence>

            {/* Stage 3: Waveform with noise-driven bars */}
            <Sequence from={8} layout="none">
              <div
                style={{
                  position: "absolute",
                  top: 60,
                  right: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  background: "rgba(0,0,0,0.6)",
                  padding: "10px 16px",
                  borderRadius: 100,
                  backdropFilter: "blur(10px)",
                }}
              >
                {new Array(WAVE_BARS).fill(0).map((_, i) => {
                  const waveNoise = noise2D(`wave-${i}`, frame * 0.04, i * 0.8);
                  const wave = Math.sin(frame * 0.3 + i * 0.8) * 0.5 + 0.5;
                  const h = 4 + (wave + waveNoise * 0.3) * 16;

                  const barColor = interpolateColors(
                    i,
                    [0, WAVE_BARS / 2, WAVE_BARS - 1],
                    [COLORS.success, "#4ade80", COLORS.success]
                  );

                  return (
                    <div
                      key={i}
                      style={{
                        width: 3,
                        height: Math.max(2, h),
                        background: barColor,
                        borderRadius: 2,
                        opacity: 0.8,
                      }}
                    />
                  );
                })}
              </div>
            </Sequence>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
