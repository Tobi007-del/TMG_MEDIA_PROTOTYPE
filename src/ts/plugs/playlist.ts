import { BasePlug } from ".";
import type { VideoBuild, Settings } from "../types/build";
import type { Event } from "../types/reactor";
import { DEFAULT_VIDEO_ITEM_BUILD } from "../consts/config-defaults";
import { mergeObjs, isSameURL } from "../utils";

const timeKeys = ["min", "max", "start", "end", "previews"] as const;
export type PlaylistItemTimeKey = (typeof timeKeys)[number];

export interface PlaylistItemBuild extends Pick<VideoBuild, "media" | "src" | "sources" | "tracks"> {
  settings: {
    time: Pick<Settings["time"], PlaylistItemTimeKey>;
  };
}

export type Playlist = PlaylistItemBuild[] | null;

export interface PlaylistState {
  currentIndex: number;
}
export class PlaylistPlug extends BasePlug<Playlist, PlaylistState> {
  public static readonly plugName: string = "playlist";

  public wire(): void {
    this.ctlr.state.currentIndex = 0;
    this.ctlr.config.get("playlist", (v) => (v?.length ? v : null), { signal: this.signal });
    this.ctlr.config.set("playlist", (v): Playlist => v?.map((i: any) => mergeObjs(DEFAULT_VIDEO_ITEM_BUILD, i)) ?? null, { signal: this.signal });
    this.ctlr.config.on("playlist", this.handlePlaylistChange, { signal: this.signal, immediate: true, depth: 1 });
    this.ctlr.config.watch("settings.time.start", (v) => this.ctlr.config.playlist && this.ctlr.media.status.readyState && this.ctlr.media.state.currentTime && (this.ctlr.config.playlist[this.ctlr.state.currentIndex].settings.time.start = v), { signal: this.signal, immediate: "auto" });
  }

  protected handlePlaylistChange({ root }: Event<VideoBuild, "playlist">): void {
    if (this.ctlr.media.status.readyState < 1) return;
    const list = root.playlist;
    const v = list?.find((v) => (v.media.id && v.media.id === root.media.id) || isSameURL(v.src, root.src));
    this.ctlr.state.currentIndex = v ? list?.indexOf(v) : 0;
    if (v) this.applyItem(v, false);
    else this.movePlaylistTo(this.ctlr.state.currentIndex);
  }

  public movePlaylistTo(index: number, shouldPlay?: boolean): void {
    if (!this.ctlr.config.playlist) return;
    this.ctlr.state.currentIndex = index;
    this.applyItem(this.ctlr.config.playlist[index]);
    if (typeof shouldPlay === "boolean") this.ctlr.media.intent.paused = !shouldPlay;
  }

  protected applyItem(item: PlaylistItemBuild, reset = true): void {
    this.ctlr.config.media = item.media;
    timeKeys.forEach((p) => (this.ctlr.config.settings.time[p] = item.settings.time[p] as any));
    this.ctlr.config.tracks = item.tracks ?? [];
    if (reset) this.ctlr.config.src = item.src || "";
    if (reset && "sources" in item && item.sources) this.ctlr.config.sources = item.sources;
  }

  public previousVideo(): void {
    if (this.ctlr.media.state.currentTime >= 3) this.ctlr.media.intent.currentTime = 0;
    else if (this.ctlr.config.playlist && this.ctlr.state.currentIndex > 0) this.movePlaylistTo(this.ctlr.state.currentIndex - 1, true);
  }

  public nextVideo(): void {
    if (!this.ctlr.config.playlist) return;
    if (this.ctlr.state.currentIndex < this.ctlr.config.playlist.length - 1) this.movePlaylistTo(this.ctlr.state.currentIndex + 1, true);
  }
}
