import { BasePlug } from ".";
import { VideoBuild } from "../types/build";
import { CMedia } from "../types/contract";
import { Event } from "../types/reactor";
import { camelize, uncamelize } from "../utils";

export type Css = Record<string, string | number> & {
  captionsCharacterEdgeStyle: "none" | "raised" | "depressed" | "uniform" | "dropshadow";
  captionsTextAlignment: "start" | "center" | "end";
  syncWithMedia: Record<keyof Css, boolean>;
};

export class CSSPlug extends BasePlug<Css> {
  public static readonly plugName: string = "css";
  public static readonly isCore: boolean = true;
  public classSettings = ["captionsCharacterEdgeStyle", "captionsTextAlignment"];
  public CSSCache: Record<string, string> = {};

  public wire(): void {
    this.CSSCache = {};
    this.ctlr.config.on("settings.css", this.handleCSSChange, { signal: this.signal, immediate: true, depth: 1 });
    this.classSettings.forEach(this.wireClassMediator);
    this.wireSheetMediators();
    this.wireComputedVars();
  }

  protected wireSheetMediators() {
    for (const sheet of document.styleSheets) {
      try {
        if (!sheet.cssRules) continue;
        for (const rule of sheet.cssRules) {
          if (!(rule instanceof CSSStyleRule) || !rule.selectorText?.replace(/\s/g, "")?.match(/(:root|\.tmg-media-container)/)) continue;
          for (const prop of rule.style) {
            if (!prop.startsWith("--tmg-video-")) continue;
            const field = camelize(prop.replace("--tmg-video-", ""));
            this.CSSCache[field] = rule.style.getPropertyValue(prop); // Cache raw
            this.ctlr.config.get(`settings.css.${field}`, () => getComputedStyle(this.ctlr.videoContainer).getPropertyValue(prop), { signal: this.signal });
          }
        }
      } catch {
        continue;
      }
    }
  }

  protected wireClassMediator(key: string) {
    this.ctlr.config.get(`settings.css.${key}`, () => this.getValue(key), { signal: this.signal });
  }

  protected handleCSSChange({ type, target: { key, value } }: Event<VideoBuild, "settings.css">) {
    type === "update" ? this.apply(key, value) : type === "init" && Object.keys(value!).forEach((k) => k !== "syncWithMedia" && this.apply(k, value![k]));
  }

  protected getValue(key: string): string {
    const pre = `tmg-video-${uncamelize(key, "-")}`,
      val = Array.prototype.find.call(this.ctlr.videoContainer.classList, (c) => c.startsWith(pre))?.replace(`${pre}-`, "");
    return val || "none"; // Validation logic (can be expanded to use tmg.parseUIObj if available)
  }

  protected apply(key: string, value: any) {
    this[this.classSettings.includes(key) ? "updateClass" : "updateCssVariable"](key, value);
  }

  protected updateCssVariable(key: string, value: any) {
    const strVal = String(value),
      cssVar = `--tmg-video-${uncamelize(key, "-")}`;
    [this.ctlr.videoContainer, this.ctlr.pseudoVideoContainer].forEach((el) => el?.style.setProperty(cssVar, strVal));
  }

  protected updateClass(key: string, value: any) {
    const pre = `tmg-video-${uncamelize(key, "-")}`;
    this.ctlr.videoContainer.classList.forEach((c) => c.startsWith(pre) && this.ctlr.videoContainer.classList.remove(c));
    this.ctlr.videoContainer.classList.add(`${pre}-${value}`);
  }

  protected wireComputedVars() {
    this.ctlr.config.settings.css.altImgUrl = `url(${window.TMG_VIDEO_ALT_IMG_SRC})`;
    this.ctlr.media.watch("status.videoWidth", this.syncAspectRatio, { signal: this.signal, immediate: true });
    this.ctlr.media.watch("status.videoHeight", this.syncAspectRatio, { signal: this.signal });
    this.ctlr.media.on("status.loadedMetadata", this.handleLoadedMetadataChange, { signal: this.signal, immediate: true });
    this.ctlr.state.watch("dimensions.container.width", (w) => (this.ctlr.config.settings.css.currentContainerWidth = `${w || 0}px`), { signal: this.signal, immediate: true });
    this.ctlr.state.watch("dimensions.container.height", (h) => (this.ctlr.config.settings.css.currentContainerHeight = `${h || 0}px`), { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.container.tier", ({ value: tier }) => (this.ctlr.videoContainer.dataset.sizeTier = tier || ""), { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.pseudoContainer.tier", ({ value: tier }) => (this.ctlr.pseudoVideoContainer.dataset.sizeTier = tier || ""), { signal: this.signal, immediate: true });
  }

  protected syncAspectRatio() {
    const { videoWidth: w, videoHeight: h } = this.ctlr.media.status;
    this.ctlr.config.settings.css.aspectRatio = w && h ? `${w} / ${h}` : "16 / 9";
  }

  protected handleLoadedMetadataChange({ value }: Event<CMedia, "status.loadedMetadata">) {
    const color = value && null, // use frame plug later instead of null
      keys = Object.keys(this.ctlr.config.settings.css.syncWithMedia);
    keys.forEach((k) => (this.ctlr.config.settings.css[k] = String((value ? color : null) ?? this.CSSCache[k])));
  }
}
