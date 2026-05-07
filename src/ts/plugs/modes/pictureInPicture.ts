import { BasePin, ModesPlug, KeysPlug, MediaPlug, OverlayPlug, SkeletonPlug } from "../";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../../types/contract";
import type { CtlrConfig } from "../../types/config";
import { handleDOMMutation } from "../../tools/runtime";
import { isStr, mockAsync, breath, loadResource, observeMutation, isSameURL, createEl } from "../../utils";

export interface FloatingPlayerConfig {
  disabled: boolean;
  width: number;
  height: number;
  disallowReturnToOpener: boolean;
  preferInitialWindowPlacement: boolean;
}
export type ModesPictureInPicture = {
  disabled: boolean;
  floatingPlayer: FloatingPlayerConfig;
};

export class ModesPictureInPicturePin extends BasePin<ModesPlug, ModesPictureInPicture> {
  public static readonly pinName: string = "pictureInPicture";
  public static readonly plugName: string = "modes";
  public inFloatingPlayer = false; // a quick notice flag for external deps
  public floatingWindow: (Window & typeof globalThis) | null = null;
  public whitelist: string[] = [];
  public blacklist: string[] = [];
  protected wrapper: HTMLElement | null = null;
  protected iconWrapper: HTMLButtonElement | null = null;
  
  public override mount(): void {
    // Variables Assignment
    this.wrapper = createEl("div", { className: "tmg-video-picture-in-picture-wrapper", innerHTML: `<button type="button" class="tmg-video-picture-in-picture-icon-wrapper"><svg class="tmg-video-picture-in-picture-icon" viewBox="0 0 73 73"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(2, 2)" fill-rule="nonzero" stroke-width="2" class="tmg-video-pip-icon-background"><rect x="-1" y="-1" width="71" height="71" rx="14"></rect></g><g transform="translate(15, 15)" fill-rule="nonzero"><g><polygon class="tmg-video-pip-icon-content-background" points="0 0 0 36 36 36 36 0"></polygon><rect class="tmg-video-pip-icon-content-backdrop" x="4.2890625" y="4.2890625" width="27.421875" height="13.2679687"></rect><g transform="translate(4.289063, 27.492187)"><rect x="0" y="0" width="3.1640625" height="2.109375" class="tmg-video-pip-icon-timeline-progress"></rect><rect x="7.3828125" y="0" width="20.0390625" height="2.109375" class="tmg-video-pip-icon-timeline-base"></rect></g><circle class="tmg-video-pip-icon-thumb-indicator" cx="9.5625" cy="28.546875" r="3.1640625"></circle><polygon class="tmg-video-pip-icon-content" points="31.7109375 17.5569609 31.7109375 23.2734375 4.2890625 23.2734375 4.2890625 17.5569609 13.78125 8.06477344 20.109375 14.3928984 24.328125 10.1741484"></polygon></g><g transform="translate(21, 26)"><polygon class="tmg-video-pip-icon-content-background" points="0 0 0 17.7727273 23 17.7727273 23 0"></polygon><rect class="tmg-video-pip-icon-content-backdrop" x="2.74023438" y="2.74023438" width="17.5195312" height="8.47675781"></rect><polygon class="tmg-video-pip-icon-content"points="20.2597656 11.2169473 20.2597656 14.8691406 2.74023438 14.8691406 2.74023438 11.2169473 8.8046875 5.15249414 12.8476562 9.19546289 15.5429687 6.50015039"></polygon></g></g></g></svg></button><p>Playing in picture-in-picture</p>` });
    this.iconWrapper = this.wrapper.querySelector<HTMLButtonElement>(".tmg-video-picture-in-picture-icon-wrapper");
    // DOM Injection
    this.ctlr.DOM.controlsContainer?.prepend(this.wrapper);
    this.ctlr.pseudoVideoContainer.prepend(this.wrapper.cloneNode(true));
  }

