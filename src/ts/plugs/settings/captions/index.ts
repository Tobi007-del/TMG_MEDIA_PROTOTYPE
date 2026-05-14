import { BasePlug, Captions, CAPTIONS_BUILD, CSSPlug, ROTATE_PATHS, STYLE_PATHS, type KeysPlug } from "../..";
import type { CaptionsView } from "../../../components";
import { ComponentRegistry } from "../../../core/registry";
import { type REvent, type PathValue } from "sia-reactor";
import { setPath } from "sia-reactor/utils";
import type { CtlrConfig } from "../../../types/config";
import type { CtlrMedia } from "../../../types/contract";
import { camelize, parseUIObj, rotateAny } from "../../../utils";

export class CaptionsPlug extends BasePlug<Captions> {
  public static readonly plugName: string = "captions";
  public static readonly BUILD = CAPTIONS_BUILD;
  protected view: CaptionsView | null = null;
  protected iView: CaptionsView | null = null; // info view

  public override mount(): void {
    // Variables Assignment
    this.view = ComponentRegistry.init<CaptionsView>("captions", this.ctlr);
    this.iView = ComponentRegistry.init<CaptionsView>("captions", this.ctlr);
    if (this.view) this.ctlr.DOM.captionsContainer = this.view.element;
    // DOM Injection
    this.view?.mount(), this.iView?.mount();
  }

  public override wire(): void {
    // Ctlr Config Watchers
    STYLE_PATHS.forEach((p) => this.ctlr.config.watch(`settings.${p}`, (value) => ((this.ctlr.settings.css[camelize(`captions.${p}`, /\./)] = value), this.view?.syncSize()), { signal: this.signal, immediate: true }));
    // ---- Media Listeners
    this.media.on("status.loadedMetadata", this.syncUI, { signal: this.signal, immediate: true });
    this.media.on("status.textTracks", this.syncUI, { signal: this.signal });
    this.media.on("state.currentTextTrack", this.syncUI, { signal: this.signal, immediate: true });
    this.media.on("status.activeCue", this.handleActiveCueStatus, { signal: this.signal, immediate: true });
    this.view && this.media.on("state.currentTime", this.view.syncKaraoke, { signal: this.signal });
    // ---- Config ---------
    this.ctlr.config.on("settings.captions.visible", this.handleVisible, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.captions.font.size.min", this.handleFontSizeMin, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.captions.font.size.max", this.handleFontSizeMax, { signal: this.signal, immediate: true });
    // Post Wiring
    this.ctlr.settings.css.currentCaptionsX, this.ctlr.settings.css.currentCaptionsY; // Read once so CSSPlug can cache computed values.
    const keys = this.ctlr.plug<KeysPlug>("keys");
    keys?.register("captions", this.toggleCaptions, { phase: "keyup" });
    // JS: return this.media.status.textTracks[this.media.state.currentTextTrack] && this.notify("captions");
    keys?.register("captionsFontSizeUp", (_, mod) => this.setFontSize(keys.getModded("captionsFontSize", mod, this.config.font.size.skip)), { phase: "keydown" });
    keys?.register("captionsFontSizeDown", (_, mod) => this.setFontSize(-keys.getModded("captionsFontSize", mod, this.config.font.size.skip)), { phase: "keydown" });
    keys?.register("captionsFontFamily", () => this.rotateProp(parseUIObj(this.config).font.family.values, "captions.font.family.value", false), { phase: "keydown" });
    keys?.register("captionsFontWeight", () => this.rotateProp(parseUIObj(this.config).font.weight.values, "captions.font.weight.value", false), { phase: "keydown" });
    keys?.register("captionsFontVariant", () => this.rotateProp(parseUIObj(this.config).font.variant.values, "captions.font.variant.value", false), { phase: "keydown" });
    keys?.register("captionsFontOpacity", () => this.rotateProp(parseUIObj(this.config).font.opacity.values, "captions.font.opacity.value"), { phase: "keydown" });
    keys?.register("captionsBackgroundOpacity", () => this.rotateProp(parseUIObj(this.config).background.opacity.values, "captions.background.opacity.value"), { phase: "keydown" });
    keys?.register("captionsWindowOpacity", () => this.rotateProp(parseUIObj(this.config).window.opacity.values, "captions.window.opacity.value"), { phase: "keydown" });
    keys?.register("captionsCharacterEdgeStyle", () => this.rotateProp(parseUIObj(this.config).characterEdgeStyle.values, "captions.characterEdgeStyle.value", false), { phase: "keydown" });
    keys?.register("captionsTextAlignment", () => this.rotateProp(parseUIObj(this.config).textAlignment.values, "captions.textAlignment.value", false), { phase: "keydown" });
  }

  protected handleVisible({ value }: REvent<CtlrConfig, "settings.captions.visible">): void {
    const cssPlug = this.ctlr.plug<CSSPlug>("css");
    (this.ctlr.settings.css.currentCaptionsX = cssPlug?._cache.currentCaptionsX!), (this.ctlr.settings.css.currentCaptionsY = cssPlug?._cache.currentCaptionsY!);
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return;
    !value ? this.media.container.classList.add("tmg-media-captions") : this.media.container.classList.remove("tmg-media-captions", "tmg-media-captions-preview");
    const track = this.media.status.textTracks[this.media.state.currentTextTrack]; // native, hls, dash compat
    !value && this.iView?.preview({ text: `${track?.label || track?.name} ${this.media.container.dataset.trackKind} \n Click ⚙ for settings`, region: { viewportAnchorX: 10, viewportAnchorY: 10 } });
  }

  protected handleFontSizeMin({ value: min }: REvent<CtlrConfig, "settings.captions.font.size.min">): void {
    if (this.config.font.size.value < min) this.config.font.size.value = min;
  }

  protected handleFontSizeMax({ value: max }: REvent<CtlrConfig, "settings.captions.font.size.max">): void {
    if (this.config.font.size.value > max) this.config.font.size.value = max;
  }

  protected handleActiveCueStatus({ value }: REvent<CtlrMedia, "status.activeCue">): void {
    !(!this.ctlr.isUIActive("captions") && this.ctlr.isUIActive("captionsPreview")) && this.view?.render(value);
  }

  public toggleCaptions(): void {
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return this.view?.preview(`No captions available for this ${this.media.type}`);
    this.config.visible = !this.config.visible;
  }

  public setFontSize(value: number): void {
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

  protected rotateProp(steps: PathValue<CtlrConfig["settings"], (typeof ROTATE_PATHS)[number]>[], prop: (typeof ROTATE_PATHS)[number], numeric = true): void {
    if (!steps.length) return;
    setPath(this.ctlr.settings, prop, rotateAny((numeric ? Number : String)(this.ctlr.settings.css[camelize(prop.replace(".value", ""), /\./)]), steps));
    this.view && this.ctlr.config.stall(this.view.preview);
  }

  public syncUI(): void {
    this.media.container.classList.toggle("tmg-media-captions", this.media.status.textTracks.length > 0 && !this.config.visible);
    const track = this.media.status.textTracks[this.media.state.currentTextTrack]; // native, hls, dash compat
    this.media.container.dataset.trackKind = track?.kind || track?.type || "captions";
    // JS: this.ctlr.setControlsState("captions");
  }

  protected override onDestroy(): void {
    this.view?.destroy();
    if (this.ctlr.DOM.captionsContainer === this.view?.element) this.ctlr.DOM.captionsContainer = null;
  }
}

export type * from "./types";
export * from "./build";
