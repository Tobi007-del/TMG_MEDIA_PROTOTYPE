import { BasePlug, type KeysPlug, type KeyMod } from ".";
import type { REvent } from "sia-reactor";
import { CtlrConfig } from "../types/config";
import type { CtlrMedia } from "../types/contract";
import type { OptRange } from "../types/generics";
import { clamp, rotate } from "../utils";

export interface PlaybackRate extends OptRange {}

export class PlaybackRatePlug extends BasePlug<PlaybackRate> {
  public static readonly plugName: string = "playbackRate";

  public wire(): void {
    // Ctlr Config Getters
    this.ctlr.config.get("settings.playbackRate.value", () => this.media.state.playbackRate, { signal: this.signal, lazy: true }); // #VIRTUAL: reliable return value
    // ---- Media Setters
    this.media.set("intent.playbackRate", (value) => clamp(this.config.min, value!, this.config.max), { signal: this.signal });
    // ---- Config Watchers
    this.ctlr.config.watch("settings.playbackRate.value", this.forwardPlaybackRate, { signal: this.signal, immediate: "auto" });
    // ---- Media Listeners
    this.media.on("state.playbackRate", this.handlePlaybackRateState, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.playbackRate.min", this.handleMin, { signal: this.signal });
    this.ctlr.config.on("settings.playbackRate.max", this.handleMax, { signal: this.signal });
    // Post Wiring
    const keys = this.ctlr.plug<KeysPlug>("keys");
    keys?.register("playbackRateUp", this.handleKeyRateUp, { phase: "keydown" });
    keys?.register("playbackRateDown", this.handleKeyRateDown, { phase: "keydown" });
  }

  protected forwardPlaybackRate(value?: number): void {
    this.media.intent.playbackRate = value!;
  }

  protected handleMin({ value: min }: REvent<CtlrConfig, "settings.playbackRate.min">): void {
    if (this.config.value! < min) this.config.value = min;
  }

  protected handleMax({ value: max }: REvent<CtlrConfig, "settings.playbackRate.max">): void {
    if (this.config.value! > max) this.config.value = max;
  }

  protected handlePlaybackRateState({ value }: REvent<CtlrMedia, "state.playbackRate">): void {
    // JS: this.DOM.playbackRateNotifierContent.textContent = `${this.settings.playbackRate.value}x`;
    // JS: this.DOM.playbackRateNotifierText.textContent = `${this.settings.playbackRate.value}x`;
    // JS: this.setControlsState("playbackrate");
  }

  protected handleKeyRateUp(_: KeyboardEvent, mod: KeyMod): void {
    this.changeRate(this.ctlr.plug<KeysPlug>("keys")!.getModded("playbackRate", mod, this.config.skip));
  }
  protected handleKeyRateDown(_: KeyboardEvent, mod: KeyMod): void {
    this.changeRate(-this.ctlr.plug<KeysPlug>("keys")!.getModded("playbackRate", mod, this.config.skip));
  }

  public rotateRate(dir: "forwards" | "backwards" = "forwards"): void {
    this.config.value = rotate(this.config.value!, { min: this.config.min, max: this.config.max, step: this.config.skip }, dir);
  }

  public changeRate(value: number): void {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    const rate = this.config.value!;
    if (sign === "-") {
      if (rate > this.config.min) this.config.value -= rate % value ? rate % value : value;
      // JS: return this.notify("playbackratedown");
    } else {
      if (rate < this.config.max) this.config.value += rate % value ? value - (rate % value) : value;
      // JS: return this.notify("playbackrateup");
    }
  }
}

export const PLAYBACK_RATE_BUILD: Partial<PlaybackRate> = { min: 0.25, max: 8, skip: 0.25 };
