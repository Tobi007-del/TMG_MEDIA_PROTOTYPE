import { BasePin, ModesMiniplayer, ModesPlug, OverlayPlug, SkeletonPlug } from "../..";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../../../types/contract";
import type { CtlrConfig } from "../../../types/config";
import { clamp, inDocView, inBoolArrOpt, setTimeout } from "../../../utils";
import { isInteractive } from "@t007/utils";

export class ModesMiniplayerPin extends BasePin<ModesPlug, ModesMiniplayer> {
  public static readonly pinName: string = "miniplayer";
  public static readonly plugName: string = "modes";
  protected lastMiniplayerPosX = 0;
  protected lastMiniplayerPosY = 0;
  protected lastMiniplayerPtrX = 0;
  protected lastMiniplayerPtrY = 0;
  protected nextMiniplayerX = "";
  protected nextMiniplayerY = "";
  protected wildMiniplayerX = "";
  protected wildMiniplayerY = "";

  public override wire(): void {
    // Ctlr State Watchers
    this.ctlr.state.watch("dimensions.window.width", this.handleWindowWidth, { signal: this.signal });
    // ---- Media  Listeners
    this.media.on("intent.miniplayer", this.handleMiniplayerIntent, { capture: true, signal: this.signal });
    this.media.on("state.paused", this.handlePausedState, { signal: this.signal, immediate: true });
    // ---- State --------
    this.ctlr.state.on("mediaParentIntersecting", this.handleMediaParentIntersecting, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.modes.miniplayer.disabled", this.handleDisabled, { signal: this.signal, immediate: true });
  }

  protected handleWindowWidth(width: number): void {
    if (!this.ctlr.isUIActive("fullscreen")) this.media.intent.miniplayer = "auto";
  }

  protected handleMediaParentIntersecting(): void {
    if (this.ctlr.state.readyState > 2) this.media.intent.miniplayer = "auto";
  }

  protected handleDisabled({ value }: REvent<CtlrConfig, "settings.modes.miniplayer.disabled">): void {
    this.media.tech.features.miniplayer = !value;
    if (value) this.media.intent.miniplayer = false;
  }

  protected handlePausedState({ value }: REvent<CtlrMedia, "state.paused">): void {
    if (!value) this.media.intent.miniplayer = "auto";
  }

  protected handleMiniplayerIntent(e: REvent<CtlrMedia, "intent.miniplayer">): void {
    if (e.resolved) return;
    const active = this.ctlr.isUIActive("miniplayer");
    if (this.config.disabled && !active) return e.resolve(this.name);
    const modes = this.ctlr.plug<ModesPlug>("modes");
    if ((e.value === true && !active) || (!active && !this.ctlr.isUIActive("pictureInPicture") && !modes?.pip.inFloatingPlayer && !modes?.fullscreen.inFullscreen && !this.ctlr.state.mediaParentIntersecting && window.innerWidth >= this.config.minWindowWidth && !this.media.state.paused)) this.enter();
    else if ((e.value === false && active) || (active && this.ctlr.state.mediaParentIntersecting) || (active && window.innerWidth < this.config.minWindowWidth)) this.exit();
    e.resolve(this.name); // btw this is a smart behavioral implementation rather than just a toggler
  }

  protected enter(): void {
    this.ctlr.plug<SkeletonPlug>("skeleton")?.activatePseudoMode();
    this.media.container.classList.add("tmg-media-miniplayer", "tmg-media-progress-bar");
    ["mousedown", "touchstart"].forEach((type) => this.media.container.addEventListener(type, this.handleDragStart, { signal: this.signal }));
    this.media.state.miniplayer = true;
  }

  protected exit(behavior?: ScrollBehavior): void {
    if (behavior && inDocView(this.media.pseudoContainer)) this.media.pseudoContainer.scrollIntoView({ behavior, block: "center", inline: "center" });
    this.ctlr.plug<SkeletonPlug>("skeleton")?.deactivatePseudoMode();
    this.media.container.classList.remove("tmg-media-miniplayer");
    this.media.container.classList.toggle("tmg-media-progress-bar", this.ctlr.settings.controlPanel.progressBar);
    ["mousedown", "touchstart"].forEach((type) => this.media.container.removeEventListener(type, this.handleDragStart));
    this.media.state.miniplayer = false;
  }

  public expand(): void {
    this.media.container.classList.contains("tmg-media-miniplayer") && this.exit("smooth");
  }
  public remove(): void {
    (this.media.intent.paused = true), this.exit();
  }

  protected handleDragStart(e: globalThis.Event): void {
    const target = e.target as HTMLElement,
      clientX = (e as MouseEvent).clientX ?? (e as TouchEvent).targetTouches?.[0]?.clientX ?? 0,
      clientY = (e as MouseEvent).clientY ?? (e as TouchEvent).targetTouches?.[0]?.clientY ?? 0;
    if (!this.ctlr.isUIActive("miniplayer") || target.scrollWidth > target.clientWidth || isInteractive(target) || [this.ctlr.DOM.topControlsWrapper, this.ctlr.DOM.bottomControlsWrapper, this.ctlr.DOM.captionsContainer].some((w) => w?.contains(target)) || target.closest("[class$='toast-container']")) return;
    const { left, bottom } = getComputedStyle(this.media.container);
    (this.lastMiniplayerPosX = parseFloat(left)), (this.lastMiniplayerPosY = parseFloat(bottom));
    (this.lastMiniplayerPtrX = clientX), (this.lastMiniplayerPtrY = clientY);
    (this.nextMiniplayerX = this.ctlr.settings.css.currentMiniplayerX as string), (this.nextMiniplayerY = this.ctlr.settings.css.currentMiniplayerY as string);
    (this.wildMiniplayerX = this.nextMiniplayerX), (this.wildMiniplayerY = this.nextMiniplayerY);
    document.addEventListener("mousemove", this.handleDragging, { signal: this.signal });
    document.addEventListener("touchmove", this.handleDragging, { passive: false, signal: this.signal });
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => document.addEventListener(type, this.handleDragEnd, { signal: this.signal }));
    this.media.container.style.setProperty("transition", "none", "important");
  }

