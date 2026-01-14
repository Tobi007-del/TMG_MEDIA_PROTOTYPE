export const modes = ["fullscreen", "theater", "pictureInPicture", "miniplayer"] as const;
export const controls = ["expandminiplayer", "removeminiplayer", "meta", "capture", "fullscreenorientation", "fullscreenlock", "prev", "playpause", "next", "brightness", "volume", "timeandduration", "spacer", "playbackrate", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;
export const bigControls = ["bigprev", "bigplaypause", "bignext"] as const;
export const allControls = [...controls, ...bigControls, "expandminiplayer", "removeminiplayer", "timeline"] as const;
export const keyShortcutActions = ["prev", "next", "playPause", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "timeMode", "timeFormat", "capture", "objectFit", "pictureInPicture", "theater", "fullscreen", "captions", "captionsFontSizeUp", "captionsFontSizeDown", "captionsFontFamily", "captionsFontWeight", "captionsFontVariant", "captionsFontOpacity", "captionsBackgroundOpacity", "captionsWindowOpacity", "captionsCharacterEdgeStyle", "captionsTextAlignment", "settings"] as const;
export const moddedKeyShorcutActions = ["skip", "volume", "brightness", "playbackRate", "captionsFontSize"] as const;
export const errorCodes = [
  1, // MEDIA_ERR_ABORTED
  2, // MEDIA_ERR_NETWORK
  3, // MEDIA_ERR_DECODE
  4, // MEDIA_ERR_SRC_NOT_SUPPORTED
  5, // MEDIA_ERR_UNKNOWN
] as const;

export type Mode = (typeof modes)[number];
export type Control = (typeof controls)[number];
export type BigControl = (typeof bigControls)[number];
export type AnyControl = (typeof allControls)[number];
export type KeyShortcutAction = (typeof keyShortcutActions)[number];
export type ModdedKeyShortcutAction = (typeof moddedKeyShorcutActions)[number];
export type ErrorCode = (typeof errorCodes)[number];

export interface ToastsOptions {}

export interface PreviewsInfo {
  address: string; // folder/image$.jpg
  spf: number; // 10
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

export interface CaptionOption<T> {
  value: T;
  display: string;
}

export interface CaptionSetting<T> {
  value: T;
  options: CaptionOption<T>[];
}

export interface Captions {
  disabled: boolean;
  font: {
    family: CaptionSetting<string>;
    size: Range & { options: CaptionOption<number>[] };
    color: CaptionSetting<string>;
    opacity: CaptionSetting<number>;
    weight: CaptionSetting<string | number>;
    variant: CaptionSetting<string>;
  };
  window: {
    color: CaptionSetting<string>;
    opacity: CaptionSetting<number>;
  };
  background: {
    color: CaptionSetting<string>;
    opacity: CaptionSetting<number>;
  };
  characterEdgeStyle: CaptionSetting<"none" | "raised" | "depressed" | "outline" | "drop-shadow">;
  textAlignment: CaptionSetting<"left" | "center" | "right">;
}

export interface Settings {
  noOverride: keyof Settings | boolean;
  auto: {
    play: boolean | "in-view" | "out-view" | "in-view-always" | "out-view-always";
    pause: boolean | "in-view" | "out-view" | "in-view-always" | "out-view-always";
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
    timeline:
      | {
          thumbIndicator: boolean;
          seek: {
            relative: boolean;
            cancel: { delta: number; timeout: number };
          };
        }
      | boolean;
    bottom: [Control[], Control[]] | boolean;
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
      click: string,
      dblClick: string,
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
    mods: { disabled: boolean } & Record<ModdedKeyShortcutAction, Record<"ctrl" | "alt" | "shift", number>>;
  };
  modes: {
    fullscreen: { disabled: boolean; orientationLock: boolean | "auto" | "landscape" | "portrait" | "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary" };
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
  time: Pick<Range, "skip"> & {
    previews: PreviewsInfo | boolean;
    mode: "remaining" | "elapsed";
    format: "digital" | "human" | "human-long";
    seekSync: boolean;
    loop: boolean;
    start: number; // null or undefined to use video `currentTime`
    end: number;
  };
  toasts: {
    disabled: boolean;
    nextVideoPreview: PosterPreview;
    captureAutoClose: number;
  } & ToastsOptions;
  volume: Range & { muted: boolean };
}

export type PlaylistItem = Pick<VideoOptions, "media" | "src" | "sources" | "tracks"> & {
  settings: {
    time: Pick<Settings["time"], "previews" | "start" | "end">;
  };
};

export type VideoOptions = {
  id: string;
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  lightState: {
    disabled: boolean;
    controls: (Control | BigControl)[] | boolean;
    preview: PosterPreview;
  };
  media: MediaMetadata & { id: string; profile: string; links: Record<"title" | "artist" | "profile", string> };
  mediaPlayer: "TMG";
  mediaType: "video";
  playlist: PlaylistItem[];
  settings: Settings;
  sources: string[];
  src: string;
  tracks: Track[];
  cloneOnDetach: boolean; // stateful issues, src resets - freezing, etc.
};
