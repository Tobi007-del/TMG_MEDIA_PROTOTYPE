import { DeepPartial } from "sia-reactor";
import { Playlist, PlaylistItemConfig } from "./types";

export const timeKeys = ["min", "max", "start", "end", "previews"] as const;

export const PLAYLIST_BUILD: DeepPartial<Playlist> = null;

export const PLAYLIST_ITEM_BUILD: DeepPartial<PlaylistItemConfig> = {
  media: {
    title: "",
    chapterInfo: [],
    links: {
      title: "",
    },
  },
  src: "",
  tracks: [],
  settings: {
    time: {
      start: 0,
      previews: false,
    },
  },
}; // for a playlist
