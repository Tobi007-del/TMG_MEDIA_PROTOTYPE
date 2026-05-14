import { BasePin, ModesFullscreen, ModesPlug } from "../..";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../../../types/contract";
import type { CtlrConfig } from "../../../types/config";
import type { OrientationOption } from "../../../types/generics";
import { isBool, IS_MOBILE, enterFullscreen, exitFullscreen, queryFullscreenEl, supportsFullscreen } from "../../../utils";

export class ModesFullscreenPin extends BasePin<ModesPlug, ModesFullscreen> {
  public static readonly pinName: string = "fullscreen";
  public static readonly plugName: string = "modes";
  public inFullscreen = false; // a quick notice flag for external deps

  public override wire(): void {
    // Ctlr State Watchers
    this.ctlr.state.watch("docInFullscreen", this.handleDocInFullscreen, { signal: this.signal });
    this.ctlr.state.watch("screenOrientation", this.handleScreenOrientation, { signal: this.signal });
    // ---- Config Listeners
    this.ctlr.config.on("settings.modes.fullscreen.disabled", this.handleDisabled, { signal: this.signal, immediate: true });
    // ---- Media --------
    this.media.on("intent.fullscreen", this.handleFullscreenIntent, { capture: true, signal: this.signal });
  }

  protected handleDisabled({ value }: REvent<CtlrConfig, "settings.modes.fullscreen.disabled">): void {
    this.media.tech.features.fullscreen = !value && supportsFullscreen();
    if (value && this.ctlr.isUIActive("fullscreen")) this.media.intent.fullscreen = false;
  }

  protected handleFullscreenIntent(e: REvent<CtlrMedia, "intent.fullscreen">): void {
    if (e.resolved) return;
    if (this.config.disabled && !this.inFullscreen) return e.resolve(this.name);
    if (!this.ctlr.isUIActive("fullscreen")) {
      const fW = this.ctlr.plug<ModesPlug>("modes")?.pip?.floatingWindow;
      if (this.ctlr.isUIActive("floatingPlayer")) return fW?.addEventListener("pagehide", this.enter, { signal: this.signal }), fW?.close(), e.resolve(this.name);
      if (this.ctlr.isUIActive("pictureInPicture")) this.media.intent.pictureInPicture = false;
      this.media.intent.miniplayer = false;
      this.enter();
    } else {
      exitFullscreen(this.media.container);
      this.inFullscreen = false;
    }
    e.resolve(this.name);
  }

  protected async enter(): Promise<void> {
    await enterFullscreen(this.media.container);
    this.inFullscreen = true;
  }

  protected async handleDocInFullscreen(docInFs: boolean): Promise<void> {
    const inFs = docInFs && queryFullscreenEl() === this.media.container;
    if (inFs) {
      this.media.container.classList.add("tmg-media-fullscreen");
      this.media.state.fullscreen = true;
    } else if (this.ctlr.isUIActive("fullscreen")) {
      this.media.container.classList.remove("tmg-media-fullscreen");
      this.ctlr.settings.locked.disabled = true;
      this.inFullscreen = false;
      this.media.intent.miniplayer = "auto";
      this.media.state.fullscreen = false;
    }
    // JS: this.ctlr.setControlsState("fullscreenlock"); // components will be isolated
    if (IS_MOBILE) await this.changeScreenOrientation(inFs ? this.config.orientationLock : false);
    // JS: IS_MOBILE && this.ctlr.setControlState(this.ctlr.DOM.fullscreenOrientationBtn, { hidden: false });
  }

  protected handleScreenOrientation(orientation: ScreenOrientation): void {
    if (!this.ctlr.state.mediaParentIntersecting || !IS_MOBILE || this.ctlr.state.readyState < 2 || this.config.onRotate === false || this.ctlr.isUIActive("fullscreen") || this.ctlr.isUIActive("miniplayer")) return;
    const deg = isBool(this.config.onRotate) ? 90 : parseInt(String(this.config.onRotate));
    if (orientation.angle === deg || orientation.angle === 360 - deg) this.media.intent.fullscreen = !this.inFullscreen;
  }

  public async changeScreenOrientation(option: boolean | OrientationOption = true): Promise<void> {
    const orientation = screen.orientation as any;
    if (option === false) return void orientation?.unlock?.();
    await orientation?.lock?.(option === "auto" ? (this.media.status.videoHeight > this.media.status.videoWidth ? "portrait" : "landscape") : option === true ? (orientation.angle === 0 ? "landscape" : "portrait") : (option as OrientationOption));
  }
}
