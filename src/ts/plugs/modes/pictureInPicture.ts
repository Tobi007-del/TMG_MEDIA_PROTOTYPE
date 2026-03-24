import { BaseModule, KeysPlug, MediaPlug, OverlayPlug, SkeletonPlug } from "../";
import type { REvent } from "../../types/reactor";
import type { CtlrMedia } from "../../types/contract";
import type { VideoBuild } from "../../types/build";
import { mockAsync, breath, loadResource, observeMutation, isSameURL, createEl } from "../../utils";
import { handleDOMMutation } from "../../tools/runtime";

export interface FloatingPlayerConfig {
  disabled: boolean;
  width: number;
  height: number;
  disallowReturnToOpener: boolean;
  preferInitialWindowPlacement: boolean;
}
export type PictureInPictureModuleConfig = {
  disabled: boolean;
  floatingPlayer: FloatingPlayerConfig;
};

export class PictureInPictureModule extends BaseModule<PictureInPictureModuleConfig> {
  public static readonly moduleName = "pictureInPicture";
  public inFloatingPlayer = false; // a quick notice flag for external deps
  public floatingWindow: (Window & typeof globalThis) | null = null;
  public whitelist: string[] = [];
  public blacklist: string[] = [];

  public wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.modes.pictureInPicture.disabled", this.handleDisabledConfig, { signal: this.signal });
    // ---- Media --------
    this.media.on("intent.pictureInPicture", this.handlePictureInPictureIntent, { capture: true, signal: this.signal });
    // ---- State --------
    this.media.on("state.pictureInPicture", this.handlePictureInPictureState, { signal: this.signal });
    // Post Wiring
    this.media.tech.features.pictureInPicture = !this.config.disabled;
  }

  protected handleDisabledConfig({ value }: REvent<VideoBuild, "settings.modes.pictureInPicture.disabled">): void {
    this.media.tech.features.pictureInPicture = !value;
    if (value && (this.ctlr.isUIActive("pictureInPicture") || this.ctlr.isUIActive("floatingPlayer"))) this.media.intent.pictureInPicture = false;
  }

  protected handlePictureInPictureIntent(e: REvent<CtlrMedia, "intent.pictureInPicture">): void {
    if (e.resolved) return;
    if (this.media.element !== this.media.tech.element && this.config.floatingPlayer.disabled) return e.reject(this.name);
    if (this.config.disabled && !this.ctlr.isUIActive("pictureInPicture") && !this.inFloatingPlayer) return e.resolve(this.name);
    if (this.ctlr.isUIActive("fullscreen")) this.media.intent.fullscreen = false;
    if (!this.ctlr.isUIActive("pictureInPicture") && (window as any).documentPictureInPicture && !this.config.floatingPlayer.disabled) {
      !this.inFloatingPlayer ? this.initFloatingPlayer() : this.floatingWindow?.close();
      e.resolve(this.name);
    } // tech will handle PIP toggle if not using floating player
  }

  protected async handlePictureInPictureState({ value }: REvent<CtlrMedia, "state.pictureInPicture">): Promise<void> {
    if (this.floatingWindow) return;
    if (value) {
      this.ctlr.videoContainer.classList.add("tmg-video-picture-in-picture");
      this.ctlr.getPlug<OverlayPlug>("overlay")?.show();
      this.media.intent.miniplayer = false;
      this.ctlr.getPlug<MediaPlug>("media")?.syncSession();
    } else {
      await mockAsync(180);
      this.ctlr.videoContainer.classList.remove("tmg-video-picture-in-picture");
      this.media.intent.miniplayer = "auto";
      this.ctlr.getPlug<OverlayPlug>("overlay")?.delay();
    }
  }

  protected async initFloatingPlayer(): Promise<void> {
    if (this.inFloatingPlayer) return;
    (window as any).documentPictureInPicture?.window?.close?.();
    this.media.intent.miniplayer = false;
    this.floatingWindow = await (window as any).documentPictureInPicture.requestWindow(this.config.floatingPlayer);
    this.inFloatingPlayer = true;
    this.floatingWindow!.document.documentElement.style.cssText = `height:100%; background:url(${this.ctlr.config.media?.profile}) center / 32px no-repeat, url(${this.media.state.poster}) center / ${this.ctlr.settings.css.bgSafeObjectFit} no-repeat, black;`;
    await breath(this.floatingWindow! as Window & typeof globalThis);
    const cssTexts = [],
      parse = (src: string) => ("string" === typeof src ? src : null),
      whitelist = this.whitelist.concat([parse(window.T007_TOAST_CSS_SRC!), parse(window.T007_INPUT_CSS_SRC!), parse(window.TMG_VIDEO_CSS_SRC!) ?? "https://cdn.jsdelivr.net/npm/tmg-media-player@latest/dist/index.min.css"].filter(Boolean) as string[]); // video CSS too experimental; needs a link :)
    for (const sheet of document.styleSheets) {
      try {
        if (!whitelist.some((src) => isSameURL(src, sheet.href))) for (const cssRule of sheet.cssRules) if (((cssRule as CSSStyleRule).selectorText?.includes(":root")) || cssRule.cssText.includes("tmg") || cssRule.cssText.includes("t007")) cssTexts.push(cssRule.cssText);
      } catch {
        continue; // add extensible whitelisting and blacklisting hrefs later
      }
    }
    this.floatingWindow!.document.head.append(createEl("style", { textContent: cssTexts.join("\n") }));
    await Promise.all(whitelist.map((href) => href.includes(".css") && loadResource(href, "style", undefined, this.floatingWindow!)));
    this.ctlr.getPlug<SkeletonPlug>("skeleton")?.activatePseudoMode();
    this.ctlr.videoContainer.classList.add("tmg-video-floating-player", "tmg-video-progress-bar");
    this.floatingWindow!.document.body.append(this.ctlr.videoContainer);
    this.floatingWindow!.document.documentElement.id = document.documentElement.id;
    this.floatingWindow!.document.documentElement.className = document.documentElement.className;
    document.documentElement.getAttributeNames().forEach((attr) => this.floatingWindow!.document.documentElement.setAttribute(attr, document.documentElement.getAttribute(attr)!));
    this.signal.addEventListener("abort", observeMutation(this.floatingWindow!.document.documentElement, handleDOMMutation, { childList: true, subtree: true }), { once: true });
    this.floatingWindow!.addEventListener("resize", this.handleFloatingPlayerResize, { signal: this.signal });
    this.floatingWindow!.addEventListener("pagehide", this.handleFloatingPlayerClose, { signal: this.signal });
    this.ctlr.getPlug<KeysPlug>("keys")?.setKeyEventListeners("add");
    this.media.state.pictureInPicture = true;
  }

  protected handleFloatingPlayerResize(): void {
    this.config.floatingPlayer.width = this.floatingWindow?.innerWidth ?? this.config.floatingPlayer.width;
    this.config.floatingPlayer.height = this.floatingWindow?.innerHeight ?? this.config.floatingPlayer.height;
  }

  protected handleFloatingPlayerClose(): void {
    this.inFloatingPlayer = false;
    this.floatingWindow = null;
    this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", this.ctlr.settings.controlPanel.progressBar);
    this.ctlr.videoContainer.classList.remove("tmg-video-floating-player");
    this.ctlr.getPlug<SkeletonPlug>("skeleton")?.deactivatePseudoMode();
    this.media.intent.miniplayer = "auto";
    this.media.state.pictureInPicture = false;
  }
}
