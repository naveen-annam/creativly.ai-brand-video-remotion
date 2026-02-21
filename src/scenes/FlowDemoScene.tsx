import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { makeStar } from "@remotion/shapes";
import { loadFont } from "@remotion/google-fonts/Inter";
import { COLORS } from "../constants";
import { FlowNode } from "../components/FlowNode";
import { FlowEdge } from "../components/FlowEdge";
import { FloatingDiamond } from "../components/Rotating3D";
import { PulseRings } from "../components/PulseRings";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

// ═══════════════════════════════════════════
//  LAYOUT — node positions in canvas space
// ═══════════════════════════════════════════
const N = {
  img1:  { x: 680,  y: 360, w: 300, h: 380 },
  vid1:  { x: 1130, y: 490, w: 300, h: 340 },
  img2:  { x: 1130, y: 110, w: 300, h: 340 },
  llm1:  { x: 1580, y: 400, w: 320, h: 280 },
};

// Edge connection points (right handle → left handle)
const E = {
  img1_vid: {
    x1: N.img1.x + N.img1.w, y1: N.img1.y + N.img1.h / 2,
    x2: N.vid1.x,             y2: N.vid1.y + N.vid1.h / 2,
  },
  img1_img2: {
    x1: N.img1.x + N.img1.w, y1: N.img1.y + N.img1.h / 2,
    x2: N.img2.x,             y2: N.img2.y + N.img2.h / 2,
  },
  vid_llm: {
    x1: N.vid1.x + N.vid1.w, y1: N.vid1.y + N.vid1.h / 2,
    x2: N.llm1.x,             y2: N.llm1.y + N.llm1.h / 2,
  },
};

// Text content
const PROMPT_1  = "Make it anime style";
const PROMPT_V  = "Gentle wind moving the flowers";
const PROMPT_2  = "Add fantasy lighting";
const LLM_TEXT  = "Summary: cinematic flower field, soft breeze, warm golden glow. Ready for post-production assembly.";

// Cinematic result gradients (simulate AI-generated imagery)
const G_ANIME   = "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #e040fb 80%, #f093fb 100%)";
const G_VIDEO   = "linear-gradient(135deg, #0a1628 0%, #1a4a7a 35%, #2e86c1 65%, #48c6ef 100%)";
const G_FANTASY = "linear-gradient(135deg, #f5af19 0%, #f12711 40%, #c471ed 75%, #8e44ad 100%)";

// Ambient star particles
const STARS = Array.from({ length: 14 }, (_, i) => ({
  x: random(`fs-x-${i}`) * 2400,
  y: random(`fs-y-${i}`) * 1400,
  size: random(`fs-s-${i}`) * 14 + 5,
  speed: random(`fs-sp-${i}`) * 0.3 + 0.15,
  delay: random(`fs-d-${i}`) * 20,
}));

