import type { Controller } from "./controller";
import { Inert, Intent } from "./reactor";
import { Sources, Src, SrcObject, Tracks } from "../plugs";
import { BaseTech } from "../media";

export interface MediaContract {
  // "Must Haves" to be even considered media
  src: Src;
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
}

export interface MediaState {
  // --- The Big Three (Promise-based State) ---
  src: MediaContract["src"]; // Rejects if network fails or format unsupported
  currentTime: MediaContract["currentTime"]; // Rejects if outside seekable range
  paused: MediaContract["paused"]; // Rejects if "Autoplay Policy" denies it
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
  xrSession: boolean; // Request "Immersive Mode" (Handshake)
  xrMode: "inline" | "immersive-vr" | "immersive-ar"; // Hardware target
  xrReferenceSpace: "local" | "local-floor" | "bounded-floor" | "unbounded";
  // --- Projection & Stereo (The "Content" Logic) ---
  projection: "flat" | "equirectangular" | "cubemap" | "cylindrical";
  stereoMode: "mono" | "sbs" | "top-bottom" | "vr180" | "none"; // Side-by-Side vs Top-Bottom
  // --- Camera & Viewport (The "Lens") ---
  fieldOfView: number; // Degrees (Vertical FOV)
  aspectRatio: number; // Viewport ratio
  // --- Orientation (The "Head/Camera" Pose) ---
  panningX: number; // Yaw (Left/Right)
  panningY: number; // Pitch (Up/Down)
  panningZ: number; // Roll (Tilt/Barrel)
  // --- Interaction (XR Controllers) ---
  xrInputSource: any; // Reference to active controllers/hand-tracking
  // --- Track Switching (Async Buffering/Streaming) ---
  // NOTE: "Disabled" value is "-1"
  currentTextTrack: number; // Subtitle
  currentAudioTrack: number; // Language (English -> Spanish)
  currentVideoTrack: number; // Angle
  autoLevel: boolean; // ABR Algorithm enabled?
  currentLevel: number; // Quality (1080p -> 4K)
  // --- HTML Attributes ---
  poster: string;
  autoplay: boolean;
  loop: boolean;
  preload: "" | "auto" | "metadata" | "none";
  playsInline: boolean;
  crossOrigin: "anonymous" | "use-credentials" | string | null;
  controls: boolean; // Native controls enabled?
  controlsList: DOMTokenList | string | null; // Native controls disabled (e.g. "nodownload")
  disablePictureInPicture: boolean;
  // ---  HTML Lists ---
  sources: Sources; // HTML courtesy
  tracks: Tracks; // HTML courtesy
}

export interface MediaIntent extends MediaState {
  currentLevel: any;
  currentAudioTrack: any;
  currentVideoTrack: any;
  currentTextTrack: any;
} // Tech's responsibility to receive `any` intent and produce a `number` that can index their status (track/level) lists

export interface MediaStatus {
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
  duration: MediaContract["duration"]; // In seconds
  ended: MediaContract["ended"]; // Playback complete?
  // --- Dimensions ---
  videoWidth: number;
  videoHeight: number;
  // --- Lifecycle Gates ---
  loadedMetadata: boolean; // Do we know duration?
  loadedData: boolean; // Can we render frame 1?
  canPlay: boolean; // Can we start?
  canPlayThrough: boolean; // Can we finish?
  // --- Lists ---
  textTracks: TextTrackList | any[];
  audioTracks: any[]; // | AudioTrackList
  videoTracks: any[]; // | VideoTrackList
  levels: any[];
  // --- VR / XR Info ---
  xrCapabilities: Record<
    "hasPosition" | "hasOrientation" | "isEmulated", // 6DoF- Room-scale, 3DoF- Head rotation, Emulated- Magic Window
    boolean
  > | null;
  // --- Active Content ---
  activeCue: TextTrackCue | null; // The current subtitle/caption line
}

export interface MediaSettings {
  // --- Defaults (Startup values) ---
  defaultMuted: boolean;
  defaultPlaybackRate: number;
  // --- Stream Sources ---
  srcObject: SrcObject; // HTML courtesy
}

export type MediaFeatures = {
  [K in Exclude<keyof MediaState, keyof MediaContract>]?: boolean;
} & {
  [K in Exclude<keyof MediaStatus, keyof MediaContract>]?: boolean;
} & {
  [K in Exclude<keyof MediaSettings, keyof MediaContract>]?: boolean;
};

export interface MediaReport {
  state: MediaState;
  intent: Intent<MediaIntent>;
  status: MediaStatus;
  settings: MediaSettings;
}

export type CMedia = {
  tech: Inert<BaseTech>;
  element: HTMLVideoElement;
} & MediaReport; // Controller Media
