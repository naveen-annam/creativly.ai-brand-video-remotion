# creativly.ai Brand Video — Built with Remotion + Claude Code

A production-grade **programmatic brand video** built entirely with [Remotion](https://remotion.dev) and [Claude Code](https://claude.ai/claude-code). 17 scenes, 34 components, 12,000+ lines of React — all animations driven purely by `useCurrentFrame()`, `spring()`, `interpolate()`, and `noise2D()`. Zero CSS animations.

https://github.com/user-attachments/assets/placeholder

## Why This Exists

This project demonstrates what's possible when you combine **Claude Code** (Anthropic's AI coding agent) with **Remotion** (React-based video rendering). Every scene, transition, component, and animation was built through iterative AI-assisted development — from V1 to V26 across multiple sessions.

If you're looking for a real-world example of:
- Building complex Remotion videos with AI assistance
- Advanced Remotion animation patterns and transitions
- Frame-driven animation architecture (no CSS transitions)
- Glass morphism, kinetic typography, and cinematic UI recreation in React

...this is it.

## Features

### 17 Cinematic Scenes

| # | Scene | Theme | Highlights |
|---|-------|-------|------------|
| 1 | **Intro** | Dark | Logo reveal, tagline, gradient underline, version badge |
| 2 | **Flow Demo** | Dark | 5-node pipeline walkthrough, bezier edges, camera system, tooltips, selection marquee |
| 3 | **Templates** | Light | Category pills, count badge, search input, template grid |
| 4 | **Focused Demo** | Dark | Studio editor, parameter sliders, prompt typing, progress ring, negative prompt |
| 5 | **Collaboration** | Light | Live cursors with drift, comment bubbles, activity feed |
| 6 | **Models** | Dark | Model grid, category tabs, provider badges, search bar |
| 7 | **Text Generation** | Light | Token counter, prompt history sidebar, LLM parameter chips |
| 8 | **Style Presets** | Dark | Active indicator, parameter chips, style preview cards |
| 9 | **Audio Generation** | Light | 40-bar waveform equalizer, player controls, model badges |
| 10 | **Recorder** | Dark | Pulsing REC badge, live timer, 5-bar audio level meter |
| 11 | **Editor** | Light | Timeline ruler, track headers, clip labels, toolbar |
| 12 | **Inpainting** | Dark | Brush cursor, mask trail, tool palette, opacity slider |
| 13 | **Upscaling** | Light | Resolution table, quality badges, zoom magnifier lens |
| 14 | **Batch Generation** | Dark | Variant badges, prompt badge, generation queue, compare toggle |
| 15 | **Performance** | Light | Metric cards with count-up, sparkline graph, server status |
| 16 | **Open Source** | Dark | GitHub stats, commit activity grid, tech stack badges |
| 17 | **Outro** | Dark | Rotating gradient border, community stats, social link pills |

### 13 Transitions Between Scenes

- **Fade** — smooth opacity crossfade
- **Slide** — directional slide (top, bottom, left, right)
- **Wipe** — directional wipe reveal
- **Clock Wipe** — radial clock sweep
- **Flip** — 3D card flip
- **Light Leaks** — cinematic golden light leak overlays (3 instances)

### 16 Reusable Components

| Component | Description |
|-----------|-------------|
| `FlowNode` | Full-featured node card — type colors, prompts, results, waveform, action dock, handle glow |
| `FlowEdge` | Animated SVG bezier edge with `evolvePath()` |
| `BrowserWindow` | Chrome-style browser frame with address bar |
| `CreativlyLogo` | Animated SVG logo with draw-on effect |
| `AuroraBackground` | Layered gradient aurora with noise drift |
| `GridBackground` | Dot grid with fade mask |
| `ParticleField` | Floating particle system with noise movement |
| `GlowOrb` | Pulsing gradient orb with blur |
| `PulseRings` | Expanding concentric ring animation |
| `MatrixRain` | Matrix-style falling character rain |
| `Rotating3D` | CSS perspective 3D rotation |
| `KineticType` | Word-by-word kinetic typography |
| `CharacterReveal` | Per-character staggered reveal |
| `SplitText` | Split and animate text fragments |
| `Typewriter` | Typing animation with cursor |
| `WordHighlight` | Sequential word highlight with gradient |

## Animation Patterns

All animations use **exclusively Remotion primitives** — no CSS transitions, no `@keyframes`, no `requestAnimationFrame`:

```tsx
// Spring entrance with stagger
const entrance = spring({
  frame: Math.max(0, frame - delay - i * 4),
  fps: 30,
  config: { damping: 16, stiffness: 120, mass: 0.4 },
});

// Smooth interpolation
const opacity = interpolate(frame, [20, 40], [0, 1], {
  extrapolateRight: "clamp",
});

// Organic movement with noise
const drift = noise2D("cursor", frame * 0.02, 0) * 50;

// Animated SVG paths
const evolved = evolvePath(progress, svgPath);
```

