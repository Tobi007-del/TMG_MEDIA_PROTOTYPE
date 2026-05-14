import type { MediaType, Mode } from "./generics";
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
  brightness: Brightness;
  captions: Captions;
  controlPanel: ControlPanel;
  css: Css;
  errorMessages: ErrorMessages;
  fastPlay: FastPlay;
  frame: Frame;
  gesture: Gesture;
  keys: Keys;
  locked: Locked;
  modes: Modes;
  notifiers: Notifiers;
  objectFit: ObjectFit;
  overlay: Overlay;
  persist: Persist;
  playbackRate: PlaybackRate;
  playsInline: PlaysInline;
  techOrder: string[];
  time: CTime;
  timeTravel: TimeTravel;
  toasts: Toasts;
  volume: Volume;
}

export interface CtlrConfig {
  id: string;
  debug: boolean;
  disabled: boolean;
  initialMode: Mode;
  lightState: LightState;
  media: Media;
  mediaPlayer: "TMG";
  mediaType: MediaType;
  playlist: Playlist;
  settings: Settings;
  sources: Sources;
  src: Src;
  srcObject: SrcObject;
  tracks: Tracks;
  cloneOnDetach: boolean; // stateful issues, src resets - freezing, etc.
  noPlugList: (keyof Settings | keyof CtlrConfig | string)[]; // for non-core plugs
}
