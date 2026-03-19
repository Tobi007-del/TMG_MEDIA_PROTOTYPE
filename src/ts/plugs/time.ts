import { BasePlug, GesturePlug, OverlayPlug } from ".";
import { parseIfPercent, clamp, safeNum, formatMediaTime, parseCSSTime, setTimeout, IS_MOBILE } from "../utils";
import type { REvent } from "../types/reactor";
import type { OptRange } from "../types/generics";
import type { PreviewConfig, Timeline } from "../components";
import { CtlrMedia } from "../types/contract";

export interface CTime extends OptRange {
  mode: "elapsed" | "remaining";
  format: "digital" | "human" | "human-long";
  start: number | null | undefined;
  end: number;
  loop: boolean;
  previews?: Omit<PreviewConfig, "type"> | boolean;
  seekSync: boolean;
}

export class TimePlug extends BasePlug<CTime> {
  public static readonly plugName: string = "time";
  private actualStart = 0;
  private pseudoStart = 0;
  private skipDuration = 0;
  private skipDurationId = -1;
  private currentSkipNotifier: HTMLElement | null = null;
  public guardedTimePaths = ["lightState.preview.time", "settings.time.min", "settings.time.max", "settings.time.start", "settings.time.end", "settings.auto.next.preview.time"] as const;

  public wire(): void {
    // Variables Assignment
    this.pseudoStart = this.config.start ?? 0;
    // Ctlr Config Getters
    this.guardTimeValues();
    // ---- Media Setters
    this.media.set("intent.currentTime", () => clamp(this.config.min, this.config.value!, this.config.max), { signal: this.signal });
    // ---- Config Watchers
    this.ctlr.config.watch("settings.time.value", this.forwardTimeValue, { signal: this.signal, immediate: "auto" });
    this.ctlr.config.watch("settings.time.start", (v) => v !== this.pseudoStart && (this.actualStart = +v!), { signal: this.signal, immediate: true });
    // ---- Media Listeners
    this.media.on("state.currentTime", this.handleCurrentTimeState, { signal: this.signal, immediate: true });
    this.media.on("status.waiting", this.handleWaitingStatus, { signal: this.signal });
  }

  protected forwardTimeValue(value?: number): void {
    this.media.intent.currentTime = value!;
  }

  protected handleCurrentTimeState({ target }: REvent<CtlrMedia, "state.currentTime">): void {
    const curr = target.value!,
      min = this.config.min!,
      max = this.config.max!,
      dur = this.media.status.duration,
      end = this.config.end!;
    if (curr < min || curr > max) {
      this.media.intent.currentTime = this.config.loop ? min : curr;
      if (!this.config.loop) this.media.intent.paused = true;
    }
    if (this.media.status.readyState && curr && this.ctlr.state.readyState > 1) this.config.start = this.pseudoStart = curr > 3 && curr < (end ?? dur) - 3 ? curr : this.actualStart;
  }

  protected handleWaitingStatus({ value }: REvent<CtlrMedia, "status.waiting">): void {
    if (value && IS_MOBILE && this.currentSkipNotifier) this.media.once("status.waiting", () => this.ctlr.getPlug<OverlayPlug>("overlay")?.remove(), { signal: this.signal });
  }

  public toTimeVal(value?: number | string | null): number {
    return parseIfPercent(value ?? 0, this.media.status.duration);
  }
  public toTimeText(time = this.media.state.currentTime, useMode = false, showMs = false): string {
    const format = this.config.format,
      duration = this.media.status.duration;
    if (!useMode || this.config.mode !== "remaining") return formatMediaTime({ time, format, elapsed: true, showMs });
    return `-${formatMediaTime({ time: duration - time, format, elapsed: false, showMs })}`;
  }

  public get nextMode(): CTime["mode"] {
    return this.config.mode === "elapsed" ? "remaining" : "elapsed";
  }
  public toggleMode(): void {
    this.config.mode = this.nextMode;
  }

  public get nextFormat(): CTime["format"] {
    const current = this.config.format;
    return current === "digital" ? "human" : current === "human" ? "human-long" : "digital";
  }
  public rotateFormat(): void {
    this.config.format = this.nextFormat;
  }

  public skip(duration: number): void {
    const overlay = this.ctlr.getPlug<OverlayPlug>("overlay"),
      notifier = duration > 0 ? this.ctlr.queryDOM(".tmg-video-fwd-notifier") : this.ctlr.queryDOM(".tmg-video-bwd-notifier");
    duration = duration > 0 ? (this.media.status.duration - this.media.state.currentTime > duration ? duration : this.media.status.duration - this.media.state.currentTime) : duration < 0 ? (this.media.state.currentTime > Math.abs(duration) ? duration : -this.media.state.currentTime) : 0;
    this.media.intent.currentTime = this.media.state.currentTime + duration;
    this.ctlr.settings.css.currentPlayedPosition = this.ctlr.settings.css.currentThumbPosition = safeNum(this.media.intent.currentTime / this.media.status.duration);
    const mdle = this.ctlr.getPlug<GesturePlug>("gesture")?.general;
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
          !this.media.state.paused ? overlay?.remove() : overlay?.show();
        },
        parseCSSTime(this.ctlr.settings.css.notifiersAnimationTime),
        this.signal
      );
      return void notifier?.setAttribute("data-skip", String(Math.trunc(this.skipDuration)));
    } else this.currentSkipNotifier?.classList.remove("tmg-video-control-persist");
    notifier?.setAttribute("data-skip", String(Math.trunc(Math.abs(duration))));
  }

  guardTimeValues() {
    this.guardedTimePaths.forEach((p) => this.ctlr.config.get(p, this.toTimeVal, { signal: this.signal }));
  }
}
