import { BasePlug, type KeysPlug, type KeyMod } from ".";
import type { REvent } from "../types/reactor";
import type { CtlrConfig } from "../types/config";
import type { CtlrMedia } from "../types/contract";
import type { OptRange } from "../types/generics";
import { clamp } from "../utils";

export interface Brightness extends OptRange {
  dark: boolean;
}

export class BrightnessPlug extends BasePlug<Brightness> {
  public static readonly plugName: string = "brightness";
  protected lastBrightness = 100;
  protected sliderAptBrightness = 100;
  protected shouldDark = false;
  protected shouldSetLastBrightness = false;

  public wire(): void {
    // Variables Assignment
    const configBrightness = this.config.value ?? this.ctlr.settings.css.brightness ?? 100;
    this.lastBrightness = clamp(this.config.min, configBrightness, this.config.max);
    this.shouldDark = this.shouldSetLastBrightness = this.config.dark ?? false;
    this.config.value = this.shouldDark ? 0 : this.lastBrightness;
    // Ctlr Config Getters
    // this.ctlr.config.get("settings.brightness.value", () => Number(this.ctlr.settings.css.brightness ?? 100), { signal: this.signal, lazy: true }); // VIRTUAL: reliable return value
    // ----------- Setters
    this.ctlr.config.set("settings.brightness.value", (value) => clamp(this.shouldDark ? 0 : this.config.min, value!, this.config.max), { signal: this.signal });
    // ----------- Watchers
    this.ctlr.config.watch("settings.brightness.value", this.forwardBrightness, { signal: this.signal, immediate: "auto" });
    this.ctlr.config.watch("settings.brightness.dark", this.forwardDark, { signal: this.signal, immediate: "auto" });
    // ---- Media Listeners
    this.media.on("intent.brightness", this.handleBrightnessIntent, { capture: true, signal: this.signal });
    this.media.on("intent.dark", this.handleDarkIntent, { capture: true, signal: this.signal });
    // ---- Config Listeners
    this.ctlr.config.on("settings.brightness.min", this.handleMin, { signal: this.signal });
    this.ctlr.config.on("settings.brightness.max", this.handleMax, { signal: this.signal });
    // Post Wiring
    this.media.tech.features.brightness = true;
    const keys = this.ctlr.getPlug<KeysPlug>("keys");
    keys?.register("dark", this.handleKeyDark, { phase: "keyup" });
    keys?.register("brightnessUp", this.handleKeyBrightnessUp, { phase: "keydown" });
    keys?.register("brightnessDown", this.handleKeyBrightnessDown, { phase: "keydown" });
  }

  protected getBrightnessStep(mod: KeyMod, fallback = this.config.skip): number {
    return this.ctlr.getPlug<KeysPlug>("keys")?.getModded("brightness", mod, fallback) ?? fallback;
  }

  protected forwardBrightness(value: number): void {
    this.media.intent.brightness = value;
  }
  protected forwardDark(value: boolean): void {
    this.media.intent.dark = value;
  }

  protected handleBrightnessIntent(e: REvent<CtlrMedia, "intent.brightness">): void {
    if (e.resolved) return;
    this.handleBrightnessState(e.value);
    this.media.state.brightness = e.value;
    e.resolve(this.name);
  }

  protected handleDarkIntent(e: REvent<CtlrMedia, "intent.dark">): void {
    if (e.resolved) return;
    this.handleDarkState(e.value);
    this.media.state.dark = e.value;
    e.resolve(this.name);
  }

  protected handleMin({ target }: REvent<CtlrConfig, "settings.brightness.min">): void {
    const min = target.value;
    if (this.config.value < min) this.config.value = min;
    if (this.lastBrightness < min) this.lastBrightness = min;
  }

  protected handleMax({ target }: REvent<CtlrConfig, "settings.brightness.max">): void {
    const max = target.value;
    if (this.config.value > max) this.config.value = max;
    if (this.lastBrightness > max) this.lastBrightness = max;
    this.ctlr.videoContainer.classList.toggle("tmg-video-brightness-boost", max > 100);
    this.ctlr.settings.css.brightnessSliderPercent = Math.round((100 / max) * 100);
    this.ctlr.settings.css.maxBrightnessRatio = max / 100;
  }

