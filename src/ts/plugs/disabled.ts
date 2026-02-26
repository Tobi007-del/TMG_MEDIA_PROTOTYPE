import { BasePlug } from ".";
import type { Event } from "../types/reactor";
import type { VideoBuild } from "../types/build";
import type { OverlayPlug } from "./overlay";
import type { ToastsPlug } from "./toasts";
import type { ControlPanelPlug } from "./controlPanel";
import type { Timeline } from "../components";

export type Disabled = boolean;

interface DisabledState {
  message: string | null;
}

export class DisabledPlug extends BasePlug<Disabled, DisabledState> {
  public static readonly plugName: string = "disabled";

  public wire(): void {
    this.ctlr.media.on("state.paused", ({ target: { value } }) => !value && this.ctlr.media.status.loadedMetadata && this.reactivate(), { signal: this.signal });
    this.ctlr.config.on("disabled", this.handleDisabled, { immediate: true, signal: this.signal });
  }

  protected handleDisabled({ target: { value } }: Event<VideoBuild, "disabled">): void {
    if (value) {
      // this.leaveSettingsView(); // TODO: when settings plug exists
      this.ctlr.cancelAllLoops();
      this.ctlr.videoContainer.classList.add("tmg-video-disabled");
      this.ctlr.media.intent.paused = true;
      this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
      this.ctlr.DOM.containerContent?.setAttribute("inert", "");
      // this.setKeyEventListeners("remove"); // TODO: when keys plug exists
      this.ctlr.getPlug<ToastsPlug>("toasts")?.toast?.warn("You cannot access the custom controls when disabled");
      this.ctlr.log("You cannot access the custom controls when disabled", "warn");
    } else {
      this.ctlr.videoContainer.classList.remove("tmg-video-disabled");
      this.ctlr.DOM.containerContent?.removeAttribute("inert");
      // this.setKeyEventListeners("add"); // TODO: when keys plug exists
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
    if (!this.ctlr.videoContainer.classList.contains("tmg-video-inactive") || !this.ctlr.media.status.loadedMetadata) return;
    this.state.message = null;
    this.ctlr.DOM.containerContent?.removeAttribute("data-message");
    this.ctlr.videoContainer.classList.remove("tmg-video-inactive");
  }
}
