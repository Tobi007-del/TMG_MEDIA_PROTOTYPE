import { BasePlug } from ".";
import type { REvent } from "sia-reactor";
import type { CtlrConfig } from "../types/config";
import type { OverlayPlug, ToastsPlug, ControlPanelPlug } from ".";
import type { Timeline } from "../components";

export type Disabled = boolean;

interface DisabledState {
  message: string | null;
}

export class DisabledPlug extends BasePlug<Disabled, DisabledState> {
  public static readonly plugName: string = "disabled";

  public wire(): void {
    // Ctlr State Watchers
    this.ctlr.config.watch("disabled", (value) => (this.config = value), { signal: this.signal }); // #COMPUTED: config can lose reference
    // ---- Media Listeners
    this.media.on("state.paused", ({ value }) => !value && this.media.status.loadedMetadata && this.reactivate(), { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("disabled", this.handleDisabled, { immediate: true, signal: this.signal });
  }

  protected handleDisabled({ value }: REvent<CtlrConfig, "disabled">): void {
    if (value) {
      // JS: this.leaveSettingsView();
      this.ctlr.cancelAllLoops();
      this.ctlr.videoContainer.classList.add("tmg-video-disabled");
      this.media.intent.paused = true;
      this.ctlr.plug<OverlayPlug>("overlay")?.show();
      this.ctlr.DOM.containerContent?.setAttribute("inert", "");
      // JS: this.setKeyEventListeners("remove");
      this.ctlr.plug<ToastsPlug>("toasts")?.toast?.warn("You cannot access the custom controls when disabled");
      this.ctlr.log("You cannot access the custom controls when disabled", "warn");
    } else {
      this.ctlr.videoContainer.classList.remove("tmg-video-disabled");
      this.ctlr.DOM.containerContent?.removeAttribute("inert");
      // this.setKeyEventListeners("add");
    }
  }

  public deactivate(message: string): void {
    this.ctlr.plug<OverlayPlug>("overlay")?.show();
    this.state.message = message;
    this.ctlr.DOM.containerContent?.setAttribute("data-message", message);
    const timeline = this.ctlr.plug<ControlPanelPlug>("controlPanel")?.getControl<Timeline>("timeline");
    timeline && this.ctlr.setCanvasFallback(timeline["previewCanvas"], timeline["previewContext"]!);
    timeline && this.ctlr.setCanvasFallback(timeline["thumbnailCanvas"], timeline["thumbnailContext"]!);
    this.ctlr.videoContainer.classList.add("tmg-video-inactive");
  }

  public reactivate(): void {
    if (!this.ctlr.videoContainer.classList.contains("tmg-video-inactive") || !this.media.status.loadedMetadata) return;
    this.state.message = null;
    this.ctlr.DOM.containerContent?.removeAttribute("data-message");
    this.ctlr.videoContainer.classList.remove("tmg-video-inactive");
  }
}

export const DISABLED_BUILD: Disabled = false;
