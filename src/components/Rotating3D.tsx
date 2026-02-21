import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { noise2D } from "@remotion/noise";

export const Rotating3DBox: React.FC<{
  size?: number;
  color?: string;
  accentColor?: string;
  speed?: number;
  x?: number;
  y?: number;
  delay?: number;
  opacity?: number;
  noiseId?: string;
}> = ({
  size = 120,
  color = "rgba(255,255,255,0.06)",
  accentColor = "rgba(255,255,255,0.15)",
  speed = 1,
  x = 0,
  y = 0,
  delay = 0,
  opacity = 1,
  noiseId = "box",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 18, stiffness: 60 },
  });
  const entranceScale = interpolate(entrance, [0, 1], [0, 1]);

  const rotX = frame * 0.8 * speed + noise2D(`${noiseId}-rx`, frame * 0.01, 0) * 15;
  const rotY = frame * 1.2 * speed + noise2D(`${noiseId}-ry`, 0, frame * 0.01) * 15;
  const rotZ = frame * 0.3 * speed;

  const half = size / 2;

  const faces = [
    { transform: `rotateY(0deg) translateZ(${half}px)`, bg: color },
    { transform: `rotateY(90deg) translateZ(${half}px)`, bg: color },
    { transform: `rotateY(180deg) translateZ(${half}px)`, bg: accentColor },
    { transform: `rotateY(-90deg) translateZ(${half}px)`, bg: color },
    { transform: `rotateX(90deg) translateZ(${half}px)`, bg: accentColor },
    { transform: `rotateX(-90deg) translateZ(${half}px)`, bg: color },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        perspective: 800,
        opacity: opacity * entrance,
        transform: `scale(${entranceScale})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
        }}
      >
        {faces.map((face, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              background: face.bg,
              border: `1px solid ${accentColor}`,
              transform: face.transform,
              backfaceVisibility: "hidden",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Rotating3DSphere: React.FC<{
  size?: number;
  color?: string;
  ringCount?: number;
  speed?: number;
  x?: number;
  y?: number;
  delay?: number;
  noiseId?: string;
}> = ({
  size = 200,
  color = "rgba(255,214,0,0.3)",
  ringCount = 5,
  speed = 1,
  x = 0,
  y = 0,
  delay = 0,
  noiseId = "sphere",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 60 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        perspective: 1000,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.5, 1])})`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${frame * 0.5 * speed + noise2D(`${noiseId}-sx`, frame * 0.01, 0) * 10}deg) rotateY(${frame * 0.8 * speed}deg)`,
        }}
      >
        {Array.from({ length: ringCount }, (_, i) => {
          const angle = (i / ringCount) * 180;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1.5px solid ${color}`,
                transform: `rotateY(${angle}deg)`,
                backfaceVisibility: "visible",
              }}
            />
          );
        })}
        {Array.from({ length: ringCount }, (_, i) => {
          const angle = (i / ringCount) * 180;
          return (
            <div
              key={`h-${i}`}
              style={{
                position: "absolute",
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1px solid ${color}`,
                transform: `rotateX(${angle}deg)`,
                backfaceVisibility: "visible",
                opacity: 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export const FloatingDiamond: React.FC<{
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  speed?: number;
  delay?: number;
  noiseId?: string;
  glow?: boolean;
  glowColor?: string;
}> = ({
  size = 60,
  color = "rgba(255,214,0,0.4)",
  x = 0,
  y = 0,
  speed = 1,
  delay = 0,
  noiseId = "dia",
  glow = false,
  glowColor = "#3B82F6",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const rotX = frame * 1.5 * speed;
  const rotY = frame * 2 * speed;
  const floatY = noise2D(`${noiseId}-fy`, frame * 0.015, 0) * 15;
  const floatX = noise2D(`${noiseId}-fx`, 0, frame * 0.015) * 10;

  return (
    <div
      style={{
        position: "absolute",
        left: x + floatX,
        top: y + floatY,
        width: size,
        height: size,
        perspective: 600,
        opacity: entrance * 0.8,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(45deg) scale(${interpolate(entrance, [0, 1], [0, 1])})`,
          background: color,
          boxShadow: glow ? `0 0 30px ${glowColor}44, 0 0 60px ${glowColor}22` : undefined,
        }}
      />
    </div>
  );
};
