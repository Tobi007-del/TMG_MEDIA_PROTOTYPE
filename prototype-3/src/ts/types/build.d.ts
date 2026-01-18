import type { UIOption, UISettings } from "./UIOptions";
import {
  modes,
  controls,
  bigControls,
  allControls,
  keyShortcutActions,
  moddedKeyShortcutActions,
  errorCodes,
} from "constants/config";
import type { ToastOptions } from "toasts";

export type Mode = (typeof modes)[number];
export type Control = (typeof controls)[number];
export type BigControl = (typeof bigControls)[number];
export type AnyControl = (typeof allControls)[number];
export type KeyShortcutAction = (typeof keyShortcutActions)[number];
export type ModdedKeyShortcutAction = (typeof moddedKeyShortcutActions)[number];
export type ErrorCode = (typeof errorCodes)[number];

export interface ControlPanelBottomTuple {
  1: Control[];
  2: Control[];
  3: Control[];
}
export interface PosterPreview {
  usePoster: boolean;
  time: number;
  tease: boolean;
}

export interface Range {
  min: number;
  max: number;
  value: number | null;
  skip: number;
}

export interface Track {
  kind: string;
  label: string;
  srclang: string;
  src: string;
  default: boolean;
  id: string;
}

export interface Captions {
  disabled: boolean;
  font: {
    family: UISettings<string>;
    size: Range & { options: UIOption<number>[] };
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

export interface Settings {
  noOverride: keyof Settings | boolean;
  auto: {
    play:
      | boolean
      | "in-view"
      | "out-view"
      | "in-view-always"
      | "out-view-always";
    pause:
      | boolean
      | "in-view"
      | "out-view"
      | "in-view-always"
      | "out-view-always";
    next: boolean;
  };
  beta: {
    disabled: boolean;
    fastPlay: {
      rewind: boolean;
    };
    gesture: {
      touch: {
        volume: boolean;
        brightness: boolean;
        timeline: boolean;
        threshold: number;
        axesRatio: number;
        inset: number;
        sliderTimeout: number;
        xRatio: number;
        yRatio: number;
      };
    };
    pictureInPicture: {
      floatingPlayer: {
        disabled: boolean;
        width: number;
        height: number;
        disallowReturnToOpener: boolean;
        preferInitialWindowPlacement: boolean;
      };
    };
  };
  css: Record<string, string>;
  brightness: Range;
  captions: Captions;
  controlPanel: {
    profile: string | boolean;
    title: string | boolean;
    artist: string | boolean;
    top: Control[] | boolean;
    center: BigControl[] | boolean;
    bottom:
      | boolean // Case: true/false
      | Control[] // Case: Flat Array ['play', 'pause'] (Logic puts this in Row 3)
      | Control[][] // Case: Array of Rows [['time'], ['play'], ['vol']]
      | Partial<ControlPanelBottomTuple>; // Case: Explicit Object { 1: [...], 2: [...] }
    timeline:
      | {
          thumbIndicator: boolean;
          seek: {
            relative: boolean;
            cancel: { delta: number; timeout: number };
          };
        }
      | boolean;
    progressBar: boolean;
  };
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
  };
  gesture: {
    click: string;
    dblClick: string;
    wheel: {
      volume: {
        normal: boolean;
        slider: boolean;
      };
      brightness: {
        normal: boolean;
        slider: boolean;
      };
      timeline: {
        normal: boolean;
        slider: boolean;
      };
      timeout: number;
      xRatio: number;
      yRatio: number;
    };
  };
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
  modes: {
    fullscreen: {
      disabled: boolean;
      orientationLock:
        | boolean
        | "auto"
        | "landscape"
        | "portrait"
        | "portrait-primary"
        | "portrait-secondary"
        | "landscape-primary"
        | "landscape-secondary";
    };
    theater: boolean;
    pictureInPicture: boolean;
    miniplayer: { disabled: boolean; minWindowWidth: number };
  };
  notifiers: boolean;
  overlay: {
    delay: number;
    behavior: "persistent" | "auto" | "strict" | "hidden";
  };
  persist: boolean;
  playbackRate: Range;
  playsInline: boolean;
  time: Range & {
    previews:
      | {
          address: string; // folder/image$.jpg
          spf: number; // 10
        }
      | boolean;
    mode: "remaining" | "elapsed";
    format: "digital" | "human" | "human-long";
    seekSync: boolean;
    loop: boolean;
    start: number | null | undefined; // null or undefined to use video `currentTime`
    end: number;
  };
  toasts: {
    disabled: boolean;
    nextVideoPreview: PosterPreview;
    captureAutoClose: number;
  } & ToastOptions;
  volume: Range & { muted: boolean };
}

export type PlaylistItemBuild = Pick<
  VideoBuild,
  "media" | "src" | "sources" | "tracks"
> & {
  settings: {
    time: Pick<Settings["time"], "previews" | "start" | "end">;
  };
};

export type VideoBuild = {
  id: string;
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  lightState: {
    disabled: boolean;
    controls: (Control | BigControl)[] | boolean;
    preview: PosterPreview;
  };
  media: MediaMetadata & {
    id: string;
    profile: string;
    links: Record<"title" | "artist" | "profile", string>;
  };
  mediaPlayer: "TMG";
  mediaType: "video";
  playlist: PlaylistItemBuild[];
  settings: Settings;
  sources: string[];
  src: string;
  tracks: Track[];
  cloneOnDetach: boolean; // stateful issues, src resets - freezing, etc.
};
