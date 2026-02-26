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
    this.ctlr.config.set("lightState.disabled", (value) => (this.ctlr.state.readyState > 1 ? TERMINATOR : value));
    this.ctlr.config.on("lightState.disabled", this.handleDisabledChange, { signal: this.signal, immediate: true });
    this.ctlr.config.on("lightState.controls", this.handleControlsChange, { signal: this.signal, immediate: true });
    this.ctlr.config.on("lightState.preview.usePoster", this.handleUsePosterChange, { signal: this.signal });
    this.ctlr.config.on("lightState.preview.time", this.handleTimeChange, { signal: this.signal });
    if (this.config.disabled) this.ctlr.setReadyState(); // warning my compadre: gesture plug
  }

  protected handleDisabledChange({ value, target }: Event<VideoBuild, "lightState.disabled">): void {
    if (value) {
      const timeStart = this.ctlr.config.settings.time.start;
      if (timeStart != null) this.ctlr.media.intent.currentTime = timeStart;
      this.ctlr.videoContainer.classList.remove("tmg-video-light");
      this.ctlr.media.element.removeEventListener("play", this.remove);
      this.ctlr.DOM.controlsContainer?.removeEventListener("click", this.handleLightStateClick);
      this.ctlr.setReadyState(); // you can wire now, compadre
    } else {
      const { preview } = target.object;
      this.ctlr.config.lightState.preview.usePoster = preview.usePoster;
      this.ctlr.config.lightState.preview.time = preview.time;
      this.ctlr.videoContainer.classList.add("tmg-video-light");
      this.ctlr.media.element.addEventListener("play", this.remove, { signal: this.signal });
      this.ctlr.DOM.controlsContainer?.addEventListener("click", this.handleLightStateClick, { signal: this.signal });
    }
  }

  protected handleControlsChange(): void {
    this.ctlr.queryDOM("[data-control-id]", true).forEach((c) => (c.dataset.lightControl = this.isLight(c.dataset.controlId!) ? "true" : "false"));
  }

  protected handleUsePosterChange({ value, root }: Event<VideoBuild, "lightState.preview.usePoster">): void {
    !root.lightState.disabled && (!value || !this.ctlr.media.state.poster) && (this.ctlr.media.intent.currentTime = root.lightState.preview.time);
  }

  protected handleTimeChange({ value, target, root }: Event<VideoBuild, "lightState.preview.time">): void {
    !root.lightState.disabled && (!target.object.preview.usePoster || !this.ctlr.media.state.poster) && (this.ctlr.media.intent.currentTime = value!);
  }

  protected add(): void {
    this.ctlr.config.lightState.disabled = false;
  }

  protected remove(): void {
    this.ctlr.config.lightState.disabled = true;
    this.isLight("bigplaypause") && this.stall();
    this.ctlr.media.intent.paused = false;
  }

  protected handleLightStateClick({ target }: MouseEvent): void {
    target === this.ctlr.DOM.controlsContainer && this.remove();
  }

  protected stall(): void {
    this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
    const bigPlayBtn = this.ctlr.getPlug<ControlPanelPlug>("controlPanel")?.getControlEl("big-play-pause");
    bigPlayBtn && this.ctlr.videoContainer.classList.add("tmg-video-stall");
    bigPlayBtn?.addEventListener("animationend", () => this.ctlr.videoContainer.classList.remove("tmg-video-stall"), { once: true, signal: this.signal });
  }

  protected isLight(controlId: string): boolean {
    return inBoolArrOpt(this.ctlr.config.lightState.controls, controlId);
  }
}
