import { PlaylistItemBuild, VideoBuild } from "../types/build";
import { DeepPartial } from "../types/obj";
import { IS_MOBILE } from "../utils";

export const DEFAULT_VIDEO_BUILD: DeepPartial<VideoBuild> = {
  mediaPlayer: "TMG",
  mediaType: "video",
  media: { title: "", artist: "", profile: "", album: "", artwork: [], chapterInfo: [], links: { title: "", artist: "", profile: "" } },
  disabled: false,
  lightState: { disabled: false, controls: ["meta", "bigplaypause", "fullscreenorientation"], preview: { usePoster: true, time: 2 } },
  debug: true,
  settings: {
    auto: { next: 2000000 },
    beta: {
      disabled: false,
      fastPlay: { rewind: true },
      gesture: {
        touch: { volume: true, brightness: true, timeline: true, threshold: 200, axesRatio: 3, inset: 20, sliderTimeout: 1000, xRatio: 1, yRatio: 1 },
      },
      pictureInPicture: {
        floatingPlayer: {
          disabled: false,
          width: 270,
          height: 145,
          disallowReturnToOpener: false,
          preferInitialWindowPlacement: false,
        },
      },
    },
    css: {},
    brightness: { min: 0, max: 150, value: 100, skip: 5 },
    captions: {
      disabled: false,
      allowVideoOverride: true,
      font: {
        family: {
          value: "inherit",
          options: [
            { value: "inherit", display: "Default" },
            { value: "monospace", display: "Monospace" },
            { value: "sans-serif", display: "Sans Serif" },
            { value: "serif", display: "Serif" },
            { value: "cursive", display: "Cursive" },
            { value: "fantasy", display: "Fantasy" },
            { value: "system-ui", display: "System UI" },
            { value: "arial", display: "Arial" },
            { value: "verdana", display: "Verdana" },
            { value: "tahoma", display: "Tahoma" },
            { value: "times new roman", display: "Times New Roman" },
            { value: "georgia", display: "Georgia" },
            { value: "impact", display: "Impact" },
            { value: "comic sans ms", display: "Comic Sans MS" },
          ],
        },
        size: {
          min: 100,
          max: 400,
          value: 100,
          skip: 100,
          options: [
            { value: 25, display: "25%" },
            { value: 50, display: "50%" },
            { value: 100, display: "100%" },
            { value: 150, display: "150%" },
            { value: 200, display: "200%" },
            { value: 300, display: "300%" },
            { value: 400, display: "400%" },
          ],
        },
        color: {
          value: "white",
          options: [
            { value: "white", display: "White" },
            { value: "yellow", display: "Yellow" },
            { value: "green", display: "Green" },
            { value: "cyan", display: "Cyan" },
            { value: "blue", display: "Blue" },
            { value: "magenta", display: "Magenta" },
            { value: "red", display: "Red" },
            { value: "black", display: "Black" },
          ],
        },
        opacity: {
          value: 1,
          options: [
            { value: 0.25, display: "25%" },
            { value: 0.5, display: "50%" },
            { value: 0.75, display: "75%" },
            { value: 1, display: "100%" },
          ],
        },
        weight: {
          value: "400",
          options: [
            { value: "100", display: "Thin" },
            { value: "200", display: "Extra Light" },
            { value: "300", display: "Light" },
            { value: "400", display: "Normal" },
            { value: "500", display: "Medium" },
            { value: "600", display: "Semi Bold" },
            { value: "700", display: "Bold" },
            { value: "800", display: "Extra Bold" },
            { value: "900", display: "Black" },
          ],
        },
        variant: {
          value: "normal",
          options: [
            { value: "normal", display: "Normal" },
            { value: "small-caps", display: "Small Caps" },
            { value: "all-small-caps", display: "All Small Caps" },
          ],
        },
      },
      background: {
        color: {
          value: "black",
          options: [
            { value: "white", display: "White" },
            { value: "yellow", display: "Yellow" },
            { value: "green", display: "Green" },
            { value: "cyan", display: "Cyan" },
            { value: "blue", display: "Blue" },
            { value: "magenta", display: "Magenta" },
            { value: "red", display: "Red" },
            { value: "black", display: "Black" },
          ],
        },
        opacity: {
          value: 0.75,
          options: [
            { value: 0, display: "0%" },
            { value: 0.25, display: "25%" },
            { value: 0.5, display: "50%" },
            { value: 0.75, display: "75%" },
            { value: 1, display: "100%" },
          ],
        },
      },
      window: {
        color: {
          value: "black",
          options: [
            { value: "white", display: "White" },
            { value: "yellow", display: "Yellow" },
            { value: "green", display: "Green" },
            { value: "cyan", display: "Cyan" },
            { value: "blue", display: "Blue" },
            { value: "magenta", display: "Magenta" },
            { value: "red", display: "Red" },
            { value: "black", display: "Black" },
          ],
        },
        opacity: {
          value: 0,
          options: [
            { value: 0, display: "0%" },
            { value: 0.25, display: "25%" },
            { value: 0.5, display: "50%" },
            { value: 0.75, display: "75%" },
            { value: 1, display: "100%" },
          ],
        },
      },
      characterEdgeStyle: {
        value: "none",
        options: [
          { value: "none", display: "None" },
          { value: "drop-shadow", display: "Drop Shadow" },
          { value: "raised", display: "Raised" },
          { value: "depressed", display: "Depressed" },
          { value: "outline", display: "Outline" },
        ],
      },
      textAlignment: {
        value: "left",
        options: [
          { value: "left", display: "Left" },
          { value: "center", display: "Center" },
          { value: "right", display: "Right" },
        ],
      },
    },
    controlPanel: {
      profile: true,
      title: true,
      artist: true,
      top: ["expandminiplayer", "spacer", "meta", "spacer", "capture", "fullscreenlock", "fullscreenorientation", "removeminiplayer"],
      center: ["bigprev", "bigplaypause", "bignext"],
      bottom: { 1: [], 2: ["spacer", "timeline", "spacer"], 3: ["prev", "playpause", "next", "brightness", "volume", "timeandduration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] },
      buffer: "eclipse",
      timeline: { thumbIndicator: true, seek: { relative: !IS_MOBILE, cancel: { delta: 15, timeout: 2000 } } },
      progressBar: IS_MOBILE,
      draggable: ["", "wrapper"],
    },
    errorMessages: { 1: "The video playback was aborted :(", 2: "The video failed due to a network error :(", 3: "The video could not be decoded :(", 4: "The video source is not supported :(" },
    fastPlay: { playbackRate: 2, key: true, pointer: { type: "all", threshold: 800, inset: 20 }, reset: true },
    gesture: {
      click: IS_MOBILE ? "" : "togglePlay",
      dblClick: IS_MOBILE ? "togglePlay" : "toggleFullscreenMode",
      wheel: { volume: { normal: true, slider: true }, brightness: { normal: true, slider: true }, timeline: { normal: true, slider: true }, timeout: 2000, xRatio: 12, yRatio: 6 },
    },
    keys: {
      disabled: false,
      strictMatches: false,
      overrides: [" ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"],
      shortcuts: { prev: "Shift+p", next: "Shift+n", playPause: "k", mute: "m", dark: "d", skipBwd: "j", skipFwd: "l", stepFwd: ".", stepBwd: ",", volumeUp: "ArrowUp", volumeDown: "ArrowDown", brightnessUp: "y", brightnessDown: "h", playbackRateUp: ">", playbackRateDown: "<", timeFormat: "z", timeMode: "q", capture: "s", objectFit: "a", pictureInPicture: "i", theater: "t", fullscreen: "f", captions: "c", captionsFontSizeUp: ["+", "="], captionsFontSizeDown: ["-", "_"], captionsFontFamily: "u", captionsFontWeight: "g", captionsFontVariant: "v", captionsFontOpacity: "o", captionsBackgroundOpacity: "b", captionsWindowOpacity: "w", captionsCharacterEdgeStyle: "e", captionsTextAlignment: "x", settings: "?" },
      mods: { disabled: false, skip: { ctrl: 60, shift: 10 }, volume: { ctrl: 50, shift: 10 }, brightness: { ctrl: 50, shift: 10 }, playbackRate: { ctrl: 1 }, captionsFontSize: {} },
      // prettier-ignore
      blocks: ["Ctrl+Tab", "Ctrl+Shift+Tab", "Ctrl+PageUp", "Ctrl+PageDown", "Cmd+Option+ArrowRight", "Cmd+Option+ArrowLeft", "Ctrl+1", "Ctrl+2", "Ctrl+3", "Ctrl+4", "Ctrl+5", "Ctrl+6", "Ctrl+7", "Ctrl+8", "Ctrl+9", "Cmd+1", "Cmd+2", "Cmd+3", "Cmd+4", "Cmd+5", "Cmd+6", "Cmd+7", "Cmd+8", "Cmd+9", "Alt+ArrowLeft", "Alt+ArrowRight", "Cmd+ArrowLeft", "Cmd+ArrowRight", "Ctrl+r", "Ctrl+Shift+r", "F5", "Shift+F5", "Cmd+r", "Cmd+Shift+r", "Ctrl+h", "Ctrl+j", "Ctrl+d", "Ctrl+f", "Cmd+y", "Cmd+Option+b", "Cmd+d", "Cmd+f", "Ctrl+Shift+i", "Ctrl+Shift+j", "Ctrl+Shift+c", "Ctrl+u", "F12", "Cmd+Option+i", "Cmd+Option+j", "Cmd+Option+c", "Cmd+Option+u", "Ctrl+=", "Ctrl+-", "Ctrl+0", "Cmd+=", "Cmd+-", "Cmd+0", "Ctrl+p", "Ctrl+s", "Ctrl+o", "Cmd+p", "Cmd+s", "Cmd+o"],
    },
    locked: false,
    modes: { fullscreen: { disabled: false, orientationLock: "auto", onRotate: 90 }, theater: !IS_MOBILE, pictureInPicture: true, miniplayer: { disabled: false, minWindowWidth: 240 } },
    notifiers: true,
    noOverride: false,
    overlay: { delay: 3000, behavior: "strict" },
    persist: true,
    playbackRate: { min: 0.25, max: 8, skip: 0.25 },
    playsInline: true,
    time: { min: 0, skip: 10, previews: false, mode: "elapsed", format: "digital", seekSync: false },
    toasts: { disabled: false, nextVideoPreview: { usePoster: true, time: 2, tease: true }, captureAutoClose: 15000000, maxToasts: 7, position: "bottom-left", hideProgressBar: true, closeButton: !IS_MOBILE, animation: "slide-up", dragToCloseDir: "x||y" },
    volume: { min: 0, max: 300, skip: 5 },
  },
};

export const DEFAULT_VIDEO_ITEM_BUILD: DeepPartial<PlaylistItemBuild> = {
  media: { title: "", chapterInfo: [], links: { title: "" } },
  src: "",
  tracks: [],
  settings: { time: { start: 0, previews: false } },
}; // for a playlist
