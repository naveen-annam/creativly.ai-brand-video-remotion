import { useCurrentFrame, interpolate } from "remotion";

export const GlowOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay?: number;
  pulseSpeed?: number;
}> = ({ x, y, size, color, delay = 0, pulseSpeed = 0.03 }) => {
  const frame = useCurrentFrame();

  const scale = 0.8 + 0.2 * Math.sin((frame + delay) * pulseSpeed);
  const opacity = interpolate(frame, [0, 30], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 40%, transparent 70%)`,
        transform: `scale(${scale})`,
        opacity,
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
    />
  );
};
