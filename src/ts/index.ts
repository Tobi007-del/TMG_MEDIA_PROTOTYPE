import "../css/index.scss";
import "./types/global.d.ts";
import { init, win } from "./tools/runtime";
import { loadResource } from "./utils/dom";

export * from "./api";

if (win) {
  window.tmg ??= {} as any; // bundler will handle the rest
  window.TMG_VIDEO_ALT_IMG_SRC ??= "https://cdn.jsdelivr.net/npm/tmg-media-player/assets/movie-tape.png";
  window.TMG_VIDEO_CSS_SRC ??= "https://cdn.jsdelivr.net/npm/tmg-media-player@latest/dist/index.min.css";
  console.log("%cTMG Media Player Available", "color: darkturquoise");
  (loadResource(window.TMG_VIDEO_CSS_SRC), loadResource(window.T007_TOAST_JS_SRC!, "script", { module: true }), loadResource(window.T007_INPUT_JS_SRC!, "script"));
  init();
} else {
  console.log("\x1b[38;2;139;69;19mTMG Media Player Unavailable\x1b[0m");
  (console.error("TMG Media Player cannot run in a terminal!"), console.warn("Consider moving to a browser environment to use the TMG Media Player"));
}
