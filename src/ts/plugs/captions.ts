import { BasePlug, CSSPlug, type KeysPlug } from ".";
import type { CaptionsView } from "../components";
import { ComponentRegistry } from "../core/registry";
import { type REvent, type DeepPartial, type PathValue } from "sia-reactor";
import { setAny } from "sia-reactor/utils";
import type { CtlrConfig } from "../types/config";
import type { CtlrMedia } from "../types/contract";
import type { OptRange } from "../types/generics";
import type { UIOption, UISettings } from "../types/UIOptions";
import { camelize, parseUIObj, rotate } from "../utils";

export interface Captions {
  disabled: boolean;
  font: {
    family: UISettings<string>;
    size: OptRange & { options: UIOption<number>[] };
    color: UISettings<string>;
    opacity: UISettings<number>;
    weight: UISettings<string | number>;
    variant: UISettings<string>;
  };
  window: {
    color: UISettings<string>;
    opacity: UISettings<number>;
  };
  background: {
    color: UISettings<string>;
    opacity: UISettings<number>;
  };
  characterEdgeStyle: UISettings<"none" | "raised" | "depressed" | "outline" | "drop-shadow">;
  textAlignment: UISettings<"left" | "center" | "right">;
  allowVideoOverride: boolean;
  previewTimeout: 1500;
}

const STYLE_PROPS = ["font.family", "font.size", "font.color", "font.opacity", "font.weight", "font.variant", "background.color", "background.opacity", "window.color", "window.opacity", "characterEdgeStyle", "textAlignment"] as const;
const ROTATE_PATHS = ["captions.font.family.value", "captions.font.weight.value", "captions.font.variant.value", "captions.font.opacity.value", "captions.background.opacity.value", "captions.window.opacity.value", "captions.characterEdgeStyle.value", "captions.textAlignment.value"] as const;

type CaptionsStyleProp = (typeof STYLE_PROPS)[number];
type CaptionsRotatePath = (typeof ROTATE_PATHS)[number];

export class CaptionsPlug extends BasePlug<Captions> {
  public static readonly plugName: string = "captions";
  protected view: CaptionsView | null = null;
  protected iView: CaptionsView | null = null; // info view

  public mount(): void {
    // Variables Assignment
    this.view = ComponentRegistry.init<CaptionsView>("captions", this.ctlr);
    this.iView = ComponentRegistry.init<CaptionsView>("captions", this.ctlr);
    if (this.view) this.ctlr.DOM.captionsContainer = this.view.element;
    // DOM Injection
    (this.view?.mount(), this.iView?.mount());
  }

