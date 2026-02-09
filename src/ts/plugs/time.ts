import { BasePlug } from ".";
import { parseIfPercent, formatMediaTime, clamp } from "../utils";
import type { Event, Payload } from "../types/reactor";
import type { VideoBuild } from "../types/build";
import type { OptRange } from "../types/generics";
import type { ControlPanelPlug } from ".";
import type { PreviewConfig, Timeline } from "../components";
import { Media } from "../types/contract";

export interface Time extends OptRange {
  mode: "elapsed" | "remaining";
  format: "digital" | "human" | "human-long";
  start: number | null | undefined;
  end: number;
  loop: boolean;
  previews?: Omit<PreviewConfig, "type"> | boolean;
  seekSync: boolean;
}

export class TimePlug extends BasePlug<Time> {
  public static readonly plugName: string = "time";

  public wire(): void {
    (["settings.time.min", "settings.time.max", "settings.time.value", "settings.time.start", "settings.time.end"] as const).forEach((p) => this.ctl.config.get(p, this.toTimeVal));
    this.ctl.media.set("intent.currentTime", () => clamp(this.config.min, this.config.value!, this.config.max), { signal: this.signal });
    this.ctl.config.watch("settings.time.value", this.forwardTimeValue, { signal: this.signal });
    this.ctl.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
  }

  protected forwardTimeValue(value?: number): void {
    this.ctl.media.intent.currentTime = value!;
  }

  protected handleTimeUpdate({ target }: Event<Media, "state.currentTime">): void {
    const currentTime = target.value!,
      min = this.ctl.config.settings.time.min!,
      max = this.ctl.config.settings.time.max!,
      duration = this.ctl.media.status.duration,
      end = this.ctl.config.settings.time.end!;
    if (currentTime < min || currentTime > max) {
      this.ctl.media.intent.currentTime = this.ctl.config.settings.time.loop ? min : currentTime;
      if (!this.ctl.config.settings.time.loop) this.ctl.media.intent.paused = true;
    }
    if (currentTime > 3 && currentTime < (end ?? duration) - 3) this.ctl.config.settings.time.start = currentTime;
  }

  public toTimeVal(value: number | string | undefined | null): number {
    return parseIfPercent(value ?? 0, this.ctl.media.status.duration);
  }
  public toTimeText(time = this.ctl.media.state.currentTime, useMode = false, showMs = false): string {
    const format = this.ctl.config.settings.time.format,
      duration = this.ctl.media.status.duration;
    if (!useMode || this.ctl.config.settings.time.mode !== "remaining") return formatMediaTime({ time, format, elapsed: true, showMs });
    return `-${formatMediaTime({ time: duration - time, format, elapsed: false, showMs })}`;
  }

  public get nextMode(): Time["mode"] {
    return this.ctl.config.settings.time.mode === "elapsed" ? "remaining" : "elapsed";
  }
  public toggleMode(): void {
    this.ctl.config.settings.time.mode = this.nextMode;
  }

  public get nextFormat(): Time["format"] {
    const current = this.ctl.config.settings.time.format;
    return current === "digital" ? "human" : current === "human" ? "human-long" : "digital";
  }
  public rotateFormat(): void {
    this.ctl.config.settings.time.format = this.nextFormat;
  }
}
