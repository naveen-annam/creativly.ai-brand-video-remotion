import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

export const Typewriter: React.FC<{
  text: string;
  style?: React.CSSProperties;
  cursor?: boolean;
  delay?: number;
  speed?: number;
  cursorColor?: string;
  pauseAfter?: number;
  pauseDuration?: number;
}> = ({
  text,
  style,
  cursor = true,
  delay = 0,
  speed = 1,
  cursorColor = COLORS.accent,
  pauseAfter,
  pauseDuration = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = delay;
  let progress = Math.max(0, frame - startFrame);

  let charCount: number;
  if (pauseAfter !== undefined && pauseAfter > 0) {
    const charsBeforePause = pauseAfter;
    const framesForFirstPart = charsBeforePause / speed;

    if (progress <= framesForFirstPart) {
      charCount = Math.floor(progress * speed);
    } else if (progress <= framesForFirstPart + pauseDuration) {
      charCount = charsBeforePause;
    } else {
      const remaining = progress - framesForFirstPart - pauseDuration;
      charCount = charsBeforePause + Math.floor(remaining * speed);
    }
  } else {
    charCount = Math.floor(progress * speed);
  }

  const currentText = text.slice(0, Math.min(charCount, text.length));
  const showCursor =
    cursor && (charCount < text.length || frame % fps < fps / 2);

  return (
    <div
      style={{ ...style, display: "inline-block", whiteSpace: "pre-wrap" }}
    >
      {currentText}
      <span
        style={{
          opacity: showCursor ? 1 : 0,
          marginLeft: 4,
          display: "inline-block",
          width: "0.15em",
          height: "1em",
          backgroundColor: cursorColor,
          verticalAlign: "text-bottom",
          transform: "translateY(2px)",
        }}
      />
    </div>
  );
};
