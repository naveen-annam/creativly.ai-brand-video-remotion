import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { CharacterReveal } from "../components/CharacterReveal";
import { FloatingDiamond } from "../components/Rotating3D";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "800", "900"],
});

/* ---------- cursor data ---------- */
const CURSORS = [
  {
    color: "#FF5733",
    label: "Sarah",
    role: "Designer",
    start: { x: 80, y: 850 },
    end: { x: 760, y: 420 },
    delay: 10,
  },
  {
    color: "#33FF57",
    label: "Mike",
    role: "Developer",
    start: { x: 1850, y: 920 },
    end: { x: 1120, y: 490 },
    delay: 15,
  },
  {
    color: "#3357FF",
    label: "Alex",
    role: "PM",
    start: { x: 480, y: -120 },
    end: { x: 880, y: 310 },
    delay: 20,
  },
  {
    color: "#F0F",
    label: "Nina",
    role: "Writer",
    start: { x: 1920, y: 80 },
    end: { x: 1220, y: 620 },
    delay: 25,
  },
];

/* ---------- curved connection paths between cursor endpoints ---------- */
const CONN_PATHS = CURSORS.map((c, i) => {
  const next = CURSORS[(i + 1) % CURSORS.length];
  const mx = (c.end.x + next.end.x) / 2;
  const my = (c.end.y + next.end.y) / 2 - 100;
  return `M ${c.end.x} ${c.end.y} Q ${mx} ${my} ${next.end.x} ${next.end.y}`;
});

/* ---------- diamond positions ---------- */
const DIAMONDS = [
  { x: 120, y: 140, size: 50, speed: 0.8, delay: 3, noiseId: "d1", color: "rgba(255,214,0,0.18)", glow: true },
  { x: 1750, y: 180, size: 70, speed: 1.1, delay: 6, noiseId: "d2", color: "rgba(255,214,0,0.14)", glow: true },
  { x: 1650, y: 820, size: 40, speed: 1.4, delay: 9, noiseId: "d3", color: "rgba(10,10,10,0.08)", glow: false },
  { x: 200, y: 750, size: 55, speed: 0.6, delay: 12, noiseId: "d4", color: "rgba(255,214,0,0.12)", glow: true },
  { x: 960, y: 120, size: 35, speed: 1.0, delay: 5, noiseId: "d5", color: "rgba(10,10,10,0.06)", glow: false },
  { x: 1400, y: 450, size: 45, speed: 0.9, delay: 8, noiseId: "d6", color: "rgba(255,214,0,0.10)", glow: true },
  { x: 350, y: 400, size: 30, speed: 1.3, delay: 14, noiseId: "d7", color: "rgba(10,10,10,0.05)", glow: false },
];

/* ---------- cursor icon with stylish label ---------- */
const CursorIcon = ({
  color,
  label,
  role,
  cursorScale = 1,
  labelOpacity = 1,
}: {
  color: string;
  label: string;
  role: string;
  cursorScale?: number;
  labelOpacity?: number;
}) => (
  <div style={{ position: "relative", transform: `scale(${cursorScale})` }}>
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        filter: `drop-shadow(0 3px 6px rgba(0,0,0,0.35)) drop-shadow(0 0 16px ${color}77)`,
      }}
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.1943L11.4841 12.3673H5.65376Z"
        fill={color}
        stroke="white"
        strokeWidth="1.2"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 18,
        top: 18,
        display: "flex",
        alignItems: "center",
        gap: 6,
        backgroundColor: color,
        padding: "5px 14px 5px 12px",
        borderRadius: 20,
        color: "white",
        fontSize: 15,
        fontFamily,
        fontWeight: 800,
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
        boxShadow: `0 4px 14px rgba(0,0,0,0.25), 0 0 24px ${color}55`,
        opacity: labelOpacity,
      }}
    >
      {label}
      <span
        style={{
          fontSize: 11,
          fontWeight: 400,
          opacity: 0.8,
          fontStyle: "italic",
          marginLeft: 2,
        }}
      >
        {role}
      </span>
    </div>
  </div>
);

