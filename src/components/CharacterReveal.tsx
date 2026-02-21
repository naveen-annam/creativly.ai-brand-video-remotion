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

export const CharacterReveal: React.FC<{
  text: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  offsetY?: number;
  blur?: boolean;
  gradient?: boolean;
}> = ({
  text,
  style,
  delay = 0,
  stagger = 1,
  springConfig = { damping: 12, stiffness: 100, mass: 0.4 },
  offsetY = 30,
  blur = false,
  gradient = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = text.split("");

  return (
    <span style={{ display: "inline-block", ...style }}>
      {chars.map((char, i) => {
        const charDelay = delay + i * stagger;
        const spr = spring({
          frame: Math.max(0, frame - charDelay),
          fps,
          config: springConfig,
        });

        const y = offsetY * (1 - spr);
        const blurVal = blur ? 8 * (1 - spr) : 0;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity: spr,
              filter: blurVal > 0.1 ? `blur(${blurVal}px)` : undefined,
              whiteSpace: char === " " ? "pre" : undefined,
              ...(gradient ? GRADIENT_STYLE : undefined),
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
