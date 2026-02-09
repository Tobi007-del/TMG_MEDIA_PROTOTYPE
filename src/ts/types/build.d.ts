import type { UIOption, UISettings } from "./UIOptions";
import type { ToastOptions } from "./t007";
import type {
  Mode,
  ErrorCode,
  ModdedKeyShortcutAction,
  KeyShortcutAction,
  AptAutoplayOption,
  OrientationOption,
  OptRange,
  PosterPreview,
} from "./generics";
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
  Time,
} from "../plugs";
import { LightState } from "../plugs/light-state";

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
  characterEdgeStyle: UISettings<
    "none" | "raised" | "depressed" | "outline" | "drop-shadow"
  >;
  textAlignment: UISettings<"left" | "center" | "right">;
}

export interface Toasts extends ToastOptions {
  disabled: boolean;
  nextVideoPreview: PosterPreview;
  captureAutoClose: number;
}

export interface Settings {
  noOverride: keyof Settings | boolean;
  auto: {
    play: boolean | AptAutoplayOption;
    pause: boolean | AptAutoplayOption;
    next: number; // -1 for false
  };
  css: Css;
  brightness: OptRange;
  captions: Captions;
  controlPanel: ControlPanel;
  errorMessages: Record<ErrorCode, string>;
  fastPlay: {
    playbackRate: number;
    key: boolean;
    pointer: {
      type: string;
      threshold: number;
      inset: number;
    };
    reset: boolean;
    rewind: boolean;
  };
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
  modes: {
    fullscreen: {
      disabled: boolean;
      orientationLock: boolean | OrientationOption;
      onRotate: boolean | number; // 0-portrait, 90-landscape, 180, 270
    };
    theater: boolean;
    pictureInPicture: {
      disabled: boolean;
      floatingPlayer: {
        disabled: boolean;
        width: number;
        height: number;
        disallowReturnToOpener: boolean;
        preferInitialWindowPlacement: boolean;
      };
    };
    miniplayer: { disabled: boolean; minWindowWidth: number };
  };
  notifiers: boolean;
  overlay: Overlay;
  persist: Persist;
  playbackRate: OptRange;
  playsInline: boolean;
  techOrder: string[];
  time: Time;
  toasts: Toasts;
  volume: Volume;
}

export type VideoBuild = {
  id: string;
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  lightState: LightState;
  media: MediaMetadata & {
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
  };
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
