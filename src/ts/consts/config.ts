// ============ Configurations ============

export const modes = ["fullscreen", "theater", "pictureInPicture", "miniplayer"] as const;

export const controls = ["expandminiplayer", "removeminiplayer", "meta", "timeline", "capture", "fullscreenorientation", "fullscreenlock", "prev", "playpause", "next", "brightness", "volume", "timeandduration", "spacer", "playbackrate", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const;

export const bigControls = ["bigprev", "bigplaypause", "bignext"] as const;

export const keyShortcutActions = ["prev", "next", "playPause", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "timeMode", "timeFormat", "capture", "objectFit", "pictureInPicture", "theater", "fullscreen", "captions", "captionsFontSizeUp", "captionsFontSizeDown", "captionsFontFamily", "captionsFontWeight", "captionsFontVariant", "captionsFontOpacity", "captionsBackgroundOpacity", "captionsWindowOpacity", "captionsCharacterEdgeStyle", "captionsTextAlignment", "settings"] as const;

export const moddedKeyShortcutActions = ["skip", "volume", "brightness", "playbackRate", "captionsFontSize"] as const; // numerical values
