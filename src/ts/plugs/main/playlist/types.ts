import { CtlrConfig, Settings } from "../../../types/config";
import { timeKeys } from "./build";

export type PlaylistItemTimeKey = (typeof timeKeys)[number];

export interface PlaylistItemConfig extends Pick<CtlrConfig, "media" | "src" | "sources" | "tracks"> {
  settings: {
    time: Pick<Settings["time"], PlaylistItemTimeKey>;
  };
}
export type Playlist = PlaylistItemConfig[] | null;

export interface PlaylistState {
  currentIndex: number;
}
