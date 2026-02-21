import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../constants';

export const GridBackground: React.FC<{
  velocity?: number;
  opacity?: number;
}> = ({ velocity = 20, opacity = 0.3 }) => {
  const frame = useCurrentFrame();

  const offset = (frame * velocity) % 100;

  return (
    <AbsoluteFill
      style={{
        zIndex: 0,
        backgroundColor: COLORS.bg,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          opacity,
          backgroundImage: `
            linear-gradient(to right, ${COLORS.bgGrid} 1px, transparent 1px),
            linear-gradient(to bottom, ${COLORS.bgGrid} 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: `translateY(${offset}px) perspective(1000px) rotateX(60deg) scale(2)`,
          transformOrigin: '50% 0%',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
