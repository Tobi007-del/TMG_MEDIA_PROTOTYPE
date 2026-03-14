import { BasePlug, type FramePlug } from ".";
import { type CtlrMedia } from "../types/contract";
import { type Event } from "../types/reactor";
import { uncamelize } from "../utils";

export type Css = Record<string, string | number> & {
  captionsCharacterEdgeStyle: "none" | "raised" | "depressed" | "uniform" | "dropshadow";
  captionsTextAlignment: "start" | "center" | "end";
  syncWithMedia: Record<keyof Css, boolean>; // not a live synced key
};

export class CSSPlug extends BasePlug<Css> {
  public static readonly plugName: string = "css";
  public static readonly isCore: boolean = true;
  public classKeys = ["captionsCharacterEdgeStyle", "captionsTextAlignment"];
  public CSSCache: Record<string, string | number> = {};

  public wire(): void {
    // Variables Assignment
    const entries = Object.entries(this.config);
    this.ctlr.config.settings.css.altImgUrl = `url(${window.TMG_VIDEO_ALT_IMG_SRC})`;
    // Ctlr Config Getters
    this.ctlr.config.get("*", (val, { target: { key, path } }) => {
      if (!path.startsWith("settings.css.") || path.includes("sync")) return val;
      const newVal = this[this.classKeys.includes(key) ? "getClassValue" : "getCSSValue"](key);
      return ((this.CSSCache[key] ||= newVal), newVal);
    });
    // ---- Media Watchers
    this.ctlr.media.watch("status.videoWidth", this.syncAspectRatio, { signal: this.signal, immediate: true });
    this.ctlr.media.watch("status.videoHeight", this.syncAspectRatio, { signal: this.signal });
    // ---- Config -------
    this.ctlr.config.watch("*", (val, { target: { key, path } }) => path.startsWith("settings.css.") && !path.includes("sync") && this.apply(key, val), { signal: this.signal }); // `.watch()`: CSSOM needs immediate updates for visual sync
    // ---- State --------
    this.ctlr.state.watch("dimensions.container.width", (w) => (this.ctlr.config.settings.css.currentContainerWidth = `${w || 0}px`), { signal: this.signal, immediate: true });
    this.ctlr.state.watch("dimensions.container.height", (h) => (this.ctlr.config.settings.css.currentContainerHeight = `${h || 0}px`), { signal: this.signal, immediate: true });
    // ---- Media Listeners
    this.ctlr.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
    // ---- State ----------
    this.ctlr.state.on("dimensions.container.tier", ({ value: tier }) => (this.ctlr.videoContainer.dataset.sizeTier = tier || ""), { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.pseudoContainer.tier", ({ value: tier }) => (this.ctlr.pseudoVideoContainer.dataset.sizeTier = tier || ""), { signal: this.signal, immediate: true });
    // Post Wiring
    entries.forEach(([k, v]) => k !== "syncWithMedia" && ((this.CSSCache[k] ||= this.config[k]), this.apply(k, v)));
  }

  protected async handleLoadedMetadataStatus({ value }: Event<CtlrMedia, "status.loadedMetadata">) {
    const color = value && (await this.ctlr.getPlug<FramePlug>("frame")?.getMainColor()),
      keys = Object.keys(this.ctlr.config.settings.css.syncWithMedia).filter((k) => this.ctlr.config.settings.css.syncWithMedia[k]);
    keys.forEach((k) => (this.ctlr.config.settings.css[k] = String((value ? color : null) ?? this.CSSCache[k])));
  }

  protected getCSSValue(key: string): string {
    const cssVar = `--tmg-video-${uncamelize(key, "-")}`,
      val = getComputedStyle(this.ctlr.videoContainer).getPropertyValue(cssVar);
    return val;
  }

  protected getClassValue(key: string): string {
    const prefix = `tmg-video-${uncamelize(key, "-")}`,
      val = Array.prototype.find.call(this.ctlr.videoContainer.classList, (c) => c.startsWith(prefix))?.replace(`${prefix}-`, "");
    return val || "none"; // Validation logic (can be expanded to use tmg.parseUIObj if available)
  }

  protected apply(key: string, value: any) {
    this[this.classKeys.includes(key) ? "updateClassValue" : "updateCssVariable"](key, value);
  }

  protected updateCssVariable(key: string, value: any) {
    const strVal = String(value),
      cssVar = `--tmg-video-${uncamelize(key, "-")}`;
    [this.ctlr.videoContainer, this.ctlr.pseudoVideoContainer].forEach((el) => el?.style.setProperty(cssVar, strVal));
  }

  protected updateClassValue(key: string, value: any) {
    const pre = `tmg-video-${uncamelize(key, "-")}`;
    this.ctlr.videoContainer.classList.forEach((c) => c.startsWith(pre) && this.ctlr.videoContainer.classList.remove(c));
    this.ctlr.videoContainer.classList.add(`${pre}-${value}`);
  }

  protected syncAspectRatio() {
    const { videoWidth: w, videoHeight: h } = this.ctlr.media.status;
    this.ctlr.config.settings.css.aspectRatio = w && h ? `${w} / ${h}` : "16 / 9";
  }
}
