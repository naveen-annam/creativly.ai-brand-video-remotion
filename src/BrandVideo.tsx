import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import { LightLeak } from "@remotion/light-leaks";
import {
  VIDEO_FPS,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  DURATIONS,
  TRANSITION_FRAMES,
} from "./constants";

import { IntroScene } from "./scenes/IntroScene";
import { FlowDemoScene } from "./scenes/FlowDemoScene";
import { TemplatesScene } from "./scenes/TemplatesScene";
import { FocusedDemoScene } from "./scenes/FocusedDemoScene";
import { CollaborationScene } from "./scenes/CollaborationScene";
import { ModelsScene } from "./scenes/ModelsScene";
import { TextGenerationScene } from "./scenes/TextGenerationScene";
import { StylePresetsScene } from "./scenes/StylePresetsScene";
import { AudioGenerationScene } from "./scenes/AudioGenerationScene";
import { RecorderScene } from "./scenes/RecorderScene";
import { EditorScene } from "./scenes/EditorScene";
import { InpaintingScene } from "./scenes/InpaintingScene";
import { UpscalingScene } from "./scenes/UpscalingScene";
import { BatchGenerationScene } from "./scenes/BatchGenerationScene";
import { PerformanceScene } from "./scenes/PerformanceScene";
import { OpenSourceScene } from "./scenes/OpenSourceScene";
import { OutroScene } from "./scenes/OutroScene";

const f = (seconds: number) => Math.round(seconds * VIDEO_FPS);

export const BrandVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {/* 1. INTRO (BLACK) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.intro)}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* 2. FLOW DEMO (BLACK) — cinematic pipeline walkthrough */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.flowDemo)}>
          <FlowDemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 3. TEMPLATES (WHITE) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.templates)}>
          <TemplatesScene />
        </TransitionSeries.Sequence>

        {/* Light Leak: Templates -> Focused Demo (golden yellow tint) */}
        <TransitionSeries.Overlay durationInFrames={30}>
          <LightLeak seed={3} hueShift={50} />
        </TransitionSeries.Overlay>

        {/* 3. FOCUSED DEMO (BLACK) — studio editing experience */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.focusedDemo)}>
          <FocusedDemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* 4. COLLABORATION (WHITE) */}
        <TransitionSeries.Sequence
          durationInFrames={f(DURATIONS.collaboration)}
        >
          <CollaborationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />

        {/* 5. MODELS (BLACK) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.models)}>
          <ModelsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-top" })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 6. TEXT GEN (WHITE) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.textGen)}>
          <TextGenerationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* 7. STYLE PRESETS (BLACK) */}
        <TransitionSeries.Sequence
          durationInFrames={f(DURATIONS.stylePresets)}
        >
          <StylePresetsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* 8. AUDIO GEN (WHITE) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.audioGen)}>
          <AudioGenerationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 9. RECORDER (BLACK) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.recorder)}>
          <RecorderScene />
        </TransitionSeries.Sequence>

        {/* Light Leak: Recorder -> Editor (warm golden) */}
        <TransitionSeries.Overlay durationInFrames={30}>
          <LightLeak seed={7} hueShift={45} />
        </TransitionSeries.Overlay>

        {/* 10. EDITOR (WHITE) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.editor)}>
          <EditorScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />

        {/* 11. INPAINTING (BLACK) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.inpainting)}>
          <InpaintingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
          })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* 12. UPSCALING (WHITE) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.upscaling)}>
          <UpscalingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* 13. BATCH GEN (BLACK) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.batchGen)}>
          <BatchGenerationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 14. PERFORMANCE (WHITE) */}
        <TransitionSeries.Sequence
          durationInFrames={f(DURATIONS.performance)}
        >
          <PerformanceScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* 15. OPEN SOURCE (DARK #0D1117) */}
        <TransitionSeries.Sequence
          durationInFrames={f(DURATIONS.openSource)}
        >
          <OpenSourceScene />
        </TransitionSeries.Sequence>

        {/* Light Leak: OpenSource -> Outro (golden yellow finale) */}
        <TransitionSeries.Overlay durationInFrames={35}>
          <LightLeak seed={1} hueShift={50} />
        </TransitionSeries.Overlay>

        {/* 16. OUTRO (BLACK) */}
        <TransitionSeries.Sequence durationInFrames={f(DURATIONS.outro)}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
