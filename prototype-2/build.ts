const modes = ["fullscreen", "theater", "pictureinpicture", "miniplayer"] as const;
const beta = ["rewind", "draggablecontrols", "gesturecontrols", "floatingplayer"] as const;
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
type BetaFeature = (typeof beta)[number];
type KeyShortcut = (typeof keyShortcutActions)[number];
type ErrorCode = (typeof errorCodes)[number];

interface PreviewImage {
  address: string; // folder/image$.jpg
  spf: number; // 10
}

interface Range {
  min: number;
  max: number;
  value: number;
  skip: number;
}

interface Settings {
  allowOverride: Exclude<keyof Settings, "allowOverride">[] | boolean;
  errorMessages: Partial<Record<ErrorCode, string>>;
  beta: BetaFeature[] | boolean;
  modes: Mode[] | boolean;
  controllerStructure: Control[] | boolean;
  notifiers: boolean;
  persist: boolean;
  playsInline: boolean;
  overlayDelay: number;
  volume: Range & { muted: boolean };
  brightness: Range;
  playbackRate: Range;
  captionsSize: Range;
  auto: {
    next: boolean;
    captions: boolean;
    play: boolean;
  };
  time: Pick<Range, "skip"> & {
    linePosition: "top" | "bottom";
    previewImages: PreviewImage | boolean;
    progressBar: boolean;
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
    shortcuts: Partial<Record<KeyShortcut, string>>;
  };
}

type PlaylistItem = Pick<VideoBuild, "media" | "src" | "sources" | "tracks"> & {
  settings?: {
    time?: Pick<Settings["time"], "previewImages" | "start" | "end">;
  };
};

type VideoBuild = Partial<{
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
  settings: Partial<Settings>;
}>;
