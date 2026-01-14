"use strict";
var tmg = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // prototype-3/src/ts/index.ts
  var index_exports = {};
  __export(index_exports, {
    Reactor: () => reactor_exports
  });

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
  return __toCommonJS(index_exports);
})();
//# sourceMappingURL=tmg-player.js.map
