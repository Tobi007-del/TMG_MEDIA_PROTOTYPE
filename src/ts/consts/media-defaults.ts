import { createTimeRanges } from "../utils";
import type { MediaIntent, MediaState, MediaStatus, MediaSettings } from "../types/contract";

// DEFAULT INTENT (The Wishes)
export const DEFAULT_MEDIA_INTENT: MediaIntent = {
  // Core
  src: "",
  currentTime: 0,
  paused: true,
  // Engine
  volume: 1,
  muted: false,
  playbackRate: 1,
  // Modes
  pictureInPicture: false,
  fullscreen: false,
  // Casting
  airplay: false,
  chromecast: false,
  // VR / XR
  vrDisplay: false,
  isStereo: false,
  fieldOfView: 90, // Standard FOV
  panningX: 0,
  panningY: 0,
  // Tracks (0 usually means "Main" or "Auto" depending on logic, -1 is safer for "Auto")
  currentLevel: -1,
  currentAudioTrack: -1,
  currentVideoTrack: -1,
  currentTextTrack: -1,
};

// DEFAULT STATE (The Reality)
export const DEFAULT_MEDIA_STATE: MediaState = { ...DEFAULT_MEDIA_INTENT };

// DEFAULT INFO (The Facts)
export const DEFAULT_MEDIA_STATUS: MediaStatus = {
  // Network
  readyState: 0, // HAVE_NOTHING
  networkState: 0, // EMPTY
  error: null,
  bandwidth: null,
  // Buffering
  waiting: false,
  stalled: false,
  seeking: false,
  buffered: createTimeRanges(),
  played: createTimeRanges(),
  seekable: createTimeRanges(),
  duration: NaN, // HTML5 Standard for "Unknown"
  ended: false,
  // Dimensions
  videoWidth: 0,
  videoHeight: 0,
  // Gates
  loadedMetadata: false,
  loadedData: false,
  canPlay: false,
  canPlayThrough: false,
  // Lists (We start with empty lists or nulls)
  sources: [],
  audioTracks: [],
  videoTracks: [],
  textTracks: [],
  levels: [],
  // VR
  vrCapabilities: null,
};

// DEFAULT SETTINGS (The Config)
export const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  poster: "",
  autoplay: false,
  loop: false,
  preload: "metadata",
  playsInline: true,
  crossOrigin: null,
  controls: false, // We disable native controls
  defaultMuted: false,
  defaultPlaybackRate: 1,
  autoLevel: true, // Adaptive Streaming on by default
};
