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
    this.ctl.config.on("disabled", this.handleDisabled, { signal: this.signal });
  }

  protected handleDisabled({ target: { value } }: Event<VideoBuild, "disabled">): void {
    if (value) {
      // this.leaveSettingsView(); // TODO: when settings plug exists
      this.ctl.cancelAllLoops();
      this.ctl.videoContainer.classList.add("tmg-video-disabled");
      this.ctl.media.intent.paused = true;
      this.ctl.getPlug<OverlayPlug>("overlay")?.show();
      this.ctl.DOM.containerContent?.setAttribute("inert", "");
      // this.setKeyEventListeners("remove"); // TODO: when keys plug exists
      this.ctl.getPlug<ToastsPlug>("toasts")?.toast?.warn("You cannot access the custom controls when disabled");
      this.ctl.log("You cannot access the custom controls when disabled", "warn");
    } else {
      this.ctl.videoContainer.classList.remove("tmg-video-disabled");
      this.ctl.DOM.containerContent?.removeAttribute("inert");
      // this.setKeyEventListeners("add"); // TODO: when keys plug exists
    }
  }

  public deactivate(message: string): void {
    this.ctl.getPlug<OverlayPlug>("overlay")?.show();
    this.state.message = message;
    this.ctl.DOM.containerContent?.setAttribute("data-message", message);
    const timeline = this.ctl.getPlug<ControlPanelPlug>("controlPanel")?.getControl<Timeline>("timeline");
    if (timeline) {
      this.ctl.setCanvasFallback(timeline["previewCanvas"], timeline["previewContext"]!);
      this.ctl.setCanvasFallback(timeline["thumbnailCanvas"], timeline["thumbnailContext"]!);
    }
    this.ctl.videoContainer.classList.add("tmg-video-inactive");
  }

  public reactivate(): void {
    if (!this.ctl.videoContainer.classList.contains("tmg-video-inactive") || !this.ctl.media.status.loadedMetadata) return;
    this.state.message = null;
    this.ctl.DOM.containerContent?.removeAttribute("data-message");
    this.ctl.videoContainer.classList.remove("tmg-video-inactive");
  }
}