  public wire(): void {
    // Ctlr Config Watchers
    STYLE_PROPS.forEach((prop) => {
      this.ctlr.config.watch(`settings.captions.${prop}.value` as `settings.captions.${CaptionsStyleProp}.value`, (value) => ((this.ctlr.settings.css[camelize(`captions.${prop}`, /\./)] = value), this.view?.syncSize()), { signal: this.signal, immediate: true });
    });
    // ---- Media Listeners
    this.media.on("status.loadedMetadata", this.syncUIState, { signal: this.signal, immediate: true });
    this.media.on("status.textTracks", this.syncUIState, { signal: this.signal });
    this.media.on("state.currentTextTrack", this.handleCurrentTextTrackState, { signal: this.signal, immediate: true });
    this.media.on("status.activeCue", this.handleActiveCueStatus, { signal: this.signal, immediate: true });
    this.view && this.media.on("state.currentTime", this.view.syncKaraoke, { signal: this.signal });
    // ---- Config ---------
    this.ctlr.config.on("settings.captions.font.size.min", this.handleFontSizeMin, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.captions.font.size.max", this.handleFontSizeMax, { signal: this.signal, immediate: true });
    // Post Wiring
    (this.ctlr.settings.css.currentCaptionsX, this.ctlr.settings.css.currentCaptionsY); // Read once so CSSPlug can cache computed values.
    const keys = this.ctlr.plug<KeysPlug>("keys");
    keys?.register("captions", this.toggleCaptions, { phase: "keyup" });
    // JS: return this.media.status.textTracks[this.media.state.currentTextTrack] && this.notify("captions");
    keys?.register("captionsFontSizeUp", (_, mod) => this.changeFontSize(keys.getModded("captionsFontSize", mod, this.config.font.size.skip)), { phase: "keydown" });
    keys?.register("captionsFontSizeDown", (_, mod) => this.changeFontSize(-keys.getModded("captionsFontSize", mod, this.config.font.size.skip)), { phase: "keydown" });
    keys?.register("captionsFontFamily", () => this.rotateProp(parseUIObj(this.config).font.family.values, "captions.font.family.value", false), { phase: "keydown" });
    keys?.register("captionsFontWeight", () => this.rotateProp(parseUIObj(this.config).font.weight.values, "captions.font.weight.value", false), { phase: "keydown" });
    keys?.register("captionsFontVariant", () => this.rotateProp(parseUIObj(this.config).font.variant.values, "captions.font.variant.value", false), { phase: "keydown" });
    keys?.register("captionsFontOpacity", () => this.rotateProp(parseUIObj(this.config).font.opacity.values, "captions.font.opacity.value"), { phase: "keydown" });
    keys?.register("captionsBackgroundOpacity", () => this.rotateProp(parseUIObj(this.config).background.opacity.values, "captions.background.opacity.value"), { phase: "keydown" });
    keys?.register("captionsWindowOpacity", () => this.rotateProp(parseUIObj(this.config).window.opacity.values, "captions.window.opacity.value"), { phase: "keydown" });
    keys?.register("captionsCharacterEdgeStyle", () => this.rotateProp(parseUIObj(this.config).characterEdgeStyle.values, "captions.characterEdgeStyle.value", false), { phase: "keydown" });
    keys?.register("captionsTextAlignment", () => this.rotateProp(parseUIObj(this.config).textAlignment.values, "captions.textAlignment.value", false), { phase: "keydown" });
  }

  protected handleDisabledConfig({ value }: REvent<CtlrConfig, "settings.captions.disabled">): void {
    const cssPlug = this.ctlr.plug<CSSPlug>("css");
    ((this.ctlr.settings.css.currentCaptionsX = cssPlug?._cache.currentCaptionsX!), (this.ctlr.settings.css.currentCaptionsY = cssPlug?._cache.currentCaptionsY!));
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return;
    !value ? this.ctlr.videoContainer.classList.add("tmg-video-captions") : this.ctlr.videoContainer.classList.remove("tmg-video-captions", "tmg-video-captions-preview");
    !value && this.iView?.preview({ text: `${this.media.status.textTracks[this.media.state.currentTextTrack]?.label} ${this.ctlr.videoContainer.dataset.trackKind} \n Click ⚙ for settings`, region: { viewportAnchorX: 10, viewportAnchorY: 10 } });
  }

  protected handleFontSizeMin({ value: min }: REvent<CtlrConfig, "settings.captions.font.size.min">): void {
    if (this.config.font.size.value < min) this.config.font.size.value = min;
  }

  protected handleFontSizeMax({ value: max }: REvent<CtlrConfig, "settings.captions.font.size.max">): void {
    if (this.config.font.size.value > max) this.config.font.size.value = max;
  }

  protected handleCurrentTextTrackState({ value }: REvent<CtlrMedia, "state.currentTextTrack">): void {
    this.ctlr.videoContainer.dataset.trackKind = this.media.status.textTracks[value]?.kind || "captions";
  }

  protected handleActiveCueStatus({ value }: REvent<CtlrMedia, "status.activeCue">): void {
    !(!this.ctlr.isUIActive("captions") && this.ctlr.isUIActive("captionsPreview")) && this.view?.render(value);
  }

  protected syncUIState(): void {
    this.ctlr.videoContainer.classList.toggle("tmg-video-captions", this.media.status.textTracks.length > 0 && !this.config.disabled);
    this.ctlr.videoContainer.dataset.trackKind = this.media.status.textTracks[this.media.state.currentTextTrack]?.kind || "captions";
    // JS: this.ctlr.setControlsState("captions");
  }

  public toggleCaptions(): void {
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return this.view?.preview("No captions available for this video");
    this.config.disabled = !this.config.disabled;
  }

  public changeFontSize(value: number): void {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    const size = Number(this.ctlr.settings.css.captionsFontSize);
    switch (sign) {
      case "-":
        if (size > this.config.font.size.min) this.config.font.size.value = size - (size % value ? size % value : value);
        break;
      default:
        if (size < this.config.font.size.max) this.config.font.size.value = size + (size % value ? size % value : value);
    }
    this.view && this.ctlr.config.stall(this.view.preview);
  }

  protected rotateProp(steps: PathValue<CtlrConfig["settings"], CaptionsRotatePath>[], prop: CaptionsRotatePath, numeric = true): void {
    if (!steps.length) return;
    const curr = this.ctlr.settings.css[camelize(prop.replace(".value", ""), /\./)];
    setAny(this.ctlr.settings, prop, rotate(numeric ? Number(curr) : String(curr), steps));
    this.view && this.ctlr.config.stall(this.view.preview);
  }

  protected onDestroy(): void {
    this.view?.destroy();
    if (this.ctlr.DOM.captionsContainer === this.view?.element) this.ctlr.DOM.captionsContainer = null;
  }
}

export const CAPTIONS_BUILD: DeepPartial<Captions> = {
  disabled: false,
  allowVideoOverride: true,
  font: {
    family: {
      value: "inherit",
      options: [
        { value: "inherit", display: "Default" },
        { value: "monospace", display: "Monospace" },
        { value: "sans-serif", display: "Sans Serif" },
        { value: "serif", display: "Serif" },
        { value: "cursive", display: "Cursive" },
        { value: "fantasy", display: "Fantasy" },
        { value: "system-ui", display: "System UI" },
        { value: "arial", display: "Arial" },
        { value: "verdana", display: "Verdana" },
        { value: "tahoma", display: "Tahoma" },
        { value: "times new roman", display: "Times New Roman" },
        { value: "georgia", display: "Georgia" },
        { value: "impact", display: "Impact" },
        { value: "comic sans ms", display: "Comic Sans MS" },
      ],
    },
    size: {
      min: 100,
      max: 400,
      value: 100,
      skip: 100,
      options: [
        { value: 25, display: "25%" },
        { value: 50, display: "50%" },
        { value: 100, display: "100%" },
        { value: 150, display: "150%" },
        { value: 200, display: "200%" },
        { value: 300, display: "300%" },
        { value: 400, display: "400%" },
      ],
    },
    color: {
      value: "white",
      options: [
        { value: "white", display: "White" },
        { value: "yellow", display: "Yellow" },
        { value: "green", display: "Green" },
        { value: "cyan", display: "Cyan" },
        { value: "blue", display: "Blue" },
        { value: "magenta", display: "Magenta" },
        { value: "red", display: "Red" },
        { value: "black", display: "Black" },
      ],
    },
    opacity: {
      value: 1,
      options: [
        { value: 0.25, display: "25%" },
        { value: 0.5, display: "50%" },
        { value: 0.75, display: "75%" },
        { value: 1, display: "100%" },
      ],
    },
    weight: {
      value: "400",
      options: [
        { value: "100", display: "Thin" },
        { value: "200", display: "Extra Light" },
        { value: "300", display: "Light" },
        { value: "400", display: "Normal" },
        { value: "500", display: "Medium" },
        { value: "600", display: "Semi Bold" },
        { value: "700", display: "Bold" },
        { value: "800", display: "Extra Bold" },
        { value: "900", display: "Black" },
      ],
    },
    variant: {
      value: "normal",
      options: [
        { value: "normal", display: "Normal" },
        { value: "small-caps", display: "Small Caps" },
        { value: "all-small-caps", display: "All Small Caps" },
      ],
    },
  },
  background: {
    color: {
      value: "black",
      options: [
        { value: "white", display: "White" },
        { value: "yellow", display: "Yellow" },
        { value: "green", display: "Green" },
        { value: "cyan", display: "Cyan" },
        { value: "blue", display: "Blue" },
        { value: "magenta", display: "Magenta" },
        { value: "red", display: "Red" },
        { value: "black", display: "Black" },
      ],
    },
    opacity: {
      value: 0.75,
      options: [
        { value: 0, display: "0%" },
        { value: 0.25, display: "25%" },
        { value: 0.5, display: "50%" },
        { value: 0.75, display: "75%" },
        { value: 1, display: "100%" },
      ],
    },
  },
  window: {
    color: {
      value: "black",
      options: [
        { value: "white", display: "White" },
        { value: "yellow", display: "Yellow" },
        { value: "green", display: "Green" },
        { value: "cyan", display: "Cyan" },
        { value: "blue", display: "Blue" },
        { value: "magenta", display: "Magenta" },
        { value: "red", display: "Red" },
        { value: "black", display: "Black" },
      ],
    },
    opacity: {
      value: 0,
      options: [
        { value: 0, display: "0%" },
        { value: 0.25, display: "25%" },
        { value: 0.5, display: "50%" },
        { value: 0.75, display: "75%" },
        { value: 1, display: "100%" },
      ],
    },
  },
  characterEdgeStyle: {
    value: "none",
    options: [
      { value: "none", display: "None" },
      { value: "drop-shadow", display: "Drop Shadow" },
      { value: "raised", display: "Raised" },
      { value: "depressed", display: "Depressed" },
      { value: "outline", display: "Outline" },
    ],
  },
  textAlignment: {
    value: "left",
    options: [
      { value: "left", display: "Left" },
      { value: "center", display: "Center" },
      { value: "right", display: "Right" },
    ],
  },
};
