import { BasePlug, OverlayPlug } from ".";
import type { Controller } from "../core/controller";
import type { ScreenLocked } from "../components";
import type { CtlrConfig } from "../types/config";
import type { REvent } from "../types/reactor";
import { ComponentRegistry } from "../core/registry";
import { setTimeout, parseCSSTime, mockAsync, createEl } from "../utils";

export type Locked = {
  disabled: boolean;
};

export interface LockedState {
  visible: boolean;
}

export class LockedPlug extends BasePlug<Locked, LockedState> {
  public static readonly plugName: string = "locked";
  public lockOverlayDelayId = -1;
  protected control: ScreenLocked | null = null;

  constructor(ctlr: Controller, config: Locked) {
    super(ctlr, config, { visible: false });
  }

  public mount(): void {
    // Variables Assignment
    const wrapper = createEl("div", { className: "tmg-video-screen-locked-wrapper", innerHTML: `<p>Screen Locked</p><p>Tap to Unlock</p>` });
    this.control = ComponentRegistry.init<ScreenLocked>("screenlocked", this.ctlr);
    // DOM Injection
    this.ctlr.DOM.containerContentWrapper?.appendChild(wrapper);
    this.control && wrapper.prepend(this.control.element);
  }

  public wire(): void {
    // Event Listeners
    this.ctlr.videoContainer.addEventListener("click", this.handleScreenClick, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.locked.disabled", this.handleLockChange, { signal: this.signal, immediate: true });
  }

  protected handleScreenClick(): void {
    if (this.config.disabled) return;
    this.state.visible ? this?.removeOverlay() : this?.showOverlay();
  }

  protected async handleLockChange({ value }: REvent<CtlrConfig, "settings.locked.disabled">): Promise<void> {
    if (!value) {
      // JS: this.ctlr.leaveSettingsView?.();
      setTimeout(this.showOverlay, 0, this.signal);
      this.ctlr.videoContainer.classList.add("tmg-video-locked", "tmg-video-progress-bar");
      this.ctlr.getPlug<OverlayPlug>("overlay")?.remove("force");
      // JS: this.ctlr.setKeyEventListeners?.("remove");
    } else {
      this.removeOverlay();
      await mockAsync(parseCSSTime(this.ctlr.settings.css.switchTransitionTime));
      this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", this.ctlr.settings.controlPanel.progressBar);
      this.ctlr.videoContainer.classList.remove("tmg-video-locked");
      this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
      // JS: this.ctlr.setKeyEventListeners?.("add");
    }
  }

  public showOverlay(): void {
    this.ctlr.videoContainer.classList.add("tmg-video-locked-overlay");
    this.state.visible = true;
    this.delayOverlay();
  }

  public removeOverlay(): void {
    this.ctlr.videoContainer.classList.remove("tmg-video-locked-overlay");
    this.state.visible = false;
  }

  public delayOverlay(): void {
    clearTimeout(this.lockOverlayDelayId);
    this.lockOverlayDelayId = setTimeout(this.removeOverlay, this.ctlr.settings.overlay.delay, this.signal);
  }

  protected onDestroy(): void {
    this.control?.destroy();
  }
}

export const LOCKED_BUILD: Partial<Locked> = { disabled: true };
