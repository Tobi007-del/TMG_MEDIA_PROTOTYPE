import { clamp, setTimeout } from "../../utils";
import { BaseModule, ControlPanelPlug, VolumePlug } from "../";

export interface WheelConfig {
  volume: { normal: boolean; slider: boolean };
  brightness: { normal: boolean; slider: boolean };
  timeline: { normal: boolean; slider: boolean };
  timeout: number;
  xRatio: number;
  yRatio: number;
}

export class WheelModule extends BaseModule<WheelConfig> {
  public static readonly moduleName: string = "wheel gesture";
  protected timeoutId: number | null = null;
  protected zone: { x: "left" | "right"; y: "top" | "bottom" } | null = null;
  protected xCheck = false;
  protected yCheck = false;
  protected timePercent = 0;
  protected timeMultiplier = 1;
  protected deltaY = 0;
  protected nextTime = 0;

  public wire() {
    this.ctl.videoContainer.addEventListener("wheel", this.handleWheel, { passive: false, signal: this.signal });
  }

  protected canHandle(e: WheelEvent): boolean {
    return !this.ctl.config.settings.locked && !this.ctl.config.disabled && e.target === this.ctl.DOM.controlsContainer && !this.ctl.state.gestureTouchXCheck && !this.ctl.state.gestureTouchYCheck && !this.ctl.state.speedCheck;
  }

  protected handleWheel(e: WheelEvent): void {
    if (!this.canHandle(e)) return;
    e.preventDefault();
    this.timeoutId ? clearTimeout(this.timeoutId) : this.handleInit(e);
    this.timeoutId = setTimeout(this.handleStop, this.config.timeout, this.signal);
    this.handleMove(e);
  }

  protected handleInit({ clientX: x, clientY: y }: WheelEvent): void {
    const rect = this.ctl.videoContainer.getBoundingClientRect();
    this.zone = { x: x - rect.left > rect.width * 0.5 ? "right" : "left", y: y - rect.top > rect.height * 0.5 ? "bottom" : "top" };
    this.deltaY = this.timePercent = 0;
    this.timeMultiplier = 1;
  }

  protected handleMove({ clientX: x, deltaX, deltaY, shiftKey }: WheelEvent): void {
    deltaX = shiftKey ? deltaY : deltaX;
    const wc = this.config,
      rect = this.ctl.videoContainer.getBoundingClientRect(),
      width = shiftKey ? rect.height : rect.width,
      height = shiftKey ? rect.width : rect.height;
    let xPercent = -deltaX / (width * wc.xRatio);
    xPercent = this.timePercent += xPercent;
    const xSign = xPercent >= 0 ? "+" : "-";
    xPercent = Math.abs(xPercent);
    if (deltaX || shiftKey) {
      if (!wc.timeline.normal || this.yCheck) return this.handleStop();
      this.xCheck = true;
      this.applyTimeline(xPercent, xSign, this.timeMultiplier);
      if (shiftKey) return;
    }
    if (deltaY) {
      if (this.xCheck) {
        const mY = clamp(0, Math.abs((this.deltaY += deltaY)), height * wc.yRatio * 0.5);
        this.timeMultiplier = 1 - mY / (height * wc.yRatio * 0.5);
        return this.applyTimeline(xPercent, xSign, this.timeMultiplier);
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
      this.ctl.media.intent.currentTime = this.nextTime;
    }
  }

  protected applyTimeline(percent: number, sign: string, multiplier: number): void {
    const { currentTime } = this.ctl.media.state,
      { duration } = this.ctl.media.status,
      change = percent * duration * +multiplier.toFixed(1);
    this.nextTime = clamp(0, currentTime + (sign === "+" ? change : -change), duration);
  }

  protected applyRange(key: "volume" | "brightness", percent: number, sign: string): void {
    const plug = this.ctl.getPlug<VolumePlug>(key),
      range = this.ctl.config.settings[key],
      value = range.value! + (sign === "+" ? percent : -percent) * range.max;
    plug?.handleSliderInput(clamp(0, Math.round(value), range.max));
  }
}
