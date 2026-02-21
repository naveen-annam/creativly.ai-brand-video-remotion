import { useCurrentFrame, useVideoConfig } from "remotion";

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]()<>=/\\|@#$%&*+-~";
const COLUMNS = 50;

const columns = Array.from({ length: COLUMNS }, (_, i) => ({
  x: (i / COLUMNS) * 100,
  speed: seededRandom(i * 7 + 1) * 2 + 1,
  length: Math.floor(seededRandom(i * 11 + 3) * 15) + 8,
  offset: seededRandom(i * 13 + 5) * 200,
  charSeed: i * 17,
}));

export const MatrixRain: React.FC<{
  color?: string;
  opacity?: number;
  fontSize?: number;
}> = ({
  color = "#30d158",
  opacity = 0.3,
  fontSize = 18,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const lineHeight = fontSize * 1.4;
  const totalRows = Math.ceil(height / lineHeight) + 20;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
      }}
    >
      {columns.map((col) => {
        const yProgress = ((frame * col.speed + col.offset) % (totalRows * lineHeight));

        return (
          <div
            key={col.x}
            style={{
              position: "absolute",
              left: `${col.x}%`,
              top: 0,
              transform: `translateY(${yProgress - col.length * lineHeight}px)`,
              fontFamily: "monospace",
              fontSize,
              lineHeight: `${lineHeight}px`,
              whiteSpace: "pre",
            }}
          >
            {new Array(col.length).fill(0).map((_, j) => {
              const charIndex = Math.floor(
                seededRandom(col.charSeed + j * 3 + Math.floor(frame * 0.1 + j * 0.5)) * CHARS.length
              );
              const isHead = j === col.length - 1;
              const charOpacity = isHead ? 1 : (j / col.length) * 0.8;

              return (
                <div
                  key={j}
                  style={{
                    color: isHead ? "#ffffff" : color,
                    opacity: charOpacity,
                    textShadow: isHead
                      ? `0 0 20px ${color}, 0 0 40px ${color}`
                      : `0 0 8px ${color}44`,
                  }}
                >
                  {CHARS[charIndex]}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
