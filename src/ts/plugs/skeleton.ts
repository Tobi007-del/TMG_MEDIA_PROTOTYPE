import { BasePlug } from ".";
import type { Event } from "../types/reactor";
import type { CMedia } from "../types/contract";
import { assignEl, IS_MOBILE } from "../utils";

export type Skeleton = undefined;

export class SkeletonPlug extends BasePlug<Skeleton> {
  public static readonly plugName: string = "skeleton";
  public static readonly isCore: boolean = true;

  public mount(): void {
    this.setupContainers();
    this.injectInterface();
  }

  public wire(): void {
    this.ctlr.media.on("state.paused", this.handlePausedChange, { signal: this.signal, immediate: true });
    this.ctlr.media.on("status.ended", ({ target: { value } }) => this.ctlr.videoContainer.classList.toggle("tmg-video-replay", value), { signal: this.signal, immediate: true });
    this.ctlr.media.on("status.waiting", ({ target: { value } }) => this.ctlr.videoContainer.classList.toggle("tmg-video-buffering", value), { signal: this.signal, immediate: true });
    this.ctlr.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
  }

  protected setupContainers(): void {
    assignEl(
      this.ctlr.videoContainer,
      {
        role: "region",
        ariaLabel: "Video Player",
        className: `tmg-video-container tmg-media-container${IS_MOBILE ? " tmg-video-mobile" : ""}${this.ctlr.media.state.paused ? " tmg-video-paused" : ""}`,
      },
      {
        trackKind: "captions",
        volumeLevel: "muted",
        brightnessLevel: "dark",
        objectFit: this.ctlr.config.settings.css.objectFit || "contain", // object fit plug'll handle it
      }
    );
    this.ctlr.media.element.parentElement?.insertBefore(this.ctlr.videoContainer, this.ctlr.media.element);
    assignEl(this.ctlr.pseudoVideoContainer, {
      role: "status",
      className: "tmg-pseudo-video-container tmg-media-container",
    });
    assignEl(this.ctlr.pseudoVideo, {
      ariaHidden: "true",
      className: "tmg-pseudo-video tmg-media",
      muted: true,
      autoplay: false,
    });
    this.ctlr.pseudoVideoContainer.appendChild(this.ctlr.pseudoVideo);
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
              <button type="button" class="tmg-video-settings-close-btn">
                <svg viewBox="0 0 25 25" class="tmg-video-settings-close-btn-icon">
                  <path transform="translate(0, 4)" d="M1.307,5.988 L6.616,1.343 C7.027,0.933 7.507,0.864 7.918,1.275 L7.918,4.407 C8.014,4.406 8.098,4.406 8.147,4.406 C13.163,4.406 16.885,7.969 16.885,12.816 C16.885,14.504 16.111,13.889 15.788,13.3 C14.266,10.52 11.591,8.623 8.107,8.623 C8.066,8.623 7.996,8.624 7.917,8.624 L7.917,11.689 C7.506,12.099 6.976,12.05 6.615,11.757 L1.306,7.474 C0.897,7.064 0.897,6.399 1.307,5.988 L1.307,5.988 Z"></path>
                </svg>
                <span>Close Settings</span>
              </button>
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
    this.ctlr.DOM.containerContent?.prepend(this.ctlr.media.element);
  }

  protected handlePausedChange({ target: { value } }: Event<CMedia, "state.paused">): void {
    if (!value) for (const media of document.querySelectorAll<HTMLMediaElement>("video, audio")) media !== this.ctlr.media.element && !media.paused && media.pause();
    this.ctlr.videoContainer.classList.toggle("tmg-video-paused", value);
  }

  protected handleLoadedMetadataStatus({ target: { value } }: Event<CMedia, "status.loadedMetadata">): void {
    if (!value) return;
    this.ctlr.pseudoVideo.src = this.ctlr.media.element.currentSrc;
    this.ctlr.pseudoVideo.crossOrigin = this.ctlr.media.element.crossOrigin;
  }

  public activatePseudoMode(): void {
    const pv = this.ctlr.pseudoVideo,
      v = this.ctlr.media.element,
      pvc = this.ctlr.pseudoVideoContainer,
      vc = this.ctlr.videoContainer;
    ((pv.id = v.id), (v.id = ""));
    pv.className += " " + v.className.replace(/tmg-media|tmg-video/g, "");
    pvc.className += " " + vc.className.replace(/tmg-media-container|tmg-pseudo-video-container/g, "");
    vc.parentElement?.insertBefore(pvc, vc);
    document.body.append(vc);
  }

  public deactivatePseudoMode(destroy?: boolean): void {
    const pv = this.ctlr.pseudoVideo,
      v = this.ctlr.media.element,
      pvc = this.ctlr.pseudoVideoContainer,
      vc = this.ctlr.videoContainer;
    ((v.id = pv.id), (pv.id = ""));
    pv.className = "tmg-pseudo-video tmg-media";
    pvc.className = "tmg-pseudo-video-container tmg-media-container";
    pvc.parentElement?.replaceChild(destroy ? v : vc, pvc);
  }

  protected onDestroy() {
    this.ctlr.media.element.parentElement?.replaceChild(this.ctlr.media.element, this.ctlr.videoContainer);
  }
}
