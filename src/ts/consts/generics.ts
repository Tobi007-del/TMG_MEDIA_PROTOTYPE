// ============ Constants ============

export const FN_KEY = "tmg_fn_registry";
export const LUID_KEY = "tmg_local_uid";

export const keysWhitelist = [" ", "enter", "escape", "arrowup", "arrowdown", "arrowleft", "arrowright", "home", "end", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
// prettier-ignore
export const keysBlocks = ["Ctrl+Tab", "Ctrl+Shift+Tab", "Ctrl+PageUp", "Ctrl+PageDown", "Cmd+Option+ArrowRight", "Cmd+Option+ArrowLeft", "Ctrl+1", "Ctrl+2", "Ctrl+3", "Ctrl+4", "Ctrl+5", "Ctrl+6", "Ctrl+7", "Ctrl+8", "Ctrl+9", "Cmd+1", "Cmd+2", "Cmd+3", "Cmd+4", "Cmd+5", "Cmd+6", "Cmd+7", "Cmd+8", "Cmd+9", "Alt+ArrowLeft", "Alt+ArrowRight", "Cmd+ArrowLeft", "Cmd+ArrowRight", "Ctrl+r", "Ctrl+Shift+r", "F5", "Shift+F5", "Cmd+r", "Cmd+Shift+r", "Ctrl+h", "Ctrl+j", "Ctrl+d", "Ctrl+f", "Cmd+y", "Cmd+Option+b", "Cmd+d", "Cmd+f", "Ctrl+Shift+i", "Ctrl+Shift+j", "Ctrl+Shift+c", "Ctrl+u", "F12", "Cmd+Option+i", "Cmd+Option+j", "Cmd+Option+c", "Cmd+Option+u", "Ctrl+=", "Ctrl+-", "Ctrl+0", "Cmd+=", "Cmd+-", "Cmd+0", "Ctrl+p", "Ctrl+s", "Ctrl+o", "Cmd+p", "Cmd+s", "Cmd+o"];

export const errorCodes = [
  1, // MEDIA_ERR_ABORTED
  2, // MEDIA_ERR_NETWORK
  3, // MEDIA_ERR_DECODE
  4, // MEDIA_ERR_SRC_NOT_SUPPORTED
  5, // MEDIA_ERR_UNKNOWN
] as const;

// ============ Configurations ============

export const modes = ["fullscreen", "theater", "pictureInPicture", "miniplayer"] as const;

export const controls = ["expandminiplayer", "removeminiplayer", "meta", "timeline", "capture", "fullscreenorientation", "fullscreenlock", "prev", "playpause", "next", "brightness", "volume", "timeandduration", "spacer", "playbackrate", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;

export const bigControls = ["bigprev", "bigplaypause", "bignext"] as const;

export const keyShortcutActions = ["prev", "next", "playPause", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "timeMode", "timeFormat", "capture", "objectFit", "pictureInPicture", "theater", "fullscreen", "captions", "captionsFontSizeUp", "captionsFontSizeDown", "captionsFontFamily", "captionsFontWeight", "captionsFontVariant", "captionsFontOpacity", "captionsBackgroundOpacity", "captionsWindowOpacity", "captionsCharacterEdgeStyle", "captionsTextAlignment", "settings"] as const;

export const moddedKeyShortcutActions = ["skip", "volume", "brightness", "playbackRate", "captionsFontSize"] as const; // numerical values

export const aptAutoplayOptions = ["in-view", "out-view", "in-view-always", "out-view-always"];

export const orientationOptions = ["auto", "landscape", "portrait", "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"] as const;
