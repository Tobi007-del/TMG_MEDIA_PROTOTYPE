import { BasePlug, OverlayPlug, ControlPanelPlug, Control, BigControl } from ".";
import { PosterPreview } from "../types/generics";
import { VideoBuild } from "../types/build";
import { Event, TERMINATOR } from "../core/reactor";
import { inBoolArrOpt } from "../utils";

export interface LightState {
  disabled: boolean;
  controls: (Control | BigControl)[] | boolean;
  preview: PosterPreview;
}

export class LightStatePlug extends BasePlug<LightState> {
  public static readonly plugName: string = "lightState";

  public wire(): void {
    this.ctl.config.set("lightState.disabled", (value) => (this.ctl.state.readyState > 1 ? TERMINATOR : value));
    this.ctl.config.on("lightState.disabled", this.handleDisabledChange, { signal: this.signal, immediate: true });
    this.ctl.config.on("lightState.controls", this.handleControlsChange, { signal: this.signal, immediate: true });
    this.ctl.config.on("lightState.preview.usePoster", this.handleUsePosterChange, { signal: this.signal });
    this.ctl.config.on("lightState.preview.time", this.handleTimeChange, { signal: this.signal });
    if (this.config.disabled) this.ctl.setReadyState(); // warning my compadre: gesture plug
  }

  protected handleDisabledChange({ value, target }: Event<VideoBuild, "lightState.disabled">): void {
    if (value) {
      const timeStart = this.ctl.config.settings.time.start;
      if (timeStart != null) this.ctl.media.intent.currentTime = timeStart;
      this.ctl.videoContainer.classList.remove("tmg-video-light");
      this.ctl.media.element.removeEventListener("play", this.remove);
      this.ctl.DOM.controlsContainer?.removeEventListener("click", this.handleLightStateClick);
      this.ctl.setReadyState(); // you can wire now, compadre
    } else {
      const { preview } = target.object;
      this.ctl.config.lightState.preview.usePoster = preview.usePoster;
      this.ctl.config.lightState.preview.time = preview.time;
      this.ctl.videoContainer.classList.add("tmg-video-light");
      this.ctl.media.element.addEventListener("play", this.remove, { signal: this.signal });
      this.ctl.DOM.controlsContainer?.addEventListener("click", this.handleLightStateClick, { signal: this.signal });
    }
  }

  protected handleControlsChange(): void {
    this.ctl.queryDOM("[data-control-id]", true).forEach((c) => (c.dataset.lightControl = this.isLight(c.dataset.controlId!) ? "true" : "false"));
  }

  protected handleUsePosterChange({ value, root }: Event<VideoBuild, "lightState.preview.usePoster">): void {
    !root.lightState.disabled && (!value || !this.ctl.media.state.poster) && (this.ctl.media.intent.currentTime = root.lightState.preview.time);
  }

  protected handleTimeChange({ value, target, root }: Event<VideoBuild, "lightState.preview.time">): void {
    !root.lightState.disabled && (!target.object.preview.usePoster || !this.ctl.media.state.poster) && (this.ctl.media.intent.currentTime = value!);
  }

  protected add(): void {
    this.ctl.config.lightState.disabled = false;
  }

  protected remove(): void {
    this.ctl.config.lightState.disabled = true;
    this.isLight("bigplaypause") && this.stall();
    this.ctl.media.intent.paused = false;
  }

  protected handleLightStateClick({ target }: MouseEvent): void {
    target === this.ctl.DOM.controlsContainer && this.remove();
  }

  protected stall(): void {
    this.ctl.getPlug<OverlayPlug>("overlay")?.show();
    const bigPlayBtn = this.ctl.getPlug<ControlPanelPlug>("controlPanel")?.getControlEl("big-play-pause");
    bigPlayBtn && this.ctl.videoContainer.classList.add("tmg-video-stall");
    bigPlayBtn?.addEventListener("animationend", () => this.ctl.videoContainer.classList.remove("tmg-video-stall"), { once: true, signal: this.signal });
  }

  protected isLight(controlId: string): boolean {
    return inBoolArrOpt(this.ctl.config.lightState.controls, controlId);
  }
}
