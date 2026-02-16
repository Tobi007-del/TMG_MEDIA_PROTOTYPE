import { BasePlug } from ".";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";
import type { OptRange } from "../types/generics";
import { clamp, rotate } from "../utils";

export interface PlaybackRate extends OptRange {}

export class PlaybackRatePlug extends BasePlug<PlaybackRate> {
  public static readonly plugName: string = "playbackRate";

  public wire(): void {
    this.ctl.media.set("intent.playbackRate", (value) => clamp(this.config.min, value!, this.config.max), { signal: this.signal });
    this.ctl.config.watch("settings.playbackRate.value", this.forwardRate, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.playbackRate.min", this.handleMinChange, { signal: this.signal });
    this.ctl.config.on("settings.playbackRate.max", this.handleMaxChange, { signal: this.signal });
  }

  protected forwardRate(value?: number): void {
    this.ctl.media.intent.playbackRate = value!;
  }

  protected handleMinChange({ target }: Event<VideoBuild, "settings.playbackRate.min">): void {
    const min = target.value!;
    if (this.config.value! < min) this.config.value = min;
  }

  protected handleMaxChange({ target }: Event<VideoBuild, "settings.playbackRate.max">): void {
    const max = target.value!;
    if (this.config.value! > max) this.config.value = max;
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
      // return this.notify("playbackratedown");
    } else {
      if (rate < this.config.max) this.config.value += rate % value ? value - (rate % value) : value;
      // return this.notify("playbackrateup");
    }
  }
}
