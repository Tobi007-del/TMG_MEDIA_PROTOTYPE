import { BasePlug } from "./base-plug";
import { createEl } from "../utils";

export class SkeletonPlug extends BasePlug {
  static plugName = "skeleton";
  static isCore = true;

  protected onSetup() {
    this.buildContainers();
  }

  private buildContainers() {
    this.ctl.videoContainer = createEl("div", {
      role: "region",
      ariaLabel: "Video Player",
      className: `tmg-video-container tmg-media-container`,
    });
    this.ctl.media.element.parentElement?.insertBefore(this.ctl.videoContainer, this.ctl.media.element);
    this.ctl.pseudoVideoContainer = createEl("div", {
      role: "status",
      className: "tmg-pseudo-video-container tmg-media-container",
    });
    this.ctl.pseudoVideo = createEl("video", {
      ariaHidden: "true",
      className: "tmg-pseudo-video tmg-media",
      muted: true,
      autoplay: false,
    });
    this.ctl.pseudoVideoContainer.appendChild(this.ctl.pseudoVideo);
  }

  protected onDispose() {
    if (this.ctl.videoContainer) this.ctl.videoContainer.remove();
  }
}
