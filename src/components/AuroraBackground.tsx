import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const AuroraBackground: React.FC<{
  colors?: string[];
  speed?: number;
  opacity?: number;
}> = ({
  colors = ["#3b82f6", "#8b5cf6", "#f43f5e", "#10b981"],
  speed = 0.5,
  opacity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = (frame / fps) * speed;

  const blobs = colors.map((color, i) => {
    const angle = t + (i * Math.PI * 2) / colors.length;
    const x = 50 + Math.sin(angle) * 25 + Math.cos(angle * 0.7 + i) * 10;
    const y = 50 + Math.cos(angle * 0.8) * 20 + Math.sin(angle * 1.3 + i * 2) * 8;
    const scaleX = 1 + Math.sin(t * 0.5 + i * 1.5) * 0.3;
    const scaleY = 1 + Math.cos(t * 0.7 + i) * 0.2;

    return { color, x, y, scaleX, scaleY };
  });

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: opacity * fadeIn, overflow: "hidden" }}>
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: "60%",
            height: "60%",
            background: `radial-gradient(circle, ${blob.color}66 0%, ${blob.color}22 30%, transparent 70%)`,
            transform: `translate(-50%, -50%) scaleX(${blob.scaleX}) scaleY(${blob.scaleY})`,
            filter: "blur(80px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
