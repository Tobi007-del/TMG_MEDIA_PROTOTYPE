import { Controller } from "../core/controller";
import { BasePlug } from ".";
import type { VideoBuild } from "../types/build";
import type { Event } from "../types/reactor";
import { type Reactive } from "../tools/mixins";
import { setTimeout, IS_MOBILE } from "../utils";

export interface Overlay {
  delay: number;
  behavior: "persistent" | "auto" | "strict" | "hidden";
}

interface OverlayState {
  visible: boolean;
}

export class OverlayPlug extends BasePlug<Overlay, OverlayState> {
  public static readonly plugName: string = "overlay";
  public overlayDelayId = -1;

  constructor(ctl: Controller, config: Overlay) {
    super(ctl, config, { visible: false });
  }

  public wire(): void {
    this.ctl.config.on("settings.overlay.behavior", this.handleBehavior, { signal: this.signal, immediate: true });
  }

  protected handleBehavior({ target: { value } }: Event<VideoBuild, "settings.overlay.behavior">): void {
    value === "persistent" && this.show();
    value === "hidden" && this.remove("force");
  }

  public shouldShow(): boolean {
    return this.config.behavior !== "hidden" && !this.ctl.config.settings.locked && !this.ctl.isUIActive("playerDragging");
  }

  public shouldRemove(manner?: "force"): boolean {
    return this.config.behavior !== "persistent" && (manner === "force" || (!this.ctl.isUIActive("pictureInPicture") && !this.ctl.isUIActive("settings") && (IS_MOBILE ? !this.ctl.media.status.waiting && !this.ctl.media.state.paused : this.config.behavior === "strict" ? true : !this.ctl.media.state.paused)));
  }

  public show(): void {
    if (!this.shouldShow()) return;
    this.ctl.videoContainer.classList.add("tmg-video-overlay");
    this.state.visible = true;
    this.delay();
  }

  public delay(): void {
    clearTimeout(this.overlayDelayId);
    if (this.shouldRemove()) this.overlayDelayId = setTimeout(this.remove, this.config.delay, this.signal);
  }

  public remove(manner?: "force"): void {
    if (this.shouldRemove(manner)) {
      this.ctl.videoContainer.classList.remove("tmg-video-overlay");
      this.state.visible = false;
    }
  }
}
