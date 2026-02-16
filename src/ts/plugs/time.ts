import { BasePlug, GesturePlug, OverlayPlug } from ".";
import { parseIfPercent, clamp, safeNum, formatMediaTime, parseCSSTime, setTimeout } from "../utils";
import type { Event } from "../types/reactor";
import type { OptRange } from "../types/generics";
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
  private actualStart = 0;
  private pseudoStart = 0;
  private skipDuration = 0;
  private skipDurationId = -1;
  private currentSkipNotifier: HTMLElement | null = null;

  public wire(): void {
    this.pseudoStart = this.ctl.config.settings.time.start ?? 0;
    (["settings.time.min", "settings.time.max", "settings.time.value", "settings.time.start", "settings.time.end"] as const).forEach((p) => this.ctl.config.get(p, this.toTimeVal));
    this.ctl.media.set("intent.currentTime", () => clamp(this.config.min, this.config.value!, this.config.max), { signal: this.signal });
    this.ctl.config.watch("settings.time.value", this.forwardTimeValue, { signal: this.signal });
    this.ctl.config.watch("settings.time.start", (v) => v !== this.pseudoStart && (this.actualStart = +v!), { signal: this.signal, immediate: true });
    this.ctl.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
  }

  protected forwardTimeValue(value?: number): void {
    this.ctl.media.intent.currentTime = value!;
  }

  protected handleTimeUpdate({ target }: Event<Media, "state.currentTime">): void {
    const curr = target.value!,
      min = this.ctl.config.settings.time.min!,
      max = this.ctl.config.settings.time.max!,
      dur = this.ctl.media.status.duration,
      end = this.ctl.config.settings.time.end!;
    if (curr < min || curr > max) {
      this.ctl.media.intent.currentTime = this.ctl.config.settings.time.loop ? min : curr;
      if (!this.ctl.config.settings.time.loop) this.ctl.media.intent.paused = true;
    }
    if (this.ctl.media.status.readyState && curr) this.ctl.config.settings.time.start = this.pseudoStart = curr > 3 && curr < (end ?? dur) - 3 ? curr : this.actualStart;
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

  public skip(duration: number): void {
    const overlay = this.ctl.getPlug<OverlayPlug>("overlay"),
      notifier = duration > 0 ? this.ctl.queryDOM(".tmg-video-fwd-notifier") : this.ctl.queryDOM(".tmg-video-bwd-notifier");
    duration = duration > 0 ? (this.ctl.media.status.duration - this.ctl.media.state.currentTime > duration ? duration : this.ctl.media.status.duration - this.ctl.media.state.currentTime) : duration < 0 ? (this.ctl.media.state.currentTime > Math.abs(duration) ? duration : -this.ctl.media.state.currentTime) : 0;
    this.ctl.media.intent.currentTime = this.ctl.media.state.currentTime + duration;
    this.ctl.config.settings.css.currentPlayedPosition = this.ctl.config.settings.css.currentThumbPosition = safeNum(this.ctl.media.intent.currentTime / this.ctl.media.status.duration);
    const mdle = this.ctl.getPlug<GesturePlug>("gesture")?.general;
    if (mdle?.state.skipPersist) {
      if (this.currentSkipNotifier && notifier !== this.currentSkipNotifier) {
        this.skipDuration = 0;
        this.currentSkipNotifier.classList.remove("tmg-video-control-persist");
      }
      overlay?.show();
      this.currentSkipNotifier = notifier;
      notifier?.classList.add("tmg-video-control-persist");
      this.skipDuration += duration;
      clearTimeout(this.skipDurationId);
      this.skipDurationId = setTimeout(
        () => {
          mdle.deactivateSkipPersist();
          notifier?.classList.remove("tmg-video-control-persist");
          this.skipDuration = 0;
          this.currentSkipNotifier = null;
          !this.ctl.media.state.paused ? overlay?.remove() : overlay?.show();
        },
        parseCSSTime(this.ctl.config.settings.css.notifiersAnimationTime),
        this.signal
      );
      return void notifier?.setAttribute("data-skip", String(Math.trunc(this.skipDuration)));
    } else this.currentSkipNotifier?.classList.remove("tmg-video-control-persist");
    notifier?.setAttribute("data-skip", String(Math.trunc(Math.abs(duration))));
  }
}
