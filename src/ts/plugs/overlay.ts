import { Controller } from "../core/controller";
import { BasePlug } from ".";
import type { VideoBuild } from "../types/build";
import type { Event } from "../types/reactor";
import { type Reactive } from "../tools/mixins";
import { setTimeout, IS_MOBILE } from "../utils";

export interface Overlay {
  delay: number;
  curtain: "cover" | "auto";
  behavior: "persistent" | "auto" | "strict" | "hidden";
}

interface OverlayState {
  visible: boolean;
}

export class OverlayPlug extends BasePlug<Overlay, OverlayState> {
  public static readonly plugName: string = "overlay";
  public overlayDelayId = -1;

  constructor(ctlr: Controller, config: Overlay) {
    super(ctlr, config, { visible: false });
  }

  public wire(): void {
    this.ctlr.media.on("state.paused", ({ target: { value } }) => (value ? this.show() : this.delay()), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.overlay.curtain", this.handleCurtain, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.overlay.behavior", this.handleBehavior, { signal: this.signal, immediate: true });
  }

  protected handleCurtain({ target: { value } }: Event<VideoBuild, "settings.overlay.curtain">): void {
    this.ctlr.videoContainer.dataset.curtain = value;
  }

  protected handleBehavior({ target: { value } }: Event<VideoBuild, "settings.overlay.behavior">): void {
    value === "persistent" && this.show();
    value === "hidden" && this.remove("force");
  }

  public shouldShow(): boolean {
    return this.config.behavior !== "hidden" && !this.ctlr.config.settings.locked && !this.ctlr.isUIActive("playerDragging");
  }

  public shouldRemove(manner?: "force"): boolean {
    return this.config.behavior !== "persistent" && (manner === "force" || (!this.ctlr.isUIActive("pictureInPicture") && !this.ctlr.isUIActive("settings") && (IS_MOBILE ? !this.ctlr.media.status.waiting && !this.ctlr.media.state.paused : this.config.behavior === "strict" ? true : !this.ctlr.media.state.paused)));
  }

  public show(): void {
    if (!this.shouldShow()) return;
    this.ctlr.videoContainer.classList.add("tmg-video-overlay");
    this.state.visible = true;
    this.delay();
  }

  public delay(): void {
    clearTimeout(this.overlayDelayId);
    if (this.shouldRemove()) this.overlayDelayId = setTimeout(this.remove, this.config.delay, this.signal);
  }

  public remove(manner?: "force"): void {
    if (this.shouldRemove(manner)) {
      this.ctlr.videoContainer.classList.remove("tmg-video-overlay");
      this.state.visible = false;
    }
  }
}
