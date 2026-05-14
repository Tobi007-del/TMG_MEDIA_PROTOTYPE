import { BasePlug, DISABLED_BUILD, KeysPlug, OverlayPlug, ToastsPlug, ControlPanelPlug, Disabled, DisabledState } from "../..";
import type { REvent } from "sia-reactor";
import type { CtlrConfig } from "../../../types/config";
import type { Timeline } from "../../../components";

export class DisabledPlug extends BasePlug<Disabled, DisabledState> {
  public static readonly plugName: string = "disabled";
  public static readonly BUILD = DISABLED_BUILD;

  public override wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("disabled", this.handle, { immediate: true, signal: this.signal });
  }

  protected handle({ value }: REvent<CtlrConfig, "disabled">): void {
    if (value) {
      // JS: this.leaveSettingsView();
      this.ctlr.cancelAllLoops();
      this.media.container.classList.add("tmg-media-disabled");
      this.media.intent.paused = true;
      this.ctlr.plug<OverlayPlug>("overlay")?.show();
      this.ctlr.DOM.containerContent?.setAttribute("inert", "");
      this.ctlr.plug<KeysPlug>("keys")?.setEventListeners("remove");
      this.ctlr.plug<ToastsPlug>("toasts")?.toast?.warn("You cannot access the custom controls when disabled");
      this.ctlr.log("You cannot access the custom controls when disabled", "warn");
    } else {
      this.media.container.classList.remove("tmg-media-disabled");
      this.ctlr.DOM.containerContent?.removeAttribute("inert");
      this.ctlr.plug<KeysPlug>("keys")?.setEventListeners("add");
    }
  }

  public deactivate(message: string): void {
    this.ctlr.plug<OverlayPlug>("overlay")?.show();
    this.ctlr.DOM.containerContent?.setAttribute("data-message", (this.state.message = message));
    const timeline = this.ctlr.plug<ControlPanelPlug>("controlPanel")?.getCtrl<Timeline>("timeline");
    timeline && this.ctlr.setCanvasFallback(timeline["previewCanvas"], timeline["previewContext"]!);
    timeline && this.ctlr.setCanvasFallback(timeline["thumbnailCanvas"], timeline["thumbnailContext"]!);
    this.media.container.classList.add("tmg-media-inactive");
  }

  public reactivate(): void {
    t007.dialog?.dismiss(`${this.ctlr.id}-error-dialog`, "recovered");
    if (!this.media.container.classList.contains("tmg-media-inactive") || !this.media.status.loadedMetadata) return;
    this.state.message = null;
    this.ctlr.DOM.containerContent?.removeAttribute("data-message");
    this.media.container.classList.remove("tmg-media-inactive");
  }
}

export type * from "./types";
export * from "./build";
