import { BasePlug, OverlayPlug } from ".";
import type { Controller } from "../core/controller";
import type { ScreenLocked } from "../components";
import type { VideoBuild } from "../types/build";
import type { Event } from "../types/reactor";
import { reactive, type Reactive } from "../tools/mixins";
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
  protected btnComponent?: ScreenLocked;

  constructor(ctl: Controller, config: Locked) {
    super(ctl, config, { visible: false });
  }

  public mount(): void {
    this.injectLockedWrapper();
    this.injectScreenLockedBtn();
  }

  public wire(): void {
    this.ctl.videoContainer.addEventListener("click", this.handleScreenClick, { signal: this.signal });
    this.ctl.config.on("settings.locked.disabled", this.handleLockChange, { signal: this.signal, immediate: true });
  }

  protected injectLockedWrapper(): void {
    const wrapper = createEl("div", {
      className: "tmg-video-screen-locked-wrapper",
      innerHTML: `
        <p>Screen Locked</p>
        <p>Tap to Unlock</p>
      `,
    });
    this.ctl.DOM.containerContentWrapper?.appendChild(wrapper);
  }

  protected injectScreenLockedBtn(): void {
    const result = ComponentRegistry.init<ScreenLocked>("screenlocked", this.ctl);
    if (!result) return;
    this.ctl.queryDOM(".tmg-video-screen-locked-wrapper")?.prepend(result.element);
    this.btnComponent = result.instance;
  }

  protected handleScreenClick(): void {
    if (this.config.disabled) return;
    this.state.visible ? this?.removeOverlay() : this?.showOverlay();
  }

  protected async handleLockChange({ target: { value } }: Event<VideoBuild, "settings.locked.disabled">): Promise<void> {
    if (!value) {
      // TODO: Implement leaveSettingsView on Controller
      // this.ctl.leaveSettingsView?.();
      setTimeout(this.showOverlay, 0, this.signal);
      this.ctl.videoContainer.classList.add("tmg-video-locked", "tmg-video-progress-bar");
      this.ctl.getPlug<OverlayPlug>("overlay")?.remove("force");
      // TODO: Implement setKeyEventListeners on Controller
      // this.ctl.setKeyEventListeners?.("remove");
    } else {
      this.removeOverlay();
      await mockAsync(parseCSSTime(this.ctl.config.settings.css.switchTransitionTime));
      this.ctl.videoContainer.classList.toggle("tmg-video-progress-bar", this.ctl.config.settings.controlPanel.progressBar);
      this.ctl.videoContainer.classList.remove("tmg-video-locked");
      this.ctl.getPlug<OverlayPlug>("overlay")?.show();
      // TODO: Implement setKeyEventListeners on Controller
      // this.ctl.setKeyEventListeners?.("add");
    }
  }

  public showOverlay(): void {
    this.ctl.videoContainer.classList.add("tmg-video-locked-overlay");
    this.state.visible = true;
    this.delayOverlay();
  }

  public removeOverlay(): void {
    this.ctl.videoContainer.classList.remove("tmg-video-locked-overlay");
    this.state.visible = false;
  }

  public delayOverlay(): void {
    clearTimeout(this.lockOverlayDelayId);
    this.lockOverlayDelayId = setTimeout(this.removeOverlay, this.ctl.config.settings.overlay.delay, this.signal);
  }

  protected onDestroy(): void {
    this.btnComponent?.destroy();
  }
}
