import { BasePlug } from ".";
import type { TimePlug } from "./time";
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
  speedValue: number;
  isRewinding: boolean;
}

export class FastPlayPlug extends BasePlug<FastPlay, FastPlayState> {
  public static readonly plugName: string = "fastPlay";
  protected speedCheck = false;
  protected wasPaused = false;
  protected lastPlaybackRate = 1;
  protected rewindPlaybackRate = 0;
  protected speedIntervalId: number | null = null;
  protected speedPointerCheck = false;
  protected speedDirection: "forwards" | "backwards" = "forwards";
  protected speedTimeoutId: number | null = null;
  protected playTriggerCounter = 0;

  public wire(): void {
    const attachListeners = () => {
      this.ctl.DOM.controlsContainer?.addEventListener("pointerdown", this.handleSpeedPointerDown, { capture: true, signal: this.signal });
    };
    if (this.ctl.state.readyState > 1) attachListeners();
    else this.ctl.state.once("readyState", attachListeners, { signal: this.signal });
  }

  public fastPlay(pos: "forwards" | "backwards"): void {
    if (this.speedCheck) return;
    this.speedCheck = true;
    this.wasPaused = this.ctl.media.state.paused;
    this.lastPlaybackRate = this.ctl.config.settings.playbackRate.value;
    // JS: this.DOM.playbackRateNotifier?.classList.add("tmg-video-control-active");
    this.ctl.queryDOM(".tmg-video-playback-rate-notifier")?.classList.add("tmg-video-control-active");
    setTimeout(pos === "backwards" && this.config.rewind ? this.rewind : this.fastForward, 0, this.signal);
  }

  public fastForward(rate = this.config.playbackRate): void {
    this.ctl.config.settings.playbackRate.value = this.state.speedValue = rate;
    this.state.isRewinding = false;
    const notifier = this.ctl.queryDOM(".tmg-video-playback-rate-notifier"),
      timePlug = this.ctl.getPlug<TimePlug>("time");
    // JS: this.DOM.playbackRateNotifier?.classList.remove("tmg-video-rewind");
    notifier?.classList.remove("tmg-video-rewind");
    notifier?.setAttribute("data-current-time", timePlug?.toTimeText(this.ctl.media.state.currentTime, true) ?? "0:00");
    this.ctl.media.intent.paused = false;
  }

  public rewind(rate = this.config.playbackRate): void {
    this.ctl.config.settings.playbackRate.value = this.rewindPlaybackRate = this.state.speedValue = rate;
    this.state.isRewinding = true;
    const notifier = this.ctl.queryDOM(".tmg-video-playback-rate-notifier");
    // JS: this.DOM.playbackRateNotifier?.classList.add("tmg-video-rewind");
    notifier?.classList.add("tmg-video-rewind");
    this.ctl.media.element.addEventListener("play", () => this.rewindReset(), { signal: this.signal });
    this.speedIntervalId = setInterval(() => this.rewindVideo(), this.ctl.state.pframeDelay - 20, this.signal);
  }

  protected rewindVideo(): void {
    if (!this.ctl.media.state.paused) this.ctl.media.intent.paused = true;
    const newTime = this.ctl.media.state.currentTime - this.rewindPlaybackRate / this.ctl.state.pfps,
      notifier = this.ctl.queryDOM(".tmg-video-playback-rate-notifier"),
      timePlug = this.ctl.getPlug<TimePlug>("time");
    this.ctl.media.intent.currentTime = newTime;
    this.ctl.config.settings.css.currentPlayedPosition = this.ctl.config.settings.css.currentThumbPosition = this.ctl.media.state.currentTime / this.ctl.media.status.duration;
    notifier?.setAttribute("data-current-time", timePlug?.toTimeText(this.ctl.media.state.currentTime, true) ?? "0:00");
  }

