import { BasePin, GesturePlug, OverlayPlug, ControlPanelPlug, GestureGeneral } from "../..";
import { setTimeout, addSafeClicks, IS_MOBILE } from "../../../utils";
import { Timeline } from "../../../components";
import type { TimePlug } from "../time";

export class GestureGeneralPin extends BasePin<GesturePlug, GestureGeneral> {
  public static readonly pinName: string = "general";
  public static readonly plugName: string = "gesture";
  protected focusSubjectId = "";
  protected skipPersistPosition: "left" | "right" | null = null;

  public override wire(): void {
    // Event Listeners
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
    this.ctlr.plug<OverlayPlug>("overlay")?.delay();
    this.ctlr.plug<ControlPanelPlug>("controlPanel")?.getCtrl<Timeline>("timeline")?.stopScrubbing();
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
      overlay = this.ctlr.plug<OverlayPlug>("overlay");
    (!pointerType || !IS_MOBILE) && overlay?.show();
    pointerType && (target as HTMLElement).closest(".tmg-media-side-controls-wrapper") && clearTimeout(overlay?.overlayDelayId ?? -1);
  }

  protected handleHoverPointerOut(): void {
    setTimeout(() => !IS_MOBILE && !this.media.container.matches(":hover") && this.ctlr.plug<OverlayPlug>("overlay")?.remove());
  }

  protected handleClick(e: MouseEvent): void {
    if (e.target === this.ctlr.DOM.controlsContainer && this.config.click) this.media.intent[this.config.click] = !this.media.state[this.config.click] as never;
  }

  protected handleDblClick(e: MouseEvent): void {
    const { clientX: x, target, detail } = e;
    if (target !== this.ctlr.DOM.controlsContainer) return;
    const rect = this.media.container.getBoundingClientRect(),
      pos = x - rect.left > rect.width * 0.65 ? "right" : x - rect.left < rect.width * 0.35 ? "left" : "center";
    if (this.state.skipPersist && pos !== this.skipPersistPosition) {
      this.deactivateSkipPersist();
      if (detail === 1) return;
    }
    if (pos === "center" && this.config.dblClick) return void (this.media.intent[this.config.dblClick] = !this.media.state[this.config.dblClick] as never);
    if (this.state.skipPersist && detail === 2) return;
    if (!this.state.skipPersist) this.activateSkipPersist(pos as "left" | "right");
    this.ctlr.plug<TimePlug>("time")?.skip(pos === "right" ? this.ctlr.settings.time.skip : -this.ctlr.settings.time.skip);
  }

  public activateSkipPersist(pos: "left" | "right"): void {
    this.state.skipPersist = true;
    this.skipPersistPosition = pos;
    this.media.container.addEventListener("click", this.handleDblClick, { signal: this.signal });
    setTimeout(() => this.deactivateSkipPersist(), 2000);
  }

  public deactivateSkipPersist(): void {
    this.state.skipPersist = false;
    this.skipPersistPosition = null;
    this.media.container.removeEventListener("click", this.handleDblClick);
  }
}
