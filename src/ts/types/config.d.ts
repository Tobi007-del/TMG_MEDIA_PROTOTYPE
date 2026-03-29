import type { Mode } from "./generics";
import type {
  Sources,
  Src,
  SrcObject,
  Tracks,
  Persist,
  Css,
  Playlist,
  PlaylistItemConfig,
  ControlPanel,
  Gesture,
  Locked,
  Overlay,
  Skeleton,
  TimeTravel,
  Volume,
  CTime,
  Brightness,
  PlaybackRate,
  Captions,
  Auto,
  Toasts,
  PlaysInline,
  Media,
  FastPlay,
  Frame,
  ErrorMessages,
  LightState,
  Modes,
  Keys,
  Notifiers,
} from "../plugs";

// NOTE: Use deep partial util where necessary after imports

export interface Settings {
  auto: Auto;
  css: Css;
  brightness: Brightness;
  captions: Captions;
  controlPanel: ControlPanel;
  errorMessages: ErrorMessages;
  fastPlay: FastPlay;
  gesture: Gesture;
  keys: Keys;
  locked: Locked;
  modes: Modes;
  objectFit: ObjectFit;
  frame: Frame;
  notifiers: Notifiers;
  overlay: Overlay;
  persist: Persist;
  playbackRate: PlaybackRate;
  playsInline: PlaysInline;
  techOrder: string[];
  time: CTime;
  toasts: Toasts;
  volume: Volume;
}

export type CtlrConfig = {
  id: string;
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  lightState: LightState;
  media: Media;
  mediaPlayer: "TMG";
  mediaType: "video";
  playlist: Playlist;
  settings: Settings;
  sources: Sources;
  src: Src;
  srcObject: SrcObject;
  tracks: Tracks;
  cloneOnDetach: boolean; // stateful issues, src resets - freezing, etc.
  noPlugList: string[]; // for non-core plugs
};
