import { BasePlug } from ".";
import { VideoBuild } from "../types/build";
import { Event } from "../types/reactor";
import { camelize, isObj, uncamelize } from "../utils";

export interface Css extends Record<string, string | number> {
  captionsCharacterEdgeStyle: "none" | "raised" | "depressed" | "uniform" | "dropshadow";
  captionsTextAlignment: "start" | "center" | "end";
}

export class CSSPlug extends BasePlug<Css> {
  public static readonly plugName: string = "css";
  public static readonly isCore: boolean = true;
  protected classSettings = ["captionsCharacterEdgeStyle", "captionsTextAlignment"];
  protected cssCache: Record<string, string> = {};

  public wire(): void {
    this.cssCache = {};
    this.classSettings.forEach(this.wireClassMediator);
    this.wireSheetMediators();
    this.ctl.config.on("settings.css", this.handleCSSChange, { signal: this.signal, immediate: true });
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
            this.cssCache[field] = rule.style.getPropertyValue(prop); // Cache raw
            this.ctl.config.get(`settings.css.${field}`, () => getComputedStyle(this.ctl.videoContainer).getPropertyValue(prop), { signal: this.signal, lazy: true });
          }
        }
      } catch {
        continue;
      }
    }
  }

  protected wireClassMediator(key: string) {
    this.ctl.config.get(`settings.css.${key}`, () => this.getCSSClassValue(key), { signal: this.signal, lazy: true });
  }

  protected handleCSSChange({ type, target: { key, value } }: Event<VideoBuild, "settings.css">) {
    if (type !== "update" && type !== "init") return;
    const apply = (k: string, v: any) => this[this.classSettings.includes(k) ? "updateClass" : "updateCssVariable"](k, v);
    isObj<Css>(value) ? Object.keys(value).forEach((k) => apply(k, value[k])) : apply(key, value);
  }

  protected updateCssVariable(key: string, value: any) {
    const strVal = String(value),
      cssVar = `--tmg-video-${uncamelize(key, "-")}`;
    [this.ctl.videoContainer, this.ctl.pseudoVideoContainer].forEach((el) => el?.style.setProperty(cssVar, strVal));
  }

  protected getCSSClassValue(key: string): string {
    const pre = `tmg-video-${uncamelize(key, "-")}`,
      val = Array.prototype.find.call(this.ctl.videoContainer.classList, (c) => c.startsWith(pre))?.replace(`${pre}-`, "");
    return val || "none"; // Validation logic (can be expanded to use tmg.parseUIObj if available)
  }

  protected updateClass(key: string, value: any) {
    if (!this.ctl.videoContainer) return;
    const pre = `tmg-video-${uncamelize(key, "-")}`;
    this.ctl.videoContainer.classList.forEach((c) => c.startsWith(pre) && this.ctl.videoContainer.classList.remove(c));
    this.ctl.videoContainer.classList.add(`${pre}-${value}`);
  }

  protected wireComputedVars() {
    this.ctl.config.settings.css.altImgUrl = `url(${window.TMG_VIDEO_ALT_IMG_SRC})`;
    const updateRatio = () => {
      const { videoWidth: w, videoHeight: h } = this.ctl.media.status;
      this.ctl.config.settings.css.aspectRatio = w && h ? `${w} / ${h}` : "16 / 9";
    };
    this.ctl.media.watch("status.videoWidth", updateRatio, { signal: this.signal, immediate: true });
    this.ctl.media.watch("status.videoHeight", updateRatio, { signal: this.signal });
    this.ctl.state.watch(
      "dimensions.container",
      (dim) => {
        this.ctl.config.settings.css.currentContainerWidth = `${dim?.width || 0}px`;
        this.ctl.config.settings.css.currentContainerHeight = `${dim?.height || 0}px`;
        this.ctl.videoContainer.dataset.sizeTier = dim?.tier || "";
      },
      { signal: this.signal, immediate: true }
    );
    this.ctl.state.watch("dimensions.pseudoContainer", (dim) => {
      this.ctl.pseudoVideoContainer.dataset.sizeTier = dim?.tier || "";
    });
  }
}
