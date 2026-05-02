import { BasePlug, OverlayPlug, ControlPanelPlug, Control, BigControl } from ".";
import type { PosterPreview } from "../types/generics";
import type { CtlrConfig } from "../types/config";
import { type DeepPartial, type REvent, TERMINATOR } from "sia-reactor";
import { inBoolArrOpt } from "../utils";

export interface LightState {
  disabled: boolean;
  controls: (Control | BigControl)[] | boolean;
  preview: PosterPreview;
}

export class LightStatePlug extends BasePlug<LightState> {
  public static readonly plugName: string = "lightState";

  public override wire(): void {
    // Ctlr Config Setters
    this.ctlr.config.set("lightState.disabled", (value) => (this.ctlr.state.readyState > 1 ? TERMINATOR : value));
    // ----------- Listeners
    this.ctlr.config.on("lightState.disabled", this.handleDisabled, { signal: this.signal, immediate: true });
    this.ctlr.config.on("lightState.controls", this.handleControls, { signal: this.signal, immediate: true });
    this.ctlr.config.on("lightState.preview.usePoster", this.handleUsePoster, { signal: this.signal });
    this.ctlr.config.on("lightState.preview.time", this.handleTime, { signal: this.signal });
    // Post Wiring
    if (this.config.disabled) this.ctlr.setReadyState(); // warning my compadres: gesture plug & others
  }

  protected handleDisabled({ value, target }: REvent<CtlrConfig, "lightState.disabled">): void {
    if (value) {
      const timeStart = this.ctlr.settings.time.start;
      if (timeStart != null) this.media.intent.currentTime = timeStart;
      this.ctlr.videoContainer.classList.remove("tmg-video-light");
      this.media.element.removeEventListener("play", this.remove);
      this.ctlr.DOM.controlsContainer?.removeEventListener("click", this.handleLightStateClick);
      this.ctlr.setReadyState(); // you can wire now, compadre
    } else {
      this.ctlr.config.lightState.preview.usePoster = this.config.preview.usePoster;
      this.ctlr.videoContainer.classList.add("tmg-video-light");
      this.media.element.addEventListener("play", this.remove, { signal: this.signal });
      this.ctlr.DOM.controlsContainer?.addEventListener("click", this.handleLightStateClick, { signal: this.signal });
    }
  }

  protected handleControls(): void {
    this.ctlr.queryDOM("[data-control-id]", true).forEach((c) => (c.dataset.lightControl = this.isLight(c.dataset.controlId!) ? "true" : "false"));
  }

  protected handleUsePoster({ target: { value, object }, root }: REvent<CtlrConfig, "lightState.preview.usePoster">): void {
    if (root.lightState.disabled || (value && this.media.state.poster)) return;
    this.media.intent.currentTime = object.time;
    if (!this.media.status.loadedMetadata) this.media.once("status.loadedMetadata", () => (this.config.preview.usePoster = value), { signal: this.signal }); // retrigger when metadata is ready in case time is a percentage
  }

  protected handleTime({ target: { object }, root }: REvent<CtlrConfig, "lightState.preview.time">): void {
    !root.lightState.disabled && (!object.usePoster || !this.media.state.poster) && (this.media.intent.currentTime = object.time!);
  }

  protected add(): void {
    this.ctlr.config.lightState.disabled = false;
  }

  protected remove(): void {
    this.ctlr.config.lightState.disabled = true;
    this.isLight("bigplaypause") && this.stall();
    this.media.intent.paused = false;
  }

  protected handleLightStateClick({ target }: MouseEvent): void {
    target === this.ctlr.DOM.controlsContainer && this.remove();
  }

  protected stall(): void {
    this.ctlr.plug<OverlayPlug>("overlay")?.show();
    const bigPlayBtn = this.ctlr.plug<ControlPanelPlug>("controlPanel")?.getCtrlEl("bigplaypause");
    bigPlayBtn && this.ctlr.videoContainer.classList.add("tmg-video-stall");
    bigPlayBtn?.addEventListener("animationend", () => this.ctlr.videoContainer.classList.remove("tmg-video-stall"), { once: true, signal: this.signal });
  }

  protected isLight(controlId: string): boolean {
    return inBoolArrOpt(this.ctlr.config.lightState.controls, controlId);
  }
}

export const LIGHT_STATE_BUILD: DeepPartial<LightState> = {
  disabled: false,
  controls: ["meta", "bigplaypause", "fullscreenorientation"],
  preview: { usePoster: true, time: 4 },
};
