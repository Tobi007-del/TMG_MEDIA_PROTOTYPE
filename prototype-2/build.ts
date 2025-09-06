const modes = ["normal", "fullscreen", "theater", "pictureinpicture", "miniplayer"] as const;
const beta = ["rewind", "draggablecontrols", "gesturecontrols", "floatingplayer"] as const;
const controllerStructure = ["prev", "playpause", "next", "brightness", "volume", "duration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;
const keyShortcutActions = [
  "prev",
  "next",
  "playPause",
  "timeFormat",
  "skipBwd",
  "skipFwd",
  "stepFwd",
  "stepBwd",
  "mute",
  "dark",
  "volumeUp",
  "volumeDown",
  "brightnessUp",
  "brightnessDown",
  "playbackRateUp",
  "playbackRateDown",
  "objectFit",
  "fullScreen",
  "theater",
  "expandMiniPlayer",
  "removeMiniPlayer",
  "pictureInPicture",
  "captions",
  "captionsOpacity",
  "captionsWindowOpacity",
  "captionsSizeUp",
  "captionsSizeDown",
  "settings",
] as const;
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
type PlaylistItem = Partial<{
  media: MediaMetadata;
  src: string;
  sources: string[];
  tracks: string[];
  settings: Partial<{
    previewImages: PreviewImage | boolean;
    startTime: number | null;
    endTime: number | null;
  }>;
}>;

interface PreviewImage {
  address: string; // folder/image$.jpg
  fps: number; // 10
}

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
  settings: {
    allowOverride: string[] | boolean;
    previewImages: PreviewImage | boolean | null;
    errorMessages: Partial<Record<ErrorCode, string>>;
    beta: BetaFeature[];
    modes: Mode[];
    controllerStructure: Control[] | boolean;
    timelinePosition: "top" | "bottom";
    timeFormat: "timeLeft" | "timeSpent";
    startTime: number | null;
    endTime: number | null;
    timeSkip: number;
    volumeSkip: number;
    brightnessSkip: number;
    playbackRateSkip: number;
    captionsSizeSkip: number;
    maxVolume: number;
    maxBrightness: number;
    maxPlaybackRate: number;
    maxCaptionsSize: number;
    notifiers: boolean;
    progressBar: boolean;
    persist: boolean;
    automove: number; // -1 for false
    autocaptions: boolean;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    playsInline: boolean;
    overlayRestraint: number;
    strictKeyMatches: boolean;
    keyOverrides: string[];
    keyBlocks: string[];
    keyShortcuts: boolean | Partial<Record<KeyShortcut, string>>;
  };
}>;
