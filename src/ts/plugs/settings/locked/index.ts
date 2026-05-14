import { BasePlug, KeysPlug, Locked, LOCKED_BUILD, LockedState, OverlayPlug } from "../..";
import type { Controller } from "../../../core/controller";
import type { FullscreenLockButton } from "../../../components";
import type { CtlrConfig } from "../../../types/config";
import type { REvent } from "sia-reactor";
import { ComponentRegistry } from "../../../core/registry";
import { setTimeout, parseCSSTime, mockAsync, createEl } from "../../../utils";

export class LockedPlug extends BasePlug<Locked, LockedState> {
  public static readonly plugName: string = "locked";
  public static readonly BUILD = LOCKED_BUILD;
  public lockOverlayDelayId = -1;
  public wrapper!: HTMLDivElement;
  public control: FullscreenLockButton | null = null;

  constructor(ctlr: Controller, config: Locked) {
    super(ctlr, config, { visible: false });
  }

  public override mount(): void {
    // Variables Assignment
    this.wrapper = createEl("div", { className: "tmg-media-screen-locked-wrapper", innerHTML: `<p>Screen Locked</p><p>Tap to Unlock</p>` });
    this.control = ComponentRegistry.init<FullscreenLockButton>("screenlock", this.ctlr);
    // DOM Injection
    this.ctlr.DOM.containerContentWrapper?.append(this.wrapper);
  }

  public override wire(): void {
    // Event Listeners
    this.media.container.addEventListener("click", this.handleScreenClick, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.locked.disabled", this.handleDisabled, { signal: this.signal, immediate: true });
  }

  protected handleScreenClick(): void {
    if (!this.config.disabled) this.state.visible ? this?.removeOverlay() : this?.showOverlay();
  }

  protected async handleDisabled({ value }: REvent<CtlrConfig, "settings.locked.disabled">): Promise<void> {
    if (!value) {
      // JS: this.ctlr.leaveSettingsView?.();
      setTimeout(this.showOverlay, 0, this.signal);
      this.media.container.classList.add("tmg-media-locked", "tmg-media-progress-bar");
      this.ctlr.plug<OverlayPlug>("overlay")?.remove("force");
      this.ctlr.plug<KeysPlug>("keys")?.setEventListeners("remove");
    } else {
      this.removeOverlay();
      await mockAsync(parseCSSTime(this.ctlr.settings.css.switchTransitionTime));
      this.media.container.classList.toggle("tmg-media-progress-bar", this.ctlr.settings.controlPanel.progressBar);
      this.media.container.classList.remove("tmg-media-locked");
      this.ctlr.plug<OverlayPlug>("overlay")?.show();
      this.ctlr.plug<KeysPlug>("keys")?.setEventListeners("add");
    }
  }

  public showOverlay(): void {
    this.media.container.classList.add("tmg-media-locked-overlay");
    this.state.visible = true;
    this.delayOverlay();
  }

  public removeOverlay(): void {
    this.media.container.classList.remove("tmg-media-locked-overlay");
    this.state.visible = false;
  }

  public delayOverlay(): void {
    clearTimeout(this.lockOverlayDelayId);
    this.lockOverlayDelayId = setTimeout(this.removeOverlay, this.ctlr.settings.overlay.delay, this.signal);
  }

  protected override onDestroy(): void {
    this.control?.destroy();
  }
}

export type * from "./types";
export * from "./build";
