
export const MEDIA_CONTRACT = [
  // Must Haves for Universal Media
  "src",
  "currentTime",
  "duration",
  "paused",
  "ended"
] as const;

export const MEDIA_INTENTS = [
  // The Big Three
  "src",
  "currentTime",
  "paused",
  // Engine
  "volume",
  "muted",
  "playbackRate",
  // Presentation
  "pictureInPicture",
  "fullscreen",
  // Casting
  "airplay",
  "chromecast",
  // VR / XR
  "vrDisplay",
  "isStereo",
  "fieldOfView",
  "panningX",
  "panningY",
  // Tracks & Levels
  "currentLevel",
  "currentAudioTrack",
  "currentVideoTrack",
  "currentTextTrack"
] as const;

export const MEDIA_STATES = [...MEDIA_INTENTS] as const;

export const MEDIA_STATUS = [
  // Network & Health
  "readyState",
  "networkState",
  "error",
  "bandwidth",
  // Buffering & Time
  "waiting",
  "stalled",
  "seeking",
  "buffered",
  "played",
  "seekable",
  "duration",
  "ended",
  // Dimensions
  "videoWidth",
  "videoHeight",
  // Lifecycle Gates
  "loadedMetadata",
  "loadedData",
  "canPlay",
  "canPlayThrough",
  // Lists
  "audioTracks",
  "videoTracks",
  "textTracks",
  "levels",
  // VR
  "vrCapabilities"
] as const;

export const MEDIA_SETTINGS = [
  "poster",
  "autoplay",
  "loop",
  "preload",
  "playsInline",
  "crossOrigin",
  "controls",
  "defaultMuted",
  "defaultPlaybackRate",
  "autoLevel",
] as const;

export const MEDIA_FEATURES = []