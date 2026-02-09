import { clamp, setTimeout } from "../../utils";
import { BaseModule, OverlayPlug, VolumePlug } from "../";

export interface TouchConfig {
  volume: boolean;
  brightness: boolean;
  timeline: boolean;
  threshold: number;
  sliderTimeout: number;
  xRatio: number;
  yRatio: number;
  axesRatio: number;
  inset: number;
}

export class TouchModule extends BaseModule<TouchConfig> {
  public static readonly moduleName: string = "touch gesture";
  protected lastX = 0;
  protected lastY = 0;
  protected zone: { x: "left" | "right"; y: "top" | "bottom" } | null = null;
  protected xCheck = false;
  protected yCheck = false;
  protected canCancel = true;
  protected cancelTimeoutId = -1;
  protected sliderTimeoutId = -1;
  protected nextTime = 0;

  public wire() {
    this.ctl.DOM.controlsContainer?.addEventListener("touchstart", this.handleStart, { capture: true, signal: this.signal });
  }

  protected canHandle(e: TouchEvent): boolean {
    return !this.ctl.config.disabled && e.touches?.length === 1 && e.target === this.ctl.DOM.controlsContainer && !this.ctl.state.speedCheck;
  }

  protected handleStart(e: TouchEvent): void {
    if (!this.canHandle(e)) return;
    this.handleEnd();
    this.lastX = e.touches[0].clientX;
    this.lastY = e.touches[0].clientY;
    this.ctl.videoContainer.addEventListener("touchmove", this.handleInit, { once: true, signal: this.signal });
    this.cancelTimeoutId = setTimeout(() => (this.canCancel = false), this.config.threshold, this.signal);
    ["touchend", "touchcancel"].forEach((evt) => this.ctl.videoContainer.addEventListener(evt, this.handleEnd, { signal: this.signal }));
  }

  protected handleInit(e: Event): void {
    const te = e as TouchEvent;
    if (te.touches?.length > 1 || this.ctl.state.speedCheck) return;
    te.preventDefault();
    const tc = this.config,
      rect = this.ctl.videoContainer.getBoundingClientRect(),
      x = te.touches[0].clientX,
      y = te.touches[0].clientY,
      deltaX = Math.abs(this.lastX - x),
      deltaY = Math.abs(this.lastY - y);

    this.zone = { x: x - rect.left > rect.width * 0.5 ? "right" : "left", y: y - rect.top > rect.height * 0.5 ? "bottom" : "top" };
    const rLeft = this.lastX - rect.left,
      rTop = this.lastY - rect.top;

    if (deltaX > deltaY * tc.axesRatio && rLeft > tc.inset && rLeft < rect.width - tc.inset) {
      if (tc.timeline) {
        this.ctl.state.gestureTouchXCheck = this.xCheck = true;
        this.ctl.videoContainer.addEventListener("touchmove", this.handleXMove, { passive: false, signal: this.signal });
      }
    } else if (deltaY > deltaX * tc.axesRatio && rTop > tc.inset && rTop < rect.height - tc.inset) {
      if ((tc.volume && this.zone?.x === "right") || (tc.brightness && this.zone?.x === "left")) {
        this.ctl.state.gestureTouchYCheck = this.yCheck = true;
        this.ctl.videoContainer.addEventListener("touchmove", this.handleYMove, { passive: false, signal: this.signal });
      }
    }
  }

  protected handleXMove(e: Event): void {
    const te = e as TouchEvent;
    if (this.canCancel) return this.handleEnd();
    te.preventDefault();
    this.ctl.DOM.touchTimelineNotifier?.classList.add("tmg-video-control-active");
    this.ctl.throttle(
      "gestureTouchMove",
      () => {
        const tc = this.config,
          { offsetWidth: width, offsetHeight: height } = this.ctl.videoContainer,
          x = te.touches[0].clientX,
          y = te.touches[0].clientY,
          deltaX = x - this.lastX,
          deltaY = y - this.lastY,
          sign = deltaX >= 0 ? "+" : "-",
          percent = clamp(0, Math.abs(deltaX), width * tc.xRatio) / (width * tc.xRatio),
          mY = clamp(0, Math.abs(deltaY), height * tc.yRatio * 0.5),
          multiplier = 1 - mY / (height * tc.yRatio * 0.5);
        this.applyTimeline({ percent, sign, multiplier });
      },
      30,
      false
    );
  }

  protected handleYMove(e: Event): void {
    const te = e as TouchEvent;
    if (this.canCancel || !this.ctl.isUIActive("fullscreen")) return this.handleEnd();
    te.preventDefault();
    (this.zone?.x === "right" ? this.ctl.DOM.touchVolumeNotifier : this.ctl.DOM.touchBrightnessNotifier)?.classList.add("tmg-video-control-active");
    this.ctl.throttle(
      "gestureTouchMove",
      () => {
        const tc = this.config,
          height = this.ctl.videoContainer.offsetHeight,
          y = te.touches[0].clientY,
          deltaY = y - this.lastY,
          sign = deltaY >= 0 ? "-" : "+",
          percent = clamp(0, Math.abs(deltaY), height * tc.yRatio) / (height * tc.yRatio);
        this.lastY = y;
        this.applyRange(this.zone?.x === "right" ? "volume" : "brightness", percent, sign);
      },
      30,
      false
    );
  }

  protected handleEnd(): void {
    if (this.xCheck) {
      this.ctl.state.gestureTouchXCheck = this.xCheck = false;
      this.ctl.videoContainer.removeEventListener("touchmove", this.handleXMove);
      this.ctl.DOM.touchTimelineNotifier?.classList.remove("tmg-video-control-active");
      if (!this.canCancel) this.ctl.media.intent.currentTime = this.nextTime;
    }
    if (this.yCheck) {
      this.ctl.state.gestureTouchYCheck = this.yCheck = false;
      this.ctl.videoContainer.removeEventListener("touchmove", this.handleYMove);
      clearTimeout(this.sliderTimeoutId);
      this.sliderTimeoutId = setTimeout(
        () => {
          this.ctl.DOM.touchVolumeNotifier?.classList.remove("tmg-video-control-active");
          this.ctl.DOM.touchBrightnessNotifier?.classList.remove("tmg-video-control-active");
        },
        this.config.sliderTimeout,
        this.signal
      );
      if (!this.canCancel) this.ctl.getPlug<OverlayPlug>("overlay")?.remove();
    }
    clearTimeout(this.cancelTimeoutId);
    this.canCancel = true;
    this.ctl.videoContainer.removeEventListener("touchmove", this.handleInit);
    ["touchend", "touchcancel"].forEach((evt) => this.ctl.videoContainer.removeEventListener(evt, this.handleEnd));
  }

  protected applyTimeline({ percent, sign, multiplier }: { percent: number; sign: string; multiplier: number }): void {
    const { currentTime } = this.ctl.media.state,
      { duration } = this.ctl.media.status,
      change = percent * duration * +multiplier.toFixed(1);
    this.nextTime = clamp(0, currentTime + (sign === "+" ? change : -change), duration);
  }

  protected applyRange(key: "volume" | "brightness", percent: number, sign: string): void {
    const plug = this.ctl.getPlug<VolumePlug>(key),
      range = this.ctl.config.settings[key],
      value = sign === "+" ? range.value! + percent * range.max : range.value! - percent * range.max;
    plug?.handleSliderInput(clamp(0, Math.round(value), range.max));
  }
}
