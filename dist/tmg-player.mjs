var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// prototype-3/src/ts/mixins/reactor.ts
var reactor_exports = {};
__export(reactor_exports, {
  TERMINATOR: () => TERMINATOR
});
var TERMINATOR = {};

// prototype-3/src/ts/index.ts
if (typeof window !== "undefined") {
  window.tmg || (window.tmg = {});
  window.TMG_VIDEO_ALT_IMG_SRC ?? (window.TMG_VIDEO_ALT_IMG_SRC = "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png");
  window.TMG_VIDEO_CSS_SRC ?? (window.TMG_VIDEO_CSS_SRC = "/TMG_MEDIA_PROTOTYPE/prototype-3/prototype-3-video.css");
  window.T007_TOAST_JS_SRC ?? (window.T007_TOAST_JS_SRC = "/T007_TOOLS/T007_toast_library/T007_toast.js");
} else {
  console.log("\x1B[38;2;139;69;19mTMG Media Player Unavailable\x1B[0m");
  console.error("TMG Media Player cannot run in a terminal!"), console.warn("Consider moving to a browser environment to use the TMG Media Player");
}
export {
  reactor_exports as Reactor
};
//# sourceMappingURL=tmg-player.mjs.map