/* ========== SCENE ========== */
export const CollaborationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* --- watermark noise drift --- */
  const watermarkDriftX = noise2D("wm-x", frame * 0.004, 0) * 20;
  const watermarkDriftY = noise2D("wm-y", 0, frame * 0.004) * 12;

  /* --- title entrance springs --- */
  const subtitleSpr = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.6 },
  });
  const subtitleY = interpolate(subtitleSpr, [0, 1], [50, 0]);

  const mainTitleSpr = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.8 },
  });
  const mainTitleScale = interpolate(mainTitleSpr, [0, 1], [0.6, 1]);
  const mainTitleBlur = interpolate(mainTitleSpr, [0, 1], [20, 0]);

  const togetherSpr = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 10, stiffness: 60, mass: 1 },
  });
  const togetherY = interpolate(togetherSpr, [0, 1], [60, 0]);
  const togetherRotate = interpolate(togetherSpr, [0, 1], [8, -3]);

  /* --- global noise micro-movement for entire title block --- */
  const titleBlockNoiseX = noise2D("tbx", frame * 0.008, 0) * 4;
  const titleBlockNoiseY = noise2D("tby", 0, frame * 0.008) * 3;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgWhite, overflow: "hidden" }}>

      {/* ====== BACKGROUND WATERMARK "COLLAB" ====== */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotate(-10deg) translate(${watermarkDriftX}px, ${watermarkDriftY}px)`,
          fontFamily,
          fontSize: 400,
          fontWeight: 900,
          fontStyle: "italic",
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          padding: "0.15em 0.3em",
          backgroundClip: "text",
          opacity: 0.04,
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        COLLAB
      </div>

      {/* ====== FLOATING DIAMONDS (3D) ====== */}
      <Sequence from={0} layout="none">
        {DIAMONDS.map((d) => (
          <FloatingDiamond
            key={d.noiseId}
            x={d.x}
            y={d.y}
            size={d.size}
            speed={d.speed}
            delay={d.delay}
            noiseId={d.noiseId}
            color={d.color}
            glow={d.glow}
            glowColor={COLORS.brand}
          />
        ))}
      </Sequence>

      {/* ====== TYPOGRAPHIC TITLE BLOCK ====== */}
      <Sequence from={0} layout="none">
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              textAlign: "center",
              transform: `translate(${titleBlockNoiseX}px, ${titleBlockNoiseY}px)`,
            }}
          >
            {/* "Real-Time" - small italic uppercase */}
            <div
              style={{
                fontFamily,
                fontSize: 32,
                fontWeight: 400,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.35em",
                color: COLORS.textMutedDark,
                opacity: subtitleSpr,
                transform: `translateY(${subtitleY}px)`,
                marginBottom: 8,
              }}
            >
              <CharacterReveal
                text="Real-Time"
                delay={0}
                stagger={2}
                springConfig={{ damping: 16, stiffness: 120, mass: 0.4 }}
                offsetY={25}
              />
            </div>

            {/* "Collaboration" - MASSIVE */}
            <div
              style={{
                fontFamily,
                fontSize: 180,
                fontWeight: 900,
                lineHeight: 0.9,
                color: COLORS.textBlack,
                transform: `scale(${mainTitleScale})`,
                filter: `blur(${mainTitleBlur}px)`,
                opacity: mainTitleSpr,
                letterSpacing: "-0.03em",
              }}
            >
              <CharacterReveal
                text="Collaboration"
                delay={8}
                stagger={1.5}
                springConfig={{ damping: 14, stiffness: 90, mass: 0.5 }}
                offsetY={60}
              />
            </div>

            {/* "TOGETHER" - large italic yellow, rotated */}
            <div
              style={{
                fontFamily,
                fontSize: 100,
                fontWeight: 900,
                fontStyle: "italic",
                opacity: togetherSpr,
                transform: `translateY(${togetherY}px) rotate(${togetherRotate}deg)`,
                marginTop: 10,
                letterSpacing: "0.02em",
              }}
            >
              <CharacterReveal
                text="TOGETHER"
                delay={20}
                stagger={2}
                springConfig={{ damping: 12, stiffness: 80, mass: 0.6 }}
                offsetY={40}
                gradient
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ====== CONNECTION LINES WITH evolvePath ====== */}
      <Sequence from={15} layout="none">
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {CONN_PATHS.map((path, i) => {
            const startFrame =
              Math.max(
                CURSORS[i].delay,
                CURSORS[(i + 1) % CURSORS.length].delay
              ) + 10;
            const pathProg = interpolate(
              frame,
              [startFrame, startFrame + 25],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );
            const evolved = evolvePath(pathProg, path);

            /* subtle noise-driven opacity pulse */
            const lineNoisePulse =
              0.25 + noise2D(`conn-${i}`, frame * 0.02, i) * 0.1;

            return (
              <path
                key={`conn-${i}`}
                d={path}
                fill="none"
                stroke={CURSORS[i].color}
                strokeWidth="2"
                strokeDasharray={evolved.strokeDasharray}
                strokeDashoffset={evolved.strokeDashoffset}
                opacity={lineNoisePulse}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </Sequence>

      {/* ====== RIPPLE RINGS at cursor destinations ====== */}
      <Sequence from={20} layout="none">
        {CURSORS.map((cursor, i) => {
          const rippleFrame = frame - cursor.delay - 15;

          return [0, 1, 2].map((ring) => {
            const ringDelay = ring * 7;
            const ringFrame = rippleFrame - ringDelay;
            const ringScale = interpolate(ringFrame, [0, 30], [0, 120], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const ringOp = interpolate(ringFrame, [0, 8, 30], [0, 0.5, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return ringFrame > 0 ? (
              <div
                key={`ripple-${i}-${ring}`}
                style={{
                  position: "absolute",
                  left: cursor.end.x,
                  top: cursor.end.y,
                  width: ringScale,
                  height: ringScale,
                  borderRadius: "50%",
                  border: `2px solid ${cursor.color}`,
                  transform: "translate(-50%, -50%)",
                  opacity: ringOp,
                  pointerEvents: "none",
                }}
              />
            ) : null;
          });
        })}
      </Sequence>

      {/* ====== CURSORS with noise-based path wobble ====== */}
      <Sequence from={5} layout="none">
        {CURSORS.map((cursor, i) => {
          const spr = spring({
            frame: Math.max(0, frame - cursor.delay),
            fps,
            config: { damping: 18, stiffness: 50 },
          });

          const click = spring({
            frame: Math.max(0, frame - cursor.delay - 22),
            fps,
            config: { damping: 10, stiffness: 200 },
          });
          const clickScale = interpolate(click, [0, 0.5, 1], [1, 0.75, 1]);

          /* noise wobble on the path while in transit */
          const inTransit = spr > 0.02 && spr < 0.98;
          const pathNoiseX = inTransit
            ? noise2D(`cur-${i}-x`, frame * 0.035, i) * 18
            : noise2D(`cur-${i}-idle-x`, frame * 0.008, i) * 3;
          const pathNoiseY = inTransit
            ? noise2D(`cur-${i}-y`, i, frame * 0.035) * 14
            : noise2D(`cur-${i}-idle-y`, i, frame * 0.008) * 2;

          const x =
            interpolate(spr, [0, 1], [cursor.start.x, cursor.end.x]) +
            pathNoiseX;
          const cy =
            interpolate(spr, [0, 1], [cursor.start.y, cursor.end.y]) +
            pathNoiseY;

          /* label fade in slightly after cursor appears */
          const labelSpr = spring({
            frame: Math.max(0, frame - cursor.delay - 5),
            fps,
            config: { damping: 20, stiffness: 100 },
          });

          /* trail particle */
          const showTrail = spr > 0.08 && spr < 0.92;

          /* entrance opacity */
          const cursorOpacity = interpolate(
            frame,
            [cursor.delay, cursor.delay + 3],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div key={`cursor-group-${i}`}>
              {/* trail glow */}
              {showTrail && (
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: cy,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: cursor.color,
                    filter: `blur(6px)`,
                    opacity: 0.35,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}

              {/* cursor */}
              <div
                style={{
                  position: "absolute",
                  transform: `translate(${x}px, ${cy}px)`,
                  opacity: cursorOpacity,
                }}
              >
                <CursorIcon
                  color={cursor.color}
                  label={cursor.label}
                  role={cursor.role}
                  cursorScale={clickScale}
                  labelOpacity={labelSpr}
                />
              </div>
            </div>
          );
        })}
      </Sequence>

      {/* ====== DECORATIVE DOTS along edges (noise-driven) ====== */}
      <Sequence from={0} layout="none">
        {Array.from({ length: 12 }, (_, i) => {
          const dotDelay = i * 3;
          const dotSpr = spring({
            frame: Math.max(0, frame - dotDelay),
            fps,
            config: { damping: 20, stiffness: 100 },
          });
          const bx = noise2D(`dot-x-${i}`, frame * 0.006, i) * 6;
          const by = noise2D(`dot-y-${i}`, i, frame * 0.006) * 6;
          /* distribute around edges */
          const angle = (i / 12) * Math.PI * 2;
          const radius = 420 + (i % 3) * 60;
          const dx = 960 + Math.cos(angle) * radius + bx;
          const dy = 540 + Math.sin(angle) * radius + by;
          const dotSize = 4 + (i % 3) * 2;

          return (
            <div
              key={`dot-${i}`}
              style={{
                position: "absolute",
                left: dx,
                top: dy,
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                background: i % 2 === 0 ? "linear-gradient(135deg, #3B82F6, #06B6D4)" : COLORS.textBlack,
                opacity: dotSpr * (i % 2 === 0 ? 0.25 : 0.08),
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />
          );
        })}
      </Sequence>
    </AbsoluteFill>
  );
};
