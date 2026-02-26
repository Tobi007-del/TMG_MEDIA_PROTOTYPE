import "./css/index.scss";
import "./ts/types/global.d.ts";
import { loadResource } from "./ts/utils/dom";
import { init } from "./ts/tools/runtime";

if (typeof window !== "undefined") {
  window.tmg ??= {} as any;
  window.TMG_VIDEO_ALT_IMG_SRC ??= "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png";
  window.TMG_VIDEO_CSS_SRC ??= "/TMG_MEDIA_PROTOTYPE/prototype-3/prototype-3-video.css";
  window.T007_TOAST_CSS_SRC ??= "/T007_TOOLS/T007_toast_library/T007_toast.css";
  window.T007_TOAST_JS_SRC ??= "/T007_TOOLS/T007_toast_library/T007_toast.js";
  window.T007_INPUT_CSS_SRC ??= "/T007_TOOLS/T007_input_library/T007_input.css";
  window.T007_INPUT_JS_SRC ??= "/T007_TOOLS/T007_input_library/T007_input.js";
  console.log("%cTMG Media Player Available", "color: darkturquoise");
  (loadResource(window.TMG_VIDEO_CSS_SRC), loadResource(window.T007_TOAST_JS_SRC, "script", { module: true }), loadResource(window.T007_INPUT_JS_SRC, "script"));
  init();
} else {
  console.log("\x1b[38;2;139;69;19mTMG Media Player Unavailable\x1b[0m");
  (console.error("TMG Media Player cannot run in a terminal!"), console.warn("Consider moving to a browser environment to use the TMG Media Player"));
}

export * from "./api";
