import { TMGMediaExtension } from "./contract";
import { Player } from "../tools/player";
import { ToastInstance, ToastOptions } from "./t007";
export {};

interface T007Global {
  toast: ToastInstance;
  toaster(config: ToastOptions): ToastInstance; // Factory function
}

declare global {
  interface Window {
    tmg: Object;
    t007: T007Global;
    TMG_VIDEO_ALT_IMG_SRC: string;
    TMG_VIDEO_CSS_SRC: string;
    T007_TOAST_JS_SRC: string;
  }
  interface HTMLMediaElement {
    controlsList?: DOMTokenList;
    playsInline?: boolean;
    disablePictureInPicture?: boolean;
    tmgcontrols?: boolean;
    tmgPlayer?: Player | null;
    mediaElementSourceNode?: MediaElementAudioSourceNode | null;
    _tmgGainNode?: GainNode | null;
    _tmgDynamicsCompressorNode?: DynamicsCompressorNode | null;
  }
}
