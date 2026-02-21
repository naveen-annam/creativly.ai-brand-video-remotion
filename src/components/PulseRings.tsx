import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const PulseRings: React.FC<{
  count?: number;
  color?: string;
  maxSize?: number;
  speed?: number;
  strokeWidth?: number;
  x?: string;
  y?: string;
}> = ({
  count = 4,
  color = "rgba(59,130,246,0.4)",
  maxSize = 800,
  speed = 0.8,
  strokeWidth = 2,
  x = "50%",
  y = "50%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cycleDuration = fps / speed;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {new Array(count).fill(0).map((_, i) => {
        const offset = (i / count) * cycleDuration;
        const progress = ((frame + offset) % cycleDuration) / cycleDuration;

        const size = interpolate(progress, [0, 1], [0, maxSize]);
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.8, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `${strokeWidth}px solid ${color}`,
              transform: "translate(-50%, -50%)",
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};
