import { createTimeRanges } from "../utils";
import type { MediaIntent, MediaState, MediaStatus, MediaSettings } from "../types/contract";

// DEFAULT STATE (The Reality)
export const DEFAULT_MEDIA_STATE: MediaState = {
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
  xrSession: false,
  xrMode: "inline",
  xrReferenceSpace: "local",
  projection: "flat",
  stereoMode: "none",
  fieldOfView: 90, // Standard FOV
  aspectRatio: 16 / 9, // Standard Aspect Ratio
  panningX: 0,
  panningY: 0,
  panningZ: 0,
  xrInputSource: null,
  // Tracks & Streaming
  currentTextTrack: -1,
  currentAudioTrack: -1,
  currentVideoTrack: -1,
  autoLevel: true, // Adaptive Streaming on by default
  currentLevel: -1,
  // HTML Attributes
  poster: "",
  autoplay: false,
  loop: false,
  preload: "metadata",
  playsInline: true,
  crossOrigin: null,
  controls: false, // We disable native controls
  controlsList: "",
  disablePictureInPicture: false,
  // HTML Lists
  sources: [],
  tracks: [],
};

// DEFAULT INTENT (The Wishes)
export const DEFAULT_MEDIA_INTENT: MediaIntent = DEFAULT_MEDIA_STATE as MediaIntent; // Intent starts as State but can diverge

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
  textTracks: [],
  audioTracks: [],
  videoTracks: [],
  levels: [],
  // VR
  xrCapabilities: null,
  // Active
  activeCue: null,
};

// DEFAULT SETTINGS (The Config)
export const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  defaultMuted: false,
  defaultPlaybackRate: 1,
  srcObject: null,
};
