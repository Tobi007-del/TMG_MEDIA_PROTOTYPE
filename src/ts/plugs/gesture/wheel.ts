import { BasePin, VolumePlug, type GesturePlug, type FastPlayPlug } from "../";
import { clamp, safeNum, setTimeout } from "../../utils";

export class GestureBasePin<Config> extends BasePin<GesturePlug, Config> {
  public static readonly plugName: string = "gesture";
  protected nextTime = 0;

  protected applyTimeline({ percent, sign, multiplier }: { percent: number; sign: string; multiplier: number }): void {
    multiplier = +multiplier.toFixed(1);
    percent = percent * multiplier;
    const curr = safeNum(this.media.state.currentTime),
      change = percent * safeNum(this.media.status.duration) * multiplier,
      next = curr + (sign === "+" ? change : -change);
    this.nextTime = clamp(0, next, this.media.status.duration);
    // JS: this.ctlr.DOM.touchTimelineNotifier.textContent = `${sign}${this.ctlr.plug<TimePlug>("time")?.toTimeText(Math.abs(this.nextTime - curr))} (${this.ctlr.plug<TimePlug>("time")?.toTimeText(this.nextTime, true)}) ${multiplier < 1 ? `x${multiplier}` : ""}`;
  }

  protected applyRange(key: "volume" | "brightness", percent: number, sign: string): void {
    const range = this.ctlr.settings[key],
      value = sign === "+" ? range.value! + percent * range.max : range.value! - percent * range.max;
    this.ctlr.plug<VolumePlug>(key)?.handleSliderInput(clamp(0, Math.round(value), range.max));
  }
}

export interface GestureWheel {
  volume: { normal: boolean; slider: boolean };
  brightness: { normal: boolean; slider: boolean };
  timeline: { normal: boolean; slider: boolean };
  timeout: number;
  xRatio: number;
  yRatio: number;
}

export class GestureWheelPin extends GestureBasePin<GestureWheel> {
  public static readonly pinName: string = "wheel";
  protected timeoutId: number | null = null;
  protected zone: { x: "left" | "right"; y: "top" | "bottom" } | null = null;
  protected xCheck = false;
  protected yCheck = false;
  protected timePercent = 0;
  protected timeMultiplier = 1;
  protected deltaY = 0;
  protected nextTime = 0;

  public override wire() {
    // Event Listeners
    this.ctlr.videoContainer.addEventListener("wheel", this.handleWheel, { passive: false, signal: this.signal });
  }

  protected canHandle(e: WheelEvent): boolean {
    return !this.ctlr.settings.locked && !this.ctlr.config.disabled && e.target === this.ctlr.DOM.controlsContainer && !this.ctlr.plug<GesturePlug>("gesture")?.touch.xCheck && !this.ctlr.plug<GesturePlug>("gesture")?.touch.yCheck && !this.ctlr.plug<FastPlayPlug>("fastPlay")?.speedCheck;
  }

  protected handleWheel(e: WheelEvent): void {
    if (!this.canHandle(e)) return;
    e.preventDefault();
    this.timeoutId ? clearTimeout(this.timeoutId) : this.handleInit(e);
    this.timeoutId = setTimeout(this.handleStop, this.config.timeout, this.signal);
    this.handleMove(e);
  }

  protected handleInit({ clientX: x, clientY: y }: WheelEvent): void {
    const rect = this.ctlr.videoContainer.getBoundingClientRect();
    this.zone = { x: x - rect.left > rect.width * 0.5 ? "right" : "left", y: y - rect.top > rect.height * 0.5 ? "bottom" : "top" };
    this.deltaY = this.timePercent = 0;
    this.timeMultiplier = 1;
  }

  protected handleMove({ clientX: x, deltaX, deltaY, shiftKey }: WheelEvent): void {
    deltaX = shiftKey ? deltaY : deltaX;
    const wc = this.config,
      rect = this.ctlr.videoContainer.getBoundingClientRect(),
      width = shiftKey ? rect.height : rect.width,
      height = shiftKey ? rect.width : rect.height;
    let xPercent = -deltaX / (width * wc.xRatio);
    xPercent = this.timePercent += xPercent;
    const xSign = xPercent >= 0 ? "+" : "-";
    xPercent = Math.abs(xPercent);
    if (deltaX || shiftKey) {
      if (!wc.timeline.normal || this.yCheck) return this.handleStop();
      this.xCheck = true;
      this.applyTimeline({ percent: xPercent, sign: xSign, multiplier: this.timeMultiplier });
      if (shiftKey) return;
    }
    if (deltaY) {
      if (this.xCheck) {
        const mY = clamp(0, Math.abs((this.deltaY += deltaY)), height * wc.yRatio * 0.5);
        this.timeMultiplier = 1 - mY / (height * wc.yRatio * 0.5);
        return this.applyTimeline({ percent: xPercent, sign: xSign, multiplier: this.timeMultiplier });
      }
      const cancel = (this.zone?.x === "right" && !wc.volume.normal) || (this.zone?.x === "left" && !wc.brightness.normal),
        currentXZone = x - rect.left > width * 0.5 ? "right" : "left";
      if (cancel || currentXZone !== this.zone?.x) return this.handleStop();
      this.yCheck = true;
      const ySign = -deltaY >= 0 ? "+" : "-",
        yPercent = clamp(0, Math.abs(deltaY), height * wc.yRatio) / (height * wc.yRatio);
      this.zone?.x === "right" ? this.applyRange("volume", yPercent, ySign) : this.applyRange("brightness", yPercent, ySign);
    }
  }

  protected handleStop(): void {
    this.timeoutId = null;
    if (this.yCheck) this.yCheck = false;
    if (this.xCheck) {
      this.xCheck = false;
      this.media.intent.currentTime = this.nextTime;
    }
  }
}

export const GESTURE_WHEEL_BUILD: Partial<GestureWheel> = {
  volume: { normal: true, slider: true },
  brightness: { normal: true, slider: true },
  timeline: { normal: true, slider: true },
  timeout: 2000,
  xRatio: 12,
  yRatio: 6,
};
