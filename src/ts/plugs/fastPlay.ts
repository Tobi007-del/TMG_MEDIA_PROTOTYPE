import { BasePlug, type TimePlug, type OverlayPlug } from ".";
import type { DeepPartial } from "sia-reactor";
import { setTimeout, setInterval } from "../utils";

export interface FastPlay {
  playbackRate: number;
  key: boolean;
  pointer: {
    type: string;
    threshold: number;
    inset: number;
  };
  reset: boolean;
  rewind: boolean;
}

interface FastPlayState {
  isRewinding: boolean;
}

export class FastPlayPlug extends BasePlug<FastPlay, FastPlayState> {
  public static readonly plugName: string = "fastPlay";
  public speedCheck = false;
  protected wasPaused = false;
  protected lastPlaybackRate = 1;
  protected rewindPlaybackRate = 0;
  protected speedIntervalId: number | null = null;
  protected speedPtrCheck = false;
  protected speedDirection: "forwards" | "backwards" = "forwards";
  protected speedTimeoutId: number | null = null;
  protected playTriggerCounter = 0;

  public override wire(): void {
    const attachListeners = () => {
      // Event Listeners
      this.ctlr.DOM.controlsContainer?.addEventListener("pointerdown", this.handleSpeedPointerDown, { capture: true, signal: this.signal });
    };
    if (this.ctlr.state.readyState > 1) attachListeners();
    else this.ctlr.state.once("readyState", attachListeners, { signal: this.signal });
  }

  public fastPlay(pos: "forwards" | "backwards"): void {
    if (this.speedCheck) return;
    this.speedCheck = true;
    this.wasPaused = this.media.state.paused;
    this.lastPlaybackRate = this.media.state.playbackRate;
    // JS: this.DOM.playbackRateNotifier?.classList.add("tmg-video-control-active");
    setTimeout(pos === "backwards" && this.config.rewind ? this.rewind : this.fastForward, 0, this.signal);
  }

  public fastForward(rate = this.config.playbackRate): void {
    this.media.intent.playbackRate = rate;
    this.state.isRewinding = false;
    // JS: this.DOM.playbackRateNotifier?.classList.remove("tmg-video-rewind");
    // JS: this.DOM.playbackRateNotifier?.setAttribute("data-current-time",this.ctlr.plug<TimePlug>("time")?.toTimeText(this.media.state.currentTime, true) ?? "0:00");
    this.media.intent.paused = false;
  }

  public rewind(rate = this.config.playbackRate): void {
    ((this.media.intent.playbackRate = 1), (this.rewindPlaybackRate = rate));
    this.state.isRewinding = true;
    // JS: this.DOM.playbackRateNotifierText.textContent = `${rate}x`;
    // JS: this.DOM.playbackRateNotifier?.classList.add("tmg-video-rewind");
    this.media.element.addEventListener("play", () => this.rewindReset(), { signal: this.signal });
    this.speedIntervalId = setInterval(() => this.rewindVideo(), this.ctlr.state.pframeDelay - 20, this.signal);
  }

  protected rewindVideo(): void {
    if (!this.media.state.paused) this.media.intent.paused = true;
    this.media.intent.currentTime = this.media.state.currentTime - this.rewindPlaybackRate / this.ctlr.settings.frame.fps; // Apprentice Slider syncs, no CSS hack
    // this.ctlr.settings.css.currentPlayedPosition = this.ctlr.settings.css.currentThumbPosition = this.media.state.currentTime / this.media.status.duration;
    // JS: this.DOM.playbackRateNotifier?.setAttribute("data-current-time", this.ctlr.plug<TimePlug>("time")?.toTimeText(this.media.state.currentTime, true) ?? "0:00");
  }

  protected rewindReset(): void {
    if (this.speedIntervalId) {
      // JS: this.notify("videopause");
      this.media.intent.paused = true;
      clearInterval(this.speedIntervalId);
      this.speedIntervalId = null;
    } else this.speedIntervalId = setInterval(() => this.rewindVideo(), Math.round(1000 / this.ctlr.settings.frame.fps) - 20, this.signal);
  }

