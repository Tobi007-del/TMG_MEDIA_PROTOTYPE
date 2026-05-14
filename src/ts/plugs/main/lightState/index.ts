import { BasePlug, OverlayPlug, ControlPanelPlug, LightState, LIGHT_STATE_BUILD } from "../..";
import type { CtlrConfig } from "../../../types/config";
import { type REvent, TERMINATOR } from "sia-reactor";
import { inBoolArrOpt } from "../../../utils";

export class LightStatePlug extends BasePlug<LightState> {
  public static readonly plugName: string = "lightState";
  public static readonly isMain: boolean = true;
  public static readonly BUILD = LIGHT_STATE_BUILD;

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
      this.media.container.classList.remove("tmg-media-light");
      this.media.element.removeEventListener("play", this.remove);
      this.ctlr.DOM.controlsContainer?.removeEventListener("click", this.handleLightStateClick);
      this.ctlr.setReadyState(); // you can wire now, compadre
    } else {
      this.ctlr.config.lightState.preview.usePoster = this.config.preview.usePoster;
      this.media.container.classList.add("tmg-media-light");
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
    bigPlayBtn && this.media.container.classList.add("tmg-media-stall");
    bigPlayBtn?.addEventListener("animationend", () => this.media.container.classList.remove("tmg-media-stall"), { once: true, signal: this.signal });
  }

  protected isLight(controlId: string): boolean {
    return inBoolArrOpt(this.ctlr.config.lightState.controls, controlId);
  }
}

export type * from "./types";
export * from "./build";
