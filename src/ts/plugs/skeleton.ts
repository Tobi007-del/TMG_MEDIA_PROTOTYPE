import { BasePlug } from ".";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../types/contract";
import { assignEl, IS_MOBILE } from "../utils";
import { IconRegistry } from "../core/registry";

export type Skeleton = undefined;

export class SkeletonPlug extends BasePlug<Skeleton> {
  public static readonly plugName: string = "skeleton";
  public static readonly isCore: boolean = true;

  public override mount(): void {
    // Properties Assignment
    assignEl(this.ctlr.videoContainer, { role: "region", ariaLabel: "Video Player", className: `tmg-video-container tmg-media-container${IS_MOBILE ? " tmg-video-mobile" : ""}${this.media.state.paused ? " tmg-video-paused" : ""}` }, { trackKind: "captions", volumeLevel: "muted", brightnessLevel: "dark", objectFit: this.ctlr.settings.css.objectFit || "contain" });
    assignEl(this.ctlr.pseudoVideoContainer, { role: "status", className: "tmg-pseudo-video-container tmg-media-container" });
    assignEl(this.ctlr.pseudoVideo, { ariaHidden: "true", className: "tmg-pseudo-video tmg-media", muted: true, autoplay: false });
    // DOM Injection
    this.ctlr.pseudoVideoContainer.appendChild(this.ctlr.pseudoVideo);
    this.media.element.parentElement?.insertBefore(this.ctlr.videoContainer, this.media.element);
    this.injectInterface();
    this.ctlr.DOM.containerContent?.prepend(this.media.element);
  }

  public override wire(): void {
    // Ctlr Media Listeners
    this.media.on("state.paused", this.handlePausedState, { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", () => this.ctlr.videoContainer.classList.remove("tmg-video-replay"), { signal: this.signal, immediate: true });
    this.media.on("status.ended", ({ value }) => this.ctlr.videoContainer.classList.toggle("tmg-video-replay", value), { signal: this.signal, immediate: true });
    this.media.on("status.waiting", ({ value }) => this.ctlr.videoContainer.classList.toggle("tmg-video-buffering", value), { signal: this.signal, immediate: true });
    this.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
  }

  protected injectInterface(): void {
    this.ctlr.videoContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="tmg-video-container-content-wrapper">
        <div class="tmg-video-container-content">
          <div class="tmg-video-controls-container">
            <div class="tmg-video-curtain tmg-video-top-curtain"></div>
            <div class="tmg-video-curtain tmg-video-bottom-curtain"></div>
            <div class="tmg-video-curtain tmg-video-cover-curtain"></div>
          </div>
        </div>
        <div class="tmg-video-settings" inert>
          <div class="tmg-video-settings-content">
            <div class="tmg-video-settings-top-panel">
              <button type="button" class="tmg-video-settings-close-btn">${IconRegistry.get("return")}<span>Close Settings</span></button>
            </div>
            <div class="tmg-video-settings-bottom-panel">No Settings Available Yet!</div>
          </div>
        </div>
      </div>
    `
    );
    this.ctlr.DOM.containerContentWrapper = this.ctlr.queryDOM(".tmg-video-container-content-wrapper");
    this.ctlr.DOM.containerContent = this.ctlr.queryDOM(".tmg-video-container-content");
    this.ctlr.DOM.controlsContainer = this.ctlr.queryDOM(".tmg-video-controls-container");
    this.ctlr.DOM.settingsContent = this.ctlr.queryDOM(".tmg-video-settings-content");
    this.ctlr.DOM.settingsTopPanel = this.ctlr.queryDOM(".tmg-video-settings-top-panel");
    this.ctlr.DOM.settingsBottomPanel = this.ctlr.queryDOM(".tmg-video-settings-bottom-panel");
  }

  protected handlePausedState({ value }: REvent<CtlrMedia, "state.paused">): void {
    if (!value) for (const media of document.querySelectorAll<HTMLMediaElement>("video, audio")) media !== this.media.element && !media.paused && media.pause();
    this.ctlr.videoContainer.classList.toggle("tmg-video-paused", value);
  }

  protected handleLoadedMetadataStatus({ value }: REvent<CtlrMedia, "status.loadedMetadata">): void {
    if (!value) return;
    this.ctlr.pseudoVideo.src = this.media.element.currentSrc;
    this.ctlr.pseudoVideo.crossOrigin = this.media.element.crossOrigin;
  }

  public activatePseudoMode(): void {
    (this.ctlr.pseudoVideo.id = this.media.element.id), (this.media.element.id = "");
    this.ctlr.pseudoVideo.className += " " + this.media.element.className.replace(/tmg-media|tmg-video/g, "");
    this.ctlr.pseudoVideoContainer.className += " " + this.ctlr.videoContainer.className.replace(/tmg-media-container|tmg-pseudo-video-container/g, "");
    this.ctlr.videoContainer.parentElement?.insertBefore(this.ctlr.pseudoVideoContainer, this.ctlr.videoContainer);
    document.body.append(this.ctlr.videoContainer);
  }

  public deactivatePseudoMode(destroy?: boolean): void {
    (this.media.element.id = this.ctlr.pseudoVideo.id), (this.ctlr.pseudoVideo.id = "");
    this.ctlr.pseudoVideo.className = "tmg-pseudo-video tmg-media";
    this.ctlr.pseudoVideoContainer.className = "tmg-pseudo-video-container tmg-media-container";
    this.ctlr.pseudoVideoContainer.parentElement?.replaceChild(destroy ? this.media.element : this.ctlr.videoContainer, this.ctlr.pseudoVideoContainer);
  }

  protected override onDestroy() {
    this.media.element.parentElement?.replaceChild(this.media.element, this.ctlr.videoContainer);
  }
}
