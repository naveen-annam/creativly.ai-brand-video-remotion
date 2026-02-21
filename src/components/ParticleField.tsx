import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT } from "../constants";

// Deterministic pseudo-random
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
};

const PARTICLE_COUNT = 60;

const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  x: seededRandom(i * 7 + 1) * VIDEO_WIDTH,
  y: seededRandom(i * 13 + 3) * VIDEO_HEIGHT,
  size: seededRandom(i * 3 + 5) * 3 + 1,
  speed: seededRandom(i * 11 + 7) * 0.5 + 0.2,
  opacity: seededRandom(i * 17 + 9) * 0.4 + 0.1,
  delay: seededRandom(i * 23 + 11) * 60,
}));

export const ParticleField: React.FC<{
  fadeInDuration?: number;
  color?: string;
}> = ({ fadeInDuration = 2, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalOpacity = interpolate(
    frame,
    [0, fadeInDuration * fps],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {particles.map((p, i) => {
        const drift = Math.sin((frame + p.delay) * 0.02 * p.speed) * 30;
        const floatY = Math.cos((frame + p.delay) * 0.015 * p.speed) * 20;
        const pulse =
          0.5 + 0.5 * Math.sin((frame + p.delay) * 0.05);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + drift,
              top: p.y + floatY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity * pulse * globalOpacity,
              filter: `blur(${p.size > 2.5 ? 1 : 0}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
