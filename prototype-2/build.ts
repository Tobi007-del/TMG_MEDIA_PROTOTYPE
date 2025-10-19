const modes = ["fullScreen", "theater", "pictureInPicture", "miniPlayer"] as const;
const betaFeatures = ["rewind", "gestureControls", "floatingPlayer"] as const;
const controlPanel = ["prev", "playpause", "next", "brightness", "volume", "duration", "spacer", "playbackrate", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;
const keyShortcutActions = ["prev", "next", "playPause", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "timeMode", "timeFormat", "screenshot", "objectFit", "pictureInPicture", "theater", "fullScreen", "captions", "captionsFontSizeUp", "captionsFontSizeDown", "captionsFontFamily", "captionsFontWeight", "captionsFontVariant", "captionsFontOpacity", "captionsBackgroundOpacity", "captionsWindowOpacity", "captionsCharacterEdgeStyle", "settings"] as const;
const errorCodes = [
  1, // MEDIA_ERR_ABORTED
  2, // MEDIA_ERR_NETWORK
  3, // MEDIA_ERR_DECODE
  4, // MEDIA_ERR_SRC_NOT_SUPPORTED
  5, // MEDIA_ERR_UNKNOWN
] as const;

type Mode = (typeof modes)[number];
type Control = (typeof controlPanel)[number];
type BetaFeature = (typeof betaFeatures)[number];
type KeyShortcut = (typeof keyShortcutActions)[number];
type ErrorCode = (typeof errorCodes)[number];

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

interface CaptionOption<T> {
  value: T;
  display: string;
}

interface CaptionSetting<T> {
  value: T;
  options: CaptionOption<T>[];
}

interface Track {
  kind: string;
  label: string;
  srclang: string;
  src: string;
  default: boolean;
  id: string;
}

interface Captions {
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
}

interface Settings {
  allowOverride: Exclude<keyof Settings, "allowOverride">[] | boolean;
  auto: {
    play: boolean | null;
    next: boolean;
    captions: boolean;
  };
  beta: Record<BetaFeature, boolean>;
  brightness: Range;
  captions: Captions;
  controlPanel: Record<"top" | "bottom", Control[] | boolean>;
  errorMessages: Record<ErrorCode, string>;
  keys: {
    disabled: boolean;
    strictMatches: boolean;
    overrides: string[];
    blocks: string[];
    shortcuts: Record<KeyShortcut, string>;
  };
  modes: Record<Mode, boolean>;
  notifiers: boolean;
  overlay: {
    delay: number;
    behavior: "persistent" | "auto" | "strict";
  };
  persist: boolean;
  playbackRate: Range;
  playsInline: boolean;
  time: Pick<Range, "skip"> & {
    linePosition: "top" | "bottom";
    progressBar: boolean | null;
    previews: PreviewsInfo | boolean;
    mode: "remaining" | "elapsed";
    format: "digital" | "human";
    loop: boolean;
    start: number | null;
    end: number | null;
  };
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
  media: MediaMetadata;
  mediaPlayer: "TMG";
  mediaType: "video";
  playlist: PlaylistItem[];
  settings: Settings;
  sources: string[];
  src: string;
  tracks: Track[];
};
