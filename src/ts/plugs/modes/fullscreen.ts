import { BaseModule } from "../";
import type { Event } from "../../types/reactor";
import type { CtlrMedia } from "../../types/contract";
import type { VideoBuild } from "../../types/build";
import type { OrientationOption } from "../../types/generics";
import type { ModesPlug } from "./";
import { IS_MOBILE, enterFullscreen, exitFullscreen, queryFullscreenEl } from "../../utils";

export type FullscreenModuleConfig = {
  disabled: boolean;
  orientationLock: boolean | OrientationOption;
  onRotate: boolean | number; // 0-portrait, 90-landscape, 180, 270
};

export class FullscreenModule extends BaseModule<FullscreenModuleConfig> {
  public static readonly moduleName = "fullscreen";
  public inFullscreen = false; // a quick notice flag for external deps

  public wire(): void {
    // Ctlr State Watchers
    this.ctlr.state.watch("docInFullscreen", this.handleDocInFullscreen, { signal: this.signal });
    this.ctlr.state.watch("screenOrientation", this.handleScreenOrientation, { signal: this.signal });
    // ---- Config Listeners
    this.ctlr.config.on("settings.modes.fullscreen.disabled", this.handleDisabledConfig, { signal: this.signal });
    // ---- Media --------
    this.ctlr.media.on("intent.fullscreen", this.handleFullscreenIntent, { capture: true, signal: this.signal });
    // Post Wiring
    this.ctlr.media.tech.features.fullscreen = !this.config.disabled;
  }

  protected handleDisabledConfig({ value }: Event<VideoBuild, "settings.modes.fullscreen.disabled">): void {
    this.ctlr.media.tech.features.fullscreen = !value;
    if (value && this.ctlr.isUIActive("fullscreen")) this.ctlr.media.intent.fullscreen = false;
  }

  protected handleFullscreenIntent(e: Event<CtlrMedia, "intent.fullscreen">): void {
    if (e.resolved) return;
    if (this.config.disabled && !this.inFullscreen) return e.resolve(this.name);
    if (!this.ctlr.isUIActive("fullscreen")) {
      const fW = this.ctlr.getPlug<ModesPlug>("modes")?.pip?.floatingWindow;
      if (this.ctlr.isUIActive("floatingPlayer")) return (fW?.addEventListener("pagehide", this.enter), fW?.close(), e.resolve(this.name));
      if (this.ctlr.isUIActive("pictureInPicture")) this.ctlr.media.intent.pictureInPicture = false;
      this.ctlr.media.intent.miniplayer = false;
      this.enter();
    } else {
      exitFullscreen(this.ctlr.videoContainer);
      this.inFullscreen = false;
    }
    e.resolve(this.name);
  }

  protected async enter(): Promise<void> {
    await enterFullscreen(this.ctlr.videoContainer);
    this.inFullscreen = true;
  }

  protected async handleDocInFullscreen(docInFs: boolean): Promise<void> {
    const inFs = docInFs && queryFullscreenEl() === this.ctlr.videoContainer;
    if (inFs) {
      this.ctlr.videoContainer.classList.add("tmg-video-fullscreen");
      this.ctlr.media.state.fullscreen = true;
    } else if (this.ctlr.isUIActive("fullscreen")) {
      this.ctlr.videoContainer.classList.remove("tmg-video-fullscreen");
      this.ctlr.config.settings.locked.disabled = true;
      this.inFullscreen = false;
      this.ctlr.media.intent.miniplayer = "auto";
      this.ctlr.media.state.fullscreen = false;
    }
    // JS: this.ctlr.setControlsState("fullscreenlock"); // components will be isolated
    if (IS_MOBILE) await this.changeScreenOrientation(inFs ? this.config.orientationLock : false);
    // JS: IS_MOBILE && this.ctlr.setControlState(this.ctlr.DOM.fullscreenOrientationBtn, { hidden: false });
  }

  protected handleScreenOrientation(orientation: ScreenOrientation): void {
    if (!this.ctlr.state.mediaParentIntersecting || !IS_MOBILE || this.ctlr.state.readyState < 2 || this.config.onRotate === false || this.ctlr.isUIActive("fullscreen") || this.ctlr.isUIActive("miniplayer")) return;
    const deg = typeof this.config.onRotate === "boolean" ? 90 : parseInt(String(this.config.onRotate));
    if (orientation.angle === deg || orientation.angle === 360 - deg) this.ctlr.media.intent.fullscreen = !this.inFullscreen;
  }

  protected async changeScreenOrientation(option: boolean | OrientationOption = true): Promise<void> {
    const orientation = screen.orientation as any;
    if (option === false) return void orientation?.unlock?.();
    await orientation?.lock?.(option === "auto" ? (this.ctlr.media.status.videoHeight > this.ctlr.media.status.videoWidth ? "portrait" : "landscape") : option === true ? (orientation.angle === 0 ? "landscape" : "portrait") : (option as OrientationOption));
  }
}
