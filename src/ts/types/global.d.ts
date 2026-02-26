import { Player } from "../tools/player";
import { ToastInstance, ToastOptions } from "./t007";
import * as TMGGlobal from "../../";

type T007Global = Record<string, any> & {
  _resourceCache: Partial<Record<string, Promise<HTMLElement | void>>>;
  // Typing Toast Lib
  toast: ToastInstance;
  toaster(config: ToastOptions): ToastInstance; // Factory func
};

declare global {
  const t007: T007Global;
  const tmg: typeof TMGGlobal; // for IIFE build
  interface Window {
    t007: T007Global;
    tmg: typeof TMGGlobal;
    TMG_VIDEO_ALT_IMG_SRC: string;
    TMG_VIDEO_CSS_SRC: string;
    T007_TOAST_CSS_SRC: string;
    T007_TOAST_JS_SRC: string;
    T007_INPUT_CSS_SRC: string;
    T007_INPUT_JS_SRC: string;
  }
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
}

export {};
