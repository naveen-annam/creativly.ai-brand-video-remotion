import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const GRADIENT_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  padding: "0.15em 0.05em",
};

export const SplitText: React.FC<{
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  direction?: "up" | "down" | "random";
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  gradient?: boolean;
}> = ({
  text,
  style,
  delay = 0,
  stagger = 3,
  direction = "up",
  springConfig = { damping: 14, stiffness: 120, mass: 0.6 },
  gradient = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        gap: "0 0.3em",
        overflow: "hidden",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger;
        const spr = spring({
          frame: Math.max(0, frame - wordDelay),
          fps,
          config: springConfig,
        });

        const seed = i * 7 + 3;
        const randomDir =
          Math.sin(seed * 12.9898 + 78.233) > 0 ? 1 : -1;

        const offsetY =
          direction === "up"
            ? 60 * (1 - spr)
            : direction === "down"
              ? -60 * (1 - spr)
              : 60 * randomDir * (1 - spr);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${offsetY}px)`,
              opacity: spr,
              ...(gradient ? GRADIENT_STYLE : undefined),
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
