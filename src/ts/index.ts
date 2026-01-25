if (typeof window !== "undefined") {
  window.tmg ||= {};
  window.TMG_VIDEO_ALT_IMG_SRC ??= "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png";
  window.TMG_VIDEO_CSS_SRC ??= "/TMG_MEDIA_PROTOTYPE/prototype-3/prototype-3-video.css";
  window.T007_TOAST_JS_SRC ??= "/T007_TOOLS/T007_toast_library/T007_toast.js";
} else {
  console.log("\x1b[38;2;139;69;19mTMG Media Player Unavailable\x1b[0m");
  (console.error("TMG Media Player cannot run in a terminal!"), console.warn("Consider moving to a browser environment to use the TMG Media Player"));
}

export * as reactor from "./core/reactor";
// export * as browser from "./utils/browser";
export * as chores from "./utils/chores";
export * as dom from "./utils/dom";
export * as num from "./utils/num";
export * as obj from "./utils/obj";
export * as str from "./utils/str";
