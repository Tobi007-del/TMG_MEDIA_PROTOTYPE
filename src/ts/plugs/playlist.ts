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
    this.ctl.state.currentIndex = 0;
    this.ctl.config.get("playlist", (v) => (v?.length ? v : null), { signal: this.signal });
    this.ctl.config.set("playlist", (v): Playlist => v?.map((i: any) => mergeObjs(DEFAULT_VIDEO_ITEM_BUILD, i)) ?? null, { signal: this.signal });
    this.ctl.config.on("playlist", this.handlePlaylistChange, { signal: this.signal, immediate: true, depth: 1 });
    this.ctl.config.watch("settings.time.start", (v) => this.ctl.config.playlist && this.ctl.media.status.readyState && this.ctl.media.state.currentTime && (this.ctl.config.playlist[this.ctl.state.currentIndex].settings.time.start = v), { signal: this.signal, immediate: "auto" });
  }

  protected handlePlaylistChange({ root }: Event<VideoBuild, "playlist">): void {
    if (this.ctl.media.status.readyState < 1) return;
    const list = root.playlist;
    const v = list?.find((v) => (v.media.id && v.media.id === root.media.id) || isSameURL(v.src, root.src));
    this.ctl.state.currentIndex = v ? list?.indexOf(v) : 0;
    if (v) this.applyItem(v, false);
    else this.movePlaylistTo(this.ctl.state.currentIndex);
  }

  public movePlaylistTo(index: number, shouldPlay?: boolean): void {
    if (!this.ctl.config.playlist) return;
    this.ctl.state.currentIndex = index;
    this.applyItem(this.ctl.config.playlist[index]);
    if (typeof shouldPlay === "boolean") this.ctl.media.intent.paused = !shouldPlay;
  }

  protected applyItem(item: PlaylistItemBuild, reset = true): void {
    this.ctl.config.media = item.media;
    timeKeys.forEach((p) => (this.ctl.config.settings.time[p] = item.settings.time[p] as any));
    this.ctl.config.tracks = item.tracks ?? [];
    if (reset) this.ctl.config.src = item.src || "";
    if (reset && "sources" in item && item.sources) this.ctl.config.sources = item.sources;
  }

  public previousVideo(): void {
    if (this.ctl.media.state.currentTime >= 3) this.ctl.media.intent.currentTime = 0;
    else if (this.ctl.config.playlist && this.ctl.state.currentIndex > 0) this.movePlaylistTo(this.ctl.state.currentIndex - 1, true);
  }

  public nextVideo(): void {
    if (!this.ctl.config.playlist) return;
    if (this.ctl.state.currentIndex < this.ctl.config.playlist.length - 1) this.movePlaylistTo(this.ctl.state.currentIndex + 1, true);
  }
}
