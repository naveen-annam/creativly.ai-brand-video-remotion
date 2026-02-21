import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../constants";

const CIRCLES = [
  { cx: 52.58, cy: 17.07 },
  { cx: 17.03, cy: 37.8 },
  { cx: 88.12, cy: 37.8 },
  { cx: 52.58, cy: 58.54 },
  { cx: 17.03, cy: 79.27 },
  { cx: 88.12, cy: 79.27 },
  { cx: 52.58, cy: 100.01 },
];

const RADIUS = 17.03;

export const CreativlyLogo: React.FC<{
  size?: number;
  color?: string;
  mode?: "assemble" | "static" | "pulse";
}> = ({ size = 200, color = COLORS.text, mode = "assemble" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      viewBox="0 0 106 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: "auto", overflow: "visible" }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {CIRCLES.map((circle, i) => {
        if (mode === "static") {
          return (
            <circle
              key={i}
              cx={circle.cx}
              cy={circle.cy}
              r={RADIUS}
              fill={color}
            />
          );
        }

        if (mode === "pulse") {
          const pulse = Math.sin((frame / fps) * 2 + i * 0.5) * 0.15;
          const opacity = interpolate(
            Math.sin((frame / fps) * 3 + i),
            [-1, 1],
            [0.8, 1]
          );
          return (
            <circle
              key={i}
              cx={circle.cx}
              cy={circle.cy}
              r={RADIUS * (1 + pulse)}
              fill={color}
              opacity={opacity}
              filter="url(#glow)"
            />
          );
        }

        // Assemble Mode
        const delay = i * 2;
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 12, stiffness: 100, mass: 0.8 },
        });

        const scale = interpolate(progress, [0, 1], [0, 1]);
        const opacity = interpolate(progress, [0, 0.3], [0, 1]);
        const yOffset = interpolate(progress, [0, 1], [60, 0]);
        const rotate = interpolate(progress, [0, 1], [-90, 0]);

        return (
          <g
            key={i}
            transform={`rotate(${rotate} ${circle.cx} ${circle.cy})`}
          >
            <circle
              cx={circle.cx}
              cy={circle.cy + yOffset}
              r={RADIUS * scale}
              fill={color}
              opacity={opacity}
              filter="url(#glow)"
            />
          </g>
        );
      })}
    </svg>
  );
};
