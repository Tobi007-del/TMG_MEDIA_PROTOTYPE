import { Player } from "../tools/player";
import * as TMGGlobal from "../../api";
import * as _ from "@t007/toast";
import * as __ from "@t007/input";
import * as ___ from "@t007/dialog";

declare global {
  interface HTMLMediaElement {
    // Monkey-patched Props
    controlsList: DOMTokenList;
    playsInline: boolean;
    disablePictureInPicture: boolean;
    // Optional Public Props
    tmgcontrols: boolean;
    tmgPlayer?: Player | null;
    mediaElementSourceNode?: MediaElementAudioSourceNode | null; // Public since it's 1 per media element
    // Optional Private Props
    _tmgGainNode?: GainNode | null;
    _tmgDynamicsCompressorNode?: DynamicsCompressorNode | null;
    _tmgStereoPannerNode?: StereoPannerNode | null;
    _tmgPannerNode?: PannerNode | null;
  }

  interface TMGNamespace extends TMGGlobal {}

  interface Window {
    tmg: TMGNamespace;

    TMG_VIDEO_ALT_IMG_SRC?: string;
    TMG_VIDEO_CSS_SRC?: string;
  }

  var tmg: TMGNamespace; // for IIFE build
}

export {};
