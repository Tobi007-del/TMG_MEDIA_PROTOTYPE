import { BasePlug, CSSPlug, type KeysPlug } from ".";
import type { CaptionsView } from "../components";
import { ComponentRegistry } from "../core/registry";
import type { REvent } from "../types/reactor";
import type { VideoBuild } from "../types/build";
import type { CtlrMedia } from "../types/contract";
import type { OptRange } from "../types/generics";
import type { PathValue } from "../types/obj";
import type { UIOption, UISettings } from "../types/UIOptions";
import { camelize, parseUIObj, rotate, setAny } from "../utils";

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
  protected infoView: CaptionsView | null = null;

  public mount(): void {
    // Variables Assignment
    this.view = ComponentRegistry.init<CaptionsView>("captions", this.ctlr);
    this.infoView = ComponentRegistry.init<CaptionsView>("captions", this.ctlr);
    if (this.view) this.ctlr.DOM.captionsContainer = this.view.element;
    // DOM Injection
    (this.view?.mount(), this.infoView?.mount());
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
    const keys = this.ctlr.getPlug<KeysPlug>("keys");
    keys?.register("captions", this.toggleCaptions, { phase: "keyup" });
    keys?.register("captionsFontSizeUp", (_, mod) => this.changeFontSize(keys.getModded("captionsFontSize", mod, this.config.font.size.skip)), { phase: "keydown" });
    keys?.register("captionsFontSizeDown", (_, mod) => this.changeFontSize(-keys.getModded("captionsFontSize", mod, this.config.font.size.skip)), { phase: "keydown" });
    keys?.register("captionsFontFamily", this.rotateFontFamily, { phase: "keydown" });
    keys?.register("captionsFontWeight", this.rotateFontWeight, { phase: "keydown" });
    keys?.register("captionsFontVariant", this.rotateFontVariant, { phase: "keydown" });
    keys?.register("captionsFontOpacity", this.rotateFontOpacity, { phase: "keydown" });
    keys?.register("captionsBackgroundOpacity", this.rotateBackgroundOpacity, { phase: "keydown" });
    keys?.register("captionsWindowOpacity", this.rotateWindowOpacity, { phase: "keydown" });
    keys?.register("captionsCharacterEdgeStyle", this.rotateCharacterEdgeStyle, { phase: "keydown" });
    keys?.register("captionsTextAlignment", this.rotateTextAlignment, { phase: "keydown" });
  }

  protected handleDisabledConfig({ value }: REvent<VideoBuild, "settings.captions.disabled">): void {
    const cssPlug = this.ctlr.getPlug<CSSPlug>("css");
    ((this.ctlr.settings.css.currentCaptionsX = cssPlug?.CSSCache.currentCaptionsX!), (this.ctlr.settings.css.currentCaptionsY = cssPlug?.CSSCache.currentCaptionsY!));
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return;
    !value ? this.ctlr.videoContainer.classList.add("tmg-video-captions") : this.ctlr.videoContainer.classList.remove("tmg-video-captions", "tmg-video-captions-preview");
    !value && this.infoView?.preview({ text: `${this.media.status.textTracks[this.media.state.currentTextTrack]?.label} ${this.ctlr.videoContainer.dataset.trackKind} \n Click ⚙ for settings`, region: { viewportAnchorX: 10, viewportAnchorY: 10 } });
  }

  protected handleFontSizeMin({ value: min }: REvent<VideoBuild, "settings.captions.font.size.min">): void {
    if (this.config.font.size.value < min) this.config.font.size.value = min;
  }

  protected handleFontSizeMax({ value: max }: REvent<VideoBuild, "settings.captions.font.size.max">): void {
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

  protected rotateProp(steps: PathValue<VideoBuild["settings"], CaptionsRotatePath>[], prop: CaptionsRotatePath, numeric = true): void {
    if (!steps.length) return;
    const curr = this.ctlr.settings.css[camelize(prop.replace(".value", ""), /\./)];
    setAny(this.ctlr.settings, prop, rotate(numeric ? Number(curr) : String(curr), steps));
    this.view && this.ctlr.config.stall(this.view.preview);
  }

  public rotateFontFamily(): void {
    this.rotateProp(parseUIObj(this.config).font.family.values, "captions.font.family.value", false);
  }
  public rotateFontWeight(): void {
    this.rotateProp(parseUIObj(this.config).font.weight.values, "captions.font.weight.value", false);
  }
  public rotateFontVariant(): void {
    this.rotateProp(parseUIObj(this.config).font.variant.values, "captions.font.variant.value", false);
  }
  public rotateFontOpacity(): void {
    this.rotateProp(parseUIObj(this.config).font.opacity.values, "captions.font.opacity.value");
  }
  public rotateBackgroundOpacity(): void {
    this.rotateProp(parseUIObj(this.config).background.opacity.values, "captions.background.opacity.value");
  }
  public rotateWindowOpacity(): void {
    this.rotateProp(parseUIObj(this.config).window.opacity.values, "captions.window.opacity.value");
  }
  public rotateCharacterEdgeStyle(): void {
    this.rotateProp(parseUIObj(this.config).characterEdgeStyle.values, "captions.characterEdgeStyle.value", false);
  }
  public rotateTextAlignment(): void {
    this.rotateProp(parseUIObj(this.config).textAlignment.values, "captions.textAlignment.value", false);
  }

  protected onDestroy(): void {
    this.view?.destroy();
    if (this.ctlr.DOM.captionsContainer === this.view?.element) this.ctlr.DOM.captionsContainer = null;
  }
}