// ═══════════════════════════════════════════
//  SCENE
// ═══════════════════════════════════════════
export const FlowDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Camera Motion ───
  // Start tight on first node, gradually pull back to reveal full pipeline
  const camScale = interpolate(
    frame,
    [0, 20, 55, 90, 125, 165],
    [1.45, 1.25, 1.0, 0.88, 0.78, 0.75],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const camX = interpolate(
    frame,
    [0, 20, 55, 90, 125, 165],
    [120, 80, -40, -150, -220, -230],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );
  const camY = interpolate(
    frame,
    [0, 20, 55, 90, 125, 165],
    [40, 25, -10, -40, -30, -25],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  // Subtle camera shake via noise
  const shakeX = noise2D("cam-sx", frame * 0.008, 0) * 3;
  const shakeY = noise2D("cam-sy", 0, frame * 0.008) * 2;

  // ─── Node Entrance Springs ───
  const img1Spr  = spring({ frame: Math.max(0, frame - 8),  fps, config: { damping: 12, stiffness: 90, mass: 0.6 } });
  const vid1Spr  = spring({ frame: Math.max(0, frame - 52), fps, config: { damping: 12, stiffness: 90, mass: 0.6 } });
  const img2Spr  = spring({ frame: Math.max(0, frame - 72), fps, config: { damping: 12, stiffness: 90, mass: 0.6 } });
  const llm1Spr  = spring({ frame: Math.max(0, frame - 92), fps, config: { damping: 12, stiffness: 90, mass: 0.6 } });

  // ─── Typewriter (character counts) ───
  const chars1 = Math.floor(interpolate(frame, [28, 48], [0, PROMPT_1.length],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const charsV = Math.floor(interpolate(frame, [58, 73], [0, PROMPT_V.length],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const chars2 = Math.floor(interpolate(frame, [78, 90], [0, PROMPT_2.length],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const charsL = Math.floor(interpolate(frame, [102, 135], [0, LLM_TEXT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // ─── Result Reveals ───
  const res1Op = interpolate(frame, [46, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resVOp = interpolate(frame, [66, 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const res2Op = interpolate(frame, [86, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ─── Processing scan lines ───
  const scan1Pos = interpolate(frame, [40, 53], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });
  const showScan1 = frame >= 40 && frame <= 53;

  // ─── Edge drawing ───
  const edge1P = interpolate(frame, [52, 66], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const edge2P = interpolate(frame, [72, 85], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const edge3P = interpolate(frame, [92, 106], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });

  // ─── Selection state (which node is active) ───
  const sel1 = frame >= 8  && frame < 52;
  const selV = frame >= 52 && frame < 72;
  const sel2 = frame >= 72 && frame < 92;
  const selL = frame >= 92 && frame < 130;
  const glow1 = sel1 ? spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 200 } }) : 0;
  const glowV = selV ? spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 200 } }) : 0;
  const glow2 = sel2 ? spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 200 } }) : 0;
  const glowL = selL ? spring({ frame: Math.max(0, frame - 95), fps, config: { damping: 200 } }) : 0;

  // ─── Gallery Label Opacities (completed unselected nodes) ───
  const galleryLabel1Op = frame >= 52
    ? spring({ frame: Math.max(0, frame - 56), fps, config: { damping: 200 } })
    : 0;
  const galleryLabelVOp = frame >= 72
    ? spring({ frame: Math.max(0, frame - 76), fps, config: { damping: 200 } })
    : 0;
  const galleryLabel2Op = frame >= 92
    ? spring({ frame: Math.max(0, frame - 96), fps, config: { damping: 200 } })
    : 0;

  // ─── Action Dock on Image Node 1 ───
  const actionDockOp = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.4 },
  });

  // ─── Grid + Atmosphere ───
  const gridOp = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const watermarkOp = interpolate(Math.sin(frame * 0.018), [-1, 1], [0.012, 0.028]);

  // ─── Title text at bottom ───
  const titleSpr = spring({ frame: Math.max(0, frame - 115), fps, config: { damping: 16, stiffness: 70, mass: 0.6 } });
  const subSpr   = spring({ frame: Math.max(0, frame - 125), fps, config: { damping: 16, stiffness: 70, mass: 0.6 } });

  // ─── Sparkle bursts when results appear ───
  const sparkle1 = frame >= 50 && frame <= 62;
  const sparkleV = frame >= 70 && frame <= 82;
  const sparkle2 = frame >= 90 && frame <= 102;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* ═══ AMBIENT ATMOSPHERE ═══ */}

      {/* Deep ambient glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "15%",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${COLORS.brand}15 0%, transparent 70%)`,
          filter: "blur(100px)",
          transform: `translate(${noise2D("glow1", frame * 0.005, 0) * 30}px, ${noise2D("glow1y", 0, frame * 0.005) * 20}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55%",
          right: "5%",
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${COLORS.brandCyan}10 0%, transparent 70%)`,
          filter: "blur(100px)",
          transform: `translate(${noise2D("glow2", frame * 0.004, 0) * 25}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "40%",
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${COLORS.secondary}08 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Floating 3D diamonds */}
      <FloatingDiamond size={32} color={`${COLORS.brand}22`} x={90} y={100} speed={0.7} delay={5} noiseId="fds1" glow glowColor={COLORS.brand} />
      <FloatingDiamond size={22} color={`${COLORS.brandCyan}18`} x={1780} y={130} speed={1.1} delay={12} noiseId="fds2" />
      <FloatingDiamond size={40} color={`${COLORS.secondary}15`} x={1680} y={880} speed={0.5} delay={18} noiseId="fds3" glow glowColor={COLORS.secondary} />
      <FloatingDiamond size={18} color={`${COLORS.brand}28`} x={180} y={850} speed={0.9} delay={22} noiseId="fds4" />
      <FloatingDiamond size={28} color={`${COLORS.brandCyan}14`} x={960} y={60} speed={1.3} delay={8} noiseId="fds5" />

      {/* Pulse rings */}
      <PulseRings count={3} color={`${COLORS.brand}08`} maxSize={1100} speed={0.2} strokeWidth={1} />

      {/* ═══ BACKGROUND WATERMARK ═══ */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-12deg)",
          fontFamily,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 480,
          background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          backgroundClip: "text",
          opacity: watermarkOp,
          whiteSpace: "nowrap",
          letterSpacing: "0.06em",
          userSelect: "none",
          pointerEvents: "none",
          padding: "0.15em 0.3em",
        }}
      >
        FLOW
      </div>

      {/* ═══ CANVAS ═══ */}
      <div
        style={{
          position: "absolute",
          width: 2400,
          height: 1400,
          left: "50%",
          top: "50%",
          transformOrigin: "center center",
          transform: `translate(calc(-50% + ${camX + shakeX}px), calc(-50% + ${camY + shakeY}px)) scale(${camScale})`,
        }}
      >
        {/* Dot grid pattern with radial-fade mask (matching frontend flow.module.css) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: gridOp * 0.35,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1.2px, transparent 1.2px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
          }}
        />

        {/* ─── EDGES (SVG layer) ─── */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none", zIndex: 1 }}
        >
          {frame >= 50 && (
            <FlowEdge
              {...E.img1_vid}
              progress={edge1P}
              color="rgba(120, 120, 135, 0.45)"
              glow
              glowColor={COLORS.brand}
              animated={edge1P > 0.95}
              frame={frame}
            />
          )}
          {frame >= 70 && (
            <FlowEdge
              {...E.img1_img2}
              progress={edge2P}
              color="rgba(120, 120, 135, 0.45)"
              glow
              glowColor={COLORS.brand}
              animated={edge2P > 0.95}
              frame={frame}
            />
          )}
          {frame >= 90 && (
            <FlowEdge
              {...E.vid_llm}
              progress={edge3P}
              color="rgba(120, 120, 135, 0.45)"
              glow
              glowColor={COLORS.brandCyan}
              animated={edge3P > 0.95}
              frame={frame}
            />
          )}
        </svg>

        {/* ─── CONNECTION PORT PULSE DOTS ─── */}
        {(() => {
          const pulse = Math.sin(frame * 0.15) * 0.4 + 0.6;
          const dotSize = 8;
          const edges: Array<{
            progress: number;
            x2: number;
            y2: number;
            color: string;
            appeared: boolean;
          }> = [
            { progress: edge1P, x2: E.img1_vid.x2, y2: E.img1_vid.y2, color: COLORS.brand, appeared: frame >= 50 },
            { progress: edge2P, x2: E.img1_img2.x2, y2: E.img1_img2.y2, color: COLORS.brand, appeared: frame >= 70 },
            { progress: edge3P, x2: E.vid_llm.x2, y2: E.vid_llm.y2, color: COLORS.brandCyan, appeared: frame >= 90 },
          ];
          return edges.map((edge, i) =>
            edge.appeared && edge.progress > 0.95 ? (
              <div
                key={`pulse-dot-${i}`}
                style={{
                  position: "absolute",
                  left: edge.x2 - dotSize / 2,
                  top: edge.y2 - dotSize / 2,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  background: edge.color,
                  opacity: pulse,
                  boxShadow: `0 0 ${6 + pulse * 6}px ${edge.color}, 0 0 ${12 + pulse * 10}px ${edge.color}66`,
                  zIndex: 2,
                  pointerEvents: "none" as const,
                }}
              />
            ) : null,
          );
        })()}

        {/* Star particles inside canvas */}
        {STARS.map((s, i) => {
          const star = makeStar({ points: 4, innerRadius: s.size * 0.3, outerRadius: s.size });
          const drift = noise2D(`fsd-${i}`, frame * 0.012 * s.speed, i * 8);
          const pulse = Math.sin(frame * 0.07 + i * 2.5) * 0.4 + 0.35;
          const starOp = interpolate(frame, [s.delay, s.delay + 15], [0, pulse * 0.2], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <svg
              key={`fstar-${i}`}
              width={s.size * 2.5}
              height={s.size * 2.5}
              viewBox={`0 0 ${star.width} ${star.height}`}
              style={{
                position: "absolute",
                left: s.x + drift * 18,
                top: s.y + noise2D(`fsdy-${i}`, i * 8, frame * 0.012 * s.speed) * 15,
                opacity: starOp,
                transform: `rotate(${frame * s.speed * 1.5}deg)`,
                zIndex: 0,
              }}
            >
              <path
                d={star.path}
                fill="none"
                stroke={i % 3 === 0 ? COLORS.brand : i % 3 === 1 ? COLORS.brandCyan : COLORS.secondary}
                strokeWidth="0.8"
              />
            </svg>
          );
        })}

        {/* ─── SPARKLE BURSTS at node results ─── */}
        {sparkle1 && renderSparkles(N.img1.x + N.img1.w / 2, N.img1.y + 180, frame - 50, COLORS.brand)}
        {sparkleV && renderSparkles(N.vid1.x + N.vid1.w / 2, N.vid1.y + 160, frame - 70, COLORS.secondary)}
        {sparkle2 && renderSparkles(N.img2.x + N.img2.w / 2, N.img2.y + 160, frame - 90, COLORS.brandCyan)}

        {/* ─── NODES ─── */}

        {/* Image Node 1 — the starting node */}
        {frame >= 6 && (
          <div style={{ position: "absolute", left: N.img1.x, top: N.img1.y, zIndex: 5 }}>
            <FlowNode
              type="image"
              model="nano-banana"
              prompt={frame >= 28 ? PROMPT_1 : undefined}
              promptChars={chars1}
              showResult={frame >= 46}
              resultOpacity={res1Op}
              resultGradient={G_ANIME}
              selected={sel1}
              selectionGlow={glow1}
              processing={showScan1}
              processingLabel="GENERATING"
              scanLinePos={scan1Pos}
              entrance={img1Spr}
              entranceBlur={interpolate(img1Spr, [0, 1], [14, 0])}
              width={N.img1.w}
              height={N.img1.h}
              galleryLabel={frame >= 52 ? PROMPT_1 : undefined}
              galleryLabelOpacity={galleryLabel1Op}
              showActionDock={sel1 && frame >= 18}
              actionDockOpacity={actionDockOp}
            />
          </div>
        )}

        {/* Video Node — expands the pipeline */}
        {frame >= 50 && (
          <div style={{ position: "absolute", left: N.vid1.x, top: N.vid1.y, zIndex: 5 }}>
            <FlowNode
              type="video"
              model="veo-3.1"
              prompt={frame >= 58 ? PROMPT_V : undefined}
              promptChars={charsV}
              showResult={frame >= 66}
              resultOpacity={resVOp}
              resultGradient={G_VIDEO}
              selected={selV}
              selectionGlow={glowV}
              entrance={vid1Spr}
              entranceBlur={interpolate(vid1Spr, [0, 1], [14, 0])}
              width={N.vid1.w}
              height={N.vid1.h}
              showPlayButton
              handleLeftGlow={edge1P}
              galleryLabel={frame >= 72 ? PROMPT_V : undefined}
              galleryLabelOpacity={galleryLabelVOp}
            />
          </div>
        )}

        {/* Image Node 2 — edit branch */}
        {frame >= 70 && (
          <div style={{ position: "absolute", left: N.img2.x, top: N.img2.y, zIndex: 5 }}>
            <FlowNode
              type="image"
              model="nano-banana"
              prompt={frame >= 78 ? PROMPT_2 : undefined}
              promptChars={chars2}
              showResult={frame >= 86}
              resultOpacity={res2Op}
              resultGradient={G_FANTASY}
              selected={sel2}
              selectionGlow={glow2}
              entrance={img2Spr}
              entranceBlur={interpolate(img2Spr, [0, 1], [14, 0])}
              width={N.img2.w}
              height={N.img2.h}
              handleLeftGlow={edge2P}
              galleryLabel={frame >= 92 ? PROMPT_2 : undefined}
              galleryLabelOpacity={galleryLabel2Op}
            />
          </div>
        )}

        {/* LLM Node — reasoning */}
        {frame >= 90 && (
          <div style={{ position: "absolute", left: N.llm1.x, top: N.llm1.y, zIndex: 5 }}>
            <FlowNode
              type="llm"
              model="gemini-flash"
              showResult={frame >= 102}
              resultText={LLM_TEXT}
              resultTextChars={charsL}
              selected={selL}
              selectionGlow={glowL}
              entrance={llm1Spr}
              entranceBlur={interpolate(llm1Spr, [0, 1], [14, 0])}
              width={N.llm1.w}
              height={N.llm1.h}
              handleLeftGlow={edge3P}
            />
          </div>
        )}
        {/* ─── CONTEXT TOOLBAR (floats above selected node) ─── */}
        {frame >= 18 && (() => {
          // Determine which node is selected and position above it
          const activeNode = sel1 ? N.img1 : selV ? N.vid1 : sel2 ? N.img2 : selL ? N.llm1 : null;
          if (!activeNode) return null;

          const ctxDelay = sel1 ? 18 : selV ? 58 : sel2 ? 78 : 98;
          const ctxSpr = spring({
            frame: Math.max(0, frame - ctxDelay),
            fps,
            config: { damping: 20, stiffness: 140, mass: 0.4 },
          });
          const ctxY = interpolate(ctxSpr, [0, 1], [12, 0]);

          return (
            <div
              style={{
                position: "absolute",
                left: activeNode.x + activeNode.w / 2,
                top: activeNode.y - 52,
                transform: `translateX(-50%) translateY(${ctxY}px)`,
                display: "flex",
                gap: 4,
                padding: "5px 8px",
                borderRadius: 12,
                background: "rgba(10, 10, 12, 0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                opacity: ctxSpr,
                zIndex: 15,
              }}
            >
              {/* Duplicate */}
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
              {/* Run */}
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: `${COLORS.brand}18`,
                border: `1px solid ${COLORS.brand}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={COLORS.brand} stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              {/* Delete */}
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ═══ TITLE OVERLAY ═══ */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 75,
          zIndex: 20,
        }}
      >
        {/* Subtle label */}
        <div
          style={{
            fontFamily,
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: 20,
            color: COLORS.textMuted,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            opacity: titleSpr,
            transform: `translateY(${interpolate(titleSpr, [0, 1], [20, 0])}px)`,
            marginBottom: 8,
          }}
        >
          Node-Based
        </div>

        {/* Main title */}
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 68,
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            backgroundClip: "text",
            padding: "0.15em 0.3em",
            margin: "-0.15em -0.3em",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            opacity: subSpr,
            transform: `translateY(${interpolate(subSpr, [0, 1], [30, 0])}px)`,
          }}
        >
          Creative Pipeline
        </div>
      </div>

      {/* ═══ ZOOM INDICATOR (bottom-left) ═══ */}
      {frame >= 15 && (
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 75,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 10,
            background: "rgba(10, 10, 12, 0.65)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontFamily,
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.35)",
            opacity: interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            zIndex: 20,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          {Math.round(camScale * 100)}%
        </div>
      )}

      {/* ═══ MINI-MAP (bottom-right corner) ═══ */}
      {frame >= 30 && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 50,
            width: 120,
            height: 72,
            borderRadius: 10,
            background: "rgba(10, 10, 12, 0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            opacity: interpolate(frame, [30, 40], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            zIndex: 20,
          }}
        >
          {/* Mini node dots */}
          {[
            { x: 28, y: 26, active: sel1, appeared: true },
            { x: 47, y: 35, active: selV, appeared: frame >= 50 },
            { x: 47, y: 12, active: sel2, appeared: frame >= 70 },
            { x: 66, y: 28, active: selL, appeared: frame >= 90 },
          ].map((dot, i) =>
            dot.appeared ? (
              <div
                key={`mm-${i}`}
                style={{
                  position: "absolute",
                  left: dot.x,
                  top: dot.y,
                  width: dot.active ? 8 : 5,
                  height: dot.active ? 6 : 4,
                  borderRadius: 2,
                  background: dot.active ? COLORS.brand : "rgba(255,255,255,0.2)",
                  boxShadow: dot.active ? `0 0 6px ${COLORS.brand}66` : undefined,
                }}
              />
            ) : null,
          )}
          {/* Viewport rectangle */}
          <div
            style={{
              position: "absolute",
              left: interpolate(camScale, [0.75, 1.45], [5, 15]),
              top: interpolate(camScale, [0.75, 1.45], [8, 18]),
              width: interpolate(camScale, [0.75, 1.45], [90, 40]),
              height: interpolate(camScale, [0.75, 1.45], [54, 24]),
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 3,
            }}
          />
        </div>
      )}

      {/* ═══ STEP INDICATOR (right side) ═══ */}
      <div
        style={{
          position: "absolute",
          right: 50,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 20,
          opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        {[
          { active: sel1, label: "Create" },
          { active: selV, label: "Animate" },
          { active: sel2, label: "Branch" },
          { active: selL, label: "Reason" },
        ].map((step, i) => {
          const isActive = step.active;
          const isPast = (i === 0 && frame >= 52) || (i === 1 && frame >= 72) || (i === 2 && frame >= 92);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: isActive ? 1 : isPast ? 0.4 : 0.15,
              }}
            >
              <div
                style={{
                  width: isActive ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: isActive
                    ? COLORS.brand
                    : isPast
                      ? COLORS.brand
                      : "rgba(255,255,255,0.3)",
                  boxShadow: isActive ? `0 0 12px ${COLORS.brand}66` : undefined,
                }}
              />
              <span
                style={{
                  fontFamily,
                  fontSize: 11,
                  fontWeight: 600,
                  color: isActive ? COLORS.text : "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ═══ NODE PICKER SIDEBAR (left side) ═══ */}
      {frame >= 10 && (() => {
        const pickerSpr = spring({
          frame: Math.max(0, frame - 10),
          fps,
          config: { damping: 14, stiffness: 110, mass: 0.5 },
        });
        const pickerX = interpolate(pickerSpr, [0, 1], [-40, 0]);
        const activeType: string = sel1 ? "image" : selV ? "video" : sel2 ? "image" : selL ? "llm" : "image";
        const pickerItems: Array<{ type: string; color: string }> = [
          { type: "image", color: "#3B82F6" },
          { type: "video", color: "#8B5CF6" },
          { type: "llm", color: "#F59E0B" },
          { type: "audio", color: "#10B981" },
        ];
        return (
          <div
            style={{
              position: "absolute",
              left: 24,
              top: "50%",
              transform: `translateY(-50%) translateX(${pickerX}px)`,
              background: "rgba(10, 10, 12, 0.7)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "10px 8px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              width: 48,
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: 6,
              opacity: pickerSpr,
              zIndex: 20,
            }}
          >
            {pickerItems.map((item) => {
              const isActive = item.type === activeType;
              return (
                <div
                  key={item.type}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: isActive ? `${item.color}18` : "rgba(255,255,255,0.04)",
                    border: isActive ? `1px solid ${item.color}33` : "1px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ═══ BREADCRUMB BAR (top center) ═══ */}
      {frame >= 12 && (
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10, 10, 12, 0.55)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 10,
            padding: "5px 16px",
            zIndex: 20,
            opacity: interpolate(frame, [12, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em" }}>
            My Projects
          </span>
          <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.12)", letterSpacing: "0.02em" }}>
            {" / "}
          </span>
          <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.25)", letterSpacing: "0.02em" }}>
            Brand Video
          </span>
          <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.12)", letterSpacing: "0.02em" }}>
            {" / "}
          </span>
          <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}>
            Pipeline
          </span>
        </div>
      )}

      {/* ═══ TOAST NOTIFICATION (top-right) ═══ */}
      {frame >= 56 && frame <= 92 && (() => {
        const toastSpr = spring({
          frame: Math.max(0, frame - 56),
          fps,
          config: { damping: 16, stiffness: 120, mass: 0.5 },
        });
        const toastExit = frame >= 82
          ? interpolate(frame, [82, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 1;
        const toastOp = toastSpr * toastExit;
        const toastX = interpolate(toastSpr, [0, 1], [60, 0]);
        return (
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 30,
              zIndex: 20,
              opacity: toastOp,
              transform: `translateX(${toastX}px)`,
              background: "rgba(10, 10, 12, 0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              padding: "10px 16px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Checkmark icon */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#10b98122",
                border: "1px solid #10b98144",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <polyline points="4 8 7 11 12 5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            {/* Text column */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
              <span style={{ fontFamily, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
                Generation Complete
              </span>
              <span style={{ fontFamily, fontSize: 10, fontWeight: 400, color: "rgba(255,255,255,0.3)" }}>
                Image Node 1 ready
              </span>
            </div>
          </div>
        );
      })()}

      {/* ═══ KEYBOARD SHORTCUT BADGE ═══ */}
      {frame >= 30 && (
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 24,
            zIndex: 20,
            background: "rgba(10, 10, 12, 0.5)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 6,
            padding: "3px 8px",
            opacity: interpolate(frame, [30, 40], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontFamily, fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.2)" }}>
            {"\u2318K"}
          </span>
        </div>
      )}

      {/* ═══ STATUS BAR (bottom center) ═══ */}
      {frame >= 60 && (() => {
        const nodeCount = frame >= 92 ? 4 : frame >= 72 ? 3 : frame >= 52 ? 2 : 1;
        const edgeCount = frame >= 92 ? 3 : frame >= 72 ? 2 : frame >= 52 ? 1 : 0;
        const statusOp = interpolate(frame, [60, 70], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              background: "rgba(10, 10, 12, 0.5)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: "4px 14px",
              opacity: statusOp,
              display: "flex",
              alignItems: "center",
              gap: 0,
            }}
          >
            <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.2)" }}>
              {nodeCount} nodes {"\u00B7"} {edgeCount} edges {"\u00B7"}{" "}
            </span>
            <span style={{ fontFamily, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
              GPU: 87%
            </span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ─── Sparkle burst helper ───
function renderSparkles(cx: number, cy: number, localFrame: number, color: string) {
  return Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const dist = localFrame * 4 + random(`sp-d-${i}`) * 15;
    const opacity = Math.max(0, 1 - localFrame / 10);
    const size = 3 + random(`sp-s-${i}`) * 3;
    return (
      <div
        key={`sparkle-${i}`}
        style={{
          position: "absolute",
          left: cx + Math.cos(angle) * dist - size / 2,
          top: cy + Math.sin(angle) * dist - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          zIndex: 10,
        }}
      />
    );
  });
}
