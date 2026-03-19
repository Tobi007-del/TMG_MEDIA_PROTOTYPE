import { BasePlug } from ".";
import type { REvent } from "../types/reactor";
import type { VideoBuild } from "../types/build";
import type { OverlayPlug, ToastsPlug, ControlPanelPlug } from ".";
import type { Timeline } from "../components";

export type Disabled = boolean;

interface DisabledState {
  message: string | null;
}

export class DisabledPlug extends BasePlug<Disabled, DisabledState> {
  public static readonly plugName: string = "disabled";

  public wire(): void {
    // Ctlr Media Listeners
    this.media.on("state.paused", ({ value }) => !value && this.media.status.loadedMetadata && this.reactivate(), { signal: this.signal });
    // ---------- Listeners
    this.ctlr.config.on("disabled", this.handleDisabled, { immediate: true, signal: this.signal });
  }

  protected handleDisabled({ value }: REvent<VideoBuild, "disabled">): void {
    if (value) {
      // JS: this.leaveSettingsView();
      this.ctlr.cancelAllLoops();
      this.ctlr.videoContainer.classList.add("tmg-video-disabled");
      this.media.intent.paused = true;
      this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
      this.ctlr.DOM.containerContent?.setAttribute("inert", "");
      // JS: this.setKeyEventListeners("remove");
      this.ctlr.getPlug<ToastsPlug>("toasts")?.toast?.warn("You cannot access the custom controls when disabled");
      this.ctlr.log("You cannot access the custom controls when disabled", "warn");
    } else {
      this.ctlr.videoContainer.classList.remove("tmg-video-disabled");
      this.ctlr.DOM.containerContent?.removeAttribute("inert");
      // this.setKeyEventListeners("add");
    }
  }

  public deactivate(message: string): void {
    this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
    this.state.message = message;
    this.ctlr.DOM.containerContent?.setAttribute("data-message", message);
    const timeline = this.ctlr.getPlug<ControlPanelPlug>("controlPanel")?.getControl<Timeline>("timeline");
    if (timeline) {
      this.ctlr.setCanvasFallback(timeline["previewCanvas"], timeline["previewContext"]!);
      this.ctlr.setCanvasFallback(timeline["thumbnailCanvas"], timeline["thumbnailContext"]!);
    }
    this.ctlr.videoContainer.classList.add("tmg-video-inactive");
  }

  public reactivate(): void {
    if (!this.ctlr.videoContainer.classList.contains("tmg-video-inactive") || !this.media.status.loadedMetadata) return;
    this.state.message = null;
    this.ctlr.DOM.containerContent?.removeAttribute("data-message");
    this.ctlr.videoContainer.classList.remove("tmg-video-inactive");
  }
}
