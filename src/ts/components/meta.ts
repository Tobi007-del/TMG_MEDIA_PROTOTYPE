import { BaseComponent } from "./base";
import type { ComponentState } from "./base";
import { createEl } from "../utils";
import { initScrollAssist, removeScrollAssist } from "@t007/utils/hooks/vanilla";

export type MetaConfig = undefined;

export class Meta extends BaseComponent<MetaConfig, ComponentState, HTMLDivElement> {
  public static readonly componentName: string = "meta";
  public static readonly isControl: boolean = true;
  public profile!: HTMLImageElement;
  public title!: HTMLAnchorElement;
  public artist!: HTMLAnchorElement;
  protected scrollers: HTMLElement[] = [];

  public override create(): HTMLDivElement {
    // Variables Assignment
    this.element = createEl("div", { className: "tmg-video-meta-wrapper-cover" }, { draggableControl: "", dragId: "wrapper", controlId: this.name });
    const textsCover = createEl("div", { className: "tmg-video-meta-text-wrapper-cover" }),
      profileLink = createEl("a", { className: "tmg-video-profile-link" }),
      titleWrapper = createEl("div", { className: "tmg-video-title-wrapper" }),
      artistWrapper = createEl("div", { className: "tmg-video-artist-wrapper" });
    this.ctlr.DOM.videoProfile = this.profile = createEl("img", { alt: "Profile", className: "tmg-video-profile" });
    this.ctlr.DOM.videoTitle = this.title = createEl("a", { className: "tmg-video-title" });
    this.ctlr.DOM.videoArtist = this.artist = createEl("a", { className: "tmg-video-artist" });
    // DOM Injection
    profileLink.append(this.profile), titleWrapper.append(this.title), artistWrapper.append(this.artist);
    textsCover.append(titleWrapper, artistWrapper);
    return this.element.append(profileLink, textsCover), this.element;
  }

  public override wire(): void {
    // Event Listeners
    this.profile.addEventListener("load", this.ctlr.setImgLoadState, { signal: this.signal });
    this.profile.addEventListener("error", this.ctlr.setImgFallback, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.controlPanel.profile", this.syncProfile, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.title", this.syncTitle, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.artist", this.syncArtist, { signal: this.signal, immediate: true });
    // Post Wiring
    this.scrollers.push((initScrollAssist(this.title, { pxPerSecond: 60 }), this.title));
    this.scrollers.push((initScrollAssist(this.artist, { pxPerSecond: 30 }), this.artist));
  }

  public syncUI(): void {
    this.syncProfile(), this.syncTitle(), this.syncArtist();
  }
  public syncProfile(): void {
    const profile = this.ctlr.settings.controlPanel.profile;
    if (profile !== true) this.profile.dataset.videoProfile = this.profile.src = profile || "";
  }
  public syncTitle(): void {
    const title = this.ctlr.settings.controlPanel.title;
    if (title !== true) this.title.dataset.videoTitle = this.title.textContent = title || "";
  }
  public syncArtist(): void {
    const artist = this.ctlr.settings.controlPanel.artist;
    if (artist !== true) this.artist.dataset.videoArtist = this.artist.textContent = artist || "";
  }

  protected onDestroy(): void {
    this.scrollers.forEach(removeScrollAssist);
  }
}
