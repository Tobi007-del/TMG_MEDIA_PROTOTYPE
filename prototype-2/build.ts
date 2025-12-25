// Everything in this file is used for type checking and building the video player prototype, all properties are optional
const modes = ["fullScreen", "theater", "pictureInPicture", "miniPlayer"] as const;
const controlPanel = ["prev", "playpause", "next", "brightness", "volume", "duration", "spacer", "playbackrate", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;
const keyShortcutActions = ["prev", "next", "playPause", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "timeMode", "timeFormat", "capture", "objectFit", "pictureInPicture", "theater", "fullScreen", "captions", "captionsFontSizeUp", "captionsFontSizeDown", "captionsFontFamily", "captionsFontWeight", "captionsFontVariant", "captionsFontOpacity", "captionsBackgroundOpacity", "captionsWindowOpacity", "captionsCharacterEdgeStyle", "captionsTextAlignment", "settings"] as const;
const moddedKeyShorcutActions = ["skip", "volume", "brightness", "playbackRate", "captionsFontSize"] as const;
const errorCodes = [
  1, // MEDIA_ERR_ABORTED
  2, // MEDIA_ERR_NETWORK
  3, // MEDIA_ERR_DECODE
  4, // MEDIA_ERR_SRC_NOT_SUPPORTED
  5, // MEDIA_ERR_UNKNOWN
] as const;

type Mode = (typeof modes)[number];
type Control = (typeof controlPanel)[number];
type KeyShortcutAction = (typeof keyShortcutActions)[number];
type ModdedKeyShortcutAction = (typeof moddedKeyShorcutActions)[number];
type ErrorCode = (typeof errorCodes)[number];

interface ToastsOptions {}

interface PreviewsInfo {
  address: string; // folder/image$.jpg
  spf: number; // 10
}

interface Range {
  min: number;
  max: number;
  value: number | null;
  skip: number;
}

interface Track {
  kind: string;
  label: string;
  srclang: string;
  src: string;
  default: boolean;
  id: string;
}

interface CaptionOption<T> {
  value: T;
  display: string;
}

interface CaptionSetting<T> {
  value: T;
  options: CaptionOption<T>[];
}

interface Captions {
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

interface Settings {
  noOverride: keyof Settings | boolean;
  auto: {
    play: boolean | "in-view" | "out-view" | "in-view-always" | "out-view-always";
    pause: boolean | "in-view" | "out-view" | "in-view-always" | "out-view-always";
    next: boolean;
  };
  beta: {
    disabled: boolean;
    rewind: boolean;
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
    floatingPlayer: {
      disabled: boolean;
      width: number;
      height: number;
      disallowReturnToOpener: boolean;
      preferInitialWindowPlacement: boolean;
    };
  };
  css: Record<string, string>;
  brightness: Range;
  captions: Captions;
  controlPanel: {
    title: string | boolean;
    artist: string | boolean;
    profile: string | boolean;
    top: Control[] | boolean;
    bottom: [Control[], Control[]] | boolean;
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
  keys: {
    disabled: boolean;
    strictMatches: boolean;
    overrides: string[];
    blocks: string[];
    shortcuts: Record<KeyShortcutAction, string | string[]>;
    mods: { disabled: boolean } & Record<ModdedKeyShortcutAction, Record<"ctrl" | "alt" | "shift", number>>;
  };
  modes: {
    fullScreen: { disabled: boolean; orientationLock: boolean | "auto" | "landscape" | "portrait" | "portrait-primary" | "portrait-secondary" | "landscape-primary" | "landscape-secondary" };
    theater: boolean;
    pictureInPicture: boolean;
    miniPlayer: { disabled: boolean; minWindowWidth: number };
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
    line: {
      shown: boolean;
      seek: {
        relative: boolean;
        cancel: { delta: number; timeout: number };
      };
      thumbIndicator: boolean;
    };
    progressBar: boolean;
    previews: PreviewsInfo | boolean;
    mode: "remaining" | "elapsed";
    format: "digital" | "human";
    seekSync: boolean;
    loop: boolean;
    start: number;
    end: number;
  };
  toasts: {
    disabled: boolean;
    nextVideoPreview: number;
    captureAutoClose: number;
  } & ToastsOptions;
  volume: Range & { muted: boolean };
}

type PlaylistItem = Pick<VideoBuild, "media" | "src" | "sources" | "tracks"> & {
  settings: {
    time: Pick<Settings["time"], "previews" | "start" | "end">;
  };
};

type VideoBuild = {
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  initialState: boolean;
  media: MediaMetadata & { profile: string; links: Record<"title" | "artist" | "profile", string> };
  mediaPlayer: "TMG";
  mediaType: "video";
  playlist: PlaylistItem[];
  settings: Settings;
  sources: string[];
  src: string;
  tracks: Track[];
};
