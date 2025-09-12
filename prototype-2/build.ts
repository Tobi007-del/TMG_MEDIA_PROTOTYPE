const modes = ["fullscreen", "theater", "pictureinpicture", "miniplayer"] as const;
const betaFeatures = ["rewind", "gestureControls", "floatingPlayer"] as const;
const controllerStructure = ["prev", "playpause", "next", "brightness", "volume", "duration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;
const keyShortcutActions = ["prev", "next", "playPause", "timeFormat", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "objectFit", "fullScreen", "theater", "expandMiniPlayer", "removeMiniPlayer", "pictureInPicture", "captions", "captionsOpacity", "captionsWindowOpacity", "captionsSizeUp", "captionsSizeDown", "settings"] as const;
const errorCodes = [
  1, // MEDIA_ERR_ABORTED
  2, // MEDIA_ERR_NETWORK
  3, // MEDIA_ERR_DECODE
  4, // MEDIA_ERR_SRC_NOT_SUPPORTED
  5, // MEDIA_ERR_UNKNOWN
] as const;

type Mode = (typeof modes)[number];
type Control = (typeof controllerStructure)[number];
type BetaFeature = (typeof betaFeatures)[number];
type KeyShortcut = (typeof keyShortcutActions)[number];
type ErrorCode = (typeof errorCodes)[number];

interface PreviewImage {
  address: string; // folder/image$.jpg
  spf: number; // 10
}

interface Range {
  min: number;
  max: number;
  value: number | null;
  skip: number;
}

interface Settings {
  allowOverride: Exclude<keyof Settings, "allowOverride">[] | boolean;
  errorMessages: Record<ErrorCode, string>;
  beta: Record<BetaFeature, boolean>;
  modes: Mode[] | boolean;
  controllerStructure: Record<"top" | "bottom", Control[] | boolean>;
  notifiers: boolean;
  persist: boolean;
  playsInline: boolean;
  overlayDelay: number;
  volume: Range & { muted: boolean };
  brightness: Range;
  playbackRate: Range;
  captions: {
    size: Range;
    font: {
      family: string | null;
      size: number | null;
      color: string;
      opacity: number;
      weight: string | number;
      variant: string;
    };
    window: {
      color: string;
      opacity: number;
    };
    background: {
      color: string;
      opacity: number;
    };
    characterEdgeStyle: "none" | "raised" | "depressed" | "outline" | "drop shadow";
  };
  auto: {
    play: boolean | null;
    next: boolean;
    captions: boolean;
  };
  time: Pick<Range, "skip"> & {
    linePosition: "top" | "bottom";
    previewImages: PreviewImage | boolean;
    progressBar: boolean | null;
    format: "timeLeft" | "timeSpent";
    loop: boolean;
    start: number | null;
    end: number | null;
  };
  keys: {
    disabled: boolean;
    strictMatches: boolean;
    overrides: string[];
    blocks: string[];
    shortcuts: Record<KeyShortcut, string>;
  };
}

type PlaylistItem = Pick<VideoBuild, "media" | "src" | "sources" | "tracks"> & {
  settings: {
    time: Pick<Settings["time"], "previewImages" | "start" | "end">;
  };
};

type VideoBuild = {
  mediaPlayer: "TMG";
  mediaType: "video";
  media: MediaMetadata;
  disabled: boolean;
  initialMode: string;
  initialState: boolean;
  debug: boolean;
  src: string;
  sources: string[];
  tracks: string[];
  playlist: PlaylistItem[];
  settings: Settings;
};
