import { BasePlug, type KeysPlug } from ".";
import type { CtlrConfig, Settings } from "../types/config";
import { type REvent, type DeepPartial, mergeObjs, deepClone } from "../sia-reactor";
import { isBool, isSameURL } from "../utils";

const timeKeys = ["min", "max", "start", "end", "previews"] as const;
export type PlaylistItemTimeKey = (typeof timeKeys)[number];

export interface PlaylistItemConfig extends Pick<CtlrConfig, "media" | "src" | "sources" | "tracks"> {
  settings: {
    time: Pick<Settings["time"], PlaylistItemTimeKey>;
  };
}

export type Playlist = PlaylistItemConfig[] | null;

export class PlaylistPlug extends BasePlug<Playlist> {
  public static readonly plugName: string = "playlist";
  public currentIndex = 0;

  public wire(): void {
    // Variables Assignment (reset on wire)
    this.currentIndex = 0;
    // Ctlr Config Getters
    this.ctlr.config.get("playlist", (v) => (v?.length ? v : null), { signal: this.signal }); // #VIRTUAL: reliable optional chaining
    // ----------- Setters
    this.ctlr.config.set("playlist", (v): Playlist => v?.map((i: any) => mergeObjs(PLAYLIST_ITEM_BUILD, i)) ?? null, { signal: this.signal });
    // ----------- Watchers
    this.ctlr.config.watch("playlist", (value) => (this.config = value), { signal: this.signal }); // #COMPUTED: config can lose reference
    this.ctlr.config.watch("settings.time.start", (v) => this.ctlr.config.playlist && (this.config![this.currentIndex].settings.time.start = v), { signal: this.signal, immediate: "auto" });
    // ----------- Listeners
    this.ctlr.config.on("playlist", this.handlePlaylistChange, { signal: this.signal, immediate: true, depth: 1 });
    // Post Wiring
    const keys = this.ctlr.plug<KeysPlug>("keys");
    keys?.register("prev", this.previousVideo, { phase: "keydown" });
    // JS: return (this.previousVideo(), this.notify("videoprev"));
    keys?.register("next", this.nextVideo, { phase: "keydown" });
    // JS: return (this.nextVideo(), this.notify("videonext"));
  }

  protected handlePlaylistChange({ root }: REvent<CtlrConfig, "playlist">): void {
    if (this.media.status.readyState < 1) return;
    const list = root.playlist;
    const v = list?.find((v) => (v.media.id && v.media.id === root.media.id) || isSameURL(v.src, root.src));
    this.currentIndex = (v && list?.indexOf(v)) ?? 0;
    v ? this.applyItem(v, false) : this.movePlaylistTo(this.currentIndex);
  }

  public movePlaylistTo(index: number, shouldPlay?: boolean): void {
    if (!this.ctlr.config.playlist) return;
    this.currentIndex = index;
    this.applyItem(this.config![index]);
    if (isBool(shouldPlay)) this.media.intent.paused = !shouldPlay;
  }

  protected applyItem(item: PlaylistItemConfig, reset = true): void {
    this.ctlr.config.media = deepClone(item.media);
    timeKeys.forEach((p) => (this.ctlr.settings.time[p] = item.settings.time[p] as any));
    this.ctlr.config.tracks = deepClone(item.tracks ?? []);
    if (reset) this.ctlr.config.src = item.src || "";
    if (reset && "sources" in item && item.sources) this.ctlr.config.sources = deepClone(item.sources);
    // JS: this.setControlsState("playlist");
  }

  public previousVideo(): void {
    if (this.media.state.currentTime >= 3) this.media.intent.currentTime = 0;
    else if (this.ctlr.config.playlist && this.currentIndex > 0) this.movePlaylistTo(this.currentIndex - 1, true);
  }

  public nextVideo(): void {
    if (!this.ctlr.config.playlist) return;
    if (this.currentIndex < this.config!.length - 1) this.movePlaylistTo(this.currentIndex + 1, true);
  }
}

export const PLAYLIST_ITEM_BUILD: DeepPartial<PlaylistItemConfig> = {
  media: { title: "", chapterInfo: [], links: { title: "" } },
  src: "",
  tracks: [],
  settings: { time: { start: 0, previews: false } },
}; // for a playlist
