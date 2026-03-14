import { BasePlug } from ".";
import type { VideoBuild } from "../types/build";
import type { Event } from "../types/reactor";
import { capitalize } from "../utils";
import type { PlaylistPlug, TimePlug } from ".";

export interface Media extends MediaMetadata {
  id: string;
  title: string;
  artist: string;
  profile: string;
  album: string;
  artwork: Array<{ src: string; sizes?: string; type?: string }>;
  chapterInfo: Array<{
    title: string;
    startTime: number;
    artwork: Array<{ src: string; sizes?: string; type?: string }>;
  }>;
  links: Record<"title" | "artist" | "profile", string>;
  autoGenerate: boolean;
}

export class MediaPlug extends BasePlug<Media> {
  public static readonly plugName: string = "media";
  public static readonly isCore: boolean = true;

  public mount(): void {
    // Variables Assignment
    const videoProfile = this.ctlr.DOM.videoProfile as HTMLImageElement;
    // Post Mounting
    videoProfile && this.ctlr.setImgLoadState({ target: videoProfile });
  }
  
  public wire(): void {
    // Ctlr Config Watchers
    this.ctlr.config.watch("media.title", this.forwardTitle, { immediate: true, signal: this.signal });
    this.ctlr.config.watch("media.artist", this.forwardArtist, { immediate: true, signal: this.signal });
    this.ctlr.config.watch("media.profile", this.forwardProfile, { immediate: true, signal: this.signal });
    // ---- Media Listeners
    this.ctlr.media.on("state.paused", ({ value }) => !value && this.syncSession(), { signal: this.signal });
    this.ctlr.media.on("status.loadedMetadata", () => this.autoGenerate(), { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("media.links.title", this.handleMediaLink, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media.links.artist", this.handleMediaLink, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media.links.profile", this.handleMediaLink, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media.artwork", this.handleArtwork, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media", this.handleMedia, { immediate: true, signal: this.signal });
  }

  protected forwardTitle(value: string): void {
    this.ctlr.config.settings.controlPanel.title = value;
  }

  protected forwardArtist(value: string): void {
    this.ctlr.config.settings.controlPanel.artist = value;
  }

  protected forwardProfile(value: string): void {
    this.ctlr.config.settings.controlPanel.profile = value;
  }

  protected handleMediaLink({ target: { key, value } }: Event<VideoBuild, "media.links.title" | "media.links.artist" | "media.links.profile">): void {
    const el = key !== "profile" ? (this.ctlr.DOM[`video${capitalize(key)}`] as HTMLAnchorElement) : (this.ctlr.DOM.videoProfile as HTMLImageElement)?.parentElement;
    el && Object.entries({ href: value, "tab-index": value ? "0" : null, target: value ? "_blank" : null, rel: value ? "noopener noreferrer" : null }).forEach(([attr, val]) => (val ? el.setAttribute(attr, val) : el.removeAttribute(attr)));
  }

  protected handleArtwork({ currentTarget: { value } }: Event<VideoBuild, "media.artwork">): void {
    this.ctlr.media.intent.poster = value?.[0]?.src || "";
  }

  protected handleMedia(): void {
    if (!this.ctlr.media.state.paused) this.syncSession();
  }

  public syncSession(): void {
    if (!navigator.mediaSession || (document.pictureInPictureElement && !this.ctlr.isUIActive("pictureInPicture"))) return;
    if (this.config) navigator.mediaSession.metadata = new MediaMetadata(this.config as MediaMetadataInit);
    const set = (...args: Parameters<typeof navigator.mediaSession.setActionHandler>) => navigator.mediaSession.setActionHandler(...args);
    set("play", () => (this.ctlr.media.intent.paused = false));
    set("pause", () => (this.ctlr.media.intent.paused = true));
    const timePlug = this.ctlr.getPlug<TimePlug>("time");
    set("seekbackward", timePlug ? () => timePlug.skip(-this.ctlr.config.settings.time.skip) : null);
    set("seekforward", timePlug ? () => timePlug.skip(this.ctlr.config.settings.time.skip) : null);
    const playlistPlug = this.ctlr.getPlug<PlaylistPlug>("playlist"),
      playlist = this.ctlr.config.playlist,
      currentIndex = this.ctlr.getPlug<PlaylistPlug>("playlist")?.currentIndex ?? 0;
    set("previoustrack", playlist && currentIndex > 0 && playlistPlug ? playlistPlug.previousVideo : null);
    set("nexttrack", playlist && currentIndex < (playlist?.length ?? 0) - 1 && playlistPlug ? playlistPlug.nextVideo : null);
  }

  public async autoGenerate(): Promise<void> {
    const url = this.config.artwork?.[0]?.src;
    if (!this.config.autoGenerate || (url && !url.startsWith("blob:"))) return;
    url && URL.revokeObjectURL(url);
    this.config.artwork = [{ src: "" }];
    // JS: this.config.artwork = [{ src: (await this.getVideoFrame(undefined, this.config.lightState.preview.time)).url }];
  }
}

