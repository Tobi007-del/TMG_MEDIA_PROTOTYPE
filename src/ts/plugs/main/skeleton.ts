import { BasePlug } from "..";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../../types/contract";
import { assignEl, capitalize, IS_MOBILE } from "../../utils";
import { IconRegistry } from "../../core/registry";

export type Skeleton = undefined;

export class SkeletonPlug extends BasePlug<Skeleton> {
  public static readonly plugName: string = "skeleton";
  public static readonly isCore: boolean = true;

  public override mount(): void {
    // Properties Assignment
    assignEl(this.media.container, { role: "region", ariaLabel: `${capitalize(this.media.type)} Player`, className: `tmg-${this.media.type}-container tmg-media-container${IS_MOBILE ? " tmg-media-mobile" : ""}${this.media.state.paused ? " tmg-media-paused" : ""}` }, { trackKind: "captions", volumeLevel: "muted", brightnessLevel: "dark", objectFit: this.ctlr.settings.css.objectFit || "contain" });
    assignEl(this.media.pseudoContainer, { role: "status", className: `tmg-pseudo-${this.media.type}-container tmg-pseudo-media-container tmg-host-container` });
    assignEl(this.media.pseudoElement, { ariaHidden: "true", className: `tmg-pseudo-${this.media.type} tmg-pseudo-media tmg-host`, muted: true, autoplay: false });
    // DOM Injection
    this.media.pseudoContainer.appendChild(this.media.pseudoElement);
    this.media.element.parentElement?.insertBefore(this.media.container, this.media.element);
    this.injectInterface();
    this.ctlr.DOM.containerContent?.prepend(this.media.element);
  }

  public override wire(): void {
    // Ctlr Media Listeners
    this.media.on("state.paused", this.handlePausedState, { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", () => this.media.container.classList.remove("tmg-media-replay"), { signal: this.signal, immediate: true });
    this.media.on("status.ended", ({ value }) => this.media.container.classList.toggle("tmg-media-replay", value), { signal: this.signal, immediate: true });
    this.media.on("status.waiting", ({ value }) => this.media.container.classList.toggle("tmg-media-buffering", value), { signal: this.signal, immediate: true });
    this.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
  }

  protected injectInterface(): void {
    this.media.container.insertAdjacentHTML(
      "beforeend",
      `<div class="tmg-media-container-content-wrapper">
        <div class="tmg-media-container-content">
          <div class="tmg-media-controls-container">
            <div class="tmg-media-curtain tmg-media-top-curtain"></div>
            <div class="tmg-media-curtain tmg-media-bottom-curtain"></div>
            <div class="tmg-media-curtain tmg-media-cover-curtain"></div>
          </div>
        </div>
        <div class="tmg-media-settings" inert>
          <div class="tmg-media-settings-content">
            <div class="tmg-media-settings-top-panel">
              <button type="button" class="tmg-media-settings-close-btn">${IconRegistry.get("returnback")}<span>Close Settings</span></button>
            </div>
            <div class="tmg-media-settings-bottom-panel">No Settings Available Yet!</div>
          </div>
        </div>
      </div>`
    );
    this.ctlr.DOM.containerContentWrapper = this.ctlr.queryDOM(".tmg-media-container-content-wrapper");
    this.ctlr.DOM.containerContent = this.ctlr.queryDOM(".tmg-media-container-content");
    this.ctlr.DOM.controlsContainer = this.ctlr.queryDOM(".tmg-media-controls-container");
    this.ctlr.DOM.settingsContent = this.ctlr.queryDOM(".tmg-media-settings-content");
    this.ctlr.DOM.settingsTopPanel = this.ctlr.queryDOM(".tmg-media-settings-top-panel");
    this.ctlr.DOM.settingsBottomPanel = this.ctlr.queryDOM(".tmg-media-settings-bottom-panel");
  }

  protected handlePausedState({ value }: REvent<CtlrMedia, "state.paused">): void {
    if (!value) for (const media of document.querySelectorAll<HTMLMediaElement>("video, audio")) media !== this.media.element && !media.paused && media.pause();
    this.media.container.classList.toggle("tmg-media-paused", value);
  }

  protected handleLoadedMetadataStatus({ value }: REvent<CtlrMedia, "status.loadedMetadata">): void {
    if (!value) return;
    this.media.pseudoElement.src = this.media.element.currentSrc;
    this.media.pseudoElement.crossOrigin = this.media.element.crossOrigin;
  }

  public activatePseudoMode(): void {
    (this.media.pseudoElement.id = this.media.element.id), (this.media.element.id = "");
    this.media.pseudoElement.className += " " + this.media.element.className.replace(/tmg-media|tmg-media|tmg-audio|tmg-host/g, "");
    this.media.pseudoContainer.className += " " + this.media.container.className.replace(/tmg-media-container|tmg-media-container|tmg-audio-container|tmg-host-container/g, "");
    this.media.container.parentElement?.insertBefore(this.media.pseudoContainer, this.media.container);
    document.body.append(this.media.container);
  }

  public deactivatePseudoMode(destroy?: boolean): void {
    (this.media.element.id = this.media.pseudoElement.id), (this.media.pseudoElement.id = "");
    this.media.pseudoElement.className = `tmg-pseudo-${this.media.type} tmg-media tmg-host`;
    this.media.pseudoContainer.className = `tmg-pseudo-${this.media.type}-container tmg-media-container tmg-host-container`;
    this.media.pseudoContainer.parentElement?.replaceChild(destroy ? this.media.element : this.media.container, this.media.pseudoContainer);
  }

  protected override onDestroy(): void {
    this.media.element.parentElement?.replaceChild(this.media.element, this.media.container);
  }
}
