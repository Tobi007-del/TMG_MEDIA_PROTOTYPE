import { BasePlug, GesturePlug, OverlayPlug, type KeysPlug, type KeyMod } from ".";
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
    // this.ctlr.config.get("settings.time.value", () => this.ctlr.media.state.currentTime, { signal: this.signal, lazy: true }); // VIRTUAL: reliable return value
    // ---- Media Setters
    this.media.set("intent.currentTime", () => clamp(this.config.min, this.config.value!, this.config.max), { signal: this.signal });
    // ---- Config Watchers
    this.ctlr.config.watch("settings.time.value", this.forwardTimeValue, { signal: this.signal, immediate: "auto" });
    this.ctlr.config.watch("settings.time.start", (v) => v !== this.pseudoStart && (this.actualStart = +v!), { signal: this.signal, immediate: true });
    // ---- Media Listeners
    this.media.on("state.currentTime", this.handleCurrentTimeState, { signal: this.signal, immediate: true });
    this.media.on("status.waiting", this.handleWaitingStatus, { signal: this.signal });
    // Post Wiring
    const keys = this.ctlr.getPlug<KeysPlug>("keys");
    keys?.register("skipFwd", this.handleKeySkipFwd, { phase: "keydown" });
    keys?.register("skipBwd", this.handleKeySkipBwd, { phase: "keydown" });
    keys?.register("timeMode", this.toggleMode, { phase: "keyup" });
    keys?.register("timeFormat", this.rotateFormat, { phase: "keyup" });
  }

  protected forwardTimeValue(value?: number): void {
    this.media.intent.currentTime = value!;
  }

  protected handleCurrentTimeState({ value: curr }: REvent<CtlrMedia, "state.currentTime">): void {
    const dur = this.media.status.duration;
    if (curr < this.config.min || curr > this.config.max) {
      this.media.intent.currentTime = this.config.loop ? this.config.min : curr;
      if (!this.config.loop) this.media.intent.paused = true;
    }
    if (this.media.status.readyState && curr && this.ctlr.state.readyState > 1) this.config.start = this.pseudoStart = curr > 3 && curr < (this.config.end ?? dur) - 3 ? curr : this.actualStart;
  }

  protected handleWaitingStatus({ value }: REvent<CtlrMedia, "status.waiting">): void {
    if (value && IS_MOBILE && this.currentSkipNotifier) this.media.once("status.waiting", () => this.ctlr.getPlug<OverlayPlug>("overlay")?.remove(), { signal: this.signal });
  }

  public toTimeVal(value?: number | string | null): number {
    return parseIfPercent(value ?? 0, this.media.status.duration);
  }
  public toTimeText(time = this.media.state.currentTime, useMode = false, showMs = false): string {
    const format = this.config.format;
    if (!useMode || this.config.mode !== "remaining") return formatMediaTime({ time, format, elapsed: true, showMs });
    return `-${formatMediaTime({ time: this.media.status.duration - time, format, elapsed: false, showMs })}`;
  }

  public get nextMode(): CTime["mode"] {
    return this.config.mode === "elapsed" ? "remaining" : "elapsed";
  }
  public toggleMode(): void {
    this.config.mode = this.nextMode;
  }

  public get nextFormat(): CTime["format"] {
    return this.config.format === "digital" ? "human" : this.config.format === "human" ? "human-long" : "digital";
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

  protected handleKeySkipFwd(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.getPlug<GesturePlug>("gesture")?.general?.deactivateSkipPersist();
    this.skip(this.ctlr.getPlug<KeysPlug>("keys")!.getModded("skip", mod, this.config.skip));
    // JS: this.notify("fwd");
  }

  protected handleKeySkipBwd(_: KeyboardEvent, mod: KeyMod): void {
    this.ctlr.getPlug<GesturePlug>("gesture")?.general?.deactivateSkipPersist();
    this.skip(-this.ctlr.getPlug<KeysPlug>("keys")!.getModded("skip", mod, this.config.skip));
    // JS: this.notify("bwd");
  }

  guardTimeValues() {
    this.guardedTimePaths.forEach((p) => this.ctlr.config.get(p, this.toTimeVal, { signal: this.signal }));
  }
}
