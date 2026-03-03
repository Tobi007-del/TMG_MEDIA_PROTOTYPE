import { BasePlug } from ".";
import { VideoBuild } from "../types/build";
import { CtlrMedia } from "../types/contract";
import { Event } from "../types/reactor";
import { camelize, uncamelize } from "../utils";

export type Css = Record<string, string | number> & {
  captionsCharacterEdgeStyle: "none" | "raised" | "depressed" | "uniform" | "dropshadow";
  captionsTextAlignment: "start" | "center" | "end";
  syncWithMedia: Record<keyof Css, boolean>; // not a live synced key
};

export class CSSPlug extends BasePlug<Css> {
  public static readonly plugName: string = "css";
  public static readonly isCore: boolean = true;
  public classKeys = ["captionsCharacterEdgeStyle", "captionsTextAlignment"];
  public CSSCache: Record<string, string> = {};

  public wire(): void {
    this.ctlr.config.on("settings.css", this.handleCSSChange, { signal: this.signal, immediate: true, depth: 1 });
    this.wireCSSMediator();
    // Computed Vars
    this.ctlr.config.settings.css.altImgUrl = `url(${window.TMG_VIDEO_ALT_IMG_SRC})`;
    this.ctlr.media.watch("status.videoWidth", this.syncAspectRatio, { signal: this.signal, immediate: true });
    this.ctlr.media.watch("status.videoHeight", this.syncAspectRatio, { signal: this.signal });
    this.ctlr.media.on("status.loadedMetadata", this.handleLoadedMetadataChange, { signal: this.signal, immediate: true });
    this.ctlr.state.watch("dimensions.container.width", (w) => (this.ctlr.config.settings.css.currentContainerWidth = `${w || 0}px`), { signal: this.signal, immediate: true });
    this.ctlr.state.watch("dimensions.container.height", (h) => (this.ctlr.config.settings.css.currentContainerHeight = `${h || 0}px`), { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.container.tier", ({ value: tier }) => (this.ctlr.videoContainer.dataset.sizeTier = tier || ""), { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.pseudoContainer.tier", ({ value: tier }) => (this.ctlr.pseudoVideoContainer.dataset.sizeTier = tier || ""), { signal: this.signal, immediate: true });
  }

  protected wireCSSMediator() {
    this.ctlr.config.__Reactor__.options ??= {};
    const prevGet = this.ctlr.config.__Reactor__.options.get;
    this.ctlr.config.__Reactor__.options.get = (obj, key, val, proxy, paths) => {
      prevGet && (val = prevGet(obj, key, val, proxy, paths));
      if (!paths[0]?.startsWith("settings.css.")) return val;
      const safeKey = String(key);
      if (paths[0]?.includes("syncWithMedia")) return val;
      const newVal = this[this.classKeys.includes(safeKey) ? "getClassValue" : "getCSSValue"](safeKey);
      this.CSSCache[safeKey] ||= newVal;
      return newVal;
    };
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

  protected handleCSSChange({ type, target: t }: Event<VideoBuild, "settings.css">) {
    type === "update" ? this.apply(t.key, t.value) : type === "init" && Object.keys(t.value!).forEach((k) => k !== "syncWithMedia" && this.apply(k, t.value![k]));
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

  protected handleLoadedMetadataChange({ value }: Event<CtlrMedia, "status.loadedMetadata">) {
    const color = value && null, // use frame plug later instead of null
      keys = Object.keys(this.ctlr.config.settings.css.syncWithMedia);
    keys.forEach((k) => (this.ctlr.config.settings.css[k] = String((value ? color : null) ?? this.CSSCache[k])));
  }
}
