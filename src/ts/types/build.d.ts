import type { UIOption, UISettings } from "./UIOptions";
import type { Mode, ModdedKeyShortcutAction, KeyShortcutAction, OptRange } from "./generics";
import type {
  Sources,
  Src,
  SrcObject,
  Tracks,
  Persist,
  Css,
  Playlist,
  PlaylistItemBuild,
  ControlPanel,
  Gesture,
  Locked,
  Overlay,
  Skeleton,
  TimeTravel,
  Volume,
  CTime,
  Brightness,
  PlaybackRate,
  Auto,
  Toasts,
  PlaysInline,
  Media,
  FastPlay,
  Frame,
  ErrorMessages,
  LightState,
  Modes,
} from "../plugs";

// NOTE: Use deep partial util where necessary after imports

export interface Captions {
  disabled: boolean;
  allowVideoOverride: boolean;
  font: {
    family: UISettings<string>;
    size: OptRange & { options: UIOption<number>[] };
    color: UISettings<string>;
    opacity: UISettings<number>;
    weight: UISettings<string | number>;
    variant: UISettings<string>;
  };
  window: {
    color: UISettings<string>;
    opacity: UISettings<number>;
  };
  background: {
    color: UISettings<string>;
    opacity: UISettings<number>;
  };
  characterEdgeStyle: UISettings<"none" | "raised" | "depressed" | "outline" | "drop-shadow">;
  textAlignment: UISettings<"left" | "center" | "right">;
}

export interface Settings {
  noOverride: keyof Settings | boolean;
  auto: Auto;
  css: Css;
  brightness: Brightness;
  captions: Captions;
  controlPanel: ControlPanel;
  errorMessages: ErrorMessages;
  fastPlay: FastPlay;
  gesture: Gesture;
  keys: {
    disabled: boolean;
    strictMatches: boolean;
    overrides: string[];
    blocks: string[];
    shortcuts: Record<KeyShortcutAction, string | string[]>;
    mods: { disabled: boolean } & Record<
      ModdedKeyShortcutAction,
      Record<"ctrl" | "alt" | "shift", number>
    >;
  };
  locked: Locked;
  modes: Modes;
  frame: Frame;
  notifiers: boolean;
  overlay: Overlay;
  persist: Persist;
  playbackRate: PlaybackRate;
  playsInline: PlaysInline;
  techOrder: string[];
  time: CTime;
  toasts: Toasts;
  volume: Volume;
}

export type VideoBuild = {
  id: string;
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  lightState: LightState;
  media: Media;
  mediaPlayer: "TMG";
  mediaType: "video";
  playlist: Playlist;
  settings: Settings;
  sources: Sources;
  src: Src;
  srcObject: SrcObject;
  tracks: Tracks;
  cloneOnDetach: boolean; // stateful issues, src resets - freezing, etc.
  noPlugList: string[]; // for non-core plugs
};