  public slowDown(): void {
    if (!this.speedCheck) return;
    this.speedCheck = false;
    if (this.speedIntervalId) clearInterval(this.speedIntervalId);
    this.media.element.removeEventListener("play", () => this.rewindReset());
    this.media.intent.playbackRate = this.lastPlaybackRate;
    this.rewindPlaybackRate = 0;
    this.state.isRewinding = false;
    this.media.intent.paused = this.config.reset ? this.wasPaused : false;
    this.ctlr.plug<OverlayPlug>("overlay")?.remove();
    // JS: this.DOM.playbackRateNotifier?.classList.remove("tmg-video-control-active", "tmg-video-rewind");
  }

  protected handleSpeedPointerDown(e: PointerEvent): void {
    if (!this.config.pointer.type.match(new RegExp(`all|${e.pointerType}`)) || e.target !== this.ctlr.DOM.controlsContainer || this.speedCheck) return;
    ["touchmove", "mouseup", "touchend", "touchcancel"].forEach((evt) => this.ctlr.videoContainer?.addEventListener(evt, this.handleSpeedPointerUp, { signal: this.signal }));
    this.ctlr.videoContainer?.addEventListener("mouseleave", this.handleSpeedPointerOut, { signal: this.signal });
    clearTimeout(this.speedTimeoutId!);
    this.speedTimeoutId = setTimeout(
      () => {
        this.ctlr.videoContainer?.removeEventListener("touchmove", this.handleSpeedPointerUp);
        this.speedPtrCheck = true;
        const x = e.clientX ?? (e as unknown as TouchEvent).targetTouches?.[0]?.clientX;
        const rect = this.ctlr.videoContainer.getBoundingClientRect();
        const rLeft = x - rect.left;
        this.speedDirection = rLeft >= rect.width * 0.5 ? "forwards" : "backwards";
        if (rLeft < this.config.pointer.inset || rLeft > rect.width - this.config.pointer.inset) return;
        if (this.config.rewind) ["mousemove", "touchmove"].forEach((evt) => this.ctlr.videoContainer?.addEventListener(evt, this.handleSpeedPointerMove, { signal: this.signal }));
        this.fastPlay(this.speedDirection);
      },
      this.config.pointer.threshold,
      this.signal
    );
  }

  protected handleSpeedPointerMove(e: globalThis.Event): void {
    if ((e as TouchEvent).touches?.length > 1) return;
    this.ctlr.throttle(
      "speedPointerMove",
      () => {
        const rect = this.ctlr.videoContainer.getBoundingClientRect(),
          x = (e as MouseEvent).clientX ?? (e as TouchEvent).targetTouches?.[0]?.clientX,
          currPos = x - rect.left >= rect.width * 0.5 ? "forwards" : "backwards";
        if (currPos !== this.speedDirection) {
          this.speedDirection = currPos;
          this.slowDown();
          this.fastPlay(this.speedDirection);
        }
      },
      200
    );
  }

  protected handleSpeedPointerUp(): void {
    clearTimeout(this.speedTimeoutId!);
    this.speedPtrCheck = false;
    if (this.speedCheck && this.playTriggerCounter < 1) setTimeout(() => this.slowDown(), 0, this.signal);
    ["touchmove", "mouseup", "touchend", "touchcancel"].forEach((evt) => this.ctlr.videoContainer?.removeEventListener(evt, this.handleSpeedPointerUp));
    ["mousemove", "touchmove"].forEach((evt) => this.ctlr.videoContainer?.removeEventListener(evt, this.handleSpeedPointerMove));
    this.ctlr.videoContainer?.removeEventListener("mouseleave", this.handleSpeedPointerOut);
  }

  protected handleSpeedPointerOut(): void {
    !this.ctlr.videoContainer?.matches(":hover") && this.handleSpeedPointerUp();
  }
}

export const FAST_PLAY_BUILD: DeepPartial<FastPlay> = {
  playbackRate: 2,
  key: true,
  pointer: { type: "all", threshold: 800, inset: 20 },
  reset: true,
  rewind: true,
};
