import { ComponentRegistry } from "../core/registry";
import { Buffer } from "./buffer";
import { Meta } from "./meta";
import { BigNextButton } from "./bignext";
import { BigPlayPauseButton } from "./bigplaypause";
import { BigPrevButton } from "./bigprev";
import { PrevButton } from "./prev";
import { PlayPauseButton } from "./playpause";
import { NextButton } from "./next";
import { TimeButton } from "./time";
import { DurationButton } from "./duration";
import { TimeAndDurationButton } from "./timeandduration";
import { SettingsButton } from "./settings";
import { ObjectFitButton } from "./objectfit";
import { PictureInPictureButton } from "./pictureinpicture";
import { TheaterButton } from "./theater";
import { CaptureButton } from "./capture";
import { FullscreenButton } from "./fullscreen";
import { FullscreenLockButton } from "./fullscreenlock";
import { FullscreenOrientationButton } from "./fullscreenorientation";
import { RemoveMiniplayerButton } from "./removeminiplayer";
import { ExpandMiniplayerButton } from "./expandminiplayer";
import { Timeline } from "./timeline";
import { VolumeControl } from "./volume";
import { BrightnessControl } from "./brightness";
import { CaptionsView } from "./captionsview";
import { PictureInPicturePlaceholder } from "./pictureinpictureplaceholder";

[
  // Random Order
  Buffer,
  Meta,
  BigNextButton,
  BigPlayPauseButton,
  BigPrevButton,
  PrevButton,
  PlayPauseButton,
  NextButton,
  TimeButton,
  DurationButton,
  TimeAndDurationButton,
  SettingsButton,
  ObjectFitButton,
  PictureInPictureButton,
  TheaterButton,
  CaptureButton,
  FullscreenButton,
  FullscreenLockButton,
  FullscreenOrientationButton,
  RemoveMiniplayerButton,
  ExpandMiniplayerButton,
  Timeline,
  VolumeControl,
  BrightnessControl,
  CaptionsView,
  PictureInPicturePlaceholder,
].forEach((Comp) => ComponentRegistry.register(Comp));
