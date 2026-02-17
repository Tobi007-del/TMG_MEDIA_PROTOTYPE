import { BasePlug } from ".";
import type { VideoBuild } from "../types/build";
import type { Event } from "../types/reactor";
import { capitalize } from "../utils";
import type { PlaylistPlug } from "./playlist";
import type { TimePlug } from "./time";

export type Src = string;
export interface Source {
  src: string;
  type: string;
  media: string;
}
export type Sources = Source[];
export type SrcObject = MediaSource | null;

export interface Track {
  kind: string;
  label: string;
  srclang: string;
  src: string;
  default: boolean;
  id: string;
}
export type Tracks = Track[];

export type PlaysInline = boolean;

export interface Media extends MediaMetadata {
  id: string;
  title: string;
  artist: string;
  profile: string;
  album: string;
  artwork: Array<{ src: string; sizes: string; type: string }>;
  chapterInfo: Array<{
    title: string;
    startTime: number;
    artwork: Array<{ src: string; sizes: string; type: string }>;
  }>;
  links: Record<"title" | "artist" | "profile", string>;
}

export class MediaPlug extends BasePlug<Media> {
  public static readonly plugName: string = "media";
  public static readonly isCore: boolean = true;

  public mount(): void {
    const videoProfile = this.ctl.DOM.videoProfile as HTMLImageElement;
    videoProfile && this.ctl.setImgLoadState({ target: videoProfile });
  }
  public wire(): void {
    this.ctl.config.watch("media.title", this.forwardTitle, { immediate: true });
    this.ctl.config.watch("media.artist", this.forwardArtist, { immediate: true });
    this.ctl.config.watch("media.profile", this.forwardProfile, { immediate: true });
    this.ctl.config.on("media.links.title", this.handleMediaLink, { signal: this.signal });
    this.ctl.config.on("media.links.artist", this.handleMediaLink, { signal: this.signal });
    this.ctl.config.on("media.links.profile", this.handleMediaLink, { signal: this.signal });
    this.ctl.config.on("media.artwork", this.handleArtwork, { signal: this.signal });
    this.ctl.config.on("media", this.handleMediaChange, { signal: this.signal });
    this.ctl.config.media = this.ctl.config.media;
  }
  protected forwardTitle(value?: string): void {
    this.ctl.config.settings.controlPanel.title = value || "";
  }
  protected forwardArtist(value?: string): void {
    this.ctl.config.settings.controlPanel.artist = value || "";
  }
  protected forwardProfile(value?: string): void {
    this.ctl.config.settings.controlPanel.profile = value || "";
  }
  protected handleMediaLink({ target: { key, value } }: Event<VideoBuild, "media.links.title" | "media.links.artist" | "media.links.profile">): void {
    const el = key !== "profile" ? (this.ctl.DOM[`video${capitalize(key)}`] as HTMLAnchorElement) : (this.ctl.DOM.videoProfile as HTMLImageElement)?.parentElement;
    el && Object.entries({ href: value, "tab-index": value ? "0" : null, target: value ? "_blank" : null, rel: value ? "noopener noreferrer" : null }).forEach(([attr, val]) => (val ? el.setAttribute(attr, val) : el.removeAttribute(attr)));
  }
  protected handleArtwork({ currentTarget: { value } }: Event<VideoBuild, "media.artwork">): void {
    this.ctl.media.intent.poster = value?.[0]?.src || "";
  }
  protected handleMediaChange(): void {
    if (!this.ctl.media.state.paused) this.syncMediaSession();
  }
  public syncMediaSession(): void {
    if (!navigator.mediaSession) return;
    if (this.config) navigator.mediaSession.metadata = new MediaMetadata(this.config as MediaMetadataInit);
    const set = (...args: Parameters<typeof navigator.mediaSession.setActionHandler>) => navigator.mediaSession.setActionHandler(...args);
    set("play", () => (this.ctl.media.intent.paused = false));
    set("pause", () => (this.ctl.media.intent.paused = true));
    const timePlug = this.ctl.getPlug<TimePlug>("time");
    set("seekbackward", timePlug ? () => timePlug.skip(-this.ctl.config.settings.time.skip) : null);
    set("seekforward", timePlug ? () => timePlug.skip(this.ctl.config.settings.time.skip) : null);
    const playlistPlug = this.ctl.getPlug<PlaylistPlug>("playlist"),
      playlist = this.ctl.config.playlist,
      currentIndex = this.ctl.state.currentPlaylistIndex ?? 0;
    set("previoustrack", playlist && currentIndex > 0 && playlistPlug ? playlistPlug.previousVideo : null);
    set("nexttrack", playlist && currentIndex < (playlist?.length ?? 0) - 1 && playlistPlug ? playlistPlug.nextVideo : null);
  }
}

export class SrcPlug extends BasePlug<Src> {
  public static readonly plugName: string = "src";
  public static readonly isCore: boolean = true;

  public wire() {
    this.ctl.config.watch("src", this.forwardSrc, { signal: this.signal, immediate: "auto" });
  }
  protected forwardSrc(value?: string) {
    this.ctl.media.intent.src = value!;
  }
}

export class SourcesPlug extends BasePlug<Sources> {
  public static readonly plugName: string = "sources";
  public static readonly isCore: boolean = true;

  public wire() {
    this.ctl.config.watch("sources", this.forwardSources, { signal: this.signal, immediate: "auto" });
  }
  protected forwardSources(value?: Sources) {
    this.ctl.media.intent.sources = value!;
  }
}

export class SrcObjectPlug extends BasePlug<SrcObject> {
  public static readonly plugName: string = "srcObject";
  public static readonly isCore: boolean = true;

  public wire() {
    this.ctl.config.watch("srcObject", this.forwardSrcObject, { signal: this.signal, immediate: "auto" });
  }
  protected forwardSrcObject(value?: SrcObject) {
    this.ctl.media.settings.srcObject = value!;
  }
}

export class TracksPlug extends BasePlug<Tracks> {
  public static readonly plugName: string = "tracks";
  public static readonly isCore: boolean = true;

  public wire() {
    this.ctl.config.watch("tracks", this.forwardTracks, { signal: this.signal, immediate: "auto" });
  }
  protected forwardTracks(value?: Tracks) {
    this.ctl.media.intent.tracks = value!;
  }
}

export class PlaysInlinePlug extends BasePlug<PlaysInline> {
  public static readonly plugName: string = "playsInline";

  public wire() {
    this.ctl.config.watch("settings.playsInline", this.forwardPlaysInline, { signal: this.signal, immediate: true });
  }
  protected forwardPlaysInline(value?: boolean) {
    this.ctl.media.intent.playsInline = value!;
  }
}
