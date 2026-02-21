import { Easing } from "remotion";

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

export const COLORS = {
  bg: "#050505",
  bgWhite: "#FAFAFA",
  bgGrid: "#222222",
  bgSurface: "#111111",
  bgSurfaceLight: "#F0F0F0",
  border: "rgba(255,255,255,0.1)",
  borderDark: "rgba(0,0,0,0.1)",
  borderBright: "rgba(255,255,255,0.25)",
  text: "#ffffff",
  textBlack: "#0A0A0A",
  textMuted: "#a1a1aa",
  textMutedDark: "#6b7280",
  textDim: "#525252",
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  accent: "#f43f5e",
  success: "#10b981",
  warning: "#f59e0b",
  brand: "#3B82F6",
  brandLight: "#67E8F9",
  brandDark: "#2563EB",
  brandCyan: "#06B6D4",
  glass: "rgba(20, 20, 23, 0.6)",
  glassLight: "rgba(255, 255, 255, 0.7)",
};

export const DURATIONS = {
  intro: 3.5,
  flowDemo: 5.5,
  templates: 3,
  focusedDemo: 4,
  collaboration: 3,
  models: 3.5,
  textGen: 3.5,
  stylePresets: 4,
  audioGen: 3.5,
  recorder: 3,
  editor: 3.5,
  inpainting: 4,
  upscaling: 3.5,
  batchGen: 3.5,
  performance: 2.5,
  openSource: 3.5,
  outro: 4,
};

export const TRANSITION_FRAMES = 20;

export const EASING = {
  elastic: Easing.bezier(0.1, 0.9, 0.2, 1),
  cinematic: Easing.bezier(0.22, 1, 0.36, 1),
  exp: Easing.bezier(0.19, 1, 0.22, 1),
  linear: Easing.linear,
};