  protected handleDragging(e: globalThis.Event): void {
    if ((e as TouchEvent).touches?.length > 1) return;
    e.preventDefault();
    this.ctlr.plug<OverlayPlug>("overlay")?.remove("force");
    this.media.container.classList.add("tmg-media-player-dragging");
    this.ctlr.RAFLoop("miniplayerDragging", () => {
      const { innerWidth: ww, innerHeight: wh } = window,
        { offsetWidth: w, offsetHeight: h } = this.media.container,
        x = (e as MouseEvent).clientX ?? (e as TouchEvent).changedTouches?.[0]?.clientX ?? 0,
        y = (e as MouseEvent).clientY ?? (e as TouchEvent).changedTouches?.[0]?.clientY ?? 0,
        newX = this.lastMiniplayerPosX + (x - this.lastMiniplayerPtrX),
        newY = this.lastMiniplayerPosY - (y - this.lastMiniplayerPtrY),
        posX = clamp(w / 2, newX, ww - w / 2),
        posY = clamp(h / 2, newY, wh - h / 2);
      this.media.container.style.setProperty("transform", `translate(${x - this.lastMiniplayerPtrX}px, ${y - this.lastMiniplayerPtrY}px)`, "important");
      (this.nextMiniplayerX = `${(posX / ww) * 100}%`), (this.nextMiniplayerY = `${(posY / wh) * 100}%`);
      (this.wildMiniplayerX = `${(newX / ww) * 100}%`), (this.wildMiniplayerY = `${(newY / wh) * 100}%`);
    });
  }

  protected handleDragEnd(): void {
    this.ctlr.cancelRAFLoop("miniplayerDragging");
    this.media.container.classList.remove("tmg-media-player-dragging");
    this.media.container.style.setProperty("left", this.wildMiniplayerX, "important");
    this.media.container.style.setProperty("bottom", this.wildMiniplayerY, "important");
    this.media.container.style.removeProperty("transform");
    setTimeout(() => ((this.ctlr.settings.css.currentMiniplayerX = this.nextMiniplayerX), (this.ctlr.settings.css.currentMiniplayerY = this.nextMiniplayerY), ["transition", "left", "bottom"].forEach((prop) => this.media.container.style.removeProperty(prop))), 0, this.signal);
    document.removeEventListener("mousemove", this.handleDragging);
    document.removeEventListener("touchmove", this.handleDragging);
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => document.removeEventListener(type, this.handleDragEnd));
  }

  protected override onDestroy(): void {
    document.removeEventListener("mousemove", this.handleDragging);
    document.removeEventListener("touchmove", this.handleDragging);
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => document.removeEventListener(type, this.handleDragEnd));
    ["mousedown", "touchstart"].forEach((type) => this.media.container.removeEventListener(type, this.handleDragStart));
  }
}
