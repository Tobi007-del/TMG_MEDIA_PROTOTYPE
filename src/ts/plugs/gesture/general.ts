import { setTimeout, addSafeClicks } from "../../utils";
import { OverlayPlug, ControlPanelPlug, BaseModule } from "../";
import { Timeline } from "../../components";
import type { TimePlug } from "../time";

export interface GeneralConfig {
  click: string;
  dblClick: string;
}

export class GeneralModule extends BaseModule<GeneralConfig> {
  public static readonly moduleName: string = "general gesture";
  protected focusSubjectId = "";
  protected skipPersistPosition: "left" | "right" | null = null;

  public wire(): void {
    addSafeClicks(this.ctlr.DOM.controlsContainer, this.handleClick, this.handleDblClick, { capture: true, signal: this.signal });
    [this.ctlr.DOM.controlsContainer, this.ctlr.DOM.bottomControlsWrapper].forEach((el) => {
      el?.addEventListener("click", this.handleAnyClick, { capture: true, signal: this.signal });
      el?.addEventListener("contextmenu", this.handleRightClick, { signal: this.signal });
      el?.addEventListener("focusin", this.handleFocusIn, { capture: true, signal: this.signal });
      el?.addEventListener("keydown", this.handleKeyFocusIn, { capture: true, signal: this.signal });
      ["pointermove", "dragenter", "scroll"].forEach((evt) => el?.addEventListener(evt, this.handleHoverPointerActive, { capture: true, signal: this.signal }));
      el?.addEventListener("mouseleave", this.handleHoverPointerOut, { capture: true, signal: this.signal });
    });
  }

  protected handleAnyClick(): void {
    this.ctlr.getPlug<OverlayPlug>("overlay")?.delay();
    this.ctlr.getPlug<ControlPanelPlug>("controlPanel")?.getControl<Timeline>("timeline")?.stopScrubbing();
  }

  protected handleRightClick(e: MouseEvent): void {
    e.preventDefault();
  }

  protected handleFocusIn({ target }: FocusEvent): void {
    const t = target as HTMLElement;
    this.focusSubjectId = String(!t.matches(":focus-visible") && (t?.dataset?.controlId ?? t?.parentElement?.dataset?.controlId));
  }

  protected handleKeyFocusIn({ target }: KeyboardEvent): void {
    const t = target as HTMLElement;
    if ((t?.dataset?.controlId ?? t?.parentElement?.dataset?.controlId) === this.focusSubjectId) t.blur();
  }

  protected handleHoverPointerActive(e: Event): void {
    const { target, pointerType } = e as PointerEvent,
      overlay = this.ctlr.getPlug<OverlayPlug>("overlay");
    (!pointerType || !this.ctlr.state.isMobile) && overlay?.show();
    pointerType && (target as HTMLElement).closest(".tmg-video-side-controls-wrapper") && clearTimeout(overlay?.overlayDelayId ?? -1);
  }

  protected handleHoverPointerOut(): void {
    const overlay = this.ctlr.getPlug<OverlayPlug>("overlay");
    setTimeout(() => !this.ctlr.state.isMobile && !this.ctlr.videoContainer.matches(":hover") && overlay?.remove());
  }

  protected handleClick(e: MouseEvent): void {
    const { target } = e;
    if (target !== this.ctlr.DOM.controlsContainer) return;
    const onClick = this.config.click;
    // if (onClick === "togglePlay")
    this.ctlr.media.intent.paused = !this.ctlr.media.state.paused;
    // else if (onClick === "fullscreen")
    //   this.ctlr.getPlug<Mode>("mode")?.toggleFullscreen();
    // else if (onClick === "pictureInPicture")
    //   this.ctlr.getPlug<Mode>("mode")?.togglePictureInPicture();
  }

  protected handleDblClick(e: MouseEvent): void {
    const { clientX: x, target, detail } = e;
    if (target !== this.ctlr.DOM.controlsContainer) return;
    const rect = this.ctlr.videoContainer.getBoundingClientRect(),
      pos = x - rect.left > rect.width * 0.65 ? "right" : x - rect.left < rect.width * 0.35 ? "left" : "center";
    if (this.state.skipPersist && pos !== this.skipPersistPosition) {
      this.deactivateSkipPersist();
      if (detail === 1) return;
    }
    if (pos === "center") {
      const onDblClick = this.config.dblClick;
      // if (onDblClick === "togglePlay")
      this.ctlr.media.intent.paused = !this.ctlr.media.state.paused;
      //  else if (onDblClick === "fullscreen")
      //   this.ctlr.getPlug<Mode>("mode")?.toggleFullscreen();
      //  else if (onDblClick === "pictureInPicture")
      //   this.ctlr.getPlug<Mode>("mode")?.togglePictureInPicture();
      return;
    }
    if (this.state.skipPersist && detail === 2) return;
    if (!this.state.skipPersist) this.activateSkipPersist(pos as "left" | "right");
    this.ctlr.getPlug<TimePlug>("time")?.skip(pos === "right" ? this.ctlr.config.settings.time.skip : -this.ctlr.config.settings.time.skip);
  }

  public activateSkipPersist(pos: "left" | "right"): void {
    this.state.skipPersist = true;
    this.skipPersistPosition = pos;
    this.ctlr.videoContainer.addEventListener("click", this.handleDblClick, { signal: this.signal });
    setTimeout(() => this.deactivateSkipPersist(), 2000);
  }

  public deactivateSkipPersist(): void {
    this.state.skipPersist = false;
    this.skipPersistPosition = null;
    this.ctlr.videoContainer.removeEventListener("click", this.handleDblClick);
  }
}