  protected handleBrightnessState(value: number): void {
    const b = clamp(this.shouldDark ? 0 : this.config.min, value, this.config.max),
      bLevel = b === 0 ? "dark" : b < 50 ? "low" : b <= 100 ? "high" : "boost",
      bPercent = (b - 0) / (this.config.max - 0);
    this.ctlr.settings.css.brightness = b;
    this.config.dark = b === 0;
    this.ctlr.videoContainer.dataset.brightnessLevel = bLevel;
    this.ctlr.settings.css.currentBrightnessTooltipPosition = `${10.5 + bPercent * 79.5}%`;
    if (this.config.max > 100) {
      if (b <= 100) {
        this.ctlr.settings.css.currentBrightnessSliderPosition = (b - 0) / (100 - 0);
        this.ctlr.settings.css.currentBrightnessSliderBoostPosition = 0;
        this.ctlr.settings.css.brightnessSliderBoostPercent = 0;
      } else {
        this.ctlr.settings.css.currentBrightnessSliderPosition = 1;
        this.ctlr.settings.css.currentBrightnessSliderBoostPosition = (b - 100) / (this.config.max - 100);
        this.ctlr.settings.css.brightnessSliderBoostPercent = this.ctlr.settings.css.brightnessSliderPercent;
      }
    } else this.ctlr.settings.css.currentBrightnessSliderPosition = bPercent;
  }

  protected handleDarkState(dark: boolean): void {
    if (dark) {
      if (this.config.value) {
        this.lastBrightness = this.config.value;
        this.shouldSetLastBrightness = true;
      }
      this.shouldDark = true;
      if (this.config.value) this.config.value = 0;
    } else {
      const restore = this.shouldSetLastBrightness ? this.lastBrightness : this.config.value;
      this.config.value = restore ? restore : this.sliderAptBrightness;
      this.shouldDark = this.shouldSetLastBrightness = false;
    }
  }

  public toggleDark(option?: "auto"): void {
    if (option === "auto" && this.shouldSetLastBrightness && !this.lastBrightness) this.lastBrightness = this.config.skip;
    this.config.dark = !this.config.dark;
  }

  public changeBrightness(value: number): void {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    let brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.config.value;
    if (sign === "-") {
      if (brightness > this.config.min) brightness -= brightness % value ? brightness % value : value;
      // if (brightness === 0) return this.ctlr.notify("brightnessdark");
      // this.ctlr.notify("brightnessdown");
    } else {
      if (brightness < this.config.max) brightness += brightness % value ? value - (brightness % value) : value;
      // this.ctlr.notify("brightnessup");
    }
    this.shouldSetLastBrightness ? (this.lastBrightness = brightness) : (this.config.value = brightness);
  }

  protected handleKeyDark(): void {
    this.toggleDark("auto");
    // JS: this.ctlr.config.stall(() => (this.config.value === 0 ? this.notify("brightnessdark") : this.notify("brightnessup")));
  }

  protected handleKeyBrightnessUp(_: KeyboardEvent, mod: KeyMod): void {
    this.changeBrightness(this.ctlr.getPlug<KeysPlug>("keys")!.getModded("brightness", mod, this.config.skip));
  }

  protected handleKeyBrightnessDown(_: KeyboardEvent, mod: KeyMod): void {
    this.changeBrightness(-this.ctlr.getPlug<KeysPlug>("keys")!.getModded("brightness", mod, this.config.skip));
  }

  public handleSliderInput(brightness: number): void {
    this.shouldDark = this.shouldSetLastBrightness = false;
    this.config.value = brightness;
    if (brightness > 5) this.sliderAptBrightness = brightness;
  }
}

export const BRIGHTNESS_BUILD: Partial<Brightness> = { min: 0, max: 150, value: 100, skip: 5 };
