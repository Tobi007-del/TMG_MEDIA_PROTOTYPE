import type { Controller } from "./controller";
import {
  MEDIA_CONTRACT,
  MEDIA_INTENTS,
  MEDIA_STATES,
  MEDIA_INFOS,
  MEDIA_SETTINGS,
} from "../consts/contract";

export type MediaContractKey = (typeof MEDIA_CONTRACT)[number];
export type MediaIntentKey = (typeof MEDIA_INTENTS)[number];
export type MediaStateKey = MediaIntentKey;
export type MediaStatusKey = (typeof MEDIA_INFOS)[number];
export type MediaSettingsKey = (typeof MEDIA_SETTINGS)[number];

export interface MediaContract extends Record<MediaContractKey, any> {
  // Must Haves to be even considered media
  src: string;
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
}

export interface MediaIntent extends Record<MediaIntentKey, any> {
  // --- The Big Three (Promise-based State) ---
  src: string; // Rejects if network fails or format unsupported
  currentTime: number; // Rejects if outside seekable range
  paused: boolean; // Rejects if "Autoplay Policy" denies it
  // --- The Engine Inputs (Interceptable) ---
  volume: number;
  muted: boolean;
  playbackRate: number;
  // --- The Presentation Modes (Heavily Rejectable) ---
  pictureInPicture: boolean;
  fullscreen: boolean;
  // --- Casting (Connection Handshakes) ---
  airplay: boolean; // Apple AirPlay
  chromecast: boolean; // Google Cast
  // --- VR / XR (Spatial Realities) ---
  vrDisplay: boolean; // Request "Immersive Mode"
  isStereo: boolean; // Request "Side-by-Side" 3D render
  fieldOfView: number; // Degrees
  panningX: number; // Horizontal head orientation
  panningY: number; // Vertical head orientation
  // --- Track Switching (Async Buffering) ---
  currentLevel: number; // Quality (1080p -> 4K)
  currentAudioTrack: number; // Language (English -> Spanish)
  currentVideoTrack: number; // Angle
  currentTextTrack: number; // Subtitle
}

export type MediaState = MediaIntent;

export interface MediaStatus extends Record<MediaStatusKey, any> {
  // --- Network & Health ---
  readyState: number;
  networkState: number;
  error: MediaError | null;
  bandwidth: number | null; // Estimated Mbps
  // --- Buffering & Time ---
  waiting: boolean; // Spinner Active?
  stalled: boolean; // Network died?
  seeking: boolean; // Scrubbing?
  buffered: TimeRanges;
  played: TimeRanges;
  seekable: TimeRanges;
  duration: number; // In seconds
  ended: boolean; // Playback complete?
  // --- Dimensions ---
  videoWidth: number;
  videoHeight: number;
  // --- Lifecycle Gates ---
  loadedMetadata: boolean; // Do we know duration?
  loadedData: boolean; // Can we render frame 1?
  canPlay: boolean; // Can we start?
  canPlayThrough: boolean; // Can we finish?
  // --- Lists ---
  sources: Array<{ src: string; type: string; media?: string }>;
  audioTracks: AudioTrackList | any[];
  videoTracks: VideoTrackList | any[];
  textTracks: TextTrackList | any[];
  levels: any[];
  // --- VR Info ---
  vrCapabilities: Record<"hasPosition" | "hasOrientation", boolean> | null; // 6DoF, 3DoF
}

export interface MediaSettings extends Record<MediaSettingsKey, any> {
  // --- HTML Attributes ---
  poster: string;
  autoplay: boolean;
  loop: boolean;
  preload: "" | "auto" | "metadata" | "none";
  playsInline: boolean;
  crossOrigin: string | null;
  controls: boolean; // Native controls enabled?
  // --- Defaults (Startup values) ---
  defaultMuted: boolean;
  defaultPlaybackRate: number;
  // --- Streaming Logic ---
  autoLevel: boolean; // ABR Algorithm enabled?
}

export type MediaTechFeatures = {
  [K in Exclude<MediaIntentKey, MediaContractKey>]?: boolean;
} & {
  [K in Exclude<MediaStatusKey, MediaContractKey>]?: boolean;
} & {
  [K in Exclude<MediaSettingsKey, MediaContractKey>]?: boolean;
};

export interface MediaReport {
  intent: MediaIntent;
  state: MediaState;
  status: MediaStatus;
  settings: MediaSettings;
}