  public override wire(): void {
    // Event Listeners
    this.iconWrapper?.addEventListener("click", () => (this.media.intent.pictureInPicture = !this.media.state.pictureInPicture), { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.modes.pictureInPicture.disabled", this.handleDisabled, { signal: this.signal });
    // ---- Media --------
    this.media.on("intent.pictureInPicture", this.handlePictureInPictureIntent, { capture: true, signal: this.signal });
    // ---- State --------
    this.media.on("state.pictureInPicture", this.handlePictureInPictureState, { signal: this.signal });
    // Post Wiring
    this.media.tech.features.pictureInPicture = !this.config.disabled;
  }

  protected handleDisabled({ value }: REvent<CtlrConfig, "settings.modes.pictureInPicture.disabled">): void {
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
    } // tech will handle PiP toggle if not using floating player
  }

  protected async handlePictureInPictureState({ value }: REvent<CtlrMedia, "state.pictureInPicture">): Promise<void> {
    if (this.floatingWindow) return;
    if (value) {
      this.ctlr.videoContainer.classList.add("tmg-video-picture-in-picture");
      this.ctlr.plug<OverlayPlug>("overlay")?.show();
      this.media.intent.miniplayer = false;
      this.ctlr.plug<MediaPlug>("media")?.syncSession();
    } else {
      await mockAsync(180);
      this.ctlr.videoContainer.classList.remove("tmg-video-picture-in-picture");
      this.media.intent.miniplayer = "auto";
      this.ctlr.plug<OverlayPlug>("overlay")?.delay();
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
      parse = (src: string) => (isStr(src) ? src : null),
      whitelist = this.whitelist.concat([parse(window.T007_TOAST_CSS_SRC!), parse(window.T007_INPUT_CSS_SRC!), parse(window.TMG_VIDEO_CSS_SRC!) ?? "https://cdn.jsdelivr.net/npm/tmg-media-player@latest/dist/index.min.css"].filter(Boolean) as string[]); // video CSS too experimental; needs a link :)
    for (const sheet of document.styleSheets) {
      try {
        if (!whitelist.some((src) => isSameURL(src, sheet.href))) for (const cssRule of sheet.cssRules) if ((cssRule as CSSStyleRule).selectorText?.includes(":root") || cssRule.cssText.includes("tmg") || cssRule.cssText.includes("t007")) cssTexts.push(cssRule.cssText);
      } catch {
        continue; // add extensible whitelisting and blacklisting hrefs later
      }
    }
    this.floatingWindow!.document.head.append(createEl("style", { textContent: cssTexts.join("\n") }));
    await Promise.all(whitelist.map((href) => href.includes(".css") && loadResource(href, "style", undefined, this.floatingWindow!)));
    this.ctlr.plug<SkeletonPlug>("skeleton")?.activatePseudoMode();
    this.ctlr.videoContainer.classList.add("tmg-video-floating-player", "tmg-video-progress-bar");
    this.floatingWindow!.document.body.append(this.ctlr.videoContainer);
    this.floatingWindow!.document.documentElement.id = document.documentElement.id;
    this.floatingWindow!.document.documentElement.className = document.documentElement.className;
    document.documentElement.getAttributeNames().forEach((attr) => this.floatingWindow!.document.documentElement.setAttribute(attr, document.documentElement.getAttribute(attr)!));
    this.signal.addEventListener("abort", observeMutation(this.floatingWindow!.document.documentElement, handleDOMMutation, { childList: true, subtree: true }), { once: true });
    this.floatingWindow!.addEventListener("resize", this.handleFloatingPlayerResize, { signal: this.signal });
    this.floatingWindow!.addEventListener("pagehide", this.handleFloatingPlayerClose, { signal: this.signal });
    this.ctlr.plug<KeysPlug>("keys")?.setEventListeners("add");
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
    this.ctlr.plug<SkeletonPlug>("skeleton")?.deactivatePseudoMode();
    this.media.intent.miniplayer = "auto";
    this.media.state.pictureInPicture = false;
  }
}

export const MODES_PICTURE_IN_PICTURE_BUILD: Partial<ModesPictureInPicture> = {
  disabled: false,
  floatingPlayer: { disabled: false, width: 500, height: 281, disallowReturnToOpener: false, preferInitialWindowPlacement: false },
};
