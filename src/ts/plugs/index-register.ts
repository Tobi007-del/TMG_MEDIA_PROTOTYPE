import { PlugRegistry } from "../core/registry";
import { PersistPlug } from "./settings/persist";
import { SrcPlug, SourcesPlug, SrcObjectPlug, TracksPlug, PlaysInlinePlug } from "./main/sources";
import { PlaylistPlug } from "./main/playlist";
import { AutoPlug } from "./settings/auto";
import { CSSPlug } from "./settings/css";
import { SkeletonPlug } from "./main/skeleton";
import { ControlPanelPlug } from "./settings/controlPanel";
import { OverlayPlug } from "./settings/overlay";
import { NotifiersPlug } from "./settings/notifiers";
import { MediaPlug } from "./main/media";
import { TimePlug } from "./settings/time";
import { LightStatePlug } from "./main/lightState";
import { GesturePlug } from "./settings/gesture";
import { FastPlayPlug } from "./settings/fastPlay";
import { VolumePlug } from "./settings/volume";
import { BrightnessPlug } from "./settings/brightness";
import { PlaybackRatePlug } from "./settings/playbackRate";
import { ObjectFitPlug } from "./settings/objectFit/objectFit";
import { CaptionsPlug } from "./settings/captions";
import { ModesPlug } from "./settings/modes";
import { KeysPlug } from "./settings/keys";
import { ToastsPlug } from "./settings/toasts";
import { LockedPlug } from "./settings/locked";
import { FramePlug } from "./settings/frame";
import { DisabledPlug } from "./settings/disabled";
import { ErrorMessagesPlug } from "./settings/errorMessages";
import { TimeTravelPlug } from "./settings/timeTravel";

[
  // Priority Order
  SrcPlug,
  SourcesPlug,
  SrcObjectPlug,
  TracksPlug,
  MediaPlug,
  CSSPlug,
  SkeletonPlug,
  ControlPanelPlug,
  OverlayPlug,
  NotifiersPlug,
  PersistPlug,
  PlaylistPlug,
  AutoPlug,
  TimePlug,
  LightStatePlug,
  GesturePlug,
  FastPlayPlug,
  VolumePlug,
  BrightnessPlug,
  PlaybackRatePlug,
  ObjectFitPlug,
  CaptionsPlug,
  ModesPlug,
  KeysPlug,
  ToastsPlug,
  LockedPlug,
  FramePlug,
  DisabledPlug,
  ErrorMessagesPlug,
  TimeTravelPlug,
  PlaysInlinePlug,
].forEach((Plug) => PlugRegistry.register(Plug));