  protected rewindReset(): void {
    if (this.speedIntervalId) {
      // this.notify("videopause"); // TODO: when notify exists
      this.ctl.media.intent.paused = true;
      clearInterval(this.speedIntervalId);
      this.speedIntervalId = null;
    } else {
      this.speedIntervalId = setInterval(() => this.rewindVideo(), this.ctl.state.pframeDelay - 20, this.signal);
    }
  }

  public slowDown(): void {
    if (!this.speedCheck) return;
    this.speedCheck = false;
    if (this.speedIntervalId) clearInterval(this.speedIntervalId);
    this.ctl.media.element.removeEventListener("play", () => this.rewindReset());
    this.ctl.config.settings.playbackRate.value = this.lastPlaybackRate;
    this.rewindPlaybackRate = 0;
    this.state.speedValue = this.lastPlaybackRate;
    this.state.isRewinding = false;
    this.ctl.media.intent.paused = this.config.reset ? this.wasPaused : false;
    // this.removeOverlay(); // TODO: when overlay method exists
    // JS: this.DOM.playbackRateNotifier?.classList.remove("tmg-video-control-active", "tmg-video-rewind");
    this.ctl.queryDOM(".tmg-video-playback-rate-notifier")?.classList.remove("tmg-video-control-active", "tmg-video-rewind");
  }

  protected handleSpeedPointerDown(e: PointerEvent): void {
    if (!this.config.pointer.type.match(new RegExp(`all|${e.pointerType}`)) || e.target !== this.ctl.DOM.controlsContainer || this.speedCheck) return;
    ["touchmove", "mouseup", "touchend", "touchcancel"].forEach((evt) => this.ctl.videoContainer?.addEventListener(evt, this.handleSpeedPointerUp, { signal: this.signal }));
    this.ctl.videoContainer?.addEventListener("mouseleave", this.handleSpeedPointerOut, { signal: this.signal });
    clearTimeout(this.speedTimeoutId!);
    this.speedTimeoutId = setTimeout(
      () => {
        this.ctl.videoContainer?.removeEventListener("touchmove", this.handleSpeedPointerUp);
        this.speedPointerCheck = true;
        const x = e.clientX ?? (e as any).targetTouches?.[0]?.clientX;
        const rect = this.ctl.videoContainer.getBoundingClientRect();
        const rLeft = x - rect.left;
        this.speedDirection = rLeft >= rect.width * 0.5 ? "forwards" : "backwards";
        if (rLeft < this.config.pointer.inset || rLeft > rect.width - this.config.pointer.inset) return;
        if (this.config.rewind) ["mousemove", "touchmove"].forEach((evt) => this.ctl.videoContainer?.addEventListener(evt, this.handleSpeedPointerMove, { signal: this.signal }));
        this.fastPlay(this.speedDirection);
      },
      this.config.pointer.threshold,
      this.signal
    );
  }

  protected handleSpeedPointerMove(e: Event): void {
    if ((e as any).touches?.length > 1) return;
    this.ctl.throttle(
      "speedPointerMove",
      () => {
        const rect = this.ctl.videoContainer.getBoundingClientRect(),
          x = (e as any).clientX ?? (e as any).targetTouches?.[0]?.clientX,
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
    this.speedPointerCheck = false;
    if (this.speedCheck && this.playTriggerCounter < 1) setTimeout(() => this.slowDown(), 0, this.signal);
    ["touchmove", "mouseup", "touchend", "touchcancel"].forEach((evt) => this.ctl.videoContainer?.removeEventListener(evt, this.handleSpeedPointerUp));
    ["mousemove", "touchmove"].forEach((evt) => this.ctl.videoContainer?.removeEventListener(evt, this.handleSpeedPointerMove));
    this.ctl.videoContainer?.removeEventListener("mouseleave", this.handleSpeedPointerOut);
  }

  protected handleSpeedPointerOut(): void {
    !this.ctl.videoContainer?.matches(":hover") && this.handleSpeedPointerUp();
  }
}
