import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { noise2D } from "@remotion/noise";

interface KineticWord {
  text: string;
  fontSize: number;
  fontWeight?: number;
  italic?: boolean;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  delay?: number;
  outline?: boolean;
  outlineColor?: string;
  letterSpacing?: string;
}

export const KineticType: React.FC<{
  words: KineticWord[];
  fontFamily: string;
  baseDelay?: number;
  stagger?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  style?: React.CSSProperties;
  noiseIntensity?: number;
}> = ({
  words,
  fontFamily,
  baseDelay = 0,
  stagger = 5,
  springConfig = { damping: 14, stiffness: 100, mass: 0.5 },
  style,
  noiseIntensity = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = baseDelay + i * stagger;
        const spr = spring({
          frame: Math.max(0, frame - wordDelay),
          fps,
          config: springConfig,
        });

        const scaleFrom = 0.3;
        const wordScale = interpolate(spr, [0, 1], [scaleFrom, 1]);
        const wordBlur = interpolate(spr, [0, 1], [12, 0]);
        const wordY = interpolate(spr, [0, 1], [40, 0]);
        const wordRotation = interpolate(spr, [0, 1], [(word.rotation || 0) + 8, word.rotation || 0]);

        // Micro-noise for organic feel
        const nx = noise2D(`kt-x-${i}`, frame * 0.01, i * 5) * noiseIntensity;
        const ny = noise2D(`kt-y-${i}`, i * 5, frame * 0.01) * noiseIntensity;

        return (
          <div
            key={i}
            style={{
              position: word.offsetX !== undefined || word.offsetY !== undefined ? "absolute" : "relative",
              left: word.offsetX,
              top: word.offsetY,
              fontFamily,
              fontSize: word.fontSize,
              fontWeight: word.fontWeight || 900,
              fontStyle: word.italic ? "italic" : "normal",
              color: word.outline ? "transparent" : (word.color || "#000"),
              WebkitTextStroke: word.outline ? `2px ${word.outlineColor || word.color || "#000"}` : undefined,
              letterSpacing: word.letterSpacing || "-0.04em",
              lineHeight: 0.85,
              transform: `translateY(${wordY + ny}px) translateX(${nx}px) scale(${wordScale}) rotate(${wordRotation}deg)`,
              opacity: spr,
              filter: wordBlur > 0.5 ? `blur(${wordBlur}px)` : undefined,
              whiteSpace: "nowrap",
            }}
          >
            {word.text}
          </div>
        );
      })}
    </div>
  );
};
