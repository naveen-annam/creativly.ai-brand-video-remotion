import React from "react";
import { evolvePath } from "@remotion/paths";

interface FlowEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress: number;
  color?: string;
  strokeWidth?: number;
  glow?: boolean;
  glowColor?: string;
  animated?: boolean;
  animatedDots?: number;
  frame?: number;
}

/**
 * Animated bezier edge for Flow canvas.
 * Renders as SVG <g> — must be placed inside a parent <svg>.
 */
export const FlowEdge: React.FC<FlowEdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  progress,
  color = "rgba(113, 113, 122, 0.5)",
  strokeWidth = 2,
  glow = false,
  glowColor,
  animated = false,
  animatedDots = 3,
  frame = 0,
}) => {
  const midX = (x1 + x2) / 2;
  const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  const p = Math.min(1, Math.max(0, progress));
  const evolved = evolvePath(p, path);

  const resolvedGlow = glowColor ?? color;

  // Calculate point on cubic bezier for animated dots
  const getBezierPoint = (t: number) => {
    const cx1 = midX,
      cy1 = y1,
      cx2 = midX,
      cy2 = y2;
    const u = 1 - t;
    return {
      x: u * u * u * x1 + 3 * u * u * t * cx1 + 3 * u * t * t * cx2 + t * t * t * x2,
      y: u * u * u * y1 + 3 * u * u * t * cy1 + 3 * u * t * t * cy2 + t * t * t * y2,
    };
  };

  // Arrow triangle at endpoint
  const arrowSize = 8;
  const arrowOpacity = p > 0.92 ? Math.min(1, (p - 0.92) / 0.08) : 0;

  return (
    <g>
      {/* Glow layer */}
      {glow && p > 0.01 && (
        <path
          d={path}
          fill="none"
          stroke={resolvedGlow}
          strokeWidth={strokeWidth + 8}
          strokeDasharray={evolved.strokeDasharray}
          strokeDashoffset={evolved.strokeDashoffset}
          strokeLinecap="round"
          opacity={0.12}
        />
      )}

      {/* Main stroke */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={evolved.strokeDasharray}
        strokeDashoffset={evolved.strokeDashoffset}
      />

      {/* Arrow head */}
      {arrowOpacity > 0 && (
        <polygon
          points={`${x2 + 1},${y2} ${x2 - arrowSize},${y2 - arrowSize * 0.6} ${x2 - arrowSize},${y2 + arrowSize * 0.6}`}
          fill={color}
          opacity={arrowOpacity}
        />
      )}

      {/* Animated flowing dots */}
      {animated &&
        p > 0.5 &&
        Array.from({ length: animatedDots }).map((_, i) => {
          const speed = 0.015;
          const offset = i / animatedDots;
          const t = ((frame * speed + offset) % 1) * p;
          const pt = getBezierPoint(t);
          const dotOpacity = Math.sin(t * Math.PI) * 0.6;
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={2.5}
              fill="white"
              opacity={dotOpacity > 0 ? dotOpacity : 0}
            />
          );
        })}
    </g>
  );
};
