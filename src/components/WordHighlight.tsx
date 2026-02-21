import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const WordHighlight: React.FC<{
  children: React.ReactNode;
  color: string;
  delay?: number;
  active?: boolean;
  style?: React.CSSProperties;
  durationInFrames?: number;
  height?: string;
  skew?: number;
  borderRadius?: number;
}> = ({
  children,
  color,
  delay = 0,
  active = true,
  style,
  durationInFrames = 20,
  height,
  skew = -10,
  borderRadius = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
    durationInFrames,
  });

  if (!active) return <span style={style}>{children}</span>;

  return (
    <span
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      <span
        style={{
          position: "absolute",
          left: -6,
          right: -6,
          top: height ? undefined : "0.1em",
          bottom: height ? undefined : "0.1em",
          height: height || undefined,
          backgroundColor: color,
          borderRadius,
          zIndex: -1,
          transform: `scaleX(${progress}) skewX(${skew}deg)`,
          transformOrigin: "left center",
          opacity: 0.9,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};
