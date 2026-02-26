import { BasePlug } from ".";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";
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
    this.ctlr.config.set("settings.brightness.value", (value) => clamp(this.shouldDark ? 0 : this.config.min, value!, this.config.max), { signal: this.signal });
    const configBrightness = this.config.value ?? this.ctlr.config.settings.css.brightness ?? 100;
    this.lastBrightness = clamp(this.config.min, configBrightness, this.config.max);
    this.shouldDark = this.shouldSetLastBrightness = this.config.dark ?? false;
    this.config.value = this.shouldDark ? 0 : this.lastBrightness;
    this.ctlr.config.on("settings.brightness.value", this.handleBrightnessChange, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.brightness.dark", this.handleDarkChange, { signal: this.signal });
    this.ctlr.config.on("settings.brightness.min", this.handleMinChange, { signal: this.signal });
    this.ctlr.config.on("settings.brightness.max", this.handleMaxChange, { signal: this.signal });
    this.ctlr.config.get("settings.brightness.value", () => Number(this.ctlr.config.settings.css.brightness ?? 100), { signal: this.signal, lazy: true });
  }

  protected handleBrightnessState(value: number): void {
    const b = clamp(this.shouldDark ? 0 : this.config.min, value, this.config.max),
      bLevel = b === 0 ? "dark" : b < 50 ? "low" : b <= 100 ? "high" : "boost",
      bPercent = (b - 0) / (this.config.max - 0);
    this.ctlr.config.settings.css.brightness = b;
    this.config.dark = b === 0;
    this.ctlr.videoContainer.dataset.brightnessLevel = bLevel;
    this.ctlr.config.settings.css.currentBrightnessTooltipPosition = `${10.5 + bPercent * 79.5}%`;
    if (this.config.max > 100) {
      if (b <= 100) {
        this.ctlr.config.settings.css.currentBrightnessSliderPosition = (b - 0) / (100 - 0);
        this.ctlr.config.settings.css.currentBrightnessSliderBoostPosition = 0;
        this.ctlr.config.settings.css.brightnessSliderBoostPercent = 0;
      } else {
        this.ctlr.config.settings.css.currentBrightnessSliderPosition = 1;
        this.ctlr.config.settings.css.currentBrightnessSliderBoostPosition = (b - 100) / (this.config.max - 100);
        this.ctlr.config.settings.css.brightnessSliderBoostPercent = this.ctlr.config.settings.css.brightnessSliderPercent;
      }
    } else this.ctlr.config.settings.css.currentBrightnessSliderPosition = bPercent;
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

  protected handleBrightnessChange({ target: { value } }: Event<VideoBuild, "settings.brightness.value">): void {
    this.handleBrightnessState(value!);
  }

  protected handleDarkChange({ oldValue, value: dark }: Event<VideoBuild, "settings.brightness.dark">): void {
    if (oldValue === dark) return;
    this.handleDarkState(dark!);
  }

  protected handleMinChange({ target }: Event<VideoBuild, "settings.brightness.min">): void {
    const min = target.value!;
    if (this.config.value! < min) this.config.value = min;
    if (this.lastBrightness < min) this.lastBrightness = min;
  }

  protected handleMaxChange({ target }: Event<VideoBuild, "settings.brightness.max">): void {
    const max = target.value!;
    if (this.config.value! > max) this.config.value = max;
    if (this.lastBrightness > max) this.lastBrightness = max;
    this.ctlr.videoContainer.classList.toggle("tmg-video-brightness-boost", max > 100);
    this.ctlr.config.settings.css.brightnessSliderPercent = Math.round((100 / max) * 100);
    this.ctlr.config.settings.css.maxBrightnessRatio = max / 100;
  }

  public toggleDark(option?: "auto"): void {
    if (option === "auto" && this.shouldSetLastBrightness && !this.lastBrightness) this.lastBrightness = this.config.skip;
    this.config.dark = !this.config.dark;
  }

  public changeBrightness(value: number): void {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    let brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.config.value!;
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

  public handleSliderInput(brightness: number): void {
    this.shouldDark = this.shouldSetLastBrightness = false;
    this.config.value = brightness;
    if (brightness > 5) this.sliderAptBrightness = brightness;
  }
}
