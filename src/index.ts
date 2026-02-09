import "./css/index.scss";
import "./ts/types/global.d.ts";

if (typeof window !== "undefined") {
  window.tmg ||= {};
  window.TMG_VIDEO_ALT_IMG_SRC ??= "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png";
  window.TMG_VIDEO_CSS_SRC ??= "/TMG_MEDIA_PROTOTYPE/prototype-3/prototype-3-video.css";
  window.T007_TOAST_JS_SRC ??= "/T007_TOOLS/T007_toast_library/T007_toast.js";
} else {
  console.log("\x1b[38;2;139;69;19mTMG Media Player Unavailable\x1b[0m");
  (console.error("TMG Media Player cannot run in a terminal!"), console.warn("Consider moving to a browser environment to use the TMG Media Player"));
}

export { Controller } from "./ts/core/controller";
export { Player } from "./ts/tools/player";

export * from "./ts/tools/runtime";
export * as utils from "./ts/utils";