### Design System

| Token | Value |
|-------|-------|
| Brand Blue | `#3B82F6` |
| Brand Cyan | `#06B6D4` |
| Brand Gradient | `linear-gradient(135deg, #3B82F6, #06B6D4)` |
| Glass Dark | `rgba(10, 10, 12, 0.7)` + `1px solid rgba(255,255,255,0.06)` |
| Glass Light | `rgba(255, 255, 255, 0.7)` + `1px solid rgba(0,0,0,0.06)` |
| Background Dark | `#050505` |
| Background Light | `#FAFAFA` |
| Spring (smooth) | `{ damping: 200 }` |
| Spring (snappy) | `{ damping: 14, stiffness: 120, mass: 0.4 }` |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Install

```bash
git clone https://github.com/naveen-annam/creativly.ai-brand-video-remotion.git
cd creativly.ai-brand-video-remotion
pnpm install
```

### Preview

```bash
pnpm dev
```

Opens Remotion Studio at `http://localhost:3000` where you can scrub through the video frame-by-frame.

### Render

```bash
npx remotion render src/index.ts CreativlyBrandVideo out/brand-video.mp4
```

### Video Specs

| Property | Value |
|----------|-------|
| Resolution | 1920 x 1080 (Full HD) |
| Frame Rate | 30 fps |
| Duration | ~57 seconds |
| Format | MP4 (H.264) |

## Project Structure

```
src/
  index.ts              # Entry point — registers root
  Root.tsx               # Composition definition with duration calc
  BrandVideo.tsx         # TransitionSeries orchestrating all 17 scenes
  constants.ts           # Colors, durations, easing presets
  styles.css             # Tailwind import
  components/            # 16 reusable visual components
    FlowNode.tsx         # ~750 lines — the star component
    FlowEdge.tsx         # Animated SVG bezier edges
    BrowserWindow.tsx    # Browser chrome frame
    CreativlyLogo.tsx    # SVG logo with animation
    ...
  scenes/                # 18 scene files (17 active + 1 legacy)
    IntroScene.tsx
    FlowDemoScene.tsx    # ~1100 lines — cinematic pipeline demo
    FocusedDemoScene.tsx # ~1100 lines — studio editor recreation
    ...
public/                  # Static assets (screenshots, logos)
```

## Tech Stack

- **[Remotion 4.0](https://remotion.dev)** — React-based programmatic video
- **[@remotion/transitions](https://remotion.dev/docs/transitions)** — TransitionSeries with fade, slide, wipe, clockWipe, flip
- **[@remotion/noise](https://remotion.dev/docs/noise)** — Perlin noise for organic movement
- **[@remotion/paths](https://remotion.dev/docs/paths)** — SVG path evolution for animated edges
- **[@remotion/shapes](https://remotion.dev/docs/shapes)** — Star/shape generation for particles
- **[@remotion/light-leaks](https://remotion.dev/docs/light-leaks)** — Cinematic light leak overlays
- **[@remotion/google-fonts](https://remotion.dev/docs/google-fonts)** — Font loading
- **React 19** + **TypeScript 5.9**
- **Tailwind CSS 4**

## Built With Claude Code + Remotion Skill

This entire project was built using [Claude Code](https://claude.ai/claude-code) — Anthropic's AI coding CLI — powered by the **[Remotion Best Practices skill](https://remotion.dev/docs/claude-code)** which gave Claude Code deep knowledge of Remotion's APIs, animation patterns, and best practices.

The development process involved:

1. **Initial scaffolding** — Remotion project setup, scene structure, transition ordering
2. **Remotion skill guidance** — Claude Code's Remotion skill ensured correct usage of `spring()`, `interpolate()`, `TransitionSeries`, `evolvePath()`, `noise2D()`, and all Remotion packages — no guessing, no CSS animation fallbacks
3. **Deep dive exploration** — Claude Code agents analyzed the Creativly.ai frontend codebase to catalog every visual feature, UI pattern, and interaction
4. **Systematic enrichment** — Each scene was enhanced with frontend-inspired details through parallel agent architecture (3 agents editing different files simultaneously)
5. **26 iterative versions** — From basic scenes to the fully enriched final product

Every line of code was written by Claude Code, type-checked with `npx tsc --noEmit`, and committed — zero TypeScript errors throughout.

## License

MIT

## Links

- [Remotion Documentation](https://remotion.dev/docs)
- [Remotion GitHub](https://github.com/remotion-dev/remotion)
- [Claude Code](https://claude.ai/claude-code)
- [Creativly.ai](https://creativly.ai)
