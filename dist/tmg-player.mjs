var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/ts/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  ANDROID_VERSION: () => ANDROID_VERSION,
  CHROME_VERSION: () => CHROME_VERSION,
  CHROMIUM_VERSION: () => CHROMIUM_VERSION,
  DUMMY_VID: () => DUMMY_VID,
  IE_VERSION: () => IE_VERSION,
  IOS_VERSION: () => IOS_VERSION,
  IS_ANDROID: () => IS_ANDROID,
  IS_CHROME: () => IS_CHROME,
  IS_CHROMECAST_RECEIVER: () => IS_CHROMECAST_RECEIVER,
  IS_CHROMIUM: () => IS_CHROMIUM,
  IS_EDGE: () => IS_EDGE,
  IS_FIREFOX: () => IS_FIREFOX,
  IS_IE: () => IS_IE,
  IS_IOS: () => IS_IOS,
  IS_IPAD: () => IS_IPAD,
  IS_IPHONE: () => IS_IPHONE,
  IS_IPOD: () => IS_IPOD,
  IS_MOBILE: () => IS_MOBILE,
  IS_SAFARI: () => IS_SAFARI,
  IS_SMART_TV: () => IS_SMART_TV,
  IS_TIZEN: () => IS_TIZEN,
  IS_WEBOS: () => IS_WEBOS,
  IS_WINDOWS: () => IS_WINDOWS,
  TOUCH_ENABLED: () => TOUCH_ENABLED,
  addSafeClicks: () => addSafeClicks,
  addSources: () => addSources,
  addTracks: () => addTracks,
  assignEl: () => assignEl,
  breath: () => breath,
  camelize: () => camelize,
  canVidAudioTracks: () => canVidAudioTracks,
  canVidCtrlRate: () => canVidCtrlRate,
  canVidCtrlVolume: () => canVidCtrlVolume,
  canVidMuteVolume: () => canVidMuteVolume,
  canVidTextTracks: () => canVidTextTracks,
  canVidVideoTracks: () => canVidVideoTracks,
  capitalize: () => capitalize,
  clamp: () => clamp,
  clampRGBBri: () => clampRGBBri,
  cleanKeyCombo: () => cleanKeyCombo,
  cloneMedia: () => cloneMedia,
  convertToMonoChrome: () => convertToMonoChrome,
  createEl: () => createEl,
  createTimeRanges: () => createTimeRanges,
  deepBreath: () => deepBreath,
  deepClone: () => deepClone,
  deleteAny: () => deleteAny,
  deprecate: () => deprecate,
  deprecateForMajor: () => deprecateForMajor,
  enterFullscreen: () => enterFullscreen,
  exitFullscreen: () => exitFullscreen,
  formatKeyForDisplay: () => formatKeyForDisplay,
  formatKeyShortcutsForDisplay: () => formatKeyShortcutsForDisplay,
  formatMediaTime: () => formatMediaTime,
  formatSize: () => formatSize,
  formatVttLine: () => formatVttLine,
  getAny: () => getAny,
  getDominantColor: () => getDominantColor,
  getElSiblingAt: () => getElSiblingAt,
  getExtension: () => getExtension,
  getMediaReport: () => getMediaReport,
  getMimeTypeFromExtension: () => getMimeTypeFromExtension,
  getRGBBri: () => getRGBBri,
  getRGBSat: () => getRGBSat,
  getRenderedBox: () => getRenderedBox,
  getSizeTier: () => getSizeTier,
  getSources: () => getSources,
  getTermsForKey: () => getTermsForKey,
  getTrackIdx: () => getTrackIdx,
  getTracks: () => getTracks,
  getTrailPaths: () => getTrailPaths,
  getTrailRecords: () => getTrailRecords,
  getWindow: () => getWindow,
  inAny: () => inAny,
  inBoolArrOpt: () => inBoolArrOpt,
  inDocView: () => inDocView,
  initArrowFocusNav: () => initArrowFocusNav,
  initScrollAssist: () => initScrollAssist,
  initVScrollerator: () => initVScrollerator,
  intersectionObserver: () => intersectionObserver,
  isArr: () => isArr,
  isDef: () => isDef,
  isIter: () => isIter,
  isObj: () => isObj,
  isSameSources: () => isSameSources,
  isSameTracks: () => isSameTracks,
  isSameURL: () => isSameURL,
  isStrictObj: () => isStrictObj,
  isUISetting: () => isUISetting,
  isValidNum: () => isValidNum,
  keyEventAllowed: () => keyEventAllowed,
  limited: () => limited,
  loadResource: () => loadResource2,
  luid: () => luid,
  matchKeys: () => matchKeys,
  mergeObjs: () => mergeObjs,
  mockAsync: () => mockAsync,
  mutationObserver: () => mutationObserver,
  noExtension: () => noExtension,
  observeIntersection: () => observeIntersection,
  observeMutation: () => observeMutation,
  observeResize: () => observeResize,
  onceEver: () => onceEver,
  oncePerSession: () => oncePerSession,
  parseAnyObj: () => parseAnyObj,
  parseCSSTime: () => parseCSSTime,
  parseCSSUnit: () => parseCSSUnit,
  parseEvOpts: () => parseEvOpts,
  parseForARIAKS: () => parseForARIAKS,
  parseIfPercent: () => parseIfPercent,
  parseKeyCombo: () => parseKeyCombo,
  parsePanelBottomObj: () => parsePanelBottomObj,
  parseUIObj: () => parseUIObj,
  parseVttText: () => parseVttText,
  putSourceDetails: () => putSourceDetails,
  putTrackDetails: () => putTrackDetails,
  queryFullscreen: () => queryFullscreen,
  queryFullscreenEl: () => queryFullscreenEl,
  queryMediaMobile: () => queryMediaMobile,
  queryPictureInPicture: () => queryPictureInPicture,
  queryPictureInPictureEl: () => queryPictureInPictureEl,
  remToPx: () => remToPx,
  removeSafeClicks: () => removeSafeClicks,
  removeScrollAssist: () => removeScrollAssist,
  removeSources: () => removeSources,
  removeTracks: () => removeTracks,
  requestAnimationFrame: () => requestAnimationFrame2,
  resizeObserver: () => resizeObserver,
  rippleHandler: () => rippleHandler,
  rotate: () => rotate,
  safeNum: () => safeNum,
  setAny: () => setAny,
  setCurrentTrack: () => setCurrentTrack,
  setHTMLConfig: () => setHTMLConfig,
  setInterval: () => setInterval,
  setTimeout: () => setTimeout2,
  srtToVtt: () => srtToVtt,
  stepNum: () => stepNum,
  stringifyKeyCombo: () => stringifyKeyCombo,
  stripTags: () => stripTags,
  supportsFullscreen: () => supportsFullscreen,
  supportsPictureInPicture: () => supportsPictureInPicture,
  uid: () => uid,
  uncamelize: () => uncamelize
});

// src/ts/utils/quirks/ripple.ts
function rippleHandler(e, target, forceCenter = false) {
  const el = target || e.currentTarget;
  if (e.target !== e.currentTarget && e.target?.matches("button,[href],input,label,select,textarea,[tabindex]:not([tabindex='-1'])") || el?.hasAttribute("disabled") || e.pointerType === "mouse" && e.button !== 0) return;
  e.stopPropagation?.();
  const { offsetWidth: rW, offsetHeight: rH } = el, { width: w2, height: h, left: l, top: t } = el.getBoundingClientRect(), size = Math.max(rW, rH), x = forceCenter ? rW / 2 - size / 2 : (e.clientX - l) * rW / w2 - size / 2, y = forceCenter ? rH / 2 - size / 2 : (e.clientY - t) * rH / h - size / 2, wrapper = createEl("span", { className: "tmg-video-ripple-container" }), ripple = createEl("span", { className: "tmg-video-ripple tmg-video-ripple-hold" }, {}, { cssText: `width:${size}px;height:${size}px;left:${x}px;top:${y}px;` });
  let canRelease = false;
  ripple?.addEventListener("animationend", () => canRelease = true, { once: true });
  el.append(wrapper?.appendChild(ripple).parentElement);
  const release = () => {
    if (!canRelease) return ripple?.addEventListener("animationend", release, { once: true });
    ripple?.classList.replace("tmg-video-ripple-hold", "tmg-video-ripple-fade");
    ripple?.addEventListener("animationend", () => setTimeout(() => wrapper?.remove()));
    ["pointerup", "pointercancel"].forEach((evt) => el.ownerDocument.defaultView?.removeEventListener(evt, release));
  };
  ["pointerup", "pointercancel"].forEach((evt) => el.ownerDocument.defaultView?.addEventListener(evt, release));
}

// src/ts/utils/quirks/scroll.ts
function initVScrollerator({ baseSpeed = 3, maxSpeed = 10, stepDelay = 2e3, baseRate = 16, lineHeight = 80, margin = 80, car = window } = {}) {
  let linesPerSec = baseSpeed, accelId = null, lastTime = null;
  const drive = (clientY, brake = false, offsetY = 0) => {
    if (car !== window) clientY -= offsetY;
    const now = performance.now(), speed = linesPerSec * lineHeight * ((lastTime ? now - lastTime : baseRate) / 1e3);
    if (!brake && (clientY < margin || clientY > (car.innerHeight ?? car.offsetHeight) - margin)) {
      accelId === null ? accelId = setTimeout(() => linesPerSec += 1, stepDelay) : linesPerSec > baseSpeed && (linesPerSec = Math.min(linesPerSec + 1, maxSpeed));
      car.scrollBy?.(0, clientY < margin ? -speed : speed);
    } else reset();
    return lastTime = !brake ? now : null, speed;
  };
  const reset = () => (accelId && clearTimeout(accelId), accelId = null, linesPerSec = baseSpeed, lastTime = null);
  return { drive, reset };
}
var _SCROLLERS = /* @__PURE__ */ new WeakMap();
var _SCROLLER_R_OBSERVER = typeof window !== "undefined" && new ResizeObserver((entries) => entries.forEach(({ target }) => _SCROLLERS.get(target)?.update()));
var _SCROLLER_M_OBSERVER = typeof window !== "undefined" && new MutationObserver((entries) => {
  const els = /* @__PURE__ */ new Set();
  for (const entry of entries) {
    let node = entry.target instanceof Element ? entry.target : null;
    while (node && !_SCROLLERS.has(node)) node = node.parentElement;
    if (node) els.add(node);
  }
  for (const el of els) _SCROLLERS.get(el)?.update();
});
function initScrollAssist(el, { pxPerSecond = 80, assistClassName = "tmg-video-controls-scroll-assist", vertical = true, horizontal = true } = {}) {
  const parent = el?.parentElement;
  if (!parent || _SCROLLERS.has(el)) return;
  const assist = {};
  let scrollId = null, last = performance.now(), assistWidth = 20, assistHeight = 20;
  const update = () => {
    const hasInteractive = !!parent.querySelector('button, a[href], input, select, textarea, [contenteditable="true"], [tabindex]:not([tabindex="-1"])');
    if (horizontal) {
      const w2 = assist.left?.offsetWidth || assistWidth, check = hasInteractive ? el.clientWidth < w2 * 2 : false;
      assist.left.style.display = check ? "none" : el.scrollLeft > 0 ? "block" : "none";
      assist.right.style.display = check ? "none" : el.scrollLeft + el.clientWidth < el.scrollWidth - 1 ? "block" : "none";
      assistWidth = w2;
    }
    if (vertical) {
      const h = assist.up?.offsetHeight || assistHeight, check = hasInteractive ? el.clientHeight < h * 2 : false;
      assist.up.style.display = check ? "none" : el.scrollTop > 0 ? "block" : "none";
      assist.down.style.display = check ? "none" : el.scrollTop + el.clientHeight < el.scrollHeight - 1 ? "block" : "none";
      assistHeight = h;
    }
  };
  const scroll = (dir) => {
    const frame = () => {
      const now = performance.now(), dt = now - last;
      last = now;
      const d = pxPerSecond * dt / 1e3;
      if (dir === "left") el.scrollLeft = Math.max(0, el.scrollLeft - d);
      if (dir === "right") el.scrollLeft = Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + d);
      if (dir === "up") el.scrollTop = Math.max(0, el.scrollTop - d);
      if (dir === "down") el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, el.scrollTop + d);
      scrollId = requestAnimationFrame(frame);
    };
    last = performance.now();
    frame();
  };
  const stop = () => (cancelAnimationFrame(scrollId ?? 0), scrollId = null);
  const addAssist = (dir) => {
    const div = createEl("div", { className: assistClassName }, { scrollDirection: dir }, { display: "none" });
    if (!div) return;
    ["pointerenter", "dragenter"].forEach((evt) => div.addEventListener(evt, () => scroll(dir)));
    ["pointerleave", "pointerup", "pointercancel", "dragleave", "dragend"].forEach((evt) => div.addEventListener(evt, stop));
    dir === "left" || dir === "up" ? parent.insertBefore(div, el) : parent.append(div);
    assist[dir] = div;
  };
  if (horizontal) ["left", "right"].forEach(addAssist);
  if (vertical) ["up", "down"].forEach(addAssist);
  el.addEventListener("scroll", update);
  _SCROLLER_R_OBSERVER.observe(el);
  _SCROLLER_M_OBSERVER.observe(el, { childList: true, subtree: true, characterData: true });
  _SCROLLERS.set(el, {
    update,
    destroy() {
      stop();
      el.removeEventListener("scroll", update);
      _SCROLLER_R_OBSERVER.unobserve(el);
      _SCROLLERS.delete(el);
      Object.values(assist).forEach((a) => a.remove());
    }
  });
  update();
  return _SCROLLERS.get(el);
}
var removeScrollAssist = (el) => _SCROLLERS.get(el)?.destroy();

// src/ts/utils/quirks/arrowFocusNav.ts
var H_NAV_KEYS = ["ArrowRight", "ArrowLeft", "Home", "End"];
var V_NAV_KEYS = ["ArrowUp", "ArrowDown", "PageDown", "PageUp"];
var NAV_KEYS = [...H_NAV_KEYS, ...V_NAV_KEYS];
var DEFAULT_CONFIG = {
  enabled: null,
  selector: "[data-arrow-item]",
  focusOnHover: true,
  loop: true,
  virtual: false,
  typeahead: false,
  rovingTabIndex: null,
  defaultTabbableIndex: null,
  resetMs: 500,
  rtl: null,
  grid: {},
  activeClass: "focus-outlined",
  inputSelector: "input[value],textarea,[contenteditable='true']",
  focusOptions: { preventScroll: false },
  scrollIntoView: { block: "nearest", inline: "nearest" },
  onSelect: () => {
  },
  onFocusOut: () => {
  }
};
var getCommonAncestor = (a, b) => {
  if (!a || !b) return a || b || null;
  const ancestors = /* @__PURE__ */ new Set();
  let node = a;
  while (node) {
    ancestors.add(node);
    node = node.parentElement;
  }
  node = b;
  while (node) {
    if (ancestors.has(node)) return node;
    node = node.parentElement;
  }
  return null;
};
var getGrid = (all, x = true, y = true, vY = true) => {
  const len = all.length;
  const grid = {};
  if (!len) return grid;
  let cols = all.findIndex((el) => el.offsetTop !== all[0].offsetTop);
  cols = cols > 0 ? cols : len;
  if (x) grid.x = cols;
  let rows = Math.ceil(len / cols);
  if (y) grid.y = rows;
  if (vY) {
    const containerHeight = getCommonAncestor(all[0], all[1])?.clientHeight ?? 0;
    const itemHeight = all[0].offsetHeight ?? 0;
    rows = clamp(1, Math.floor(containerHeight / itemHeight), rows) || rows;
    grid.vY = rows;
  }
  return grid;
};
var getTargetIndex = ({ key, currIndex, length, gridX, gridY, vGridY, loop, ctrlKey = false, rtl }) => {
  const rowStart = currIndex - currIndex % gridX;
  const rowEnd = Math.min(rowStart + gridX - 1, length - 1);
  const colStart = currIndex % gridX;
  const colEnd = Math.min(colStart + gridX * (gridY - 1), length - 1);
  const canX = gridX > 1, canY = gridY > 1;
  const horizontalMove = rtl ? { ArrowRight: canX ? -1 : 0, ArrowLeft: canX ? 1 : 0 } : { ArrowRight: canX ? 1 : 0, ArrowLeft: canX ? -1 : 0 };
  const move = {
    ...horizontalMove,
    ArrowDown: canY ? gridX : 0,
    ArrowUp: canY ? -gridX : 0,
    Home: ctrlKey ? 0 : rowStart,
    End: ctrlKey ? length - 1 : rowEnd,
    PageDown: (vGridY - 1) * gridX,
    PageUp: -(vGridY - 1) * gridX
  }[key] ?? 0;
  let targetIndex = key === "Home" || key === "End" ? move : currIndex + move;
  if (key === "ArrowDown") {
    if (targetIndex < gridX) targetIndex = 0;
    if (!loop && targetIndex >= length) targetIndex -= move;
  } else if (key === "ArrowUp") {
    if (!loop && targetIndex < 0) targetIndex += Math.abs(move);
  } else if (key === "PageDown") {
    if (!loop && targetIndex >= length) targetIndex = colEnd;
  } else if (key === "PageUp") {
    if (!loop && targetIndex < 0) targetIndex = colStart;
  }
  return loop ? (targetIndex + length) % length : clamp(0, targetIndex, length - 1);
};
function initArrowFocusNav(container, cfg = {}) {
  const { enabled: isEnabled, selector, focusOnHover, loop, virtual, typeahead, resetMs, activeClass, inputSelector, defaultTabbableIndex, grid, rtl: isRtl, focusOptions, scrollIntoView, onSelect, onFocusOut, rovingTabIndex } = { ...DEFAULT_CONFIG, ...cfg };
  let gridX = grid.x || 1;
  let gridY = grid.y || 1;
  let vGridY = grid.vY || 1;
  let activeIndex = -1;
  let buffer = "";
  let timeout = null;
  let items = [];
  const enabled = isEnabled ?? virtual;
  const roving = rovingTabIndex ?? !virtual;
  const rtl = isRtl ?? getComputedStyle(container).direction === "rtl";
  const shouldSnub = () => !enabled || !container;
  const isItemDisabled = (el) => !el || el.hasAttribute("disabled") || el.hasAttribute("aria-disabled");
  const getItems = () => items = Array.from(container.querySelectorAll(selector));
  const getAbleIndex = (targetIndex, e = { key: "ArrowRight", ctrlKey: false }) => {
    if (shouldSnub()) return null;
    if (!items.length) return null;
    let index = targetIndex;
    let attempts = 0;
    while (attempts < items.length) {
      if (!isItemDisabled(items[index])) return index;
      index = getTargetIndex({ key: e.key, currIndex: index, gridX, gridY, vGridY, length: items.length, loop, ctrlKey: e.ctrlKey, rtl });
      attempts++;
    }
    return null;
  };
  const goToIndex = (targetIndex, e = { key: "ArrowRight" }) => {
    if (shouldSnub()) return;
    const idx = getAbleIndex(targetIndex, e);
    if (idx === null) return;
    activeIndex = idx;
    onSelect?.(items[idx], e);
    if (virtual) {
      items[idx]?.scrollIntoView(scrollIntoView);
      container.setAttribute("aria-activedescendant", items[idx].id || "");
    } else {
      items[idx]?.focus(focusOptions);
    }
  };
  const updateDOM = () => {
    if (shouldSnub()) return;
    if (!virtual && !roving) return;
    if (!items.length) return;
    const tabbableIndex = defaultTabbableIndex !== null && defaultTabbableIndex !== void 0 && !isItemDisabled(items[defaultTabbableIndex]) ? defaultTabbableIndex : getAbleIndex(0);
    items.forEach((el, i) => {
      const isActive = i === activeIndex;
      if (roving) {
        const shouldBeTabbable = i === activeIndex || activeIndex === -1 && i === tabbableIndex;
        el.setAttribute("tabindex", shouldBeTabbable ? "0" : "-1");
      } else if (virtual && activeIndex > 0) {
        const shouldBeTabbable = i > activeIndex;
        el.setAttribute("tabindex", shouldBeTabbable ? "0" : "-1");
      } else el.setAttribute("tabindex", "0");
      if (virtual) {
        el.setAttribute("aria-selected", String(isActive));
        el.classList.toggle(activeClass, isActive);
      }
    });
  };
  const typeAhead = (key) => {
    if (shouldSnub() || !typeahead) return;
    buffer += key.toLowerCase();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => buffer = "", resetMs);
    const start = activeIndex >= 0 ? activeIndex + 1 : 0;
    for (let i = 0; i < items.length; i++) {
      const idx = (start + i) % items.length;
      const label = (items[idx].getAttribute("data-label") || items[idx].innerText || "").trim().toLowerCase();
      if (label.startsWith(buffer)) return goToIndex(idx);
    }
  };
  const simulateKey = (e) => {
    if (shouldSnub()) return;
    if (document.activeElement?.matches("option")) return;
    const { key } = e;
    if (!items.length) return;
    if (virtual && (key === " " || key === "Enter")) return items[activeIndex]?.click();
    if (typeahead && key.length === 1 && /^[a-z0-9]$/i.test(key)) return typeAhead(key);
    if (!NAV_KEYS.includes(key)) return;
    if (!(e.currentTarget?.matches(DEFAULT_CONFIG.inputSelector) && gridX <= 1 && H_NAV_KEYS.includes(key))) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    const currIndex = virtual ? activeIndex : items.indexOf(document.activeElement);
    const targetIndex = getTargetIndex({ currIndex, gridX, gridY, vGridY, length: items.length, loop, rtl, key, ctrlKey: e.ctrlKey });
    goToIndex(targetIndex, e);
  };
  getItems();
  updateDOM();
  const interactiveEls = !virtual ? [container] : [container.querySelector(inputSelector)];
  interactiveEls.forEach((el) => el?.addEventListener("keydown", simulateKey));
  const handleFocusOut = (evt) => {
    if (!container.contains(evt.relatedTarget)) {
      activeIndex = -1;
      return onFocusOut?.();
    }
    const among = items.includes(evt.relatedTarget);
    if (!among && (defaultTabbableIndex ?? -1) >= 0) return activeIndex = -1;
    if (virtual) activeIndex = -1;
  };
  container.addEventListener("focusout", handleFocusOut);
  const handleHover = (evt) => {
    if (!enabled || !focusOnHover) return;
    const el = evt.currentTarget;
    const i = items.indexOf(el);
    if (i !== -1) goToIndex(i);
  };
  items.forEach((el) => el.addEventListener("mouseenter", handleHover));
  const mutationObserver2 = new MutationObserver(() => {
    const oldEl = items[activeIndex];
    getItems();
    const newEl = items[activeIndex];
    updateDOM();
    if (oldEl && newEl && oldEl === newEl) return;
    activeIndex = -1;
  });
  mutationObserver2.observe(container, { childList: true, subtree: true });
  const setGrid = (g) => {
    if (g.x !== void 0) gridX = g.x;
    if (g.y !== void 0) gridY = g.y;
    if (g.vY !== void 0) vGridY = g.vY;
  };
  setGrid(grid);
  const calcGrid = () => setGrid(getGrid(items, !grid.x, !grid.y, !grid.vY));
  calcGrid();
  const resizeObserver2 = new ResizeObserver(() => calcGrid());
  const ancestor = items.length > 1 ? getCommonAncestor(items[0], items[1]) : container;
  ancestor && resizeObserver2.observe(ancestor);
  const destroy = () => {
    interactiveEls.forEach((el) => el?.removeEventListener("keydown", simulateKey));
    container.removeEventListener("focusout", handleFocusOut);
    items.forEach((el) => el.removeEventListener("mouseenter", handleHover));
    mutationObserver2.disconnect();
    resizeObserver2.disconnect();
    if (timeout) clearTimeout(timeout);
  };
  return {
    goToIndex,
    simulateKey,
    getAbleIndex,
    typeAhead,
    items: () => items,
    activeIndex: () => activeIndex,
    activeItem: () => items[activeIndex] ?? null,
    getGrid: () => ({ x: gridX, y: gridY, vY: vGridY }),
    destroy
  };
}

// src/ts/consts/media-defaults.ts
var DEFAULT_MEDIA_STATE = {
  // Core
  src: "",
  currentTime: 0,
  paused: true,
  // Engine
  volume: 1,
  muted: false,
  brightness: 100,
  dark: false,
  playbackRate: 1,
  // Modes
  pictureInPicture: false,
  fullscreen: false,
  theater: false,
  miniplayer: false,
  // Casting
  airplay: false,
  chromecast: false,
  // VR / XR
  xrSession: false,
  xrMode: "inline",
  xrReferenceSpace: "local",
  projection: "flat",
  stereoMode: "none",
  fieldOfView: 90,
  // Standard FOV
  viewRatio: 16 / 9,
  // Standard Aspect Ratio
  panningX: 0,
  panningY: 0,
  panningZ: 0,
  xrInputSource: null,
  // Tracks & Streaming
  currentTextTrack: -1,
  currentAudioTrack: -1,
  currentVideoTrack: -1,
  autoLevel: true,
  // Adaptive Streaming on by default
  currentLevel: -1,
  // HTML Attributes
  poster: "",
  autoplay: false,
  loop: false,
  preload: "auto",
  playsInline: true,
  crossOrigin: null,
  controls: false,
  // We disable native controls
  controlsList: "",
  disablePictureInPicture: false,
  // HTML Lists
  sources: [],
  tracks: [],
  // Misc
  objectFit: "contain"
};
var DEFAULT_MEDIA_INTENT = DEFAULT_MEDIA_STATE;
var DEFAULT_MEDIA_STATUS = {
  // Network
  readyState: 0,
  // HAVE_NOTHING
  networkState: 0,
  // EMPTY
  error: null,
  bandwidth: null,
  // Buffering
  waiting: false,
  stalled: false,
  seeking: false,
  buffered: createTimeRanges(),
  played: createTimeRanges(),
  seekable: createTimeRanges(),
  duration: NaN,
  // HTML5 Standard for "Unknown"
  ended: false,
  // Dimensions
  videoWidth: 0,
  videoHeight: 0,
  // Gates
  loadedMetadata: false,
  loadedData: false,
  canPlay: false,
  canPlayThrough: false,
  // Lists (We start with empty lists or nulls)
  textTracks: [],
  audioTracks: [],
  videoTracks: [],
  levels: [],
  // VR
  xrCapabilities: null,
  // Active
  activeCue: null
};
var DEFAULT_MEDIA_SETTINGS = {
  defaultMuted: false,
  defaultPlaybackRate: 1,
  srcObject: null
};

// src/ts/utils/media.ts
function getMediaReport(m) {
  const txtTrackIdx = getTrackIdx(m, "Text");
  const report = {
    state: {
      src: m.src,
      currentTime: m.currentTime,
      paused: m.paused,
      volume: m.volume,
      muted: m.muted,
      playbackRate: m.playbackRate,
      pictureInPicture: queryPictureInPictureEl() === m,
      fullscreen: queryFullscreenEl() === m,
      currentTextTrack: txtTrackIdx,
      currentAudioTrack: getTrackIdx(m, "Audio"),
      currentVideoTrack: getTrackIdx(m, "Video"),
      poster: m instanceof HTMLVideoElement ? m.poster : "",
      autoplay: m.autoplay,
      loop: m.loop,
      preload: m.preload,
      playsInline: m instanceof HTMLVideoElement ? m.playsInline : false,
      crossOrigin: m.crossOrigin,
      controls: m.controls,
      controlsList: m.controlsList ?? m.getAttribute("controlsList"),
      disablePictureInPicture: m instanceof HTMLVideoElement ? m.disablePictureInPicture ?? m.hasAttribute("disablePictureInPicture") : false,
      sources: getSources(m),
      tracks: getTracks(m)
    },
    status: {
      readyState: m.readyState,
      networkState: m.networkState,
      error: m.error,
      seeking: m.seeking,
      buffered: m.buffered,
      played: m.played,
      seekable: m.seekable,
      duration: m.duration,
      ended: m.ended,
      loadedMetadata: m.readyState >= 1,
      loadedData: m.readyState >= 2,
      canPlay: m.readyState >= 3,
      canPlayThrough: m.readyState >= 4,
      videoWidth: m instanceof HTMLVideoElement ? m.videoWidth : 0,
      videoHeight: m instanceof HTMLVideoElement ? m.videoHeight : 0,
      textTracks: m.textTracks,
      audioTracks: m.audioTracks,
      videoTracks: m.videoTracks,
      activeCue: m.textTracks[txtTrackIdx]?.activeCues?.[0] || null
    },
    settings: {
      defaultMuted: m.defaultMuted,
      defaultPlaybackRate: m.defaultPlaybackRate
    }
  };
  return {
    state: { ...DEFAULT_MEDIA_STATE, ...report.state },
    intent: { ...DEFAULT_MEDIA_INTENT, ...report.state },
    status: { ...DEFAULT_MEDIA_STATUS, ...report.status },
    settings: { ...DEFAULT_MEDIA_SETTINGS, ...report.settings }
  };
}
function getRenderedBox(elem) {
  const getResourceDimensions = (source) => source.videoWidth && source.videoHeight ? { width: source.videoWidth, height: source.videoHeight } : null;
  const parsePositionAsPx = (str, bboxSize, objectSize) => {
    const num = parseFloat(str);
    return !str.endsWith("%") ? num : bboxSize * (num / 100) - objectSize * (num / 100);
  };
  const parseObjectPosition = (position, bbox2, object2) => {
    const [left, top] = position.split(" ");
    return { left: parsePositionAsPx(left, bbox2.width, object2.width), top: parsePositionAsPx(top, bbox2.height, object2.height) };
  };
  let { objectFit, objectPosition } = getComputedStyle(elem);
  const bbox = elem.getBoundingClientRect(), object = getResourceDimensions(elem);
  if (!object || !objectFit || !objectPosition) return {};
  if (objectFit === "scale-down") objectFit = bbox.width < object.width || bbox.height < object.height ? "contain" : "none";
  if (objectFit === "none") return { ...parseObjectPosition(objectPosition, bbox, object), ...object };
  else if (objectFit === "contain") {
    const objectRatio = object.height / object.width, bboxRatio = bbox.height / bbox.width, width = bboxRatio > objectRatio ? bbox.width : bbox.height / objectRatio, height = bboxRatio > objectRatio ? bbox.width * objectRatio : bbox.height;
    return { ...parseObjectPosition(objectPosition, bbox, { width, height }), width, height };
  } else if (objectFit === "fill") {
    const { left, top } = parseObjectPosition(objectPosition, bbox, object), objPosArr = objectPosition.split(" ");
    return { left: objPosArr[0].endsWith("%") ? 0 : left, top: objPosArr[1].endsWith("%") ? 0 : top, width: bbox.width, height: bbox.height };
  } else if (objectFit === "cover") {
    const minRatio = Math.min(bbox.width / object.width, bbox.height / object.height);
    let width = object.width * minRatio, height = object.height * minRatio, outRatio = 1;
    if (width < bbox.width) outRatio = bbox.width / width;
    if (Math.abs(outRatio - 1) < 1e-14 && height < bbox.height) outRatio = bbox.height / height;
    width *= outRatio;
    height *= outRatio;
    return { ...parseObjectPosition(objectPosition, bbox, { width, height }), width, height };
  }
  return {};
}
function getSizeTier(container) {
  const { offsetWidth: w2, offsetHeight: h } = container;
  return { width: w2, height: h, tier: h <= 130 ? "xxxxx" : w2 <= 280 ? "xxxx" : w2 <= 380 ? "xxx" : w2 <= 480 ? "xx" : w2 <= 630 ? "x" : "" };
}
function cloneMedia(v) {
  const newV = v.cloneNode(true);
  newV.tmgPlayer = v.tmgPlayer;
  v.parentElement?.replaceChild(newV, v);
  if (v.currentTime) newV.currentTime = v.currentTime;
  if (v.playbackRate !== 1) newV.playbackRate = v.playbackRate;
  if (v.defaultPlaybackRate !== 1) newV.defaultPlaybackRate = v.defaultPlaybackRate;
  if (v.volume !== 1) newV.volume = v.volume;
  if (v.muted) newV.muted = true;
  if (v.defaultMuted) newV.defaultMuted = true;
  if (v.srcObject) newV.srcObject = v.srcObject;
  if (v.autoplay) newV.autoplay = true;
  if (v.loop) newV.loop = true;
  if (v.controls) newV.controls = true;
  if (v.crossOrigin) newV.crossOrigin = v.crossOrigin;
  if (v.playsInline) newV.playsInline = true;
  if (v.controlsList?.length) newV.controlsList = v.controlsList;
  if (v.disablePictureInPicture) newV.disablePictureInPicture = true;
  if (!v.paused && newV.isConnected) newV.play();
  return newV;
}
function putSourceDetails(source, el) {
  if (source.src) el.src = source.src;
  if (source.type) el.type = source.type;
  if (source.media) el.media = source.media;
}
function addSources(sources = [], medium) {
  const addSource = (source, med) => {
    const sourceEl = createEl("source");
    putSourceDetails(source, sourceEl);
    return med.appendChild(sourceEl);
  };
  return isIter(sources) ? Array.from(sources, (source) => addSource(source, medium)) : addSource(sources, medium);
}
function getSources(medium) {
  const sources = medium.querySelectorAll("source"), _sources = [];
  sources.forEach((source) => {
    const obj = {};
    putSourceDetails(source, obj);
    _sources.push(obj);
  });
  return _sources;
}
var removeSources = (medium) => medium?.querySelectorAll("source")?.forEach((source) => source.remove());
function isSameSources(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((s1) => b.some((s2) => isSameURL(s1.src, s2.src) && s1.type === s2.type && s1.media === s2.media));
}
function putTrackDetails(track, el) {
  if (track.id) el.id = track.id;
  if (track.kind) el.kind = track.kind;
  if (track.label) el.label = track.label;
  if (track.srclang) el.srclang = track.srclang;
  if (track.src) el.src = track.src;
  if (track.default) el.default = track.default;
}
function addTracks(tracks = [], medium) {
  const addTrack = (track, med) => {
    const trackEl = createEl("track");
    putTrackDetails(track, trackEl);
    return med.appendChild(trackEl);
  };
  return isIter(tracks) ? Array.from(tracks, (track) => addTrack(track, medium)) : addTrack(tracks, medium);
}
function getTracks(medium, cues = false) {
  const tracks = medium.querySelectorAll(!cues ? "track" : "track:is([kind='captions'], [kind='subtitles'])"), _tracks = [];
  tracks.forEach((track) => {
    const obj = {};
    putTrackDetails(track, obj);
    _tracks.push(obj);
  });
  return _tracks;
}
var removeTracks = (medium) => medium.querySelectorAll("track")?.forEach((track) => (track.kind === "subtitles" || track.kind === "captions") && track.remove());
function isSameTracks(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return a.every((t1) => b.some((t2) => isSameURL(t1.src, t2.src) && t1.kind === t2.kind && t1.label === t2.label && t1.srclang === t2.srclang && t1.default === t2.default));
}
var isTrack = (type, term) => `${type}Track` in window && term instanceof window[`${type}Track`];
function getTrackIdx(medium, type, term = "active") {
  if ("number" === typeof term) return term;
  const list = medium[`${type.toLowerCase()}Tracks`];
  if (term === "active") {
    if (type === "Text") {
      for (let i = 0; i < +list?.length; i++) if (list[i].mode === "showing") return i;
    }
    if (type === "Audio") {
      for (let i = 0; i < +list?.length; i++) if (list[i].enabled) return i;
    }
    if (type === "Video") return list.selectedIndex ?? -1;
  }
  if (isTrack(type, term)) return Array.prototype.indexOf.call(list, term);
  if ("string" === typeof term) {
    term = term.toLowerCase();
    return !isNaN(+term) ? +term : Array.prototype.findIndex.call(list, (t) => t.id.toLowerCase() === term || t.label.toLowerCase() === term || t.srclang.toLowerCase() === term || t.language.toLowerCase() === term || isSameURL(t.src, term));
  }
  return -1;
}
function setCurrentTrack(medium, type, term, flush = false) {
  const list = medium[`${type.toLowerCase()}Tracks`], idx = getTrackIdx(medium, type, term);
  if (type !== "Video") for (let i = 0; i < list.length; i++) type === "Text" ? list[i].mode = i === idx ? "showing" : flush ? "disabled" : "hidden" : list[i].enabled = i === idx;
  else list[idx] && (list[idx].selected = true);
}
var DUMMY_VID = createEl("video");
function canVidCtrlVolume() {
  if (!DUMMY_VID) return false;
  try {
    const prev = DUMMY_VID.volume;
    DUMMY_VID.volume = 0.5;
    const works = DUMMY_VID.volume === 0.5;
    return DUMMY_VID.volume = prev, works;
  } catch {
    return false;
  }
}
function canVidMuteVolume() {
  return !!DUMMY_VID && "muted" in DUMMY_VID;
}
function canVidCtrlRate() {
  if (!DUMMY_VID) return false;
  try {
    const prev = DUMMY_VID.playbackRate;
    DUMMY_VID.playbackRate = 0.5;
    const works = DUMMY_VID.playbackRate === 0.5;
    return DUMMY_VID.playbackRate = prev, works;
  } catch {
    return false;
  }
}
function canVidTextTracks() {
  return !!DUMMY_VID && "textTracks" in DUMMY_VID;
}
function canVidVideoTracks() {
  return !!DUMMY_VID && "videoTracks" in DUMMY_VID;
}
function canVidAudioTracks() {
  return !!DUMMY_VID && "audioTracks" in DUMMY_VID;
}
var stripTags = (text) => text.replace(/<(\/)?([a-z0-9.:]+)([^>]*)>/gi, "");
function srtToVtt(srt, vttLines = ["WEBVTT", ""]) {
  const input = srt.replace(/\r\n?/g, "\n").trim();
  for (const block of input.split(/\n{2,}/)) {
    const lines = block.split("\n");
    let idx = /^\d+$/.test(lines[0].trim()) ? 1 : 0;
    const timing = lines[idx]?.trim().replace(/\s+/g, " "), m = timing?.match(/(\d{1,2}:\d{2}:\d{2})(?:[.,](\d{1,3}))?\s*-->\s*(\d{1,2}:\d{2}:\d{2})(?:[.,](\d{1,3}))?/);
    if (!m) continue;
    const [, startHms, startMsRaw = "0", endHms, endMsRaw = "0"] = m, to3 = (ms) => ms.padEnd(3, "0").slice(0, 3);
    vttLines.push(startHms + "." + to3(startMsRaw) + " --> " + endHms + "." + to3(endMsRaw));
    for (let i = idx + 1; i < lines.length; i++) vttLines.push(lines[i]);
    vttLines.push("");
  }
  return vttLines.join("\n");
}
function parseVttText(text) {
  const state2 = { tag: /<(\/)?([a-z0-9.:]+)([^>]*)>/gi, o: "", l: 0, p: null, c: "" }, esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  let m;
  while (m = state2.tag.exec(text)) {
    const chunk = text.slice(state2.l, m.index);
    if (chunk) state2.c += esc(chunk);
    const [_, cls, tag_n, rest] = m, low = tag_n.toLowerCase();
    if (/^[0-9]/.test(tag_n)) {
      state2.o += state2.p ? `<span data-part="timed" data-time="${state2.p}">${state2.c}</span>` : state2.c;
      state2.p = tag_n;
      state2.c = "";
    } else {
      if (cls) state2.c += ["c", "v", "lang"].includes(low) ? "</span>" : `</${low}>`;
      else if (["b", "i", "u", "ruby", "rt"].includes(low)) state2.c += `<${low}>`;
      else if (low === "c") state2.c += `<span class="vtt-c ${rest.replace(/\.([a-z0-9_-]+)/gi, "$1 ").trim()}">`;
      else if (low === "v") state2.c += `<span data-part="voice"${rest.trim() ? ` title="${esc(rest.trim())}"` : ""}>`;
      else if (low === "lang") state2.c += `<span lang="${esc(rest.trim())}">`;
    }
    state2.l = state2.tag.lastIndex;
  }
  const lChunk = text.slice(state2.l);
  if (lChunk) state2.c += esc(lChunk);
  return state2.o + (state2.p ? `<span data-part="timed" data-time="${state2.p}">${state2.c}</span>` : state2.c);
}
function formatVttLine(p, maxChars) {
  const state2 = { tokens: p.match(/<[^>]+>|\S+/g) || [], stack: [], parts: [], line: "", len: 0, openStr: "", closeStr: "", timeTag: "", lastWasTag: false }, updateTags = () => (state2.openStr = state2.stack.map((n) => `<${n}>`).join(""), state2.closeStr = state2.stack.reduceRight((a, n) => a + `</${n}>`, "")), flush = () => state2.line && (state2.parts.push(state2.line + state2.closeStr), state2.line = (state2.timeTag || "") + state2.openStr, state2.len = 0, state2.lastWasTag = true);
  state2.tokens.forEach((tok) => {
    const tag = tok[0] === "<", closeTag = tag && tok[1] === "/";
    if (tag) {
      if (state2.line && !state2.lastWasTag && !closeTag) state2.line += " ";
      const m = tok.match(/^<\/?\s*([a-z0-9._:-]+)/i), n = m?.[1] || "", timing = /^\d/.test(n);
      if (timing) return state2.timeTag = tok, state2.line += tok, state2.lastWasTag = true;
      if (!closeTag && !tok.endsWith("/>") && n) state2.stack.push(n), updateTags();
      if (closeTag && state2.stack.length) state2.stack.pop(), updateTags();
      return state2.lastWasTag = true, state2.line += tok;
    }
    const len = stripTags(tok).length, needSpace = state2.line && !state2.lastWasTag;
    if (state2.len + (needSpace ? 1 : 0) + len > maxChars) flush();
    if (needSpace) state2.line += " ", state2.len += 1;
    state2.line += tok, state2.len += len, state2.lastWasTag = false;
  });
  return flush(), state2.parts;
}

// src/ts/utils/time.ts
function formatMediaTime({ time, format = "digital", elapsed = true, showMs = false, casing = "normal" } = { time: 0 }) {
  const long = format.endsWith("long"), sx = (n = 0) => n == 1 ? "" : "s", cs = (str) => casing === "upper" ? str.toUpperCase() : casing === "title" ? str.replace(/^([a-z])/i, (m2) => m2.toUpperCase()) : str.toLowerCase(), wrd = (n = 0) => ({ h: cs(long ? " hour" + sx(n) + " " : "h"), m: cs(long ? " minute" + sx(n) + " " : "m"), s: cs(long ? " second" + sx(n) + " " : "s"), ms: cs(long ? " millisecond" + sx(n) + " " : "ms") }), pad = (v, n = 2, f) => long && !f ? v : String(v).padStart(n, "number" === typeof +n ? "0" : "-");
  if (isNaN(time ?? NaN) || time === Infinity) return format !== "digital" ? ("-" + wrd().h + pad("-") + wrd().m + (!elapsed ? "left" : "")).trim() : !elapsed ? "--:--" : "-:--";
  const s = Math.floor(Math.abs(time) % 60), m = Math.floor(Math.abs(time) / 60) % 60, h = Math.floor(Math.abs(time) / 3600), ms = Math.floor(Math.abs(time) % 1 * 1e3);
  if (format === "digital") {
    const base2 = h ? h + ":" + pad(m, 2, true) + ":" + pad(s, 2, true) : m + ":" + pad(s, 2, true);
    return !elapsed ? "-" + base2 : base2;
  }
  const base = h ? h + wrd(h).h + pad(m) + wrd(m).m + pad(s) + wrd(s).s : m + wrd(m).m + pad(s) + wrd(s).s, msPart = showMs && ms ? pad(ms, 3) + wrd(ms).ms : "";
  return (base + msPart + (!long ? " " : "") + (!elapsed ? "left" : "")).trim();
}
function createTimeRanges(ranges) {
  if (!ranges || ranges.length !== void 0) return ranges || { length: 0, start: () => 0, end: () => 0 };
  const pairs = ranges.sort((a, b) => a[0] - b[0]);
  return {
    length: pairs.length,
    start: (i) => pairs[i] ? pairs[i][0] : 0,
    end: (i) => pairs[i] ? pairs[i][1] : 0
  };
}

// src/ts/utils/obj.ts
var arrRx = /^([^\[\]]+)\[(\d+)\]$/;
function isDef(val) {
  return val !== void 0;
}
function isArr(obj) {
  return Array.isArray(obj);
}
function isObj(obj, checkArr = true) {
  return "object" === typeof obj && obj !== null && (checkArr ? !Array.isArray(obj) : true);
}
function isStrictObj(obj, crossRealms = false, typecheck = true) {
  return (typecheck ? isObj(obj, false) : true) && (crossRealms ? Object.prototype.toString.call(obj) === "[object Object]" : obj.constructor === Object);
}
function isIter(obj) {
  return obj != null && "function" === typeof obj[Symbol.iterator];
}
function isUISetting(obj) {
  return isObj(obj) && "options" in obj && isArr(obj.options);
}
function inBoolArrOpt(opt, str) {
  return opt?.includes?.(str) ?? opt;
}
function setHTMLConfig(target, attr, value) {
  value = value.trim();
  const path = attr.replace("tmg--", "");
  const parsedValue = (() => {
    if (value.includes(",")) return value.split(",")?.map((v) => v.trim());
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (/^\d+$/.test(value)) return Number(value);
    return value;
  })();
  setAny(target, path, parsedValue, "--", (p) => camelize(p));
}
function setAny(target, key, value, separator = ".", keyFunc) {
  var _a, _b;
  if (!key.includes(separator)) return void (target[keyFunc ? keyFunc(key) : key] = value);
  const keys = key.split(separator);
  let currObj = target;
  for (let i = 0; i < keys.length; i++) {
    const key2 = keyFunc ? keyFunc(keys[i]) : keys[i], match = key2.includes("[") && key2.match(arrRx);
    if (match) {
      const [, key3, iStr] = match;
      if (!isArr(currObj[key3])) currObj[key3] = [];
      if (i === keys.length - 1) currObj[key3][Number(iStr)] = value;
      else (_a = currObj[key3])[_b = Number(iStr)] || (_a[_b] = {}), currObj = currObj[key3][Number(iStr)];
    } else {
      if (i === keys.length - 1) currObj[key2] = value;
      else currObj[key2] || (currObj[key2] = {}), currObj = currObj[key2];
    }
  }
}
function getAny(source, key, separator = ".", keyFunc) {
  if (!key.includes(separator)) return source[keyFunc ? keyFunc(key) : key];
  const keys = key.split(separator);
  let currObj = source;
  for (let i = 0; i < keys.length; i++) {
    const key2 = keyFunc ? keyFunc(keys[i]) : keys[i], match = key2.includes("[") && key2.match(arrRx);
    if (match) {
      const [, key3, iStr] = match;
      if (!isArr(currObj[key3]) || !(key3 in currObj)) return void 0;
      currObj = currObj[key3][Number(iStr)];
    } else {
      if (!isObj(currObj) || !(key2 in currObj)) return void 0;
      currObj = currObj[key2];
    }
  }
  return currObj;
}
function deleteAny(target, key, separator = ".", keyFunc) {
  if (!key.includes(separator)) return void delete target[keyFunc ? keyFunc(key) : key];
  const keys = key.split(separator);
  let currObj = target;
  for (let i = 0; i < keys.length; i++) {
    const key2 = keyFunc ? keyFunc(keys[i]) : keys[i], match = key2.includes("[") && key2.match(arrRx);
    if (match) {
      const [, key3, iStr] = match;
      if (!isArr(currObj[key3]) || !(key3 in currObj)) return;
      if (i === keys.length - 1) delete currObj[key3][Number(iStr)];
      else currObj = currObj[key3][Number(iStr)];
    } else {
      if (!isObj(currObj) || !(key2 in currObj)) return;
      if (i === keys.length - 1) delete currObj[key2];
      else currObj = currObj[key2];
    }
  }
}
function inAny(source, key, separator = ".", keyFunc) {
  if (!key.includes(separator)) return key in source;
  const keys = key.split(separator);
  let currObj = source;
  for (let i = 0; i < keys.length; i++) {
    const key2 = keyFunc ? keyFunc(keys[i]) : keys[i], match = key2.includes("[") && key2.match(arrRx);
    if (match) {
      const [, key3, iStr] = match;
      if (!isArr(currObj[key3]) || !(key3 in currObj)) return false;
      if (i === keys.length - 1) return true;
      currObj = currObj[key3][Number(iStr)];
    } else {
      if (!isObj(currObj) || !(key2 in currObj)) return false;
      if (i === keys.length - 1) return true;
      currObj = currObj[key2];
    }
  }
  return true;
}
function parseUIObj(obj) {
  const result = {}, keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const entry = obj[keys[i]];
    if (!isObj(entry)) continue;
    if (isUISetting(entry)) {
      result[keys[i]] = {
        values: entry.options.map((opt) => "value" in opt ? opt.value : opt),
        displays: entry.options.map((opt) => "display" in opt ? opt.display : String(opt))
      };
    } else result[keys[i]] = parseUIObj(entry);
  }
  return result;
}
function parseAnyObj(obj, separator = ".", keyFunc = (p) => p, visited = /* @__PURE__ */ new WeakSet()) {
  if (!isObj(obj) || visited.has(obj)) return obj;
  visited.add(obj);
  const result = {};
  Object.keys(obj).forEach((k) => k.includes(separator) ? setAny(result, k, parseAnyObj(obj[k], separator, keyFunc, visited), separator, keyFunc) : result[k] = isObj(obj[k]) ? parseAnyObj(obj[k], separator, keyFunc, visited) : obj[k]);
  return result;
}
function parsePanelBottomObj(obj = [], arr = false) {
  if (!isObj(obj) && !isArr(obj)) return false;
  const [third = [], second = [], first = []] = isObj(obj) ? Object.values(obj).reverse() : isArr(obj[0]) ? [...obj].reverse() : [obj];
  return arr ? [...third, ...second, ...first] : { 1: first, 2: second, 3: third };
}
function parseEvOpts(options, opts, boolOpt = opts[0], result = {}) {
  return Object.assign(result, "boolean" === typeof options ? { [boolOpt]: options } : options), result;
}
function mergeObjs(o1 = {}, o2 = {}) {
  const merged = { ...o1 || {}, ...o2 || {} };
  return Object.keys(merged).forEach((k) => isObj(o1?.[k]) && isObj(o2?.[k]) && (merged[k] = mergeObjs(o1[k], o2[k]))), merged;
}
function getTrailPaths(path, reverse = true) {
  const parts = path.split("."), chain = ["*"];
  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    chain.push(acc);
  }
  return reverse ? chain.reverse() : chain;
}
function getTrailRecords(obj, path) {
  const parts = path.split("."), record = [["*", obj, obj]];
  let acc = "", currObj = obj;
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    record.push([acc, currObj, currObj = currObj?.[parts[i]]]);
  }
  return record;
}
function deepClone(obj, crossRealms, visited = /* @__PURE__ */ new WeakMap()) {
  if (!(isStrictObj(obj, crossRealms) || isArr(obj)) || visited.has(obj)) return obj;
  const clone = isArr(obj) ? [] : {};
  visited.set(obj, clone);
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) clone[keys[i]] = deepClone(obj[keys[i]], crossRealms, visited);
  return clone;
}

// src/ts/utils/num.ts
function isValidNum(val) {
  return !isNaN(val ?? NaN) && val !== Infinity;
}
function clamp(min = 0, val, max = Infinity) {
  return Math.min(Math.max(val, min), max);
}
function safeNum(number, fallback = 0) {
  return isValidNum(number) ? number : fallback;
}
function parseIfPercent(percent, amount, autocap = 0.25) {
  const val = percent?.endsWith?.("%") ? safeNum(parseFloat(percent) / 100 * amount) : percent;
  return val && amount && autocap && amount <= val ? amount * autocap : val;
}
function parseCSSTime(time) {
  return time?.endsWith?.("ms") ? parseFloat(time) : parseFloat(time) * 1e3;
}
function parseCSSUnit(val) {
  return val?.endsWith?.("px") ? parseFloat(val) : remToPx(parseFloat(val));
}
function remToPx(val) {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * val;
}
function stepNum(v = 0, { min, max, step }) {
  const s = Math.round((safeNum(v) - min) / step) * step + min;
  return clamp(min, +s.toFixed(10), max);
}
var _stepsCache = /* @__PURE__ */ new Map();
function rotate(cur, steps, dir = "forwards", wrap = true) {
  let list;
  if (Array.isArray(steps)) list = steps;
  else {
    const key = `${steps.min}|${steps.max}|${steps.step}`;
    if (_stepsCache.has(key)) list = _stepsCache.get(key);
    else _stepsCache.set(key, list = Array.from({ length: Math.floor((steps.max - steps.min) / steps.step) + 1 }, (_, i) => steps.min + i * steps.step));
  }
  let idx = "number" === typeof cur ? list.reduce((p, c, x) => Math.abs(c - cur) < Math.abs(list[p] - cur) ? x : p, 0) : list.indexOf(cur);
  idx = idx + (dir === "forwards" ? 1 : -1);
  return list[wrap ? (idx + list.length) % list.length : clamp(0, idx, list.length - 1)];
}

// src/ts/consts/generics.ts
var FN_KEY = "tmg_fn_registry";
var LUID_KEY = "tmg_local_uid";
var whiteListedKeys = [" ", "enter", "escape", "arrowup", "arrowdown", "arrowleft", "arrowright", "home", "end", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var errorCodes = [
  1,
  // MEDIA_ERR_ABORTED
  2,
  // MEDIA_ERR_NETWORK
  3,
  // MEDIA_ERR_DECODE
  4,
  // MEDIA_ERR_SRC_NOT_SUPPORTED
  5
  // MEDIA_ERR_UNKNOWN
];
var modes = ["fullscreen", "theater", "pictureInPicture", "miniplayer"];
var controls = ["expandminiplayer", "removeminiplayer", "meta", "timeline", "capture", "fullscreenorientation", "fullscreenlock", "prev", "playpause", "next", "brightness", "volume", "timeandduration", "spacer", "playbackrate", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"];
var bigControls = ["bigprev", "bigplaypause", "bignext"];
var keyShortcutActions = ["prev", "next", "playPause", "skipBwd", "skipFwd", "stepFwd", "stepBwd", "mute", "dark", "volumeUp", "volumeDown", "brightnessUp", "brightnessDown", "playbackRateUp", "playbackRateDown", "timeMode", "timeFormat", "capture", "objectFit", "pictureInPicture", "theater", "fullscreen", "captions", "captionsFontSizeUp", "captionsFontSizeDown", "captionsFontFamily", "captionsFontWeight", "captionsFontVariant", "captionsFontOpacity", "captionsBackgroundOpacity", "captionsWindowOpacity", "captionsCharacterEdgeStyle", "captionsTextAlignment", "settings"];
var moddedKeyShortcutActions = ["skip", "volume", "brightness", "playbackRate", "captionsFontSize"];
var aptAutoplayOptions = ["in-view", "out-view", "in-view-always", "out-view-always"];
var orientationOptions = ["auto", "landscape", "portrait", "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];

// src/ts/utils/str.ts
function capitalize(word = "") {
  return word.replace(/^(\s*)([a-z])/i, (_, s, l) => s + l.toUpperCase());
}
function camelize(str = "", { source } = /[\s_-]+/, { preserveInnerCase: pIC = true, upperFirst: uF = false } = {}) {
  return (pIC ? str : str.toLowerCase()).replace(new RegExp(source + "(\\w)", "g"), (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c[uF ? "toUpperCase" : "toLowerCase"]());
}
function uncamelize(str, separator = " ") {
  return str.replace(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase();
}
function uid(prefix = "tmg_") {
  return prefix + Date.now().toString(36) + "_" + performance.now().toString(36).replace(".", "") + "_" + Math.random().toString(36).slice(2);
}
function luid(prefix = "tmg_local_") {
  let id = localStorage.getItem(LUID_KEY);
  return !id && localStorage.setItem(LUID_KEY, id = uid(prefix)), id || "";
}
function isSameURL(src1, src2) {
  if (typeof src1 !== "string" || typeof src2 !== "string" || !src1 || !src2) return false;
  try {
    const u1 = new URL(src1, window.location.href), u2 = new URL(src2, window.location.href);
    return decodeURIComponent(u1.origin + u1.pathname) === decodeURIComponent(u2.origin + u2.pathname);
  } catch {
    return src1.replace(/\\/g, "/").split("?")[0].trim() === src2.replace(/\\/g, "/").split("?")[0].trim();
  }
}

// src/ts/utils/file.ts
function formatSize(size, decimals = 3, base = 1e3) {
  if (size < base) return size + " byte" + (size == 1 ? "" : "s");
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], exponent = Math.min(Math.floor(Math.log(size) / Math.log(base)), units.length - 1);
  return (size / Math.pow(base, exponent)).toFixed(decimals).replace(/\.0+$/, "") + " " + units[exponent];
}
function getExtension(fn) {
  return fn.slice(fn.lastIndexOf(".") + 1).toLowerCase() ?? "";
}
function noExtension(fn) {
  return fn.replace(/(?:\.(?:mp4|mkv|avi|mov|webm|flv|wmv|m4v|mpg|mpeg|3gp|ogv|ts))+$/i, "");
}
function getMimeTypeFromExtension(fn) {
  return {
    m3u8: "application/vnd.apple.mpegurl",
    mpd: "application/dash+xml",
    avi: "video/x-msvideo",
    mp4: "video/mp4",
    mkv: "video/x-matroska",
    mov: "video/quicktime",
    flv: "video/x-flv",
    webm: "video/webm",
    ogg: "video/ogg",
    wmv: "video/x-ms-wmv",
    "3gp": "video/3gpp",
    "3g2": "video/3gpp2",
    mpeg: "video/mpeg",
    ts: "video/mp2t",
    m4v: "video/x-m4v"
  }[getExtension(fn)] || "application/octet-stream";
}

// src/ts/utils/color.ts
function getRGBBri([r, g, b]) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
function getRGBSat([r, g, b]) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}
function clampRGBBri([r, g, b], m = 40) {
  const br = getRGBBri([r, g, b]), d = br < m ? m - br : br > 255 - m ? -(br - (255 - m)) : 0;
  return [r + d, g + d, b + d].map((v) => clamp(0, v, 255));
}
async function getDominantColor(src, format = "rgb", raw = false) {
  if (typeof src == "string")
    src = await new Promise((res, rej) => {
      const i = createEl("img", { src: String(src), crossOrigin: "anonymous", onload: () => res(i), onerror: () => rej(new Error(`Image load error: ${src}`)) });
    });
  if (src?.canvas) src = src.canvas;
  const c = document.createElement("canvas"), x = c.getContext("2d"), s = Math.min(64, src.width, src.height);
  c.width = c.height = s;
  src?.width && src?.height && x?.drawImage(src, 0, 0, s, s);
  const d = src && x?.getImageData(0, 0, s, s).data, ct = {}, pt = {};
  for (let i = 0; i < (d?.length ?? 0); i += 4) {
    if (d[i + 3] < 128) continue;
    const r2 = d[i] & 240, g2 = d[i + 1] & 240, b2 = d[i + 2] & 240;
    const k = r2 << 16 | g2 << 8 | b2;
    ct[k] = (ct[k] || 0) + 1;
    pt[k] = pt[k] ? [pt[k][0] + d[i], pt[k][1] + d[i + 1], pt[k][2] + d[i + 2]] : [d[i], d[i + 1], d[i + 2]];
  }
  const clrs = Object.keys(ct).sort((a, b2) => ct[b2] - ct[a]).slice(0, 7).map((k) => ({ key: k, rgb: pt[k].map((v) => Math.round(v / ct[k])) }));
  if (!clrs.length) return null;
  const [r, g, b] = clampRGBBri(clrs.reduce((sat, curr) => getRGBSat(sat.rgb) > getRGBSat(curr.rgb) ? sat : curr, clrs[0]).rgb, 70);
  return format === "hex" ? `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}` : raw == false ? `rgb(${r},${g},${b})` : [r, g, b];
}
function convertToMonoChrome(canvas, context) {
  const frame = context.getImageData(0, 0, canvas.width || 1, canvas.height || 1);
  for (let i = 0; i < frame.data.length / 4; i++) {
    const grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;
    frame.data[i * 4 + 0] = grey, frame.data[i * 4 + 1] = grey, frame.data[i * 4 + 2] = grey;
  }
  context.putImageData(frame, 0, 0);
}

// src/ts/utils/browser.ts
var w = typeof window !== "undefined" ? window : void 0;
var nav = w?.navigator;
var ua = nav?.userAgent || "";
var uaData = nav?.userAgentData;
var IS_ANDROID = false;
var IS_WINDOWS = false;
var IS_FIREFOX = false;
var IS_EDGE = false;
var IS_CHROME = false;
var IS_CHROMIUM = false;
var IS_SAFARI = false;
var IS_IE = false;
var IS_TIZEN = false;
var IS_WEBOS = false;
var IS_IPOD = false;
var IS_IPAD = false;
var IS_IPHONE = false;
var IOS_VERSION = null;
var ANDROID_VERSION = null;
var CHROME_VERSION = null;
var CHROMIUM_VERSION = null;
var IE_VERSION = null;
var IS_CHROMECAST_RECEIVER = Boolean(w?.cast?.framework?.CastReceiverContext);
var TOUCH_ENABLED = Boolean(w && ("ontouchstart" in w || nav?.maxTouchPoints || w.DocumentTouch && w.document instanceof w.DocumentTouch));
var pickVersion = (brands, needle) => brands.find((b) => b.brand === needle && b.version)?.version || null;
if (uaData?.platform && uaData?.brands) {
  IS_ANDROID = uaData.platform === "Android";
  IS_WINDOWS = uaData.platform === "Windows";
  IS_EDGE = uaData.brands.some((b) => b.brand === "Microsoft Edge");
  IS_CHROMIUM = uaData.brands.some((b) => b.brand === "Chromium" || b.brand === "Google Chrome");
  IS_CHROME = IS_CHROMIUM && !IS_EDGE;
  CHROMIUM_VERSION = CHROME_VERSION = pickVersion(uaData.brands, "Chromium") || pickVersion(uaData.brands, "Google Chrome");
}
if (!IS_CHROMIUM || !CHROMIUM_VERSION) {
  IS_ANDROID = /Android/i.test(ua);
  IS_WINDOWS || (IS_WINDOWS = /Windows/i.test(ua));
  IS_FIREFOX = /Firefox|FxiOS/i.test(ua);
  IS_EDGE = /Edg|EdgiOS/i.test(ua);
  IS_CHROMIUM = /Chrome|CriOS/i.test(ua);
  IS_CHROME = IS_CHROMIUM && !IS_EDGE;
  IS_SAFARI = /Safari/i.test(ua) && !IS_CHROME && !IS_FIREFOX && !IS_EDGE;
  IS_IE = /MSIE|(Trident\/7.0)|(rv:11.0)/i.test(ua);
  IS_TIZEN = /Tizen/i.test(ua);
  IS_WEBOS = /Web0S/i.test(ua);
  IS_IPOD = /iPod/i.test(ua);
  IS_IPAD = /iPad/i.test(ua) || IS_SAFARI && TOUCH_ENABLED && !/iPhone/i.test(ua);
  IS_IPHONE = /iPhone/i.test(ua) && !IS_IPAD;
  IOS_VERSION = ua.match(/OS (\d+)_/i)?.[1] ?? null;
  ANDROID_VERSION = ua.match(/Android\s(\d+(?:\.\d+)+)/i)?.[1] ?? null;
  CHROMIUM_VERSION = CHROME_VERSION = ua.match(/(?:Chrome|CriOS)\/(\d+)/)?.[1] ?? CHROMIUM_VERSION;
  IE_VERSION = ua.match(/MSIE\s(\d+)\.\d/)?.[1] || (/Trident\/7.0/i.test(ua) && /rv:11.0/.test(ua) ? "11.0" : null);
}
var IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;
var IS_MOBILE = Boolean(IS_ANDROID || IS_IPHONE || IS_IPOD || IS_IPAD);
var IS_SMART_TV = IS_TIZEN || IS_WEBOS;
var queryMediaMobile = (query = "(max-width: 480px), (max-width: 940px) and (max-height: 480px) and (orientation: landscape)") => Boolean(w && "matchMedia" in w && w.matchMedia(query).matches);

// src/ts/utils/keys.ts
function parseKeyCombo(combo) {
  const parts = combo.toLowerCase().split("+");
  return { ctrlKey: parts.includes("ctrl"), shiftKey: parts.includes("shift"), altKey: parts.includes("alt"), metaKey: parts.includes("meta") || parts.includes("cmd"), key: parts.find((p) => !["ctrl", "shift", "alt", "meta", "cmd"].includes(p)) || "" };
}
function stringifyKeyCombo(e) {
  const parts = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.altKey) parts.push("alt");
  if (e.shiftKey) parts.push("shift");
  if (e.metaKey) parts.push("meta");
  parts.push(e.key?.toLowerCase() ?? "");
  return parts.join("+");
}
function cleanKeyCombo(combo) {
  const clean = (combo2) => {
    const m = ["ctrl", "alt", "shift", "meta"], alias = { cmd: "meta" };
    if (combo2 === " " || combo2 === "+") return combo2;
    combo2 = combo2.replace(/\+\s*\+$/, "+plus");
    const p = combo2.toLowerCase().split("+").filter((k) => k !== "").map((k) => alias[k] || (k === "plus" ? "+" : k.trim() || " "));
    return [...p.filter((k) => m.includes(k)).sort((a, b) => m.indexOf(a) - m.indexOf(b)), ...p.filter((k) => !m.includes(k)) || ""].join("+");
  };
  return isArr(combo) ? combo.map(clean) : clean(combo);
}
function matchKeys(required, actual, strict = false) {
  const match = (required2, actual2) => {
    if (strict) return required2 === actual2;
    const reqKeys = required2.split("+"), actKeys = actual2.split("+");
    return reqKeys.every((k) => actKeys.includes(k));
  };
  return isArr(required) ? required.some((req) => match(req, actual)) : match(required, actual);
}
function getTermsForKey(combo, settings) {
  const terms = { override: false, block: false, allowed: false, action: null }, { overrides = [], shortcuts = {}, blocks = [], strictMatches: s = false } = settings?.keys || {};
  if (matchKeys(overrides, combo, s)) terms.override = true;
  if (matchKeys(blocks, combo, s)) terms.block = true;
  if (matchKeys(whiteListedKeys, combo)) terms.allowed = true;
  terms.action = Object.keys(shortcuts).find((key) => matchKeys(shortcuts[key], combo, s)) || null;
  return terms;
}
function keyEventAllowed(e, settings) {
  if (settings?.keys?.disabled || (e.key === " " || e.key === "Enter") && e.currentTarget?.document?.activeElement?.tagName === "BUTTON" || e.currentTarget?.document?.activeElement?.matches("input,textarea,[contenteditable='true']")) return false;
  const combo = stringifyKeyCombo(e), { override, block, action, allowed } = getTermsForKey(combo, settings);
  if (block) return false;
  if (override) e.preventDefault();
  if (action) return action;
  if (allowed) return e.key.toLowerCase();
  return false;
}
var formatKeyForDisplay = (combo) => ` ${(isArr(combo) ? combo : [combo]).map((c) => `(${c})`).join(" or ")}`;
function formatKeyShortcutsForDisplay(keyShortcuts) {
  const shortcuts = {};
  for (const action of Object.keys(keyShortcuts)) shortcuts[action] = formatKeyForDisplay(keyShortcuts[action]);
  return shortcuts;
}
function parseForARIAKS(s) {
  const m = { ctrl: "Control", cmd: "Meta", space: "Space", plus: "+" };
  return s.toLowerCase().replace(/[()]/g, "").replace(/\bor\b/g, " ").replace(/\w+/g, (k) => m[k] || k).replace(/\s+/g, " ").trim();
}

// src/ts/utils/fn.ts
function setTimeout2(handler, timeout, ...args) {
  const sig = args[0] instanceof AbortSignal ? args.shift() : void 0;
  if (sig?.aborted) return -1;
  const w2 = args[0] instanceof Window ? args.shift() : window;
  if (!sig) return w2.setTimeout(handler, timeout, ...args);
  const id = w2.setTimeout(() => (sig.removeEventListener("abort", kill), typeof handler === "string" ? new Function(handler) : handler(...args)), timeout), kill = () => w2.clearTimeout(id);
  return sig.addEventListener("abort", kill, { once: true }), id;
}
function setInterval(handler, timeout, ...args) {
  const sig = args[0] instanceof AbortSignal ? args.shift() : void 0;
  if (sig?.aborted) return -1;
  const w2 = args[0] instanceof Window ? args.shift() : window, id = w2.setInterval(handler, timeout, ...args);
  return sig?.addEventListener("abort", () => w2.clearInterval(id), { once: true }), id;
}
function requestAnimationFrame2(callback, sig, w2 = window) {
  if (sig?.aborted) return -1;
  if (!sig) return w2.requestAnimationFrame(callback);
  const id = w2.requestAnimationFrame((t) => (sig.removeEventListener("abort", kill), callback(t))), kill = () => w2.cancelAnimationFrame(id);
  return sig.addEventListener("abort", kill, { once: true }), id;
}
var mockAsync = (timeout = 250) => new Promise((resolve) => setTimeout2(resolve, timeout));
var breath = (w2 = window) => new Promise((res) => w2.requestAnimationFrame(res));
var deepBreath = (w2 = window) => new Promise((res) => w2.requestAnimationFrame(() => w2.requestAnimationFrame(res)));
function limited(fn, opts = {}) {
  let count = 0, { key, maxTimes: max = 1 } = "string" === typeof opts ? { key: opts } : opts;
  const getReg = () => JSON.parse(localStorage.getItem(FN_KEY) || "{}"), setReg = (r) => localStorage.setItem(FN_KEY, JSON.stringify(r));
  const handle = (...args) => {
    if (!key) return count++ < max ? fn(...args) : void 0;
    const r = getReg(), c = r[key] || 0;
    return c < max ? (r[key] = c + 1, setReg(r), fn(...args)) : void 0;
  };
  handle.left = max - (handle.count = count);
  handle.reset = () => (count = 0, key && ((r) => (delete r[key], setReg(r)))(getReg()));
  handle.block = () => (count = max, key && ((r) => (r[key] = max, setReg(r)))(getReg()));
  return handle;
}
var oncePerSession = (fn) => limited(fn);
var onceEver = (fn, key = uid()) => limited(fn, key);
function deprecate(message) {
  oncePerSession(() => console.warn(message))();
}
function deprecateForMajor(major, oldName, newName) {
  deprecate(newName ? `${oldName} is deprecated and will be removed in ${major}.0; use ${newName} instead.` : `${oldName} is deprecated and will be removed in ${major}.0.`);
}

// src/ts/utils/dom.ts
function createEl(tag, props = {}, dataset = {}, styles = {}) {
  return assignEl(tag ? document?.createElement(tag) : void 0, props, dataset, styles) ?? null;
}
function assignEl(el, props = {}, dataset = {}, styles = {}) {
  if (!el) return;
  for (const k of Object.keys(props)) if (props[k] !== void 0) el[k] = props[k];
  for (const k of Object.keys(dataset)) if (dataset[k] !== void 0) el.dataset[k] = String(dataset[k]);
  for (const k of Object.keys(styles)) if (styles[k] !== void 0) el.style[k] = styles[k];
}
function getWindow(el) {
  return (el instanceof Window ? el : el instanceof Document ? el?.defaultView : el?.ownerDocument?.defaultView) ?? void 0;
}
function loadResource2(src, type = "style", { module, media, crossOrigin, integrity, referrerPolicy, nonce, fetchPriority, attempts = 3, retryKey = false } = {}, w2 = window) {
  var _a;
  w2.t007 ?? (w2.t007 = {}), (_a = w2.t007)._resourceCache ?? (_a._resourceCache = {});
  if (w2.t007._resourceCache[src]) return w2.t007._resourceCache[src];
  const existing = type === "script" ? Array.prototype.find.call(w2.document.scripts, (s) => isSameURL(s.src, src)) : type === "style" ? Array.prototype.find.call(w2.document.styleSheets, (s) => isSameURL(s.href, src)) : null;
  if (existing) return w2.t007._resourceCache[src] = Promise.resolve(existing);
  w2.t007._resourceCache[src] = new Promise((resolve, reject) => {
    (function tryLoad(remaining, el) {
      const onerror = () => {
        el?.remove?.();
        if (remaining > 1) {
          setTimeout(tryLoad, 1e3, remaining - 1);
          console.warn(`Retrying ${type} load (${attempts - remaining + 1}): ${src}...`);
        } else {
          delete w2.t007._resourceCache[src];
          reject(new Error(`${type} load failed after ${attempts} attempts: ${src}`));
        }
      };
      const url = retryKey && remaining < attempts ? `${src}${src.includes("?") ? "&" : "?"}_${retryKey}=${Date.now()}` : src;
      if (type === "script") w2.document.body.append(el = createEl("script", { src: url, type: module ? "module" : "text/javascript", crossOrigin, integrity, referrerPolicy, nonce, fetchPriority, onload: () => resolve(el), onerror }) || "");
      else if (type === "style") w2.document.head.append(el = createEl("link", { rel: "stylesheet", href: url, media, crossOrigin, integrity, referrerPolicy, nonce, fetchPriority, onload: () => resolve(el), onerror }) || "");
      else reject(new Error(`Unsupported resource type: ${type}`));
    })(attempts);
  });
  return w2.t007._resourceCache[src];
}
function inDocView(el, axis = "y") {
  const rect = el.getBoundingClientRect(), inX = rect.left + window.scrollX >= 0 && rect.right + window.scrollX <= window.scrollX + (window.innerWidth || document.documentElement.clientWidth), inY = rect.top + window.scrollY >= 0 && rect.bottom + window.scrollY <= window.scrollY + (window.innerHeight || document.documentElement.clientHeight);
  return axis === "x" ? inY : axis === "y" ? inX : inY && inX;
}
function getElSiblingAt(p, dir, els, pos = "after") {
  return els.length && Array.prototype.reduce.call(
    els,
    ((closest, child) => {
      const { top: cT, left: cL, width: cW, height: cH } = child.getBoundingClientRect(), offset = p - (dir === "y" ? cT : cL) - (dir === "y" ? cH : cW) / 2, condition = pos === "after" ? offset < 0 && offset > closest.offset : pos === "before" ? offset > 0 && offset < closest.offset : pos === "at" ? Math.abs(offset) <= (dir === "y" ? cH : cW) / 2 && Math.abs(offset) < Math.abs(closest.offset) : false;
      return condition ? { offset, element: child } : closest;
    }),
    { offset: pos === "after" ? -Infinity : Infinity, element: void 0 }
  ).element;
}
var queryFullscreen = () => Boolean(queryFullscreenEl());
function queryFullscreenEl() {
  const d = document;
  return d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement || null;
}
var queryPictureInPicture = () => Boolean(queryPictureInPictureEl());
var queryPictureInPictureEl = () => document.pictureInPictureElement;
function supportsFullscreen() {
  const d = document, v = HTMLVideoElement.prototype;
  return Boolean(d.fullscreenEnabled || d.mozFullscreenEnabled || d.msFullscreenEnabled || d.webkitFullscreenEnabled || d.webkitSupportsFullscreen || v.webkitEnterFullscreen);
}
function supportsPictureInPicture() {
  const w2 = window, d = document, v = HTMLVideoElement.prototype;
  return Boolean(d.pictureInPictureEnabled || v.requestPictureInPicture || w2.documentPictureInPicture);
}
function enterFullscreen(el) {
  const e = el;
  return e.webkitEnterFullscreen ? e.webkitEnterFullscreen() : e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : Promise.reject(new Error("Fullscreen API is not supported"));
}
function exitFullscreen(el) {
  const e = el, d = document;
  return e.webkitExitFullscreen ? e.webkitExitFullscreen() : d.exitFullscreen ? d.exitFullscreen() : d.mozCancelFullScreen ? d.mozCancelFullScreen() : d.webkitExitFullscreen ? d.webkitExitFullscreen() : d.msExitFullscreen ? d.msExitFullscreen() : Promise.reject(new Error("Fullscreen API is not supported"));
}
function addSafeClicks(el, onClick, onDblClick, options) {
  el && removeSafeClicks(el);
  el?.addEventListener("click", el._clickHandler = (e) => (clearTimeout(el._clickTimeoutId), el._clickTimeoutId = setTimeout(() => onClick?.(e), 300)), options);
  el?.addEventListener("dblclick", el._dblClickHandler = (e) => (clearTimeout(el._clickTimeoutId), onDblClick?.(e)), options);
}
function removeSafeClicks(el) {
  el?.removeEventListener("click", el._clickHandler);
  el?.removeEventListener("dblclick", el._dblClickHandler);
}
var intersectionObserver = typeof window !== "undefined" ? new IntersectionObserver(
  (entries) => {
    for (const entry of entries) entry.target._tmgIntersectCbs?.forEach((cb) => cb(entry));
  },
  { root: null, rootMargin: "0px", threshold: 0.3 }
) : null;
var resizeObserver = typeof window !== "undefined" ? new ResizeObserver((entries) => {
  for (const entry of entries) entry.target._tmgResizeCbs?.forEach((cb) => cb(entry));
}) : null;
var mutationObserver = typeof window !== "undefined" ? new MutationObserver((mutations) => {
  const target = mutations[0].target;
  target._tmgMutationCbs?.forEach((cb) => cb(mutations));
}) : null;
function observeResize(el, cb) {
  (el._tmgResizeCbs ?? (el._tmgResizeCbs = /* @__PURE__ */ new Set())).add(cb);
  resizeObserver?.observe(el);
  return () => (el._tmgResizeCbs?.delete(cb), !el._tmgResizeCbs?.size && resizeObserver?.unobserve(el));
}
function observeIntersection(el, cb) {
  (el._tmgIntersectCbs ?? (el._tmgIntersectCbs = /* @__PURE__ */ new Set())).add(cb);
  intersectionObserver?.observe(el);
  return () => (el._tmgIntersectCbs?.delete(cb), !el._tmgIntersectCbs?.size && intersectionObserver?.unobserve(el));
}
function observeMutation(el, cb, options) {
  (el._tmgMutationCbs ?? (el._tmgMutationCbs = /* @__PURE__ */ new Set())).add(cb);
  mutationObserver?.observe(el, options);
  return () => {
    el._tmgMutationCbs?.delete(cb);
  };
}

// src/ts/tools/mixins/index.ts
var mixins_exports = {};
__export(mixins_exports, {
  bindAllMethods: () => bindAllMethods,
  getSnapshotVersion: () => getSnapshotVersion,
  getVersion: () => getVersion,
  guardAllMethods: () => guardAllMethods,
  guardMethod: () => guardMethod,
  inert: () => inert,
  intent: () => intent,
  isInert: () => isInert,
  isIntent: () => isIntent,
  isVolatile: () => isVolatile,
  live: () => live,
  methods: () => methods,
  nuke: () => nuke,
  onAllMethods: () => onAllMethods,
  reactive: () => reactive,
  stable: () => stable,
  state: () => state,
  volatile: () => volatile
});

// src/ts/tools/mixins/methodist.ts
function onAllMethods(owner, callback) {
  let proto = owner;
  while (proto && proto !== Object.prototype) {
    for (const method of Object.getOwnPropertyNames(proto)) {
      if (method === "constructor") continue;
      if ("function" !== typeof Object.getOwnPropertyDescriptor(proto, method)?.value) continue;
      callback(method, owner);
    }
    proto = Object.getPrototypeOf(proto);
  }
}
function bindAllMethods(owner) {
  onAllMethods(owner, (method, owner2) => {
    owner2[method] = owner2[method].bind(owner2);
  });
}
function guardAllMethods(owner, guardFn = guardMethod, bound = true) {
  onAllMethods(owner, (method, owner2) => {
    owner2[method] = guardFn(bound ? owner2[method].bind(owner2) : owner2[method]);
  });
}
function guardMethod(fn, onError = (e) => console.error(e)) {
  return ((...args) => {
    try {
      const result = fn(...args);
      return result instanceof Promise ? result.catch((e) => onError(e)) : result;
    } catch (e) {
      onError(e);
    }
  });
}

// src/ts/core/reactor.ts
var RAW = /* @__PURE__ */ Symbol.for("S.I.A_RAW");
var INERTIA = /* @__PURE__ */ Symbol.for("S.I.A_INERTIA");
var REJECTABLE = /* @__PURE__ */ Symbol.for("S.I.A_REJECTABLE");
var INDIFFABLE = /* @__PURE__ */ Symbol.for("S.I.A_INDIFFABLE");
var TERMINATOR = /* @__PURE__ */ Symbol.for("S.I.A_TERMINATOR");
var VERSION = /* @__PURE__ */ Symbol.for("S.I.A_VERSION");
var SSVERSION = /* @__PURE__ */ Symbol.for("S.I.A_SNAPSHOT_VERSION");
var NOOP = () => {
};
var R_BATCH = ("undefined" !== typeof queueMicrotask ? queueMicrotask : setTimeout).bind(window);
var R_LOG = console.log.bind(console, "[S.I.A Reactor]");
var EV_WARN = console.warn.bind(console, "[S.I.A Event]");
var EV_OPTS = { LISTENER: ["capture", "depth", "once", "signal", "immediate"], MEDIATOR: ["lazy", "signal", "immediate"] };
var _ReactorEvent = class _ReactorEvent {
  constructor(payload, bubbles = false, canWarn = true) {
    this.eventPhase = _ReactorEvent.NONE;
    this._propagationStopped = false;
    this._immediatePropagationStopped = false;
    this._resolved = "";
    this._rejected = "";
    this._warn = NOOP;
    this.type = this.staticType = payload.type;
    this.target = payload.target;
    this.currentTarget = payload.currentTarget;
    this.root = payload.root;
    this.value = payload.target.value;
    this.oldValue = payload.target.oldValue;
    this.path = payload.target.path;
    this.rejectable = payload.rejectable;
    this.bubbles = bubbles;
    if (canWarn) this._warn = EV_WARN;
  }
  get propagationStopped() {
    return this._propagationStopped;
  }
  stopPropagation() {
    this._propagationStopped = true;
  }
  get immediatePropagationStopped() {
    return this._immediatePropagationStopped;
  }
  stopImmediatePropagation() {
    this._propagationStopped = true;
    this._immediatePropagationStopped = true;
  }
  get resolved() {
    return this._resolved;
  }
  resolve(message) {
    if (!this.rejectable) return this._warn(`Ignored resolve() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== _ReactorEvent.CAPTURING_PHASE) this._warn(`Resolving an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._resolved = message || `Could ${this.staticType} intended value at "${this.path}"`;
  }
  get rejected() {
    return this._rejected;
  }
  reject(reason) {
    if (!this.rejectable) return this._warn(`Ignored reject() call on a non-rejectable ${this.staticType} at "${this.path}"`);
    if (this.eventPhase !== _ReactorEvent.CAPTURING_PHASE) this._warn(`Rejecting an intent on ${this.staticType} at "${this.path}" outside of the capture phase is unadvised.`);
    if (this.rejectable) this._rejected = reason || `Couldn't ${this.staticType} intended value at "${this.path}"`;
  }
  composedPath() {
    return getTrailPaths(this.path);
  }
  get canWarn() {
    return this._warn === EV_WARN;
  }
};
_ReactorEvent.NONE = 0;
_ReactorEvent.CAPTURING_PHASE = 1;
_ReactorEvent.AT_TARGET = 2;
_ReactorEvent.BUBBLING_PHASE = 3;
var ReactorEvent = _ReactorEvent;
var Reactor = class {
  constructor(obj = {}, options) {
    this.proxyCache = /* @__PURE__ */ new WeakMap();
    this.log = NOOP;
    this.config = { crossRealms: false, eventBubbling: true, batchingFunction: R_BATCH };
    // `?:`s | pay the ~800 byte price upfront for what u might never use
    this.isLogging = false;
    // keeping track so API getter doesn't slow down internal iterations in any way
    this.isTracing = false;
    this.isTracking = false;
    this.isSCloning = false;
    // Smart Cloning
    this.isBatching = false;
    this[INERTIA] = true;
    this.core = this.proxied(obj);
    if (!options) return;
    this.canLog = !!options.debug;
    if (this.isTracking = !!options.referenceTracking) this.lineage = /* @__PURE__ */ new WeakMap();
    if (this.isSCloning = this.isTracking && !!options.smartCloning) this.snapshotCache = /* @__PURE__ */ new WeakMap();
    this.isTracing = this.isTracking && !!options.lineageTracing;
    const { get = this.config.get, set = this.config.set, delete: del = this.config.delete, crossRealms = this.config.crossRealms, eventBubbling = this.config.eventBubbling } = options;
    Object.assign(this.config, { get, set, delete: del, crossRealms, eventBubbling });
  }
  proxied(obj, rejectable = false, indiffable = false, parent, key, path) {
    if (!obj || typeof obj !== "object") return obj;
    if (!(isStrictObj(obj, this.config.crossRealms, false) || Array.isArray(obj)) || obj[INERTIA]) return obj;
    obj = obj[RAW] || obj;
    if (this.isTracking && parent && key) this.link(obj, parent, key, false);
    if (this.proxyCache.has(obj)) return this.proxyCache.get(obj);
    rejectable || (rejectable = obj[REJECTABLE]);
    indiffable || (indiffable = obj[INDIFFABLE]);
    const proxy = new Proxy(obj, {
      // Robust Proxy handler
      get: (object, key2, receiver) => {
        if (key2 === RAW) return object;
        let value = object[key2];
        const safeKey = String(key2), fullPath = this.isTracing ? void 0 : path ? path + "." + safeKey : safeKey, paths = this.isTracing ? this.trace(object, safeKey) : fullPath;
        this.log(`\u{1F440} [GET Trap] Initiated for "${safeKey}" on "${paths}"`);
        if (this.config.get) value = this.config.get(object, key2, value, receiver, paths);
        if (this.getters) {
          const wildcords = this.getters.get("*");
          for (let i = 0, len = this.isTracing ? paths.length : 1; i < len; i++) {
            const currPath = this.isTracing ? paths[i] : fullPath, cords = this.getters.get(currPath);
            if (!cords && !wildcords) continue;
            const target = { path: currPath, value, key: safeKey, object: receiver }, payload = { type: "get", target, currentTarget: target, root: this.core, rejectable };
            if (cords) value = this.mediate(currPath, payload, "get", cords);
            if (!wildcords) continue;
            target.value = value;
            value = this.mediate("*", payload, "get", wildcords);
          }
        }
        return this.proxied(value, rejectable, indiffable, object, safeKey, fullPath);
      },
      set: (object, key2, value, receiver) => {
        let unchanged, safeValue, safeOldValue, terminated = false;
        const safeKey = String(key2), fullPath = this.isTracing ? void 0 : path ? path + "." + safeKey : safeKey, paths = this.isTracing ? this.trace(object, safeKey) : fullPath, loopLen = this.isTracing ? paths.length : 1, oldValue = object[key2];
        if (this.isTracking || !indiffable) {
          safeOldValue = oldValue?.[RAW] || oldValue;
          safeValue = value?.[RAW] || value;
          unchanged = Object.is(safeValue, safeOldValue);
        }
        if (!indiffable && unchanged) return true;
        this.log(`\u270F\uFE0F [SET Trap] Initiated for "${safeKey}" on "${paths}"`);
        if (this.config.set) terminated = (value = this.config.set(object, key2, value, oldValue, receiver, paths)) === TERMINATOR;
        if (this.setters) {
          const wildcords = this.setters.get("*");
          for (let i = 0; i < loopLen; i++) {
            const currPath = this.isTracking ? paths[i] : fullPath, cords = this.setters.get(currPath);
            if (!cords && !wildcords) continue;
            const target = { path: currPath, value, oldValue, key: safeKey, object: receiver }, payload = { type: "set", target, currentTarget: target, root: this.core, terminated, rejectable };
            if (cords) {
              const result2 = this.mediate(currPath, payload, "set", cords);
              if (!(terminated || (terminated = payload.terminated))) value = result2;
            }
            if (!wildcords) continue;
            target.value = value;
            const result = this.mediate("*", payload, "set", wildcords);
            if (!(terminated || (terminated = payload.terminated))) value = result;
          }
        }
        if (terminated) return this.log(`\u{1F6E1}\uFE0F [SET Mediator] Terminated on "${paths}"`), true;
        object[key2] = value;
        if (this.isTracking && !unchanged) this.isSCloning && this.stamp(object), this.unlink(safeOldValue, object, safeKey), this.link(safeValue, object, safeKey);
        if (this.watchers || this.listeners)
          for (let i = 0; i < loopLen; i++) {
            const currPath = this.isTracking ? paths[i] : fullPath, target = { path: currPath, value, oldValue, key: safeKey, object: receiver };
            this.notify(currPath, { type: "set", target, currentTarget: target, root: this.core, terminated, rejectable });
          }
        return true;
      },
      deleteProperty: (object, key2) => {
        let value, receiver = this.proxyCache.get(object), terminated = false;
        const safeKey = String(key2), fullPath = this.isTracing ? void 0 : path ? path + "." + safeKey : safeKey, paths = this.isTracing ? this.trace(object, safeKey) : fullPath, loopLen = this.isTracing ? paths.length : 1, oldValue = object[key2];
        this.log(`\u{1F5D1}\uFE0F [DELETE Trap] Initiated for "${safeKey}" on "${paths}"`);
        if (this.config.delete) terminated = (value = this.config.delete(object, key2, oldValue, receiver, paths)) === TERMINATOR;
        if (this.deleters) {
          const wildcords = this.deleters.get("*");
          for (let i = 0; i < loopLen; i++) {
            const currPath = this.isTracking ? paths[i] : fullPath, cords = this.deleters.get(currPath);
            if (!cords && !wildcords) continue;
            const target = { path: currPath, value, oldValue, key: safeKey, object: receiver }, payload = { type: "delete", target, currentTarget: target, root: this.core, rejectable };
            if (cords) {
              const result2 = this.mediate(currPath, payload, "delete", cords);
              if (!(terminated || (terminated = payload.terminated))) value = result2;
            }
            if (!wildcords) continue;
            const result = this.mediate("*", payload, "delete", wildcords);
            if (!(terminated || (terminated = payload.terminated))) value = result;
          }
        }
        if (terminated) return this.log(`\u{1F6E1}\uFE0F [DELETE Mediator] Terminated on "${paths}"`), true;
        delete object[key2];
        if (this.isTracking) this.isSCloning && this.stamp(object), this.unlink(oldValue?.[RAW] || oldValue, object, safeKey);
        if (this.watchers || this.listeners)
          for (let i = 0; i < loopLen; i++) {
            const currPath = this.isTracking ? paths[i] : fullPath, target = { path: currPath, value, oldValue, key: safeKey, object: receiver };
            this.notify(currPath, { type: "delete", target, currentTarget: target, root: this.core, rejectable });
          }
        return true;
      }
    });
    return this.proxyCache.set(obj, proxy), proxy;
  }
  trace(target, path, paths = [], visited = /* @__PURE__ */ new WeakSet()) {
    if (Object.is(target, this.core[RAW] || this.core)) return paths.push(path), paths;
    if (visited.has(target)) return paths;
    visited.add(target);
    const es = this.lineage.get(target);
    if (!es) return paths;
    for (let i = 0, len = es.length; i < len; i += 2) this.trace(es[i], es[i + 1] ? es[i + 1] + "." + path : path, paths, visited);
    return paths;
  }
  // won't be called without `.isTracking` so internal guard avoided
  link(target, parent, key, typecheck = true, es) {
    if (typecheck && !(isStrictObj(target, this.config.crossRealms) || Array.isArray(target))) return;
    es = this.lineage.get(target) ?? (this.lineage.set(target, es = []), es);
    for (let i = 0, len = es.length; i < len; i += 2) if (Object.is(es[i], parent) && es[i + 1] === key) return;
    es.push(parent, key);
  }
  unlink(target, parent, key) {
    if (!(isStrictObj(target, this.config.crossRealms) || Array.isArray(target))) return;
    const es = this.lineage.get(target);
    if (es) {
      for (let i = 0, len = es.length; i < len; i += 2) if (Object.is(es[i], parent) && es[i + 1] === key) return void es.splice(i, 2);
    }
  }
  stamp(target, typecheck = true) {
    if (typecheck && "object" !== typeof target) return;
    target[VERSION] = (target[VERSION] || 0) + 1;
    const es = this.lineage?.get(target);
    if (es) for (let i = 0, len = es.length; i < len; i += 2) this.stamp(es[i]);
  }
  mediate(path, payload, type, cords) {
    let terminated = false, value = payload.target.value;
    const isGet = type === "get", isSet = type === "set", mediators = isGet ? this.getters : isSet ? this.setters : this.deleters;
    for (let i = !isGet ? 0 : cords.length - 1, len = !isGet ? cords.length : -1; i !== len; i += !isGet ? 1 : -1) {
      const response = isGet ? cords[i].cb(value, payload) : isSet ? cords[i].cb(value, terminated, payload) : cords[i].cb(terminated, payload);
      if (isGet || !(terminated || (terminated = payload.terminated = response === TERMINATOR))) value = response;
      if (cords[i].once) cords.splice(i--, 1), !cords.length && mediators.delete(path);
    }
    return value;
  }
  notify(path, payload) {
    if (this.watchers) {
      const wildcords = this.watchers.get("*"), cords = this.watchers.get(path);
      if (cords)
        for (let i = 0, len = cords.length; i < len; i++) {
          cords[i].cb(payload.target.value, payload);
          if (cords[i].once) cords.splice(i--, 1), !cords.length && this.watchers.delete(path);
        }
      if (wildcords)
        for (let i = 0, len = wildcords.length; i < len; i++) {
          wildcords[i].cb(payload.target.value, payload);
          if (wildcords[i].once) wildcords.splice(i--, 1), !wildcords.length && this.watchers.delete("*");
        }
    }
    this.listeners && this.schedule(path, payload);
  }
  schedule(path, payload) {
    this.batch ?? (this.batch = /* @__PURE__ */ new Map());
    this.batch.set(path, payload), !this.isBatching && this.initBatching();
  }
  initBatching() {
    this.isBatching = true, this.config.batchingFunction(() => this.flush());
  }
  flush() {
    this.isBatching = false, this.batch && this.tick(this.batch.keys());
    if (this.queue?.size) for (const task of this.queue) task(), this.queue.delete(task);
  }
  wave(path, payload) {
    const e = new ReactorEvent(payload, this.config.eventBubbling, this.isLogging), chain = getTrailRecords(this.core, path);
    e.eventPhase = ReactorEvent.CAPTURING_PHASE;
    for (let i = 0; i <= chain.length - 2; i++) {
      if (e.propagationStopped) break;
      this.fire(chain[i], e, true);
    }
    if (e.propagationStopped) return;
    e.eventPhase = ReactorEvent.AT_TARGET;
    this.fire(chain[chain.length - 1], e, true);
    !e.immediatePropagationStopped && this.fire(chain[chain.length - 1], e, false);
    if (!e.bubbles) return;
    e.eventPhase = ReactorEvent.BUBBLING_PHASE;
    for (let i = chain.length - 2; i >= 0; i--) {
      if (e.propagationStopped) break;
      this.fire(chain[i], e, false);
    }
  }
  fire([path, object, value], e, isCapture, cords = this.listeners.get(path)) {
    if (!cords) return;
    e.type = path !== e.target.path ? "update" : e.staticType;
    e.currentTarget = { path, value, oldValue: e.type !== "update" ? e.target.oldValue : void 0, key: e.type !== "update" ? path : path.slice(path.lastIndexOf(".") + 1) || "", object };
    let tDepth, lDepth;
    for (let i = 0, len = cords.length; i < len; i++) {
      if (e.immediatePropagationStopped) break;
      if (cords[i].capture !== isCapture) continue;
      if (cords[i].depth !== void 0) {
        tDepth ?? (tDepth = this.getDepth(e.target.path)), lDepth ?? (lDepth = this.getDepth(path));
        if (tDepth > lDepth + cords[i].depth) continue;
      }
      cords[i].cb(e);
      if (cords[i].once) cords.splice(i--, 1), !cords.length && this.listeners.delete(path);
    }
  }
  bind(cord, signal) {
    signal?.aborted ? cord.clup() : signal?.addEventListener("abort", cord.clup, { once: true });
    if (signal && !signal.aborted) cord.sclup = () => signal.removeEventListener("abort", cord.clup);
    return cord.clup;
  }
  getContext(path) {
    const lastDot = path.lastIndexOf("."), value = path === "*" ? this.core : getAny(this.core, path), object = lastDot === -1 ? this.core : getAny(this.core, path.slice(0, lastDot));
    return { path, value, key: path.slice(lastDot + 1) || "", object };
  }
  getDepth(p, d = !p ? 0 : 1) {
    for (let i = 0, len = p.length; i < len; i++) if (p.charCodeAt(i) === 46) d++;
    return d;
  }
  tick(paths) {
    if (!paths) return this.flush();
    if ("string" === typeof paths) {
      const task = this.batch?.get(paths);
      task && (this.wave(paths, task), this.batch.delete(paths));
    } else
      for (const path of paths) {
        const task = this.batch.get(path);
        task && (this.wave(path, task), this.batch.delete(path));
      }
  }
  stall(task) {
    this.queue ?? (this.queue = /* @__PURE__ */ new Set());
    this.queue.add(task), !this.isBatching && this.initBatching();
  }
  nostall(task) {
    return this.queue?.delete(task);
  }
  syncAdd(key, path, cb, opts, onImmediate) {
    var _a;
    const { lazy = false, once = false, signal, immediate = false } = parseEvOpts(opts, EV_OPTS.MEDIATOR), store = this[_a = `${key}${key.endsWith("t") ? "t" : ""}ers`] ?? (this[_a] = /* @__PURE__ */ new Map());
    let cords = store.get(path), cord;
    if (cords) {
      for (let i = 0, len = cords.length; i < len; i++)
        if (Object.is(cords[i].cb, cb)) {
          cord = cords[i];
          break;
        }
    }
    if (cord) return cord.clup;
    let task;
    cord = { cb, once, clup: () => (lazy && this.nostall(task), this[`no${key}`](path, cb)) };
    immediate && onImmediate?.(immediate);
    task = () => (cords ?? (store.set(path, cords = []), cords)).push(cord);
    lazy ? this.stall(task) : task();
    return this.bind(cord, signal);
  }
  syncDrop(store, path, cb) {
    const cords = store?.get(path);
    if (!cords) return void 0;
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb)) return cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && store.delete(path), true;
    return false;
  }
  clone(obj, raw, visited = /* @__PURE__ */ new WeakMap()) {
    if (!(isStrictObj(obj, this.config.crossRealms) || Array.isArray(obj)) || visited.has(obj)) return obj;
    const version = obj[VERSION] || 0, cached = !raw && this.isSCloning && this.snapshotCache.get(obj);
    if (cached && obj[SSVERSION] === version) return cached;
    const clone = !raw ? Array.isArray(obj) ? [] : {} : obj[RAW] || obj;
    visited.set(obj, clone);
    const keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) clone[keys[i]] = this.clone(obj[keys[i]], raw, visited);
    if (!raw && this.isSCloning) {
      this.snapshotCache.set(obj, clone);
      obj[SSVERSION] = version;
    }
    return clone;
  }
  get(path, cb, opts) {
    return this.syncAdd("get", path, cb, opts, (imm) => (imm !== "auto" || inAny(this.core, path)) && getAny(this.core, path));
  }
  gonce(path, cb, opts) {
    return this.get(path, cb, { ...parseEvOpts(opts, EV_OPTS.MEDIATOR), once: true });
  }
  noget(path, cb) {
    return this.syncDrop(this.getters, path, cb);
  }
  set(path, cb, opts) {
    return this.syncAdd("set", path, cb, opts, (imm) => (imm !== "auto" || inAny(this.core, path)) && setAny(this.core, path, getAny(this.core, path)));
  }
  sonce(path, cb, opts) {
    return this.set(path, cb, Object.assign(parseEvOpts(opts, EV_OPTS.MEDIATOR), { once: true }));
  }
  noset(path, cb) {
    return this.syncDrop(this.setters, path, cb);
  }
  delete(path, cb, opts) {
    return this.syncAdd("delete", path, cb, opts, (imm) => (imm !== "auto" || inAny(this.core, path)) && deleteAny(this.core, path, void 0));
  }
  donce(path, cb, opts) {
    return this.delete(path, cb, Object.assign(parseEvOpts(opts, EV_OPTS.MEDIATOR), { once: true }));
  }
  nodelete(path, cb) {
    return this.syncDrop(this.deleters, path, cb);
  }
  watch(path, cb, opts) {
    return this.syncAdd("watch", path, cb, opts, (imm) => imm !== "auto" && inAny(this.core, path) && ((target) => cb(target.value, { type: "init", target, currentTarget: target, root: this.core, rejectable: false }))(this.getContext(path)));
  }
  wonce(path, cb, opts) {
    return this.watch(path, cb, Object.assign(parseEvOpts(opts, EV_OPTS.MEDIATOR), { once: true }));
  }
  nowatch(path, cb) {
    return this.syncDrop(this.watchers, path, cb);
  }
  on(path, cb, options) {
    this.listeners ?? (this.listeners = /* @__PURE__ */ new Map());
    const { capture = false, once = false, signal, immediate = false, depth } = parseEvOpts(options, EV_OPTS.LISTENER);
    let cords = this.listeners.get(path), cord;
    if (cords) {
      for (let i = 0, len = cords.length; i < len; i++)
        if (Object.is(cords[i].cb, cb) && capture === cords[i].capture) {
          cord = cords[i];
          break;
        }
    }
    if (cord) return cord.clup;
    cord = { cb, capture, depth, once, clup: () => this.off(path, cb, options) };
    if (immediate && (immediate !== "auto" || inAny(this.core, path))) {
      const target = this.getContext(path);
      cb(new ReactorEvent({ type: "init", target, currentTarget: target, root: this.core, rejectable: false }, this.config.eventBubbling, this.isLogging));
    }
    (cords ?? (this.listeners.set(path, cords = []), cords)).push(cord);
    return this.bind(cord, signal);
  }
  once(path, cb, options) {
    return this.on(path, cb, Object.assign(parseEvOpts(options, EV_OPTS.LISTENER), { once: true }));
  }
  off(path, cb, options) {
    const cords = this.listeners?.get(path);
    if (!cords) return void 0;
    const { capture } = parseEvOpts(options, EV_OPTS.LISTENER);
    for (let i = 0, len = cords.length; i < len; i++) if (Object.is(cords[i].cb, cb) && cords[i].capture === capture) return cords[i].sclup?.(), cords.splice(i--, 1), !cords.length && this.listeners.delete(path), true;
    return false;
  }
  snapshot(raw = !this.isSCloning, branch = this.core) {
    return this.clone(branch, raw);
  }
  cascade({ type, currentTarget: { path, value: news, oldValue: olds } }, objSafe = true) {
    if (type !== "set" && type !== "delete" || !(isStrictObj(news, this.config.crossRealms) || Array.isArray(news)) || (objSafe ? !(isStrictObj(olds, this.config.crossRealms) || Array.isArray(olds)) : false)) return;
    const obj = objSafe ? mergeObjs(olds, news) : news, keys = Object.keys(obj);
    for (let i = 0, len = keys.length; i < len; i++) setAny(this.core, path + "." + keys[i], obj[keys[i]]);
  }
  reset() {
    this.getters?.clear(), this.setters?.clear(), this.deleters?.clear(), this.watchers?.clear(), this.listeners?.clear();
    this.queue?.clear(), this.batch?.clear(), this.isBatching = false;
    this.proxyCache = /* @__PURE__ */ new WeakMap();
  }
  destroy() {
    this.reset(), nuke(this);
  }
  get canLog() {
    return this.log === R_LOG;
  }
  set canLog(value) {
    this.log = (this.isLogging = value) ? R_LOG : NOOP;
  }
  get canTrackReferences() {
    return this.isTracking;
  }
  get canTraceLineage() {
    return this.isTracing;
  }
  get canSmartClone() {
    return this.isSCloning;
  }
};

// src/ts/tools/mixins/reactive.ts
var methods = ["tick", "stall", "nostall", "get", "gonce", "noget", "set", "sonce", "noset", "delete", "donce", "nodelete", "watch", "wonce", "nowatch", "on", "once", "off", "cascade", "snapshot", "reset", "destroy"];
function reactive(target, options, prefs) {
  const descriptors = {}, rtr = target instanceof Reactor ? target : new Reactor(target, options), locks = { enumerable: false, configurable: true, writable: false }, hasAffix = !!(prefs?.prefix || prefs?.suffix);
  for (let key of methods) {
    if (hasAffix) (prefs?.whitelist?.includes(key) ?? true) && (key = `${prefs?.prefix || ""}${key}${prefs?.suffix || ""}`);
    else if (prefs?.whitelist?.includes(key)) continue;
    descriptors[key] = { value: rtr[key].bind(rtr), ...locks };
  }
  descriptors["__Reactor__"] = { value: rtr, ...locks };
  return Object.defineProperties(rtr.core, descriptors), rtr.core;
}
function inert(target) {
  target[INERTIA] = true;
  return target;
}
function live(target) {
  delete target[INERTIA];
  return target;
}
function isInert(target) {
  return !!target[INERTIA];
}
function intent(target) {
  target[REJECTABLE] = true;
  return target;
}
function state(target) {
  delete target[REJECTABLE];
  return target;
}
function isIntent(target) {
  return !!target[REJECTABLE];
}
function volatile(target) {
  target[INDIFFABLE] = true;
  return target;
}
function stable(target) {
  delete target[INDIFFABLE];
  return target;
}
function isVolatile(target) {
  return !!target[INDIFFABLE];
}
function getVersion(target) {
  return target[VERSION] || 0;
}
function getSnapshotVersion(target) {
  return target[SSVERSION] || 0;
}

// src/ts/tools/mixins/nuke.ts
function nuke(target) {
  let proto = target;
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if ("function" === typeof desc?.value) continue;
      if (desc?.get || desc?.set) continue;
      proto[key] = null;
    }
    proto = Object.getPrototypeOf(proto);
  }
}

// src/ts/core/registry.ts
var BaseRegistry = class {
  constructor() {
    this.items = [];
  }
  register(name, value, options) {
    this.unregister(name);
    return this.items.push({ name, value, options }), this;
  }
  unregister(name) {
    return this.items = this.items.filter((i) => i.name !== name), this;
  }
  get(name) {
    return this.items.find((i) => i.name === name)?.value;
  }
  getAll(order) {
    if (!order) return this.items.map((i) => i.value);
    return this.items.sort((a, b) => {
      const aIdx = order.indexOf(a.name), bIdx = order.indexOf(b.name);
      return aIdx === -1 && bIdx === -1 ? 0 : aIdx === -1 ? 1 : bIdx === -1 ? -1 : aIdx - bIdx;
    }).map((i) => i.value);
  }
};
var OrderedRegistry = class extends BaseRegistry {
  registerPriority(name, value, options) {
    this.unregister(name);
    return this.items.unshift({ name, value, options }), this;
  }
  registerBefore(key, name, value, options) {
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) return console.warn(`[TMG Registry] Cannot register '${name}' before '${key}': Target '${key}' not found.`), this;
    this.unregister(name);
    return this.items.splice(idx, 0, { name, value, options }), this;
  }
  registerAfter(key, name, value, options) {
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) return console.warn(`[TMG Registry] Cannot register '${name}' after '${key}': Target '${key}' not found.`), this;
    this.unregister(name);
    return this.items.splice(idx + 1, 0, { name, value, options }), this;
  }
};
var _IconRegistry = class _IconRegistry extends BaseRegistry {
  static get(name) {
    return this.instance.get(name) || `<svg></svg>`;
  }
  static register(name, svgContent) {
    this.instance.register(name, svgContent);
  }
  // Bulk register a map of icons { play: "<svg...>", pause: "<svg...>" }
  static registerAll(icons) {
    Object.keys(icons).forEach((k) => this.instance.register(k, icons[k]));
  }
};
_IconRegistry.instance = new _IconRegistry();
var IconRegistry = _IconRegistry;
var _TechRegistry = class _TechRegistry extends OrderedRegistry {
  static get(name) {
    return this.instance.get(name);
  }
  static register(Tech) {
    this.instance.register(Tech.techName, Tech);
  }
  static unregister(name) {
    this.instance.unregister(name);
  }
  static registerBefore(key, Tech) {
    this.instance.registerBefore(key, Tech.techName, Tech);
  }
  static registerAfter(key, Tech) {
    this.instance.registerAfter(key, Tech.techName, Tech);
  }
  static pick(src, techOrder) {
    return this.instance.getAll(techOrder).find((T) => T.canPlaySource(src)) || null;
  }
};
_TechRegistry.instance = new _TechRegistry();
var TechRegistry = _TechRegistry;
var _PlugRegistry = class _PlugRegistry extends OrderedRegistry {
  static get(name) {
    return this.instance.get(name);
  }
  static register(Plug, opts) {
    this.instance.register(Plug.plugName, Plug, opts);
  }
  static unregister(name) {
    this.instance.unregister(name);
  }
  static registerBefore(key, Plug) {
    this.instance.registerBefore(key, Plug.plugName, Plug);
  }
  static registerAfter(key, Plug) {
    this.instance.registerAfter(key, Plug.plugName, Plug);
  }
  static getOrdered() {
    return this.instance.getAll();
  }
};
_PlugRegistry.instance = new _PlugRegistry();
var PlugRegistry = _PlugRegistry;
var _ComponentRegistry = class _ComponentRegistry extends BaseRegistry {
  static get(name) {
    return this.instance.get(name);
  }
  static register(Comp) {
    this.instance.register(Comp.componentName, Comp);
  }
  static init(name, ctlr, options = {}) {
    const Comp = this.instance.get(name);
    if (!Comp) return null;
    const instance = new Comp(ctlr, options);
    return instance.create(), instance.setup(), instance;
  }
  static getAll() {
    return this.instance.getAll();
  }
};
_ComponentRegistry.instance = new _ComponentRegistry();
var ComponentRegistry = _ComponentRegistry;

// src/ts/media/index.ts
var media_exports = {};
__export(media_exports, {
  BaseTech: () => BaseTech,
  HTML5Tech: () => HTML5Tech
});

// src/ts/core/controllable.ts
var Controllable = class {
  // for reactivity needs of those who pass it up
  constructor(ctlr, config, state2) {
    this.ac = new AbortController();
    this.signal = this.ac.signal;
    guardAllMethods(this, ctlr.guard, true);
    this.signal = AbortSignal.any([this.signal, ctlr.signal]);
    this.ctlr = ctlr;
    this.guard = ctlr.guard;
    this.media = ctlr.media;
    this.config = config;
    this.state = isObj(state2) ? reactive(state2) : state2;
  }
  setup() {
    this.onSetup();
  }
  destroy() {
    !this.signal.aborted && this.ac.abort(`[TMG Controllable] Instance is being destroyed`);
    this.onDestroy(), this.state?.destroy?.(), this.config?.destroy?.();
    nuke(this);
  }
  onDestroy() {
  }
};

// src/ts/media/base.ts
var BaseTech = class extends Controllable {
  static canPlaySource(src) {
    return false;
  }
  get name() {
    return this.constructor.techName;
  }
  get el() {
    return this.element;
  }
  // Tracking to avoid rewiring
  constructor(ctlr, config, features = {}) {
    super(ctlr, config);
    this.element = config.element;
    this.features = reactive(features);
    this.wiredFeatures = {};
  }
  onSetup() {
    this.mount();
    if (this.ctlr.state.readyState) this.wire();
    else this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal });
  }
  onDestroy() {
    this.unmount();
  }
  mount() {
    this.element && this.element !== this.config.element && this.config.element.replaceWith(this.element);
  }
  unmount() {
    this.element && this.config.element !== this.element && this.element.replaceWith(this.config.element);
  }
  // --- THE MANDATORY CORE 5 ---
  wire() {
    this.media.on("intent", this.handleIntentChange, { signal: this.signal });
    this.wireSrc();
    this.wireCurrentTime();
    this.wireDuration();
    this.wirePaused();
    this.wireEnded();
    this.wireFeatures();
  }
  // --- THE EXTENSIONS ---
  wireFeatures() {
    this.features.on("*", this.handleFeaturesChange, { signal: this.signal, immediate: true });
  }
  // --- Miscellaneous ---
  handleFeaturesChange({ type, target: t }) {
    type === "update" ? this.wireFeature(t.key) : type === "init" && Object.keys(t.value).forEach(this.wireFeature);
  }
  handleIntentChange(e) {
    if (e.type === "update" && !this.features[e.target.key] && e.value) e.stopImmediatePropagation();
  }
  wireFeature(feature) {
    var _a;
    !this.wiredFeatures[feature] && this[`wire${capitalize(feature)}`]?.();
    (_a = this.wiredFeatures)[feature] || (_a[feature] = true);
  }
};

// src/ts/media/html5.ts
var _HTML5Tech = class _HTML5Tech extends BaseTech {
  static canPlaySource(src) {
    return true;
  }
  constructor(ctlr, config) {
    super(ctlr, config, {
      // Kinda Core
      volume: canVidCtrlVolume(),
      muted: canVidMuteVolume(),
      playbackRate: canVidCtrlRate(),
      // Modes
      pictureInPicture: supportsPictureInPicture() && !ctlr.media.state.disablePictureInPicture,
      fullscreen: supportsFullscreen(),
      // Attributes
      poster: true,
      autoplay: true,
      loop: true,
      playsInline: true,
      crossOrigin: true,
      controls: true,
      controlsList: true,
      disablePictureInPicture: true,
      preload: true,
      // Lists
      textTracks: canVidTextTracks(),
      videoTracks: canVidVideoTracks(),
      audioTracks: canVidAudioTracks(),
      activeCue: canVidTextTracks(),
      // Infos
      readyState: true,
      networkState: true,
      error: true,
      waiting: true,
      stalled: true,
      seeking: true,
      buffered: true,
      seekable: true,
      videoWidth: true,
      videoHeight: true,
      loadedMetadata: true,
      canPlay: true,
      canPlayThrough: true,
      // Settings
      defaultMuted: true,
      defaultPlaybackRate: true
    });
    this.eOpts = { EL: { signal: this.signal }, REACTOR: { capture: true, signal: this.signal, immediate: this.ctlr.payload.initialized } };
  }
  // ===========================================================================
  // WIRING (Connections Only)
  // ===========================================================================
  // --- Core Wiring ---
  wireSrc() {
    this.el.addEventListener("loadstart", this.setLoadStartState, this.eOpts.EL);
    this.config.on("intent.src", this.handleSrcIntent, this.eOpts.REACTOR);
  }
  wireCurrentTime() {
    this.el.addEventListener("timeupdate", this.setTimeUpdateState, this.eOpts.EL);
    this.el.addEventListener("seeking", this.setSeekingState, this.eOpts.EL);
    this.el.addEventListener("seeked", this.setSeekedState, this.eOpts.EL);
    this.config.on("intent.currentTime", this.handleCurrentTimeIntent, this.eOpts.REACTOR);
  }
  wireDuration() {
    this.el.addEventListener("durationchange", this.setDurationChangeState, this.eOpts.EL);
  }
  wirePaused() {
    this.el.addEventListener("play", this.setPlayState, this.eOpts.EL);
    this.el.addEventListener("pause", this.setPauseState, this.eOpts.EL);
    this.config.on("intent.paused", this.handlePausedIntent, this.eOpts.REACTOR);
  }
  wireEnded() {
    this.el.addEventListener("ended", this.setEndedState, this.eOpts.EL);
  }
  // --- Features Wiring ---
  wireFeatures() {
    super.wireFeatures();
    this.wireHTMLState();
    const loadEvents = ["loadstart", "progress", "suspend", "abort", "emptied", "stalled"];
    loadEvents.forEach((e) => this.el.addEventListener(e, this.handleLoadStatus, this.eOpts.REACTOR));
    this.el.addEventListener("error", this.handleErrorStatus, this.eOpts.REACTOR);
    this.el.addEventListener("waiting", this.handleWaitingStatus, this.eOpts.REACTOR);
    this.el.addEventListener("playing", this.handlePlayingStatus, this.eOpts.REACTOR);
    this.el.addEventListener("stalled", this.handleStalledStatus, this.eOpts.REACTOR);
    this.el.addEventListener("loadedmetadata", this.handleLoadedMetadataStatus, this.eOpts.REACTOR);
    this.el.addEventListener("loadeddata", this.handleLoadedDataStatus, this.eOpts.REACTOR);
    this.el.addEventListener("canplay", this.handleCanPlayStatus, this.eOpts.REACTOR);
    this.el.addEventListener("canplaythrough", this.handleCanPlayThroughStatus, this.eOpts.REACTOR);
    this.features.textTracks && this.wireTracksStatus("textTracks");
    this.features.videoTracks && this.wireTracksStatus("videoTracks");
    this.features.audioTracks && this.wireTracksStatus("audioTracks");
    this.features.activeCue && this.wireActiveCueStatus?.();
  }
  // --- Engine Inputs Wiring ---
  wireVolume() {
    this.el.addEventListener("volumechange", this.setVolumeChangeState, this.eOpts.EL);
    this.config.on("intent.volume", this.handleVolumeIntent, this.eOpts.REACTOR);
  }
  wireMuted() {
    this.config.on("intent.muted", this.handleMutedIntent, this.eOpts.REACTOR);
  }
  wirePlaybackRate() {
    this.el.addEventListener("ratechange", this.setRateChangeState, this.eOpts.EL);
    this.config.on("intent.playbackRate", this.handlePlaybackRateIntent, this.eOpts.REACTOR);
  }
  // --- Presentation Modes Wiring ---
  wirePictureInPicture() {
    this.el.addEventListener("enterpictureinpicture", this.setEnterPiPState, this.eOpts.EL);
    this.el.addEventListener("leavepictureinpicture", this.setLeavePiPState, this.eOpts.EL);
    this.config.on("intent.pictureInPicture", this.handlePiPIntent, this.eOpts.REACTOR);
  }
  wireFullscreen() {
    this.el.addEventListener("webkitbeginfullscreen", this.setWebkitBeginFullscreenState, this.eOpts.REACTOR);
    this.el.addEventListener("webkitendfullscreen", this.setWebkitEndFullscreenState, this.eOpts.REACTOR);
    this.ctlr.state.watch("docInFullscreen", this.setFullscreenChangeState, this.eOpts.REACTOR);
    this.config.on("intent.fullscreen", this.handleFullscreenIntent, this.eOpts.REACTOR);
  }
  // --- Track Switching Wiring ---
  wireCurrentTrack(type) {
    this.config.set(`intent.current${type}Track`, (term) => getTrackIdx(this.el, type, term), { signal: this.signal });
    const list = this.el[`${type.toLowerCase()}Tracks`];
    list?.addEventListener("change", () => this.setCurrentTrackState(type, list), this.eOpts.REACTOR);
    this.config.on(`intent.current${type}Track`, (e) => this.handleCurrentTrackIntent(e, type), this.eOpts.REACTOR);
  }
  wireCurrentAudioTrack() {
    this.wireCurrentTrack("Audio");
  }
  wireCurrentVideoTrack() {
    this.wireCurrentTrack("Video");
  }
  wireCurrentTextTrack() {
    this.wireCurrentTrack("Text");
  }
  // --- HTML (Bulk Wiring) ---
  wireHTMLState() {
    this.signal.addEventListener("abort", observeMutation(this.el, this.setHTMLStateFromMutation, { attributes: true, childList: true, subtree: false }), { once: true });
  }
  // --- Attribute Wiring ---
  bindAttr(key, isBool = false) {
    this.config.on(`intent.${key}`, (e) => this.handleAttributeIntent(e, key, isBool), this.eOpts.REACTOR);
  }
  wirePoster() {
    this.bindAttr("poster");
  }
  wireAutoplay() {
    this.bindAttr("autoplay", true);
  }
  wireLoop() {
    this.bindAttr("loop", true);
  }
  wirePreload() {
    this.bindAttr("preload");
  }
  wirePlaysInline() {
    this.bindAttr("playsInline", true);
  }
  wireCrossOrigin() {
    this.bindAttr("crossOrigin");
  }
  wireControls() {
    this.bindAttr("controls", true);
  }
  wireControlsList() {
    this.bindAttr("controlsList");
  }
  wireDisablePictureInPicture() {
    this.bindAttr("disablePictureInPicture", true);
    this.config.on("state.disablePictureInPicture", this.handlePiPState);
  }
  // --- Lists Wiring ---
  wireSources() {
    this.config.on("intent.sources", this.handleSourcesIntent, this.eOpts.REACTOR);
  }
  wireTracks() {
    this.config.on("intent.tracks", this.handleTracksIntent, this.eOpts.REACTOR);
  }
  // --- Status Tracks Wiring ---
  wireTracksStatus(type) {
    const list = this.el[type];
    list && ["addtrack", "removetrack"].forEach((e) => list.addEventListener(e, () => this.handleTracksStatus(type, list), this.eOpts.REACTOR));
  }
  // --- Active Cue Wiring ---
  wireActiveCueStatus() {
    this.config.on(
      "state.currentTextTrack",
      ({ value: curr, oldValue: prev }) => {
        if (prev !== -1) this.el.textTracks[prev]?.removeEventListener("cuechange", this.handleActiveCueStatus, this.eOpts.EL);
        this.el.textTracks[curr]?.addEventListener("cuechange", this.handleActiveCueStatus, this.eOpts.EL);
        this.handleActiveCueStatus({ target: this.el.textTracks[curr] });
      },
      this.eOpts.REACTOR
    );
  }
  // --- Settings Wiring ---
  wireDefaultMuted() {
    this.config.on("settings.defaultMuted", this.handleDefaultMutedSetting, this.eOpts.REACTOR);
  }
  wireDefaultPlaybackRate() {
    this.config.on("settings.defaultPlaybackRate", this.handleDefaultPlaybackRateSetting, this.eOpts.REACTOR);
  }
  // ===========================================================================
  // HANDLERS (The Logic - Auto-Guarded by Controllable)
  // ===========================================================================
  // --- Core States ---
  setLoadStartState() {
    const { state: s, status: st } = this.config;
    st.error = st.activeCue = null;
    st.waiting = true;
    st.ended = st.stalled = st.loadedData = st.loadedMetadata = st.canPlay = st.canPlayThrough = false;
    st.duration = NaN;
    st.buffered = this.el.buffered;
    st.seekable = this.el.seekable;
    if (!isSameURL(this.el.src, s.src)) s.src = this.el.src;
    this.config.state.paused = this.el.paused;
  }
  setTimeUpdateState() {
    this.config.state.currentTime = this.el.currentTime;
  }
  setSeekingState() {
    this.config.status.seeking = true;
  }
  setSeekedState() {
    this.config.status.seeking = false;
  }
  setDurationChangeState() {
    this.config.status.duration = this.el.duration;
  }
  setPlayState() {
    this.config.state.paused = false;
  }
  setPauseState() {
    this.config.state.paused = true;
  }
  setEndedState() {
    this.config.status.ended = this.config.state.paused = true;
  }
  // --- Core Intents ---
  handleSrcIntent(e) {
    if (e.resolved || isSameURL(this.el.src, e.value)) return;
    this.el.src = e.value ?? "";
    this.el.load();
    e.resolve(_HTML5Tech.techName);
  }
  handleCurrentTimeIntent(e) {
    if (e.resolved) return;
    this.el.currentTime = e.value;
    e.resolve(_HTML5Tech.techName);
  }
  handlePausedIntent(e) {
    if (e.resolved) return;
    const p = e.value ? this.el.pause() : this.el.play();
    if (p?.then) p.then(() => e.resolve(_HTML5Tech.techName)).catch((err) => e.reject(err.message));
    else e.resolve(_HTML5Tech.techName);
  }
  // --- Feature States ---
  setVolumeChangeState() {
    this.config.state.volume = this.el.volume * 100;
    this.config.state.muted = this.el.muted;
  }
  setRateChangeState() {
    this.config.state.playbackRate = this.el.playbackRate;
  }
  setEnterPiPState() {
    this.config.state.pictureInPicture = true;
  }
  setLeavePiPState() {
    this.config.state.pictureInPicture = false;
  }
  setFullscreenChangeState(docInFs) {
    this.config.state.fullscreen = docInFs ? queryFullscreenEl() === this.el : false;
  }
  setWebkitBeginFullscreenState() {
    this.config.state.fullscreen = true;
  }
  setWebkitEndFullscreenState() {
    this.config.state.fullscreen = false;
  }
  setCurrentTrackState(type, list) {
    this.config.state[`current${type}Track`] = getTrackIdx(this.el, type, "active");
  }
  setHTMLStateFromMutation(mutations) {
    for (const m of mutations) {
      const { state: state2, settings } = this.config;
      if (m.type === "childList") {
        const nodes = [...m.addedNodes, ...m.removedNodes];
        if (nodes.some(({ nodeName: nm }) => nm === "SOURCE")) state2.sources = getSources(this.el);
        if (nodes.some(({ nodeName: nm }) => nm === "TRACK")) state2.tracks = getTracks(this.el);
      } else if (m.type !== "attributes" || !m.attributeName) return;
      switch (m.attributeName) {
        case "poster":
          return state2.poster = this.el.poster;
        case "autoplay":
          return state2.autoplay = this.el.autoplay;
        case "loop":
          return state2.loop = this.el.loop;
        case "preload":
          return state2.preload = this.el.preload;
        case "crossorigin":
          return state2.crossOrigin = this.el.crossOrigin;
        case "controls":
          return state2.controls = this.el.controls;
        case "playsinline":
        case "webkit-playsinline":
          return state2.playsInline = this.el.playsInline;
        case "controlslist":
          return state2.controlsList = this.el.controlsList ?? this.el.getAttribute(m.attributeName);
        case "disablepictureinpicture":
          return state2.disablePictureInPicture = this.el.disablePictureInPicture ?? this.el.hasAttribute(m.attributeName);
        case "muted":
          return state2.muted = this.el.muted, settings.defaultMuted = this.el.defaultMuted;
      }
    }
  }
  // --- Feature Intents ---
  handleVolumeIntent(e) {
    if (e.resolved) return;
    this.el.volume = e.value / 100;
    e.resolve(_HTML5Tech.techName);
  }
  handleMutedIntent(e) {
    if (e.resolved) return;
    this.el.muted = e.value;
    e.resolve(_HTML5Tech.techName);
  }
  handlePlaybackRateIntent(e) {
    if (e.resolved) return;
    this.el.playbackRate = e.value;
    e.resolve(_HTML5Tech.techName);
  }
  handlePiPIntent(e) {
    if (e.resolved) return;
    e.value ? this.el.requestPictureInPicture() : document.exitPictureInPicture();
    e.resolve(_HTML5Tech.techName);
  }
  handleFullscreenIntent(e) {
    if (e.resolved) return;
    e.value ? enterFullscreen(this.el) : exitFullscreen(this.el);
    e.resolve(_HTML5Tech.techName);
  }
  handleCurrentTrackIntent(e, type) {
    if (e.resolved) return;
    setCurrentTrack(this.el, type, e.value, false);
    e.resolve(_HTML5Tech.techName);
  }
  handleAttributeIntent(e, key, isBool) {
    if (e.resolved || key === "poster" && isSameURL(e.value, this.config.state[key])) return;
    const attr = key.toLowerCase();
    isBool ? this.el.toggleAttribute(attr, Boolean(e.value)) : e.value ? this.el.setAttribute(attr, e.value) : this.el.removeAttribute(attr);
    if (key === "playsInline") this.el.toggleAttribute("webkit-playsinline", Boolean(e.value));
    e.resolve(_HTML5Tech.techName);
  }
  handleSourcesIntent(e) {
    if (e.resolved) return;
    if (!isSameSources(this.config.state.sources, e.value)) removeSources(this.el), addSources(e.value, this.el);
    e.resolve(_HTML5Tech.techName);
  }
  handleTracksIntent(e) {
    if (e.resolved) return;
    if (!isSameTracks(this.config.state.tracks, e.value)) removeTracks(this.el), addTracks(e.value, this.el);
    e.resolve(_HTML5Tech.techName);
  }
  // --- Status (Bulk) ---
  handleLoadStatus() {
    this.config.status.readyState = this.el.readyState;
    this.config.status.networkState = this.el.networkState;
    this.config.status.buffered = this.el.buffered;
    this.config.status.seekable = this.el.seekable;
  }
  handleLoadedMetadataStatus() {
    this.config.status.loadedMetadata = true;
    this.config.status.videoWidth = this.el.videoWidth;
    this.config.status.videoHeight = this.el.videoHeight;
    this.config.status.duration = this.el.duration;
    this.handleLoadStatus();
  }
  handleLoadedDataStatus() {
    this.config.status.loadedData = true;
  }
  handleCanPlayStatus() {
    this.config.status.canPlay = true;
  }
  handleCanPlayThroughStatus() {
    this.config.status.canPlayThrough = true;
  }
  handleStalledStatus() {
    this.config.status.stalled = true;
  }
  handleWaitingStatus() {
    this.config.status.waiting = true;
  }
  handlePlayingStatus() {
    this.config.status.waiting = this.config.status.stalled = false;
  }
  handleErrorStatus(e) {
    this.config.status.error = this.el.error ?? { message: "string" === typeof e && e || e?.message };
    this.config.status.waiting = false;
  }
  handleTracksStatus(type, list) {
    this.config.status[type] = list;
  }
  handleActiveCueStatus(e) {
    const track = e?.target;
    this.config.status.activeCue = track?.activeCues?.[0] || null;
  }
  // --- Settings ---
  handleDefaultMutedSetting(e) {
    this.el.defaultMuted = e.value;
  }
  handleDefaultPlaybackRateSetting(e) {
    this.el.defaultPlaybackRate = e.value;
  }
  // --- Other Handlers ---
  handlePiPState(e) {
    this.features.pictureInPicture = !e.value;
  }
};
_HTML5Tech.techName = "html5";
var HTML5Tech = _HTML5Tech;

// src/ts/core/controller.ts
var Controller = class {
  // Critical for Player wrapper to know when swapping modes
  constructor(medium, build) {
    this.plugs = /* @__PURE__ */ new Map();
    this.ac = new AbortController();
    this.signal = this.ac.signal;
    this._payload = { instance: this };
    // must use getter for payload
    // DOM References (Utilized by Plugs)
    this.pseudoVideo = createEl("video");
    this.videoContainer = createEl("div");
    this.pseudoVideoContainer = createEl("div");
    this.DOM = {};
    // To be populated with common elements for easy reach
    // --- UTILS CACHE ---
    this.throttleMap = /* @__PURE__ */ new Map();
    this.rafLoopMap = /* @__PURE__ */ new Map();
    this.rafLoopFnMap = /* @__PURE__ */ new Map();
    this.clups = [];
    // --- FLAGS (Essential Only) ---
    this.mutatingDOMM = true;
    this.guard = (fn, { silent = false } = {}) => {
      return guardMethod(fn, (e) => (this.log(e, "error", "swallow"), !silent && this.getPlug("toasts")?.toast?.("Something went wrong", { tag: "tmg-stwr" })));
    };
    this.cancelAllLoops = () => this.rafLoopMap.keys().forEach(this.cancelRAFLoop);
    this.setReadyState(0, medium);
    guardAllMethods(this, this.guard, true);
    this.id = build.id;
    this.config = reactive(volatile(build));
    this.state = reactive({
      readyState: 0,
      audioContextReady: !!AUDIO_CONTEXT,
      mediaIntersecting: true,
      mediaParentIntersecting: true,
      dimensions: { container: { width: 0, height: 0, tier: "x" }, pseudoContainer: { width: 0, height: 0, tier: "x" }, window: { width: window.innerWidth, height: window.innerHeight } },
      screenOrientation: window.screen.orientation,
      docVisibilityState: document.visibilityState,
      docInFullscreen: queryFullscreen()
    });
    const defs = getMediaReport(medium);
    this.media = reactive({
      tech: inert({}),
      // dummy tech to be replaced on boot
      element: inert(medium),
      intent: volatile(intent(defs.intent)),
      state: state(defs.state),
      status: state(defs.status),
      settings: state(defs.settings)
    });
    this.config.watch("settings", (value) => this.settings = value, { immediate: true, signal: this.signal });
    this.buildCache = this.config.snapshot();
    this.media.set("tech", (t) => inert(t), { signal: this.signal });
    this.boot();
  }
  getPlug(name) {
    return this.plugs.get(name);
  }
  boot() {
    this.connectPlugs();
    this.wireTechOverseer();
    this.wireRuntimeState();
    this.setReadyState();
    if (!this.media.state.paused) this.setReadyState();
    else this.media.wonce("state.paused", () => this.setReadyState(), { signal: this.signal });
    setTimeout2(() => this.mutatingDOMM = false, 0, this.signal);
  }
  connectPlugs() {
    for (const PlugClass of PlugRegistry.getOrdered()) {
      const key = PlugClass.plugName;
      this.plugin(PlugClass, key in this.config ? this.config[key] : this.config.settings[key]);
    }
  }
  plugin(PlugClass, config) {
    if (this.config.noPlugList.includes(PlugClass.plugName) && !PlugClass.isCore) return;
    this.getPlug(PlugClass.plugName)?.destroy();
    const plug = new PlugClass(this, config);
    this.plugs.set(PlugClass.plugName, (plug.setup(), plug));
  }
  wireTechOverseer() {
    const opts = { capture: true, signal: this.signal };
    this.media.on("intent.src", () => this.overseeTech(), { ...opts, immediate: true });
    this.media.on("intent.sources", () => this.overseeTech(), opts);
    this.media.on("state.src", () => this.overseeTech("state"), opts);
    this.media.on("state.sources", () => this.overseeTech("intent"), opts);
    this.media.on("settings.srcObject", () => this.overseeTech(), opts);
  }
  overseeTech(pref = "intent") {
    const { src: prefSrc, sources: prefSources } = pref === "intent" ? this.media.intent : this.media.state, { src: altSrc, sources: altSources } = pref === "intent" ? this.media.state : this.media.intent;
    if (this.media.settings.srcObject) return this.switchTech(HTML5Tech);
    let selectedTech = null, selectedSource = null;
    if (!isSameURL(prefSrc, altSrc)) {
      selectedTech = TechRegistry.pick(prefSrc, this.config.settings.techOrder);
      if (selectedTech) selectedSource = prefSrc;
    }
    if (!selectedTech && !isSameSources(prefSources, altSources)) {
      for (const source of prefSources) {
        selectedTech = TechRegistry.pick(source.src, this.config.settings.techOrder);
        if (selectedTech) {
          selectedSource = source.src;
          break;
        }
      }
    }
    this.switchTech(selectedTech || HTML5Tech);
    if (selectedSource !== prefSrc && !this.media.tech.features.sources) this.media.intent.src = selectedSource;
  }
  switchTech(TechClass, config = this.media) {
    if (this.media.tech && TechClass === this.media.tech.constructor) return;
    if (this.media.tech) this.media.tech.destroy(), this.log(`Switching tech from '${this.media.tech.name}' -> '${TechClass.name}'`);
    (this.media.tech = new TechClass(this, config)).setup();
  }
  wireRuntimeState() {
    this.clups.push(observeIntersection(this.videoContainer.parentElement, (entry) => this.state.mediaParentIntersecting = entry.isIntersecting));
    this.clups.push(observeIntersection(this.videoContainer, (entry) => this.state.mediaIntersecting = entry.isIntersecting));
    this.clups.push(observeResize(this.videoContainer, () => this.state.dimensions.container = getSizeTier(this.videoContainer)));
    this.clups.push(observeResize(this.pseudoVideoContainer, () => this.state.dimensions.pseudoContainer = getSizeTier(this.pseudoVideoContainer)));
  }
  get payload() {
    const readyState = this.state?.readyState ?? 0;
    this._payload.readyState = readyState, this._payload.initialized = readyState > 0, this._payload.destroyed = readyState < 0;
    return this._payload;
  }
  setReadyState(state2, medium) {
    const readyState = !this.state ? 0 : clamp(0, state2 ?? this.state.readyState + 1, 3);
    if (this.state) this.state.readyState = readyState;
    this.fire("tmgreadystatechange", this.payload, medium);
  }
  // ()=>{}: needs to be bounded even before initialization
  log(mssg, type = "log", action) {
    if (!this.config.debug) return;
    switch (type) {
      case "error":
        return action === "swallow" ? console.warn(`[TMG Controller] swallowed error:`, mssg) : console.error(`[TMG Controller] error:`, mssg);
      case "warn":
        return console.warn(`[TMG Controller] warning:`, mssg);
      default:
        return console.log(`[TMG Controller] log:`, mssg);
    }
  }
  fire(eN, detail = null, el = this.media.element, bubbles = true, cancelable = true) {
    eN && el?.dispatchEvent(new CustomEvent(eN, { detail, bubbles, cancelable }));
  }
  throttle(key, fn, delay = 30, strict = true) {
    if (strict) {
      const now = performance.now();
      if (now - (this.throttleMap.get(key) ?? 0) < delay) return;
      return this.throttleMap.set(key, now), fn();
    }
    if (this.throttleMap.has(key)) return;
    const id = setTimeout2(() => this.throttleMap.delete(key), delay, this.signal, getWindow(this.videoContainer));
    return this.throttleMap.set(key, id), fn();
  }
  RAFLoop(key, fn) {
    this.rafLoopFnMap.set(key, fn);
    const loop = () => (this.rafLoopFnMap.get(key)?.(), this.rafLoopMap.set(key, requestAnimationFrame2(loop, this.signal, getWindow(this.videoContainer))));
    !this.rafLoopMap.has(key) && this.rafLoopMap.set(key, requestAnimationFrame2(loop, this.signal, getWindow(this.videoContainer)));
  }
  cancelRAFLoop(key) {
    getWindow(this.videoContainer)?.cancelAnimationFrame(this.rafLoopMap.get(key)), this.rafLoopFnMap.delete(key), this.rafLoopMap.delete(key);
  }
  queryDOM(query, all = false, isPseudo = false) {
    const container = isPseudo ? this.pseudoVideoContainer : this.videoContainer;
    return all ? container.querySelectorAll(query) : container.querySelector(query);
  }
  setImgLoadState({ target: img }) {
    img?.setAttribute("data-loaded", String(img.complete && img.naturalWidth > 0));
  }
  setImgFallback({ target: img }) {
    img.src = window.TMG_VIDEO_ALT_IMG_SRC;
  }
  setCanvasFallback(canvas, context, img) {
    img = canvas && createEl("img", { src: window.TMG_VIDEO_ALT_IMG_SRC, onload: () => context?.drawImage(img, 0, 0, canvas.width, canvas.height) });
  }
  isUIActive(mode, el = this.videoContainer) {
    if (mode === "settings") mode = "settings-view";
    return el.classList.contains(`tmg-video-${uncamelize(mode, "-")}`);
  }
  destroy() {
    this.mutatingDOMM = true;
    this.setReadyState(-1);
    this.cancelAllLoops();
    this.ac.abort("[TMG Controller] Instance is being destroyed");
    this.clups.forEach((cleanup) => cleanup());
    [...this.plugs.values()].reverse().forEach((p) => p.destroy());
    this.media.tech.destroy();
    this.plugs.clear(), this.throttleMap.clear(), this.rafLoopMap.clear(), this.rafLoopFnMap.clear();
    this.media.destroy(), this.state.destroy(), this.config.destroy();
    const el = this.config.cloneOnDetach ? cloneMedia(this.media.element) : this.media.element;
    return nuke(this), el;
  }
};

// src/ts/consts/config-defaults.ts
var DEFAULT_VIDEO_BUILD = {
  mediaPlayer: "TMG",
  mediaType: "video",
  media: { title: "", artist: "", profile: "", album: "", artwork: [], chapterInfo: [], links: { title: "", artist: "", profile: "" }, autoGenerate: true },
  disabled: false,
  lightState: { disabled: false, controls: ["meta", "bigplaypause", "fullscreenorientation"], preview: { usePoster: true, time: 4 } },
  debug: true,
  settings: {
    auto: { next: { value: 20, preview: { usePoster: true, time: 4, tease: true } } },
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
            { value: "comic sans ms", display: "Comic Sans MS" }
          ]
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
            { value: 400, display: "400%" }
          ]
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
            { value: "black", display: "Black" }
          ]
        },
        opacity: {
          value: 1,
          options: [
            { value: 0.25, display: "25%" },
            { value: 0.5, display: "50%" },
            { value: 0.75, display: "75%" },
            { value: 1, display: "100%" }
          ]
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
            { value: "900", display: "Black" }
          ]
        },
        variant: {
          value: "normal",
          options: [
            { value: "normal", display: "Normal" },
            { value: "small-caps", display: "Small Caps" },
            { value: "all-small-caps", display: "All Small Caps" }
          ]
        }
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
            { value: "black", display: "Black" }
          ]
        },
        opacity: {
          value: 0.75,
          options: [
            { value: 0, display: "0%" },
            { value: 0.25, display: "25%" },
            { value: 0.5, display: "50%" },
            { value: 0.75, display: "75%" },
            { value: 1, display: "100%" }
          ]
        }
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
            { value: "black", display: "Black" }
          ]
        },
        opacity: {
          value: 0,
          options: [
            { value: 0, display: "0%" },
            { value: 0.25, display: "25%" },
            { value: 0.5, display: "50%" },
            { value: 0.75, display: "75%" },
            { value: 1, display: "100%" }
          ]
        }
      },
      characterEdgeStyle: {
        value: "none",
        options: [
          { value: "none", display: "None" },
          { value: "drop-shadow", display: "Drop Shadow" },
          { value: "raised", display: "Raised" },
          { value: "depressed", display: "Depressed" },
          { value: "outline", display: "Outline" }
        ]
      },
      textAlignment: {
        value: "left",
        options: [
          { value: "left", display: "Left" },
          { value: "center", display: "Center" },
          { value: "right", display: "Right" }
        ]
      }
    },
    controlPanel: {
      profile: true,
      title: true,
      artist: true,
      top: ["expandminiplayer", "spacer", "meta", "spacer", "capture", "fullscreenlock", "fullscreenorientation", "removeminiplayer"],
      center: ["bigprev", "bigplaypause", "bignext"],
      bottom: { 1: [], 2: ["spacer", "timeline", "spacer"], 3: [...!IS_MOBILE ? ["prev", "playpause", "next"] : [], "brightness", "volume", "timeandduration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] },
      buffer: "eclipse",
      timeline: { thumbIndicator: true, seek: { relative: !IS_MOBILE, cancel: { delta: 15, timeout: 2e3 } } },
      progressBar: IS_MOBILE,
      draggable: ["", "wrapper"]
    },
    errorMessages: { 1: "The video playback was aborted :(", 2: "The video failed due to a network error :(", 3: "The video could not be decoded :(", 4: "The video source is not supported :(" },
    fastPlay: { playbackRate: 2, key: true, pointer: { type: "all", threshold: 800, inset: 20 }, reset: true, rewind: true },
    gesture: {
      click: IS_MOBILE ? "" : "togglePlay",
      dblClick: IS_MOBILE ? "togglePlay" : "toggleFullscreenMode",
      touch: { volume: true, brightness: true, timeline: true, threshold: 200, axesRatio: 3, inset: 20, sliderTimeout: 1e3, xRatio: 1, yRatio: 1 },
      wheel: { volume: { normal: true, slider: true }, brightness: { normal: true, slider: true }, timeline: { normal: true, slider: true }, timeout: 2e3, xRatio: 12, yRatio: 6 }
    },
    keys: {
      disabled: false,
      strictMatches: false,
      overrides: [" ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"],
      shortcuts: { prev: "Shift+p", next: "Shift+n", playPause: "k", mute: "m", dark: "d", skipBwd: "j", skipFwd: "l", stepFwd: ".", stepBwd: ",", volumeUp: "ArrowUp", volumeDown: "ArrowDown", brightnessUp: "y", brightnessDown: "h", playbackRateUp: ">", playbackRateDown: "<", timeFormat: "z", timeMode: "q", capture: "s", objectFit: "a", pictureInPicture: "i", theater: "t", fullscreen: "f", captions: "c", captionsFontSizeUp: ["+", "="], captionsFontSizeDown: ["-", "_"], captionsFontFamily: "u", captionsFontWeight: "g", captionsFontVariant: "v", captionsFontOpacity: "o", captionsBackgroundOpacity: "b", captionsWindowOpacity: "w", captionsCharacterEdgeStyle: "e", captionsTextAlignment: "x", settings: "?" },
      mods: { disabled: false, skip: { ctrl: 60, shift: 10 }, volume: { ctrl: 50, shift: 10 }, brightness: { ctrl: 50, shift: 10 }, playbackRate: { ctrl: 1 }, captionsFontSize: {} },
      // prettier-ignore
      blocks: ["Ctrl+Tab", "Ctrl+Shift+Tab", "Ctrl+PageUp", "Ctrl+PageDown", "Cmd+Option+ArrowRight", "Cmd+Option+ArrowLeft", "Ctrl+1", "Ctrl+2", "Ctrl+3", "Ctrl+4", "Ctrl+5", "Ctrl+6", "Ctrl+7", "Ctrl+8", "Ctrl+9", "Cmd+1", "Cmd+2", "Cmd+3", "Cmd+4", "Cmd+5", "Cmd+6", "Cmd+7", "Cmd+8", "Cmd+9", "Alt+ArrowLeft", "Alt+ArrowRight", "Cmd+ArrowLeft", "Cmd+ArrowRight", "Ctrl+r", "Ctrl+Shift+r", "F5", "Shift+F5", "Cmd+r", "Cmd+Shift+r", "Ctrl+h", "Ctrl+j", "Ctrl+d", "Ctrl+f", "Cmd+y", "Cmd+Option+b", "Cmd+d", "Cmd+f", "Ctrl+Shift+i", "Ctrl+Shift+j", "Ctrl+Shift+c", "Ctrl+u", "F12", "Cmd+Option+i", "Cmd+Option+j", "Cmd+Option+c", "Cmd+Option+u", "Ctrl+=", "Ctrl+-", "Ctrl+0", "Cmd+=", "Cmd+-", "Cmd+0", "Ctrl+p", "Ctrl+s", "Ctrl+o", "Cmd+p", "Cmd+s", "Cmd+o"]
    },
    locked: { disabled: true },
    modes: { fullscreen: { disabled: false, orientationLock: "auto", onRotate: 90 }, theater: { disabled: !IS_MOBILE }, pictureInPicture: { disabled: false, floatingPlayer: { disabled: false, width: 500, height: 281, disallowReturnToOpener: false, preferInitialWindowPlacement: false } }, miniplayer: { disabled: false, minWindowWidth: 240 } },
    notifiers: true,
    noOverride: false,
    overlay: { delay: 3e3, behavior: "strict" },
    persist: { disabled: false, throttle: 5e3 },
    playbackRate: { min: 0.25, max: 8, skip: 0.25 },
    playsInline: true,
    time: { min: 0, skip: 10, previews: false, mode: "elapsed", format: "digital", seekSync: false },
    frame: { disabled: false, fps: 30, captureAutoClose: 15e3 },
    toasts: { disabled: false, maxToasts: 7, position: "bottom-left", hideProgressBar: true, closeButton: !IS_MOBILE, animation: "slide-up", dragToCloseDir: "x||y" },
    volume: { min: 0, max: 300, skip: 5 }
  }
};
var DEFAULT_VIDEO_ITEM_BUILD = {
  media: { title: "", chapterInfo: [], links: { title: "" } },
  src: "",
  tracks: [],
  settings: { time: { start: 0, previews: false } }
};

// src/ts/tools/player.ts
var modes2 = { fullScreen: supportsFullscreen(), pictureInPicture: supportsPictureInPicture() };
var Player = class {
  constructor(customBuild = {}) {
    this.medium = null;
    this.active = false;
    this.controller = null;
    this._build = structuredClone(DEFAULT_VIDEO_BUILD);
    this.configure({ ...customBuild, id: customBuild.id ?? `${luid()}_Controller_${Controllers.length + 1}` });
  }
  get Controller() {
    return this.controller;
  }
  get build() {
    return this._build;
  }
  set build(customBuild) {
    this.configure(customBuild);
  }
  queryBuild() {
    return !this.active ? true : this.notice({ error: "Already deployed the custom controls of your build configuration", tip: "Consider setting your build configuration before attaching your media element" }), false;
  }
  notice({ error, warning, tip }) {
    error && console.error(`[TMG Player] ${error}`);
    warning && console.warn(`[TMG Player] ${warning}`);
    tip && console.info(`[TMG Player] ${tip}`);
  }
  configure(customBuild) {
    if (!this.queryBuild() || !isObj(customBuild)) return;
    this._build = mergeObjs(this._build, parseAnyObj(customBuild));
    const keys = this._build.settings.keys;
    if (!keys) return;
    Object.keys(keys.shortcuts || {}).forEach((k) => keys.shortcuts[k] = cleanKeyCombo(keys.shortcuts[k]));
    ["blocks", "overrides"].forEach((k) => keys[k] = cleanKeyCombo(keys[k]));
  }
  async attach(medium) {
    if (isIter(medium)) return this.notice({ error: "An iterable argument cannot be attached to the TMG media player", tip: "Consider looping the iterable argument to instantiate a new 'tmg.Player' for each" });
    if (this.active) return medium;
    medium.tmgPlayer?.detach();
    tmg.Controllers.push(this._build.id);
    medium.tmgPlayer = this;
    this.medium = medium;
    await this.fetchCustomOptions(), await this.deployController();
    return this.controller?.fire("tmgattached", this.controller.payload), medium;
  }
  detach() {
    if (!this.active) return;
    const medium = this.controller?.destroy() ?? {};
    this.controller && Controllers.splice(Controllers.indexOf(this.controller), 1);
    medium?.classList?.remove(`tmg-${medium?.tagName.toLowerCase()}`, "tmg-media");
    medium.tmgcontrols = this.active = false;
    this.controller?.fire("tmgdetached", this.controller.payload);
    medium.tmgPlayer = this.controller = this.medium = null;
    return medium;
  }
  async fetchCustomOptions() {
    if (!this.medium) return;
    if (this.medium.getAttribute("tmg")?.includes(".json")) {
      await fetch(this.medium.getAttribute("tmg")).then((res) => {
        if (!res.ok) throw new Error(`JSON file not found at provided URL!. Status: ${res.status}`);
        return res.json();
      }).then((json) => this.configure(json)).catch(({ message }) => this.notice({ error: message, tip: "A valid JSON file is required for parsing your build configuration" }));
    }
    const customBuild = {}, attributes = this.medium.getAttributeNames().filter((attr) => attr.startsWith("tmg--"));
    attributes?.forEach((attr) => setHTMLConfig(customBuild, attr, this.medium.getAttribute(attr)));
    if (this.medium instanceof HTMLVideoElement && this.medium.poster) this.configure({ "media.artwork[0].src": this.medium.poster });
    this.configure(customBuild);
  }
  async deployController() {
    if (this.active || !this.medium?.isConnected) return;
    if (this._build.playlist?.[0]) this.configure(mergeObjs(DEFAULT_VIDEO_ITEM_BUILD, parseAnyObj(this._build.playlist[0])));
    if (!(this.medium instanceof HTMLVideoElement)) return this.notice({ error: `Could not deploy custom controls on the '${this.medium.tagName}' element as it is not supported`, warning: "Only the 'VIDEO' element is currently supported", tip: "" });
    this.medium.tmgcontrols = this.active = true;
    this.medium.controls = false;
    this.medium.classList.add(`tmg-${this.medium.tagName.toLowerCase()}`, "tmg-media");
    const s = this._build.settings;
    Object.keys(s.modes).forEach((k) => s.modes[k] = s.modes[k] && (modes2[String(k)] ?? true) ? s.modes[k] : false);
    await Promise.all([loadResource2(window.TMG_VIDEO_CSS_SRC), loadResource2(window.T007_TOAST_JS_SRC, "script", { module: true }), loadResource2(window.T007_INPUT_JS_SRC, "script")]);
    Controllers[Controllers.indexOf(this._build.id)] = this.controller = new Controller(this.medium, this._build);
  }
};

// src/ts/tools/runtime.ts
var AUDIO_CONTEXT = null;
var AUDIO_LIMITER = null;
var IS_DOC_TRANSIENT = false;
var _mutationId = null;
var _mutationSet = /* @__PURE__ */ new WeakSet();
var Controllers = [];
function handleVidMutation(mutations) {
  for (const mutation of mutations) {
    if (mutation.type !== "attributes") continue;
    const target = mutation.target;
    if (mutation.attributeName === "tmgcontrols") !_mutationSet.has(target) && (target.tmgcontrols = target.hasAttribute("tmgcontrols"));
    else if (mutation.attributeName?.startsWith("tmg")) target.hasAttribute(mutation.attributeName) && target.tmgPlayer?.fetchCustomOptions();
    else if (mutation.attributeName === "controls") target.hasAttribute("tmgcontrols") && target.removeAttribute("controls");
  }
}
function handleDOMMutation(mutations) {
  for (const mutation of mutations) {
    for (const node of Array.from(mutation.addedNodes)) {
      if (!(node instanceof HTMLElement)) continue;
      const videos = node.matches("video:not(.tmg-media)") ? [node] : node.querySelectorAll("video:not(.tmg-media)");
      videos.forEach((el) => {
        observeMutation(el, handleVidMutation, { attributes: true });
        el.tmgcontrols = el.hasAttribute("tmgcontrols");
      });
    }
    for (const node of Array.from(mutation.removedNodes)) {
      if (!(node instanceof HTMLElement)) continue;
      const videos = node.matches(".tmg-media") ? [node] : node.querySelectorAll(".tmg-media");
      videos.forEach((el) => {
        !el.tmgPlayer?.Controller?.mutatingDOMM && el.tmgPlayer?.detach();
      });
    }
  }
}
function flagMutation(m, check = true) {
  !_mutationSet.has(m) && check && _mutationSet.add(m);
}
function freeMutation(m) {
  clearTimeout(_mutationId);
  _mutationId = setTimeout(() => !(_mutationId = null) && _mutationSet.delete(m));
}
function mountMedia() {
  if (typeof HTMLVideoElement === "undefined") return;
  Object.defineProperty(HTMLVideoElement.prototype, "tmgcontrols", {
    get: function() {
      return this.hasAttribute("tmgcontrols");
    },
    set: async function(value) {
      if (value) {
        flagMutation(this);
        await (this.tmgPlayer || new Player()).attach(this);
        this.setAttribute("tmgcontrols", "");
        freeMutation(this);
      } else {
        flagMutation(this, this.hasAttribute("tmgcontrols"));
        this.removeAttribute("tmgcontrols");
        this.tmgPlayer?.detach();
        freeMutation(this);
      }
    },
    enumerable: true,
    configurable: true
  });
}
function unmountMedia() {
  delete HTMLVideoElement.prototype.tmgcontrols;
}
function startAudioManager() {
  if (!AUDIO_CONTEXT && IS_DOC_TRANSIENT && typeof window !== "undefined") {
    AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)();
    const L = AUDIO_LIMITER = AUDIO_CONTEXT.createDynamicsCompressor();
    L.threshold.value = -1, L.knee.value = 0, L.ratio.value = 20, L.attack.value = 1e-3, L.release.value = 0.05;
    Controllers.forEach((c) => c.state && (c.state.audioContextReady = true));
  } else if (AUDIO_CONTEXT?.state === "suspended") AUDIO_CONTEXT.resume();
}
function connectMediaToAudioManager(medium) {
  if (!AUDIO_CONTEXT) return "unavailable";
  medium.mediaElementSourceNode ?? (medium.mediaElementSourceNode = AUDIO_CONTEXT.createMediaElementSource(medium));
  medium._tmgGainNode ?? (medium._tmgGainNode = AUDIO_CONTEXT.createGain());
  medium._tmgDynamicsCompressorNode ?? (medium._tmgDynamicsCompressorNode = AUDIO_CONTEXT.createDynamicsCompressor());
  medium.mediaElementSourceNode.connect(medium._tmgDynamicsCompressorNode);
  medium._tmgDynamicsCompressorNode.connect(medium._tmgGainNode);
  medium._tmgGainNode.connect(AUDIO_LIMITER);
  AUDIO_LIMITER.connect(AUDIO_CONTEXT.destination);
}
function init() {
  mountMedia();
  ["click", "pointerdown", "keydown"].forEach((e) => document?.addEventListener(e, () => (IS_DOC_TRANSIENT = true, startAudioManager()), true));
  document?.querySelectorAll("video").forEach((medium) => {
    observeMutation(medium, handleVidMutation, { attributes: true });
    medium.tmgcontrols = medium.hasAttribute("tmgcontrols");
  });
  observeMutation(document.documentElement, handleDOMMutation, { childList: true, subtree: true });
  window?.addEventListener("resize", () => Controllers.forEach((c) => c.state && (c.state.dimensions.window = { width: window.innerWidth, height: window.innerHeight })));
  screen?.orientation.addEventListener("change", (e) => Controllers.forEach((c) => c.state && (c.state.screenOrientation = e?.target)));
  document?.addEventListener("visibilitychange", () => Controllers.forEach((c) => c.state && (c.state.docVisibilityState = document.visibilityState)));
  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach((e) => document?.addEventListener(e, () => Controllers.forEach((c) => c.state.docInFullscreen = queryFullscreen())));
}

// src/ts/core/storage.ts
var StorageAdapter = class {
  constructor(namespace) {
    this.namespace = namespace;
  }
};
var LocalStorageAdapter = class extends StorageAdapter {
  get(key) {
    try {
      const v = localStorage.getItem(`${this.namespace}_${key}`);
      return v ? JSON.parse(v) : void 0;
    } catch {
      return void 0;
    }
  }
  set(key, value) {
    try {
      localStorage.setItem(`${this.namespace}_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("[TMG Local Storage] Storage full or unavailable", e);
    }
  }
  remove(key) {
    localStorage.removeItem(`${this.namespace}_${key}`);
  }
};

// src/ts/tools/queue.ts
var AsyncQueue = class {
  constructor() {
    // add jobs, performs and reports sequentially; drop job: reports; cancel job: records, reports when about to perform
    this.jobs = [];
    this.running = false;
  }
  async handle() {
    if (this.running) return;
    this.running = true;
    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      if (job) job.cancelled ? job.resolve({ success: false, cancelled: true, dropped: false }) : (job.preTask?.(), job.resolve(await job.task()));
    }
    this.running = false;
  }
  add(task, id, cancelled, preTask) {
    return new Promise((resolve) => (this.jobs.push({ task, id, preTask, cancelled, resolve }), this.handle()));
  }
  drop(id) {
    const job = this.jobs.find((j) => j.id === id);
    job?.resolve({ success: false, cancelled: true, dropped: true });
    return job && this.jobs.splice(this.jobs.indexOf(job), 1), !!job;
  }
  cancel(id) {
    const job = this.jobs.find((j) => j.id === id);
    return job && (job.cancelled = true), !!job?.cancelled;
  }
};

// src/ts/plugs/index.ts
var plugs_exports = {};
__export(plugs_exports, {
  AutoPlug: () => AutoPlug,
  BaseModule: () => BaseModule,
  BasePlug: () => BasePlug,
  BrightnessPlug: () => BrightnessPlug,
  CSSPlug: () => CSSPlug,
  CaptionsPlug: () => CaptionsPlug,
  ControlPanelPlug: () => ControlPanelPlug,
  DisabledPlug: () => DisabledPlug,
  DraggableModule: () => DraggableModule,
  ErrorMessagesPlug: () => ErrorMessagesPlug,
  FastPlayPlug: () => FastPlayPlug,
  FramePlug: () => FramePlug,
  FullscreenModule: () => FullscreenModule,
  GeneralModule: () => GeneralModule,
  GesturePlug: () => GesturePlug,
  LightStatePlug: () => LightStatePlug,
  LockedPlug: () => LockedPlug,
  MediaPlug: () => MediaPlug,
  MiniplayerModule: () => MiniplayerModule,
  ModesPlug: () => ModesPlug,
  OverlayPlug: () => OverlayPlug2,
  PersistPlug: () => PersistPlug,
  PictureInPictureModule: () => PictureInPictureModule,
  PlaybackRatePlug: () => PlaybackRatePlug,
  PlaylistPlug: () => PlaylistPlug,
  PlaysInlinePlug: () => PlaysInlinePlug,
  SkeletonPlug: () => SkeletonPlug,
  SourcesPlug: () => SourcesPlug,
  SrcObjectPlug: () => SrcObjectPlug,
  SrcPlug: () => SrcPlug,
  TheaterModule: () => TheaterModule,
  TimePlug: () => TimePlug,
  TimeTravelPlug: () => TimeTravelPlug,
  ToastsPlug: () => ToastsPlug,
  TouchModule: () => TouchModule,
  TracksPlug: () => TracksPlug,
  VolumePlug: () => VolumePlug3,
  WheelModule: () => WheelModule
});

// src/ts/plugs/base.ts
var BasePlug = class extends Controllable {
  get name() {
    return this.constructor.plugName;
  }
  onSetup() {
    this.mount?.();
    if (this.ctlr.state.readyState) this.wire?.();
    else this.wire && this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal });
  }
  mount() {
  }
  wire() {
  }
};
BasePlug.isCore = false;
var BaseModule = class extends Controllable {
  get name() {
    return this.constructor.moduleName;
  }
  onSetup() {
    this.mount?.();
    if (this.ctlr.state.readyState) this.wire?.();
    else this.wire && this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal });
  }
  mount() {
  }
  wire() {
  }
};

// src/ts/plugs/sources.ts
var SrcPlug = class extends BasePlug {
  wire() {
    this.ctlr.config.watch("src", this.forwardSrc, { signal: this.signal, immediate: "auto" });
  }
  forwardSrc(value) {
    this.media.intent.src = value;
  }
};
SrcPlug.plugName = "src";
SrcPlug.isCore = true;
var SourcesPlug = class extends BasePlug {
  wire() {
    this.ctlr.config.watch("sources", this.forwardSources, { signal: this.signal, immediate: "auto" });
  }
  forwardSources(value) {
    this.media.intent.sources = value;
  }
};
SourcesPlug.plugName = "sources";
SourcesPlug.isCore = true;
var SrcObjectPlug = class extends BasePlug {
  wire() {
    this.ctlr.config.watch("srcObject", this.forwardSrcObject, { signal: this.signal, immediate: "auto" });
  }
  forwardSrcObject(value) {
    this.media.settings.srcObject = value;
  }
};
SrcObjectPlug.plugName = "srcObject";
SrcObjectPlug.isCore = true;
var TracksPlug = class extends BasePlug {
  wire() {
    this.ctlr.config.watch("tracks", this.forwardTracks, { signal: this.signal, immediate: "auto" });
  }
  forwardTracks(value) {
    this.media.intent.tracks = value;
  }
};
TracksPlug.plugName = "tracks";
TracksPlug.isCore = true;
var PlaysInlinePlug = class extends BasePlug {
  wire() {
    this.ctlr.config.watch("settings.playsInline", this.forwardPlaysInline, { signal: this.signal, immediate: true });
  }
  forwardPlaysInline(value) {
    this.media.intent.playsInline = value;
  }
};
PlaysInlinePlug.plugName = "playsInline";

// src/ts/plugs/playlist.ts
var timeKeys = ["min", "max", "start", "end", "previews"];
var PlaylistPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.currentIndex = 0;
  }
  wire() {
    this.currentIndex = 0;
    this.ctlr.config.get("playlist", (v) => v?.length ? v : null, { signal: this.signal });
    this.ctlr.config.set("playlist", (v) => v?.map((i) => mergeObjs(DEFAULT_VIDEO_ITEM_BUILD, i)) ?? null, { signal: this.signal });
    this.ctlr.config.watch("playlist", (value) => this.config = value, { signal: this.signal });
    this.ctlr.config.watch("settings.time.start", (v) => this.ctlr.config.playlist && (this.config[this.currentIndex].settings.time.start = v), { signal: this.signal, immediate: "auto" });
    this.ctlr.config.on("playlist", this.handlePlaylistChange, { signal: this.signal, immediate: true, depth: 1 });
  }
  handlePlaylistChange({ root }) {
    if (this.media.status.readyState < 1) return;
    const list = root.playlist;
    const v = list?.find((v2) => v2.media.id && v2.media.id === root.media.id || isSameURL(v2.src, root.src));
    this.currentIndex = (v && list?.indexOf(v)) ?? 0;
    v ? this.applyItem(v, false) : this.movePlaylistTo(this.currentIndex);
  }
  movePlaylistTo(index, shouldPlay) {
    if (!this.ctlr.config.playlist) return;
    this.currentIndex = index;
    this.applyItem(this.config[index]);
    if (typeof shouldPlay === "boolean") this.media.intent.paused = !shouldPlay;
  }
  applyItem(item, reset = true) {
    this.ctlr.config.media = deepClone(item.media);
    timeKeys.forEach((p) => this.ctlr.settings.time[p] = item.settings.time[p]);
    this.ctlr.config.tracks = deepClone(item.tracks ?? []);
    if (reset) this.ctlr.config.src = item.src || "";
    if (reset && "sources" in item && item.sources) this.ctlr.config.sources = deepClone(item.sources);
  }
  previousVideo() {
    if (this.media.state.currentTime >= 3) this.media.intent.currentTime = 0;
    else if (this.ctlr.config.playlist && this.currentIndex > 0) this.movePlaylistTo(this.currentIndex - 1, true);
  }
  nextVideo() {
    if (!this.ctlr.config.playlist) return;
    if (this.currentIndex < this.config.length - 1) this.movePlaylistTo(this.currentIndex + 1, true);
  }
};
PlaylistPlug.plugName = "playlist";

// src/ts/plugs/auto.ts
var AutoPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.nextVideoPreview = null;
    this.canAutoMovePlaylist = true;
    this.autonextVideo = () => {
      if (!this.media.status.loadedMetadata || !this.ctlr.config.playlist || this.config.next.value < 0 || !this.canAutoMovePlaylist || this.ctlr.getPlug("playlist").currentIndex >= this.ctlr.config.playlist.length - 1 || this.media.state.paused || this.media.status.waiting) return;
      this.canAutoMovePlaylist = false;
      const count = clamp(1, Math.round((this.ctlr.settings.time.end ?? this.media.status.duration) - this.media.state.currentTime), this.config.next.value), v = this.ctlr.config.playlist[this.ctlr.getPlug("playlist").currentIndex + 1], toastsPlug = this.ctlr.getPlug("toasts"), timePlug = this.ctlr.getPlug("time");
      const nVTId = toastsPlug?.toast?.("", {
        autoClose: count * 1e3,
        hideProgressBar: false,
        position: "bottom-right",
        bodyHTML: `<span title="Play next video" class="tmg-video-next-preview-wrapper">
        <button type="button"><svg viewBox="0 0 25 25"><path d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg></button>
        <video class="tmg-video-next-preview" poster="${v.media?.artwork?.[0]?.src}" src="${v.src || ""}" muted playsinline webkit-playsinline preload="metadata"></video>
        <p>${timePlug?.toTimeText(NaN) ?? "0:00"}</p>
      </span>
      <span class="tmg-video-next-info">
        <h2>Next Video in <span class="tmg-video-next-countdown">${count}</span></h2>
        ${v.media.title ? `<p class="tmg-video-next-title">${v.media.title}</p>` : ""}
      </span>`,
        onTimeUpdate: (time) => {
          const el = this.ctlr.queryDOM(".tmg-video-next-countdown");
          if (el) el.textContent = String(Math.round((count * 1e3 - time) / 1e3) || 1);
        },
        onClose: (timeElapsed) => (removeListeners(), timeElapsed && this.ctlr.getPlug("playlist")?.nextVideo()),
        tag: "tmg-anvi"
      });
      const cleanUp = (permanent = false) => (nVTId && window.t007?.toast.dismiss(nVTId, "instant"), this.nextVideoPreview = null, this.canAutoMovePlaylist = !permanent), cleanUpWhenNeeded = () => !this.media.element.ended && cleanUp(), autoCleanUpToast = () => Math.floor((this.ctlr.settings.time.end ?? this.media.status.duration) - this.media.state.currentTime) > this.config.next.value && cleanUp(), removeListeners = () => ["timeupdate", "pause", "waiting"].forEach((e, i) => this.media.element.removeEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
      ["timeupdate", "pause", "waiting"].forEach((e, i) => this.media.element.addEventListener(e, !i ? autoCleanUpToast : cleanUpWhenNeeded));
      const nVP = this.nextVideoPreview = this.ctlr.queryDOM(".tmg-video-next-preview");
      if (v.sources?.length) addSources(v.sources, nVP);
      ["loadedmetadata", "loaded", "durationchange"].forEach((e) => nVP?.addEventListener(e, ({ target: p }) => p.nextElementSibling.textContent = timePlug?.toTimeText(p.duration) ?? "0:00"));
      this.ctlr.settings.auto.next.preview = this.config.next.preview;
      nVP?.previousElementSibling?.addEventListener("click", () => (cleanUp(true), this.ctlr.getPlug("playlist")?.nextVideo()), { capture: true });
    };
  }
  wire() {
    this.ctlr.config.watch("settings.auto.play", this.forwardAutoPlay, { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", this.handleTimeUpdate, { signal: this.signal, immediate: true });
    this.ctlr.state.on("mediaParentIntersecting", this.handleIntersectionChange, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.preview.usePoster", this.handlePreviewUsePoster, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.preview.tease", this.handlePreviewTease, { signal: this.signal });
    this.ctlr.config.on("settings.auto.next.preview.time", this.handlePreviewTime, { signal: this.signal });
  }
  forwardAutoPlay(value) {
    this.media.element.autoplay = typeof value === "string" ? false : !!value;
  }
  handleTimeUpdate({ target }) {
    const dur = this.media.status.duration, curr = target.value;
    if (this.media.status.readyState && curr && this.ctlr.state.readyState > 1 && Math.floor((this.ctlr.settings.time.end ?? dur) - curr) <= this.config.next.value) this.autonextVideo();
  }
  handleIntersectionChange() {
    this.mediaAptAutoplay(this.config.pause, false);
    this.mediaAptAutoplay();
  }
  handlePreviewUsePoster({ target: { value, object } }) {
    if (!this.nextVideoPreview || value && this.nextVideoPreview.poster) return;
    if (object.tease) this.ctlr.settings.auto.next.preview.tease = true;
    else this.nextVideoPreview.currentTime = object.time;
  }
  handlePreviewTease({ target: { value, object } }) {
    if (!this.nextVideoPreview) return;
    this.nextVideoPreview.ontimeupdate = () => this.nextVideoPreview && Number(this.nextVideoPreview.currentTime) >= object.time && this.nextVideoPreview.pause();
    if (value && (!object.usePoster || !this.nextVideoPreview.poster)) this.nextVideoPreview.play();
  }
  handlePreviewTime({ target: { value, object } }) {
    if (!this.nextVideoPreview || object.usePoster && this.nextVideoPreview.poster) return;
    this.nextVideoPreview.currentTime = Number(value);
  }
  mediaAptAutoplay(auto = this.config.play, bool = true, p = this.ctlr.state.mediaParentIntersecting ? "in" : "out") {
    if (auto === `${p}-view-always`) this.media.intent.paused = !bool;
    else if (auto === `${p}-view` && this.ctlr.state.readyState < 3) this.media.intent.paused = !bool;
  }
};
AutoPlug.plugName = "auto";

// src/ts/plugs/css.ts
var CSSPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.classKeys = ["captionsCharacterEdgeStyle", "captionsTextAlignment"];
    this.CSSCache = {};
  }
  wire() {
    const entries = Object.entries(this.config);
    this.ctlr.settings.css.altImgUrl = `url(${window.TMG_VIDEO_ALT_IMG_SRC})`;
    this.ctlr.config.get("*", (val, { target: { key, path } }) => {
      var _a;
      if (!path.startsWith("settings.css.") || path.includes("sync")) return val;
      const newVal = this[this.classKeys.includes(key) ? "getClassValue" : "getCSSValue"](key);
      return (_a = this.CSSCache)[key] || (_a[key] = newVal), newVal;
    });
    this.media.watch("status.videoWidth", this.syncAspectRatio, { signal: this.signal, immediate: true });
    this.media.watch("status.videoHeight", this.syncAspectRatio, { signal: this.signal });
    this.ctlr.config.watch("*", (val, { target: { key, path } }) => path.startsWith("settings.css.") && !path.includes("sync") && this.apply(key, val), { signal: this.signal });
    this.ctlr.state.watch("dimensions.container.width", (w2) => this.ctlr.settings.css.currentContainerWidth = `${w2 || 0}px`, { signal: this.signal, immediate: true });
    this.ctlr.state.watch("dimensions.container.height", (h) => this.ctlr.settings.css.currentContainerHeight = `${h || 0}px`, { signal: this.signal, immediate: true });
    this.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.container.tier", ({ value: tier }) => this.ctlr.videoContainer.dataset.sizeTier = tier || "", { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.pseudoContainer.tier", ({ value: tier }) => this.ctlr.pseudoVideoContainer.dataset.sizeTier = tier || "", { signal: this.signal, immediate: true });
    entries.forEach(([k, v]) => {
      var _a;
      return k !== "syncWithMedia" && ((_a = this.CSSCache)[k] || (_a[k] = this.config[k]), this.apply(k, v));
    });
  }
  async handleLoadedMetadataStatus({ value }) {
    const color = value && await this.ctlr.getPlug("frame")?.getMainColor(), keys = Object.keys(this.ctlr.settings.css.syncWithMedia).filter((k) => this.ctlr.settings.css.syncWithMedia[k]);
    keys.forEach((k) => this.ctlr.settings.css[k] = String((value ? color : null) ?? this.CSSCache[k]));
  }
  getCSSValue(key) {
    const cssVar = `--tmg-video-${uncamelize(key, "-")}`, val = getComputedStyle(this.ctlr.videoContainer).getPropertyValue(cssVar);
    return val;
  }
  getClassValue(key) {
    const prefix = `tmg-video-${uncamelize(key, "-")}`, val = Array.prototype.find.call(this.ctlr.videoContainer.classList, (c) => c.startsWith(prefix))?.replace(`${prefix}-`, "");
    return val || "none";
  }
  apply(key, value) {
    this[this.classKeys.includes(key) ? "updateClassValue" : "updateCssVariable"](key, value);
  }
  updateCssVariable(key, value) {
    const strVal = String(value), cssVar = `--tmg-video-${uncamelize(key, "-")}`;
    [this.ctlr.videoContainer, this.ctlr.pseudoVideoContainer].forEach((el) => el?.style.setProperty(cssVar, strVal));
  }
  updateClassValue(key, value) {
    const pre = `tmg-video-${uncamelize(key, "-")}`;
    this.ctlr.videoContainer.classList.forEach((c) => c.startsWith(pre) && this.ctlr.videoContainer.classList.remove(c));
    this.ctlr.videoContainer.classList.add(`${pre}-${value}`);
  }
  syncAspectRatio() {
    const { videoWidth: w2, videoHeight: h } = this.media.status;
    this.ctlr.settings.css.aspectRatio = w2 && h ? `${w2} / ${h}` : "16 / 9";
  }
};
CSSPlug.plugName = "css";
CSSPlug.isCore = true;

// src/ts/plugs/skeleton.ts
var SkeletonPlug = class extends BasePlug {
  mount() {
    assignEl(this.ctlr.videoContainer, { role: "region", ariaLabel: "Video Player", className: `tmg-video-container tmg-media-container${IS_MOBILE ? " tmg-video-mobile" : ""}${this.media.state.paused ? " tmg-video-paused" : ""}` }, { trackKind: "captions", volumeLevel: "muted", brightnessLevel: "dark", objectFit: this.ctlr.settings.css.objectFit || "contain" });
    assignEl(this.ctlr.pseudoVideoContainer, { role: "status", className: "tmg-pseudo-video-container tmg-media-container" });
    assignEl(this.ctlr.pseudoVideo, { ariaHidden: "true", className: "tmg-pseudo-video tmg-media", muted: true, autoplay: false });
    this.ctlr.pseudoVideoContainer.appendChild(this.ctlr.pseudoVideo);
    this.media.element.parentElement?.insertBefore(this.ctlr.videoContainer, this.media.element);
    this.injectInterface();
    this.ctlr.DOM.containerContent?.prepend(this.media.element);
  }
  wire() {
    this.media.on("state.paused", this.handlePausedState, { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", () => this.ctlr.videoContainer.classList.remove("tmg-video-replay"), { signal: this.signal, immediate: true });
    this.media.on("status.ended", ({ value }) => this.ctlr.videoContainer.classList.toggle("tmg-video-replay", value), { signal: this.signal, immediate: true });
    this.media.on("status.waiting", ({ value }) => this.ctlr.videoContainer.classList.toggle("tmg-video-buffering", value), { signal: this.signal, immediate: true });
    this.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
  }
  injectInterface() {
    this.ctlr.videoContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="tmg-video-container-content-wrapper">
        <div class="tmg-video-container-content">
          <div class="tmg-video-controls-container">
            <div class="tmg-video-curtain tmg-video-top-curtain"></div>
            <div class="tmg-video-curtain tmg-video-bottom-curtain"></div>
            <div class="tmg-video-curtain tmg-video-cover-curtain"></div>
          </div>
        </div>
        <div class="tmg-video-settings" inert>
          <div class="tmg-video-settings-content">
            <div class="tmg-video-settings-top-panel">
              <button type="button" class="tmg-video-settings-close-btn">
                <svg viewBox="0 0 25 25" class="tmg-video-settings-close-btn-icon">
                  <path transform="translate(0, 4)" d="M1.307,5.988 L6.616,1.343 C7.027,0.933 7.507,0.864 7.918,1.275 L7.918,4.407 C8.014,4.406 8.098,4.406 8.147,4.406 C13.163,4.406 16.885,7.969 16.885,12.816 C16.885,14.504 16.111,13.889 15.788,13.3 C14.266,10.52 11.591,8.623 8.107,8.623 C8.066,8.623 7.996,8.624 7.917,8.624 L7.917,11.689 C7.506,12.099 6.976,12.05 6.615,11.757 L1.306,7.474 C0.897,7.064 0.897,6.399 1.307,5.988 L1.307,5.988 Z"></path>
                </svg>
                <span>Close Settings</span>
              </button>
            </div>
            <div class="tmg-video-settings-bottom-panel">No Settings Available Yet!</div>
          </div>
        </div>
      </div>
    `
    );
    this.ctlr.DOM.containerContentWrapper = this.ctlr.queryDOM(".tmg-video-container-content-wrapper");
    this.ctlr.DOM.containerContent = this.ctlr.queryDOM(".tmg-video-container-content");
    this.ctlr.DOM.controlsContainer = this.ctlr.queryDOM(".tmg-video-controls-container");
    this.ctlr.DOM.settingsContent = this.ctlr.queryDOM(".tmg-video-settings-content");
    this.ctlr.DOM.settingsTopPanel = this.ctlr.queryDOM(".tmg-video-settings-top-panel");
    this.ctlr.DOM.settingsBottomPanel = this.ctlr.queryDOM(".tmg-video-settings-bottom-panel");
  }
  handlePausedState({ value }) {
    if (!value) for (const media of document.querySelectorAll("video, audio")) media !== this.media.element && !media.paused && media.pause();
    this.ctlr.videoContainer.classList.toggle("tmg-video-paused", value);
  }
  handleLoadedMetadataStatus({ value }) {
    if (!value) return;
    this.ctlr.pseudoVideo.src = this.media.element.currentSrc;
    this.ctlr.pseudoVideo.crossOrigin = this.media.element.crossOrigin;
  }
  activatePseudoMode() {
    this.ctlr.pseudoVideo.id = this.media.element.id, this.media.element.id = "";
    this.ctlr.pseudoVideo.className += " " + this.media.element.className.replace(/tmg-media|tmg-video/g, "");
    this.ctlr.pseudoVideoContainer.className += " " + this.ctlr.videoContainer.className.replace(/tmg-media-container|tmg-pseudo-video-container/g, "");
    this.ctlr.videoContainer.parentElement?.insertBefore(this.ctlr.pseudoVideoContainer, this.ctlr.videoContainer);
    document.body.append(this.ctlr.videoContainer);
  }
  deactivatePseudoMode(destroy) {
    this.media.element.id = this.ctlr.pseudoVideo.id, this.ctlr.pseudoVideo.id = "";
    this.ctlr.pseudoVideo.className = "tmg-pseudo-video tmg-media";
    this.ctlr.pseudoVideoContainer.className = "tmg-pseudo-video-container tmg-media-container";
    this.ctlr.pseudoVideoContainer.parentElement?.replaceChild(destroy ? this.media.element : this.ctlr.videoContainer, this.ctlr.pseudoVideoContainer);
  }
  onDestroy() {
    this.media.element.parentElement?.replaceChild(this.media.element, this.ctlr.videoContainer);
  }
};
SkeletonPlug.plugName = "skeleton";
SkeletonPlug.isCore = true;

// src/ts/plugs/controlPanel/draggable.ts
var DraggableModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    // only ctl panel plug will instantiate after all
    this.draggingEl = null;
    this.replaced = null;
    this.safeTimeoutId = -1;
  }
  wire() {
    this.plug = this.ctlr.getPlug("controlPanel");
    this.ctlr.config.watch("settings.controlPanel.draggable", (value) => this.config = value, { signal: this.signal });
    this.ctlr.config.on("settings.controlPanel.draggable", ({ value }) => this.setDragEventListeners(value ? "add" : "remove"), { signal: this.signal, immediate: true });
  }
  setDragEventListeners(action) {
    this.ctlr.queryDOM("[data-draggable-control]", true).forEach((c) => {
      c.dataset.dragId = c.dataset.dragId ?? "";
      const act = !inBoolArrOpt(this.config, c.dataset.dragId) ? "remove" : action;
      c.dataset.draggableControl = String(c.draggable = act === "add");
      c[`${act}EventListener`]("dragstart", this.handleDragStart, { signal: this.signal });
      c[`${act}EventListener`]("drag", this.handleDrag, { signal: this.signal });
      c[`${act}EventListener`]("dragend", this.handleDragEnd, { signal: this.signal });
    });
    [...this.ctlr.queryDOM("[data-drop-zone][data-drag-id]", true), ...this.plug.zonesArr].forEach((c) => {
      c.dataset.dragId = c.dataset.dragId ?? "";
      const act = !inBoolArrOpt(this.config, c.dataset.dragId) ? "remove" : action;
      c.dataset.dropZone = String(act === "add");
      c[`${act}EventListener`]("dragenter", this.handleDragEnter, { signal: this.signal });
      c[`${act}EventListener`]("dragover", this.handleDragOver, { signal: this.signal });
      c[`${act}EventListener`]("drop", this.handleDrop, { signal: this.signal });
      c[`${act}EventListener`]("dragleave", this.handleDragLeave, { signal: this.signal });
    });
  }
  getUIZoneWCoord(target, zoneW = false) {
    let key = "";
    const pos = { 0: "left", 1: "center", 2: "right" }[[...target.parentElement.children].indexOf(target)], cws = this.ctlr.queryDOM(".tmg-video-top-controls-wrapper, .tmg-video-bottom-sub-controls-wrapper", true);
    cws.forEach((w2, i) => w2.contains(target) && (key = { 0: "top.", 1: "bottom.1.", 2: "bottom.2.", 3: "bottom.3." }[i]));
    return zoneW ? { coord: key + pos, zoneW: getAny(this.plug.zoneWs, key + pos) } : key + pos;
  }
  syncControlPanelToUI() {
    const id = (el) => el.dataset.controlId;
    const derive = (zoneW, center = false) => [center ? "spacer" : "", ...zoneW instanceof HTMLElement ? [id(zoneW)] : Array.from(zoneW.zone.children, id), center && (zoneW instanceof HTMLElement ? true : zoneW.zone.children.length) ? "spacer" : ""].filter(Boolean);
    this.ctlr.settings.controlPanel.top = [...derive(this.plug.cZoneWs.top.left), ...derive(this.plug.cZoneWs.top.center, true), ...derive(this.plug.cZoneWs.top.right)];
    this.ctlr.settings.controlPanel.center = derive(this.plug.zoneWs.center);
    this.ctlr.settings.controlPanel.bottom = {
      1: [...derive(this.plug.cZoneWs.bottom[1].left), ...derive(this.plug.cZoneWs.bottom[1].center, true), ...derive(this.plug.cZoneWs.bottom[1].right)],
      2: [...derive(this.plug.cZoneWs.bottom[2].left), ...derive(this.plug.cZoneWs.bottom[2].center, true), ...derive(this.plug.cZoneWs.bottom[2].right)],
      3: [...derive(this.plug.cZoneWs.bottom[3].left), ...derive(this.plug.cZoneWs.bottom[3].center, true), ...derive(this.plug.cZoneWs.bottom[3].right)]
    };
  }
  noDropOff(t, drop = this.draggingEl) {
    return t.dataset.dropZone !== "true" || !drop?.tagName || t.dataset.dragId !== drop.dataset.dragId;
  }
  handleDragStart(e) {
    const { target: t, dataTransfer } = e;
    if (t.dataset.draggableControl !== "true" || !t?.tagName) return;
    if (t.matches(":has(input:is(:hover, :active))")) return e.preventDefault();
    dataTransfer.effectAllowed = "move";
    this.draggingEl = t;
    requestAnimationFrame(() => t.classList.add("tmg-video-control-draggingEl"));
    this.safeTimeoutId = setTimeout2(() => t.classList.remove("tmg-video-control-draggingEl"), 1e3, this.signal);
    if (t.dataset.dragId !== "wrapper" || t.parentElement?.dataset.dragId !== "wrapper") return;
    const { coord, zoneW } = this.getUIZoneWCoord(t, true);
    setAny(this.plug.cZoneWs, coord, zoneW);
    this.replaced = { target: t.parentElement, child: zoneW.cover };
  }
  handleDrag() {
    this.ctlr.getPlug("overlay")?.delay();
    clearTimeout(this.safeTimeoutId);
  }
  handleDragEnd(e) {
    const t = e.target;
    t.classList.remove("tmg-video-control-draggingEl");
    this.replaced = this.draggingEl = null;
    if (t.dataset.dragId === "wrapper" && t.parentElement?.dataset.dragId === "wrapper") setAny(this.plug.cZoneWs, this.getUIZoneWCoord(t), t);
    this.syncControlPanelToUI();
  }
  handleDragEnter(e) {
    !this.noDropOff(e.target) && this.draggingEl && e.target.classList.add("tmg-video-dragover");
  }
  handleDragOver(e) {
    const { target: t, clientX: x, dataTransfer } = e;
    if (this.noDropOff(t)) return;
    e.preventDefault();
    dataTransfer.dropEffect = "move";
    this.ctlr.throttle(
      "dragOver",
      () => {
        if (t.dataset.dragId === "wrapper") {
          const atWrapper = getElSiblingAt(x, "x", t.querySelectorAll('.tmg-video-side-controls-wrapper-cover:has([data-drop-zone="true"][data-drag-id=""]:empty)'), "at");
          if (!atWrapper) return;
          this.replaced?.target.replaceChild(this.replaced.child, this.draggingEl);
          this.replaced = { target: t, child: atWrapper };
          return t.replaceChild(this.draggingEl, atWrapper);
        }
        const afterControl = getElSiblingAt(x, "x", t.querySelectorAll("[draggable=true]:not(.tmg-video-control-draggingEl)"));
        afterControl ? t.insertBefore(this.draggingEl, afterControl) : t.append(this.draggingEl);
        !t.dataset.dragId && this.plug.zonesArr.forEach(this.plug.handleControlsView);
      },
      500,
      false
    );
  }
  handleDrop(e) {
    !this.noDropOff(e.target) && e.target.classList.remove("tmg-video-dragover");
  }
  handleDragLeave(e) {
    !this.noDropOff(e.target) && e.target.classList.remove("tmg-video-dragover");
  }
};
DraggableModule.moduleName = "controlPanelDrag";

// src/ts/plugs/controlPanel/index.ts
var rowsArr = [1, 2, 3];
var ControlPanelPlug = class extends BasePlug {
  constructor(ctlr, config) {
    super(ctlr, config);
    this.controls = /* @__PURE__ */ new Map();
    this.scrollAssistEls = [];
    this.clups = [];
    this.draggable = new DraggableModule(this.ctlr, this.config.draggable);
  }
  getControl(name) {
    return this.controls.get(name);
  }
  getControlEl(name) {
    return this.getControl(name)?.element;
  }
  mount() {
    const buffer = ComponentRegistry.init("buffer", this.ctlr);
    this.topW = createEl("div", { className: "tmg-video-top-controls-wrapper tmg-video-apt-controls-wrapper" }, { dropZone: "", dragId: "wrapper" });
    this.bottomW = createEl("div", { className: "tmg-video-bottom-controls-wrapper" });
    buffer && this.controls.set("buffer", buffer);
    ComponentRegistry.getAll().forEach((Comp) => Comp.isControl && this.controls.set(Comp.componentName, ComponentRegistry.init(Comp.componentName, this.ctlr)));
    this.zoneWs = { top: {}, center: {}, bottom: { 1: {}, 2: {}, 3: {} } };
    this.zoneWs.top = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") };
    this.zoneWs.center = { zone: createEl("div", { className: "tmg-video-big-controls-wrapper" }, { dropZone: "", dragId: "big" }) };
    rowsArr.forEach((i) => this.zoneWs.bottom[i] = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") });
    this.cZoneWs = { top: {}, center: this.zoneWs.center, bottom: { 1: {}, 2: {}, 3: {} } };
    this.zonesArr = [...Object.values(this.zoneWs.top), ...Object.values(this.zoneWs.bottom).map((v) => Object.values(v))].flat().map((w2) => w2.zone);
    buffer?.mount?.();
    this.topW.append(this.zoneWs.top.left.cover, this.zoneWs.top.center.cover, this.zoneWs.top.right.cover);
    rowsArr.forEach((i) => {
      const row = createEl("div", { className: `tmg-video-bottom-sub-controls-wrapper tmg-video-bottom-${i}-sub-controls-wrapper tmg-video-apt-controls-wrapper` }, { dropZone: "", dragId: "wrapper" });
      row.append(this.zoneWs.bottom[i].left.cover, this.zoneWs.bottom[i].center.cover, this.zoneWs.bottom[i].right.cover);
      this.bottomW.append(row);
    });
    this.ctlr.DOM.controlsContainer?.append(this.topW, this.zoneWs.center.zone, this.bottomW);
  }
  wire() {
    this.ctlr.config.set("settings.controlPanel.bottom", (value) => parsePanelBottomObj(value), { immediate: true });
    ["settings.controlPanel.title", "settings.controlPanel.artist", "settings.controlPanel.profile"].forEach((e) => this.ctlr.config.on(e, this.handleMetaLayout, { signal: this.signal, immediate: true }));
    this.ctlr.config.on("settings.controlPanel.top", this.handleTopLayout, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.center", this.handleCenterLayout, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.bottom", this.handleBottomLayout, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.buffer", ({ value }) => this.ctlr.videoContainer.dataset.buffer = String(value), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.thumbIndicator", ({ value }) => this.ctlr.videoContainer.dataset.thumbIndicator = String(value), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.seek", this.handleTimelineSeek, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.progressBar", ({ value }) => this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", !!value), { signal: this.signal, immediate: true });
    this.initScrollAndResize();
  }
  handleMetaLayout({ target: { key, value } }) {
  }
  handleTopLayout({ value }) {
    if (!value || typeof value === "boolean") return;
    const { left, center, right } = this.getSplitControls(value);
    this.fillSWrapper(this.topW, [this.cZoneWs.top.left = this.getZoneW(left, this.zoneWs.top.left), this.cZoneWs.top.center = this.getZoneW(center, this.zoneWs.top.center), this.cZoneWs.top.right = this.getZoneW(right, this.zoneWs.top.right)]);
    this.fillZone(this.cZoneWs.top.left, left), this.fillZone(this.cZoneWs.top.center, center), this.fillZone(this.cZoneWs.top.right, right);
  }
  handleCenterLayout({ value }) {
    if (!value || typeof value === "boolean") return;
    this.fillZone(this.cZoneWs.center, value);
  }
  handleBottomLayout({ value }) {
    if (!value || typeof value === "boolean") return;
    [1, 2, 3].forEach((i) => {
      const { left, center, right } = this.getSplitControls(value[i]);
      this.fillSWrapper(this.bottomW.children[i - 1], [this.cZoneWs.bottom[i].left = this.getZoneW(left, this.zoneWs.bottom[i].left), this.cZoneWs.bottom[i].center = this.getZoneW(center, this.zoneWs.bottom[i].center), this.cZoneWs.bottom[i].right = this.getZoneW(right, this.zoneWs.bottom[i].right)]);
      this.fillZone(this.cZoneWs.bottom[i].left, left), this.fillZone(this.cZoneWs.bottom[i].center, center), this.fillZone(this.cZoneWs.bottom[i].right, right);
    });
  }
  handleTimelineSeek({ currentTarget: { value } }) {
    const timeline = this.getControl("timeline");
    if (timeline) timeline.config.scrub.relative = value.relative;
    if (timeline) timeline.config.scrub.cancel = value.cancel;
  }
  buildWSkel(side) {
    const zone = createEl("div", { className: `tmg-video-side-controls-wrapper tmg-video-${side}-side-controls-wrapper` }, { dropZone: "", scroller: side === "right" ? "reverse" : "" }), cover = createEl("div", { className: `tmg-video-side-controls-wrapper-cover tmg-video-${side}-side-controls-wrapper-cover` });
    return cover.append(zone), { cover, zone };
  }
  getSplitControls(row) {
    if (!row?.length) return { left: [], center: [], right: [] };
    const s1 = row.indexOf("spacer"), s2 = row.indexOf("spacer", s1 + 1);
    return s1 === -1 ? { left: row, center: [], right: [] } : s2 === -1 ? { left: row.slice(0, s1), center: [], right: row.slice(s1 + 1) } : { left: row.slice(0, s1), center: row.slice(s1 + 1, s2), right: row.slice(s2 + 1) };
  }
  getZoneW(ids, fallback) {
    return ids.length === 1 ? ids.includes("meta") ? this.getControlEl("meta") ?? fallback : ids.includes("timeline") ? this.getControlEl("timeline") ?? fallback : fallback : fallback;
  }
  fillSWrapper(wrapper, zoneWs) {
    wrapper.innerHTML = "";
    wrapper.append(...zoneWs.map((zoneW) => zoneW instanceof HTMLElement ? zoneW : zoneW.cover ?? zoneW.zone));
  }
  fillZone(zoneW, ids) {
    if (zoneW instanceof HTMLElement || !zoneW.zone) return;
    zoneW.zone.innerHTML = "";
    ids.forEach((id) => this.controls.get(id)?.element && zoneW.zone.append(this.controls.get(id).element));
    this.handleControlsView(zoneW.zone);
  }
  initScrollAndResize() {
    this.zonesArr.forEach((zone) => {
      this.handleControlsView(zone);
      this.scrollAssistEls.push((initScrollAssist(zone, { pxPerSecond: 60 }), zone));
      this.clups.push(observeResize(zone, () => this.handleControlsView(zone)));
      zone.addEventListener("scroll", this.handleDirtyScroll, { passive: true, signal: this.signal });
    });
  }
  handleControlsView(w2) {
    if (!w2.isConnected) return;
    let spacer, c = w2.firstElementChild;
    do {
      c?.setAttribute("data-displayed", getComputedStyle(c).display !== "none" ? "true" : "false");
      c?.setAttribute("data-spacer", "false");
      if (c?.dataset.displayed === "true" && !spacer) spacer = c;
    } while (c = c?.nextElementSibling ?? null);
    this.ctlr.settings.css.currentTopWrapperHeight = `${this.topW.offsetHeight}px`;
    this.ctlr.settings.css.currentBottomWrapperHeight = `${this.bottomW.offsetHeight}px`;
    if (w2.dataset.scroller !== "reverse") return;
    spacer?.setAttribute("data-spacer", "true");
    if (w2.dataset.resetScrolled === "true") w2.dataset.hasScrolled = "false";
    if (w2.dataset.hasScrolled === "true" || w2.scrollWidth <= w2.clientWidth || w2.scrollLeft === w2.scrollWidth - w2.clientWidth) return void (w2.scrollWidth <= w2.clientWidth && (w2.dataset.hasScrolled = "false"));
    w2.addEventListener("scroll", () => w2.dataset.hasScrolled = "false", { once: true, signal: this.signal });
    w2.scrollLeft = w2.scrollWidth - w2.clientWidth;
  }
  handleDirtyScroll(e) {
    const el = e.currentTarget;
    if (el.scrollLeft > 0) el.dataset.hasScrolled = "true";
    el.dataset.resetScrolled = String(el.scrollLeft === (el.dataset.scroller === "reverse" ? el.scrollWidth - el.clientWidth : 0));
  }
  onDestroy() {
    this.draggable?.destroy();
    this.clups.forEach((cleanup) => cleanup());
    this.scrollAssistEls.forEach(removeScrollAssist);
    this.controls.forEach((instance) => instance.destroy()), this.controls.clear();
  }
};
ControlPanelPlug.plugName = "controlPanel";
ControlPanelPlug.isCore = false;

// src/ts/plugs/overlay.ts
var OverlayPlug2 = class extends BasePlug {
  constructor(ctlr, config) {
    super(ctlr, config, { visible: false });
    this.overlayDelayId = -1;
  }
  wire() {
    this.media.on("state.paused", ({ value }) => value ? this.show() : this.delay(), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.overlay.curtain", this.handleCurtain, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.overlay.behavior", this.handleBehavior, { signal: this.signal, immediate: true });
  }
  handleCurtain({ value }) {
    this.ctlr.videoContainer.dataset.curtain = value;
  }
  handleBehavior({ value }) {
    value === "persistent" && this.show();
    value === "hidden" && this.remove("force");
  }
  shouldShow() {
    return this.config.behavior !== "hidden" && !this.ctlr.settings.locked && !this.ctlr.isUIActive("playerDragging");
  }
  shouldRemove(manner) {
    return this.config.behavior !== "persistent" && (manner === "force" || !this.ctlr.isUIActive("pictureInPicture") && !this.ctlr.isUIActive("settings") && (IS_MOBILE ? !this.media.status.waiting && !this.media.state.paused : this.config.behavior === "strict" ? true : !this.media.state.paused));
  }
  show() {
    if (!this.shouldShow()) return;
    this.ctlr.videoContainer.classList.add("tmg-video-overlay");
    this.state.visible = true;
    this.delay();
  }
  delay() {
    clearTimeout(this.overlayDelayId);
    if (this.shouldRemove()) this.overlayDelayId = setTimeout2(this.remove, this.config.delay, this.signal);
  }
  remove(manner) {
    if (this.shouldRemove(manner)) {
      this.ctlr.videoContainer.classList.remove("tmg-video-overlay");
      this.state.visible = false;
    }
  }
};
OverlayPlug2.plugName = "overlay";

// src/ts/plugs/media.ts
var MediaPlug = class extends BasePlug {
  mount() {
    const videoProfile = this.ctlr.DOM.videoProfile;
    videoProfile && this.ctlr.setImgLoadState({ target: videoProfile });
  }
  wire() {
    this.ctlr.config.watch("media.title", this.forwardTitle, { immediate: true, signal: this.signal });
    this.ctlr.config.watch("media.artist", this.forwardArtist, { immediate: true, signal: this.signal });
    this.ctlr.config.watch("media.profile", this.forwardProfile, { immediate: true, signal: this.signal });
    this.media.on("state.paused", ({ value }) => !value && this.syncSession(), { signal: this.signal });
    this.media.on("status.loadedMetadata", () => this.autoGenerate(), { signal: this.signal });
    this.ctlr.config.on("media.links.title", this.handleMediaLink, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media.links.artist", this.handleMediaLink, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media.links.profile", this.handleMediaLink, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media.artwork", this.handleArtwork, { immediate: true, signal: this.signal });
    this.ctlr.config.on("media", this.handleMedia, { immediate: true, signal: this.signal });
  }
  forwardTitle(value) {
    this.ctlr.settings.controlPanel.title = value;
  }
  forwardArtist(value) {
    this.ctlr.settings.controlPanel.artist = value;
  }
  forwardProfile(value) {
    this.ctlr.settings.controlPanel.profile = value;
  }
  handleMediaLink({ target: { key, value } }) {
    const el = key !== "profile" ? this.ctlr.DOM[`video${capitalize(key)}`] : this.ctlr.DOM.videoProfile?.parentElement;
    el && Object.entries({ href: value, "tab-index": value ? "0" : null, target: value ? "_blank" : null, rel: value ? "noopener noreferrer" : null }).forEach(([attr, val]) => val ? el.setAttribute(attr, val) : el.removeAttribute(attr));
  }
  handleArtwork({ currentTarget: { value } }) {
    this.media.intent.poster = value?.[0]?.src || "";
  }
  handleMedia() {
    if (!this.media.state.paused) this.syncSession();
  }
  syncSession() {
    if (!navigator.mediaSession || document.pictureInPictureElement && !this.ctlr.isUIActive("pictureInPicture")) return;
    if (this.config) navigator.mediaSession.metadata = new MediaMetadata(this.config);
    const set = (...args) => navigator.mediaSession.setActionHandler(...args);
    set("play", () => this.media.intent.paused = false);
    set("pause", () => this.media.intent.paused = true);
    const timePlug = this.ctlr.getPlug("time");
    set("seekbackward", timePlug ? () => timePlug.skip(-this.ctlr.settings.time.skip) : null);
    set("seekforward", timePlug ? () => timePlug.skip(this.ctlr.settings.time.skip) : null);
    const playlistPlug = this.ctlr.getPlug("playlist"), playlist = this.ctlr.config.playlist, currentIndex = this.ctlr.getPlug("playlist")?.currentIndex ?? 0;
    set("previoustrack", playlist && currentIndex > 0 && playlistPlug ? playlistPlug.previousVideo : null);
    set("nexttrack", playlist && currentIndex < (playlist?.length ?? 0) - 1 && playlistPlug ? playlistPlug.nextVideo : null);
  }
  async autoGenerate() {
    const url = this.config.artwork?.[0]?.src;
    if (!this.config.autoGenerate || url && !url.startsWith("blob:")) return;
    url && URL.revokeObjectURL(url);
    this.config.artwork = [{ src: "" }];
  }
};
MediaPlug.plugName = "media";
MediaPlug.isCore = true;

// src/ts/plugs/light-state.ts
var LightStatePlug = class extends BasePlug {
  wire() {
    this.ctlr.config.set("lightState.disabled", (value) => this.ctlr.state.readyState > 1 ? TERMINATOR : value);
    this.ctlr.config.on("lightState.disabled", this.handleDisabled, { signal: this.signal, immediate: true });
    this.ctlr.config.on("lightState.controls", this.handleControls, { signal: this.signal, immediate: true });
    this.ctlr.config.on("lightState.preview.usePoster", this.handleUsePoster, { signal: this.signal });
    this.ctlr.config.on("lightState.preview.time", this.handleTime, { signal: this.signal });
    if (this.config.disabled) this.ctlr.setReadyState();
  }
  handleDisabled({ value, target }) {
    if (value) {
      const timeStart = this.ctlr.settings.time.start;
      if (timeStart != null) this.media.intent.currentTime = timeStart;
      this.ctlr.videoContainer.classList.remove("tmg-video-light");
      this.media.element.removeEventListener("play", this.remove);
      this.ctlr.DOM.controlsContainer?.removeEventListener("click", this.handleLightStateClick);
      this.ctlr.setReadyState();
    } else {
      this.ctlr.config.lightState.preview.usePoster = this.config.preview.usePoster;
      this.ctlr.videoContainer.classList.add("tmg-video-light");
      this.media.element.addEventListener("play", this.remove, { signal: this.signal });
      this.ctlr.DOM.controlsContainer?.addEventListener("click", this.handleLightStateClick, { signal: this.signal });
    }
  }
  handleControls() {
    this.ctlr.queryDOM("[data-control-id]", true).forEach((c) => c.dataset.lightControl = this.isLight(c.dataset.controlId) ? "true" : "false");
  }
  handleUsePoster({ target: { value, object }, root }) {
    if (root.lightState.disabled || value && this.media.state.poster) return;
    this.media.intent.currentTime = object.time;
    if (!this.media.status.loadedMetadata) this.media.once("status.loadedMetadata", () => this.config.preview.usePoster = value, { signal: this.signal });
  }
  handleTime({ target: { object }, root }) {
    !root.lightState.disabled && (!object.usePoster || !this.media.state.poster) && (this.media.intent.currentTime = object.time);
  }
  add() {
    this.ctlr.config.lightState.disabled = false;
  }
  remove() {
    this.ctlr.config.lightState.disabled = true;
    this.isLight("bigplaypause") && this.stall();
    this.media.intent.paused = false;
  }
  handleLightStateClick({ target }) {
    target === this.ctlr.DOM.controlsContainer && this.remove();
  }
  stall() {
    this.ctlr.getPlug("overlay")?.show();
    const bigPlayBtn = this.ctlr.getPlug("controlPanel")?.getControlEl("big-play-pause");
    bigPlayBtn && this.ctlr.videoContainer.classList.add("tmg-video-stall");
    bigPlayBtn?.addEventListener("animationend", () => this.ctlr.videoContainer.classList.remove("tmg-video-stall"), { once: true, signal: this.signal });
  }
  isLight(controlId) {
    return inBoolArrOpt(this.ctlr.config.lightState.controls, controlId);
  }
};
LightStatePlug.plugName = "lightState";

// src/ts/plugs/gesture/wheel.ts
var WheelModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    this.timeoutId = null;
    this.zone = null;
    this.xCheck = false;
    this.yCheck = false;
    this.timePercent = 0;
    this.timeMultiplier = 1;
    this.deltaY = 0;
    this.nextTime = 0;
  }
  wire() {
    this.ctlr.videoContainer.addEventListener("wheel", this.handleWheel, { passive: false, signal: this.signal });
  }
  canHandle(e) {
    return !this.ctlr.settings.locked && !this.ctlr.config.disabled && e.target === this.ctlr.DOM.controlsContainer && !this.ctlr.getPlug("gesture")?.touch.xCheck && !this.ctlr.getPlug("gesture")?.touch.yCheck && !this.ctlr.getPlug("fastPlay")?.speedCheck;
  }
  handleWheel(e) {
    if (!this.canHandle(e)) return;
    e.preventDefault();
    this.timeoutId ? clearTimeout(this.timeoutId) : this.handleInit(e);
    this.timeoutId = setTimeout2(this.handleStop, this.config.timeout, this.signal);
    this.handleMove(e);
  }
  handleInit({ clientX: x, clientY: y }) {
    const rect = this.ctlr.videoContainer.getBoundingClientRect();
    this.zone = { x: x - rect.left > rect.width * 0.5 ? "right" : "left", y: y - rect.top > rect.height * 0.5 ? "bottom" : "top" };
    this.deltaY = this.timePercent = 0;
    this.timeMultiplier = 1;
  }
  handleMove({ clientX: x, deltaX, deltaY, shiftKey }) {
    deltaX = shiftKey ? deltaY : deltaX;
    const wc = this.config, rect = this.ctlr.videoContainer.getBoundingClientRect(), width = shiftKey ? rect.height : rect.width, height = shiftKey ? rect.width : rect.height;
    let xPercent = -deltaX / (width * wc.xRatio);
    xPercent = this.timePercent += xPercent;
    const xSign = xPercent >= 0 ? "+" : "-";
    xPercent = Math.abs(xPercent);
    if (deltaX || shiftKey) {
      if (!wc.timeline.normal || this.yCheck) return this.handleStop();
      this.xCheck = true;
      this.applyTimeline(xPercent, xSign, this.timeMultiplier);
      if (shiftKey) return;
    }
    if (deltaY) {
      if (this.xCheck) {
        const mY = clamp(0, Math.abs(this.deltaY += deltaY), height * wc.yRatio * 0.5);
        this.timeMultiplier = 1 - mY / (height * wc.yRatio * 0.5);
        return this.applyTimeline(xPercent, xSign, this.timeMultiplier);
      }
      const cancel = this.zone?.x === "right" && !wc.volume.normal || this.zone?.x === "left" && !wc.brightness.normal, currentXZone = x - rect.left > width * 0.5 ? "right" : "left";
      if (cancel || currentXZone !== this.zone?.x) return this.handleStop();
      this.yCheck = true;
      const ySign = -deltaY >= 0 ? "+" : "-", yPercent = clamp(0, Math.abs(deltaY), height * wc.yRatio) / (height * wc.yRatio);
      this.zone?.x === "right" ? this.applyRange("volume", yPercent, ySign) : this.applyRange("brightness", yPercent, ySign);
    }
  }
  handleStop() {
    this.timeoutId = null;
    if (this.yCheck) this.yCheck = false;
    if (this.xCheck) {
      this.xCheck = false;
      this.media.intent.currentTime = this.nextTime;
    }
  }
  applyTimeline(percent, sign, multiplier) {
    const { currentTime } = this.media.state, { duration } = this.media.status, change = percent * duration * +multiplier.toFixed(1);
    this.nextTime = clamp(0, currentTime + (sign === "+" ? change : -change), duration);
  }
  applyRange(key, percent, sign) {
    const plug = this.ctlr.getPlug(key), range = this.ctlr.settings[key], value = range.value + (sign === "+" ? percent : -percent) * range.max;
    plug?.handleSliderInput(clamp(0, Math.round(value), range.max));
  }
};
WheelModule.moduleName = "wheel gesture";

// src/ts/plugs/gesture/touch.ts
var TouchModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    this.lastX = 0;
    this.lastY = 0;
    this.zone = null;
    this.xCheck = false;
    this.yCheck = false;
    this.canCancel = true;
    this.cancelTimeoutId = -1;
    this.sliderTimeoutId = -1;
    this.nextTime = 0;
  }
  wire() {
    this.ctlr.DOM.controlsContainer?.addEventListener("touchstart", this.handleStart, { capture: true, signal: this.signal });
  }
  canHandle(e) {
    return !this.ctlr.config.disabled && e.touches?.length === 1 && e.target === this.ctlr.DOM.controlsContainer && !this.ctlr.getPlug("fastPlay")?.speedCheck;
  }
  handleStart(e) {
    if (!this.canHandle(e)) return;
    this.handleEnd();
    this.lastX = e.touches[0].clientX;
    this.lastY = e.touches[0].clientY;
    this.ctlr.videoContainer.addEventListener("touchmove", this.handleInit, { once: true, signal: this.signal });
    this.cancelTimeoutId = setTimeout2(() => this.canCancel = false, this.config.threshold, this.signal);
    ["touchend", "touchcancel"].forEach((evt) => this.ctlr.videoContainer.addEventListener(evt, this.handleEnd, { signal: this.signal }));
  }
  handleInit(e) {
    const te = e;
    if (te.touches?.length > 1 || this.ctlr.getPlug("fastPlay")?.speedCheck) return;
    te.preventDefault();
    const tc = this.config, rect = this.ctlr.videoContainer.getBoundingClientRect(), x = te.touches[0].clientX, y = te.touches[0].clientY, deltaX = Math.abs(this.lastX - x), deltaY = Math.abs(this.lastY - y);
    this.zone = { x: x - rect.left > rect.width * 0.5 ? "right" : "left", y: y - rect.top > rect.height * 0.5 ? "bottom" : "top" };
    const rLeft = this.lastX - rect.left, rTop = this.lastY - rect.top;
    if (deltaX > deltaY * tc.axesRatio && rLeft > tc.inset && rLeft < rect.width - tc.inset) {
      if (tc.timeline) {
        this.xCheck = true;
        this.ctlr.videoContainer.addEventListener("touchmove", this.handleXMove, { passive: false, signal: this.signal });
      }
    } else if (deltaY > deltaX * tc.axesRatio && rTop > tc.inset && rTop < rect.height - tc.inset) {
      if (tc.volume && this.zone?.x === "right" || tc.brightness && this.zone?.x === "left") {
        this.yCheck = true;
        this.ctlr.videoContainer.addEventListener("touchmove", this.handleYMove, { passive: false, signal: this.signal });
      }
    }
  }
  handleXMove(e) {
    const te = e;
    if (this.canCancel) return this.handleEnd();
    te.preventDefault();
    this.ctlr.DOM.touchTimelineNotifier?.classList.add("tmg-video-control-active");
    this.ctlr.throttle(
      "gestureTouchMove",
      () => {
        const tc = this.config, { offsetWidth: width, offsetHeight: height } = this.ctlr.videoContainer, x = te.touches[0].clientX, y = te.touches[0].clientY, deltaX = x - this.lastX, deltaY = y - this.lastY, sign = deltaX >= 0 ? "+" : "-", percent = clamp(0, Math.abs(deltaX), width * tc.xRatio) / (width * tc.xRatio), mY = clamp(0, Math.abs(deltaY), height * tc.yRatio * 0.5), multiplier = 1 - mY / (height * tc.yRatio * 0.5);
        this.applyTimeline({ percent, sign, multiplier });
      },
      30,
      false
    );
  }
  handleYMove(e) {
    const te = e;
    if (this.canCancel || !this.ctlr.isUIActive("fullscreen")) return this.handleEnd();
    te.preventDefault();
    (this.zone?.x === "right" ? this.ctlr.DOM.touchVolumeNotifier : this.ctlr.DOM.touchBrightnessNotifier)?.classList.add("tmg-video-control-active");
    this.ctlr.throttle(
      "gestureTouchMove",
      () => {
        const tc = this.config, height = this.ctlr.videoContainer.offsetHeight, y = te.touches[0].clientY, deltaY = y - this.lastY, sign = deltaY >= 0 ? "-" : "+", percent = clamp(0, Math.abs(deltaY), height * tc.yRatio) / (height * tc.yRatio);
        this.lastY = y;
        this.applyRange(this.zone?.x === "right" ? "volume" : "brightness", percent, sign);
      },
      30,
      false
    );
  }
  handleEnd() {
    if (this.xCheck) {
      this.xCheck = false;
      this.ctlr.videoContainer.removeEventListener("touchmove", this.handleXMove);
      this.ctlr.DOM.touchTimelineNotifier?.classList.remove("tmg-video-control-active");
      if (!this.canCancel) this.media.intent.currentTime = this.nextTime;
    }
    if (this.yCheck) {
      this.yCheck = false;
      this.ctlr.videoContainer.removeEventListener("touchmove", this.handleYMove);
      clearTimeout(this.sliderTimeoutId);
      this.sliderTimeoutId = setTimeout2(
        () => {
          this.ctlr.DOM.touchVolumeNotifier?.classList.remove("tmg-video-control-active");
          this.ctlr.DOM.touchBrightnessNotifier?.classList.remove("tmg-video-control-active");
        },
        this.config.sliderTimeout,
        this.signal
      );
      if (!this.canCancel) this.ctlr.getPlug("overlay")?.remove();
    }
    clearTimeout(this.cancelTimeoutId);
    this.canCancel = true;
    this.ctlr.videoContainer.removeEventListener("touchmove", this.handleInit);
    ["touchend", "touchcancel"].forEach((evt) => this.ctlr.videoContainer.removeEventListener(evt, this.handleEnd));
  }
  applyTimeline({ percent, sign, multiplier }) {
    const { currentTime } = this.media.state, { duration } = this.media.status, change = percent * duration * +multiplier.toFixed(1);
    this.nextTime = clamp(0, currentTime + (sign === "+" ? change : -change), duration);
  }
  applyRange(key, percent, sign) {
    const plug = this.ctlr.getPlug(key), range = this.ctlr.settings[key], value = sign === "+" ? range.value + percent * range.max : range.value - percent * range.max;
    plug?.handleSliderInput(clamp(0, Math.round(value), range.max));
  }
};
TouchModule.moduleName = "touch gesture";

// src/ts/plugs/gesture/general.ts
var GeneralModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    this.focusSubjectId = "";
    this.skipPersistPosition = null;
  }
  wire() {
    addSafeClicks(this.ctlr.DOM.controlsContainer, this.handleClick, this.handleDblClick, { capture: true, signal: this.signal });
    [this.ctlr.DOM.controlsContainer, this.ctlr.DOM.bottomControlsWrapper].forEach((el) => {
      el?.addEventListener("click", this.handleAnyClick, { capture: true, signal: this.signal });
      el?.addEventListener("contextmenu", this.handleRightClick, { signal: this.signal });
      el?.addEventListener("focusin", this.handleFocusIn, { capture: true, signal: this.signal });
      el?.addEventListener("keydown", this.handleKeyFocusIn, { capture: true, signal: this.signal });
      ["pointermove", "dragenter", "scroll"].forEach((evt) => el?.addEventListener(evt, this.handleHoverPointerActive, { capture: true, signal: this.signal }));
      el?.addEventListener("mouseleave", this.handleHoverPointerOut, { capture: true, signal: this.signal });
    });
  }
  handleAnyClick() {
    this.ctlr.getPlug("overlay")?.delay();
    this.ctlr.getPlug("controlPanel")?.getControl("timeline")?.stopScrubbing();
  }
  handleRightClick(e) {
    e.preventDefault();
  }
  handleFocusIn({ target }) {
    const t = target;
    this.focusSubjectId = String(!t.matches(":focus-visible") && (t?.dataset?.controlId ?? t?.parentElement?.dataset?.controlId));
  }
  handleKeyFocusIn({ target }) {
    const t = target;
    if ((t?.dataset?.controlId ?? t?.parentElement?.dataset?.controlId) === this.focusSubjectId) t.blur();
  }
  handleHoverPointerActive(e) {
    const { target, pointerType } = e, overlay = this.ctlr.getPlug("overlay");
    (!pointerType || !IS_MOBILE) && overlay?.show();
    pointerType && target.closest(".tmg-video-side-controls-wrapper") && clearTimeout(overlay?.overlayDelayId ?? -1);
  }
  handleHoverPointerOut() {
    const overlay = this.ctlr.getPlug("overlay");
    setTimeout2(() => !IS_MOBILE && !this.ctlr.videoContainer.matches(":hover") && overlay?.remove());
  }
  handleClick(e) {
    const { target } = e;
    if (target !== this.ctlr.DOM.controlsContainer) return;
    const onClick = this.config.click;
    this.media.intent.paused = !this.media.state.paused;
  }
  handleDblClick(e) {
    const { clientX: x, target, detail } = e;
    if (target !== this.ctlr.DOM.controlsContainer) return;
    const rect = this.ctlr.videoContainer.getBoundingClientRect(), pos = x - rect.left > rect.width * 0.65 ? "right" : x - rect.left < rect.width * 0.35 ? "left" : "center";
    if (this.state.skipPersist && pos !== this.skipPersistPosition) {
      this.deactivateSkipPersist();
      if (detail === 1) return;
    }
    if (pos === "center") {
      const onDblClick = this.config.dblClick;
      this.media.intent.paused = !this.media.state.paused;
      return;
    }
    if (this.state.skipPersist && detail === 2) return;
    if (!this.state.skipPersist) this.activateSkipPersist(pos);
    this.ctlr.getPlug("time")?.skip(pos === "right" ? this.ctlr.settings.time.skip : -this.ctlr.settings.time.skip);
  }
  activateSkipPersist(pos) {
    this.state.skipPersist = true;
    this.skipPersistPosition = pos;
    this.ctlr.videoContainer.addEventListener("click", this.handleDblClick, { signal: this.signal });
    setTimeout2(() => this.deactivateSkipPersist(), 2e3);
  }
  deactivateSkipPersist() {
    this.state.skipPersist = false;
    this.skipPersistPosition = null;
    this.ctlr.videoContainer.removeEventListener("click", this.handleDblClick);
  }
};
GeneralModule.moduleName = "general gesture";

// src/ts/plugs/gesture/index.ts
var GesturePlug = class extends BasePlug {
  constructor(ctlr, config, state2) {
    super(ctlr, config, state2);
    this.general = new GeneralModule(this.ctlr, { click: this.config.click, dblClick: this.config.dblClick });
    this.wheel = new WheelModule(this.ctlr, this.config.wheel);
    this.touch = new TouchModule(this.ctlr, this.config.touch);
  }
  wire() {
    const wire = () => (this.general.wire(), this.wheel.wire(), this.touch.wire());
    if (this.ctlr.state.readyState > 1) wire();
    else this.ctlr.state.once("readyState", wire, { signal: this.signal });
  }
  onDestroy() {
    super.onDestroy();
    this.general?.destroy();
    this.wheel?.destroy();
    this.touch?.destroy();
  }
};
GesturePlug.plugName = "gesture";

// src/ts/plugs/fastPlay.ts
var FastPlayPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.speedCheck = false;
    this.wasPaused = false;
    this.lastPlaybackRate = 1;
    this.rewindPlaybackRate = 0;
    this.speedIntervalId = null;
    this.speedPtrCheck = false;
    this.speedDirection = "forwards";
    this.speedTimeoutId = null;
    this.playTriggerCounter = 0;
  }
  wire() {
    const attachListeners = () => {
      this.ctlr.DOM.controlsContainer?.addEventListener("pointerdown", this.handleSpeedPointerDown, { capture: true, signal: this.signal });
    };
    if (this.ctlr.state.readyState > 1) attachListeners();
    else this.ctlr.state.once("readyState", attachListeners, { signal: this.signal });
  }
  fastPlay(pos) {
    if (this.speedCheck) return;
    this.speedCheck = true;
    this.wasPaused = this.media.state.paused;
    this.lastPlaybackRate = this.media.state.playbackRate;
    setTimeout2(pos === "backwards" && this.config.rewind ? this.rewind : this.fastForward, 0, this.signal);
  }
  fastForward(rate = this.config.playbackRate) {
    this.media.intent.playbackRate = rate;
    this.state.isRewinding = false;
    this.media.intent.paused = false;
  }
  rewind(rate = this.config.playbackRate) {
    this.media.intent.playbackRate = 1, this.rewindPlaybackRate = rate;
    this.state.isRewinding = true;
    this.media.element.addEventListener("play", () => this.rewindReset(), { signal: this.signal });
    this.speedIntervalId = setInterval(() => this.rewindVideo(), this.ctlr.state.pframeDelay - 20, this.signal);
  }
  rewindVideo() {
    if (!this.media.state.paused) this.media.intent.paused = true;
    this.media.intent.currentTime = this.media.state.currentTime - this.rewindPlaybackRate / this.ctlr.settings.frame.fps;
    this.ctlr.settings.css.currentPlayedPosition = this.ctlr.settings.css.currentThumbPosition = this.media.state.currentTime / this.media.status.duration;
  }
  rewindReset() {
    if (this.speedIntervalId) {
      this.media.intent.paused = true;
      clearInterval(this.speedIntervalId);
      this.speedIntervalId = null;
    } else this.speedIntervalId = setInterval(() => this.rewindVideo(), Math.round(1e3 / this.ctlr.settings.frame.fps) - 20, this.signal);
  }
  slowDown() {
    if (!this.speedCheck) return;
    this.speedCheck = false;
    if (this.speedIntervalId) clearInterval(this.speedIntervalId);
    this.media.element.removeEventListener("play", () => this.rewindReset());
    this.media.intent.playbackRate = this.lastPlaybackRate;
    this.rewindPlaybackRate = 0;
    this.state.isRewinding = false;
    this.media.intent.paused = this.config.reset ? this.wasPaused : false;
    this.ctlr.getPlug("overlay")?.remove();
  }
  handleSpeedPointerDown(e) {
    if (!this.config.pointer.type.match(new RegExp(`all|${e.pointerType}`)) || e.target !== this.ctlr.DOM.controlsContainer || this.speedCheck) return;
    ["touchmove", "mouseup", "touchend", "touchcancel"].forEach((evt) => this.ctlr.videoContainer?.addEventListener(evt, this.handleSpeedPointerUp, { signal: this.signal }));
    this.ctlr.videoContainer?.addEventListener("mouseleave", this.handleSpeedPointerOut, { signal: this.signal });
    clearTimeout(this.speedTimeoutId);
    this.speedTimeoutId = setTimeout2(
      () => {
        this.ctlr.videoContainer?.removeEventListener("touchmove", this.handleSpeedPointerUp);
        this.speedPtrCheck = true;
        const x = e.clientX ?? e.targetTouches?.[0]?.clientX;
        const rect = this.ctlr.videoContainer.getBoundingClientRect();
        const rLeft = x - rect.left;
        this.speedDirection = rLeft >= rect.width * 0.5 ? "forwards" : "backwards";
        if (rLeft < this.config.pointer.inset || rLeft > rect.width - this.config.pointer.inset) return;
        if (this.config.rewind) ["mousemove", "touchmove"].forEach((evt) => this.ctlr.videoContainer?.addEventListener(evt, this.handleSpeedPointerMove, { signal: this.signal }));
        this.fastPlay(this.speedDirection);
      },
      this.config.pointer.threshold,
      this.signal
    );
  }
  handleSpeedPointerMove(e) {
    if (e.touches?.length > 1) return;
    this.ctlr.throttle(
      "speedPointerMove",
      () => {
        const rect = this.ctlr.videoContainer.getBoundingClientRect(), x = e.clientX ?? e.targetTouches?.[0]?.clientX, currPos = x - rect.left >= rect.width * 0.5 ? "forwards" : "backwards";
        if (currPos !== this.speedDirection) {
          this.speedDirection = currPos;
          this.slowDown();
          this.fastPlay(this.speedDirection);
        }
      },
      200
    );
  }
  handleSpeedPointerUp() {
    clearTimeout(this.speedTimeoutId);
    this.speedPtrCheck = false;
    if (this.speedCheck && this.playTriggerCounter < 1) setTimeout2(() => this.slowDown(), 0, this.signal);
    ["touchmove", "mouseup", "touchend", "touchcancel"].forEach((evt) => this.ctlr.videoContainer?.removeEventListener(evt, this.handleSpeedPointerUp));
    ["mousemove", "touchmove"].forEach((evt) => this.ctlr.videoContainer?.removeEventListener(evt, this.handleSpeedPointerMove));
    this.ctlr.videoContainer?.removeEventListener("mouseleave", this.handleSpeedPointerOut);
  }
  handleSpeedPointerOut() {
    !this.ctlr.videoContainer?.matches(":hover") && this.handleSpeedPointerUp();
  }
};
FastPlayPlug.plugName = "fastPlay";

// src/ts/plugs/volume.ts
var VolumePlug3 = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.lastVolume = 0;
    this.sliderAptVolume = 5;
    this.shouldMute = false;
    this.shouldSetLastVolume = false;
    this.audioSetup = false;
  }
  get ctime() {
    return AUDIO_CONTEXT?.currentTime ?? 0;
  }
  mount() {
    if (this.ctlr.state.audioContextReady) this.setupAudio();
    else this.ctlr.state.once("audioContextReady", this.setupAudio, { signal: this.signal });
  }
  wire() {
    const configVolume = this.config.value ?? this.media.state.volume * 100;
    this.lastVolume = clamp(this.config.min, configVolume, this.config.max);
    this.shouldMute = this.shouldSetLastVolume = this.media.element?.muted ?? false;
    this.config.value = this.shouldMute ? 0 : this.lastVolume;
    this.media.element.addEventListener("volumechange", this.handleNativeVolumeChange, { signal: this.signal });
    this.ctlr.config.set("settings.volume.value", (value) => clamp(this.config.min, value, this.config.max), { signal: this.signal });
    this.ctlr.config.watch("settings.volume.value", this.forwardVolume, { signal: this.signal, immediate: true });
    this.ctlr.config.watch("settings.volume.muted", this.forwardMuted, { signal: this.signal, immediate: true });
    this.media.on("intent.volume", this.handleVolumeIntent, { capture: true, signal: this.signal });
    this.media.on("intent.muted", this.handleMutedIntent, { capture: true, signal: this.signal });
    this.ctlr.config.on("settings.volume.min", this.handleMin, { signal: this.signal });
    this.ctlr.config.on("settings.volume.max", this.handleMax, { signal: this.signal });
    this.media.tech.features.volume = true;
  }
  forwardVolume(value) {
    this.media.intent.volume = value;
  }
  forwardMuted(value) {
    this.media.intent.muted = value;
  }
  handleVolumeIntent(e) {
    if (e.resolved) return;
    if (this.media.element !== this.media.tech.element) return e.reject(this.name);
    this.handleVolumeState(e.value);
    this.media.state.volume = e.value;
    e.resolve(this.name);
  }
  handleMutedIntent(e) {
    if (e.resolved) return;
    if (this.media.element !== this.media.tech.element) return e.reject(this.name);
    if (e.oldValue === e.value) return e.resolve(this.name);
    this.handleMutedState(e.value);
    this.media.state.muted = e.value;
    e.resolve(this.name);
  }
  handleMin({ target }) {
    const min = target.value;
    if (this.config.value < min) this.config.value = min;
    if (this.lastVolume < min) this.lastVolume = min;
  }
  handleMax({ target }) {
    const max = target.value;
    if (this.config.value > max) this.config.value = max;
    if (this.lastVolume > max) this.lastVolume = max;
    this.ctlr.videoContainer.classList.toggle("tmg-video-volume-boost", max > 100);
    this.ctlr.settings.css.volumeSliderPercent = Math.round(100 / max * 100);
    this.ctlr.settings.css.maxVolumeRatio = max / 100;
  }
  handleVolumeState(volume) {
    const v = clamp(this.shouldMute ? 0 : this.config.min, volume * 100, this.config.max), vLevel = v === 0 ? "muted" : v < 50 ? "low" : v <= 100 ? "high" : "boost", vPercent = (v - 0) / (this.config.max - 0);
    if (this.gainNode) this.gainNode.gain.setTargetAtTime(v / 100 * 2, this.ctime, 0.05);
    this.media.element.muted = this.media.element.defaultMuted = this.config.muted = v === 0;
    this.ctlr.videoContainer.dataset.volumeLevel = vLevel;
    this.ctlr.settings.css.currentVolumeTooltipPosition = `${10.5 + vPercent * 79.5}%`;
    if (this.config.max > 100) {
      if (v <= 100) {
        this.ctlr.settings.css.currentVolumeSliderPosition = (v - 0) / (100 - 0);
        this.ctlr.settings.css.currentVolumeSliderBoostPosition = 0;
        this.ctlr.settings.css.volumeSliderBoostPercent = 0;
      } else {
        this.ctlr.settings.css.currentVolumeSliderPosition = 1;
        this.ctlr.settings.css.currentVolumeSliderBoostPosition = (v - 100) / (this.config.max - 100);
        this.ctlr.settings.css.volumeSliderBoostPercent = this.ctlr.settings.css.volumeSliderPercent;
      }
    } else this.ctlr.settings.css.currentVolumeSliderPosition = vPercent;
  }
  handleMutedState(muted) {
    if (muted) {
      if (this.config.value) {
        this.lastVolume = this.config.value;
        this.shouldSetLastVolume = true;
      }
      this.shouldMute = true;
      if (this.config.value) this.media.intent.volume = 0;
    } else {
      const restore = this.shouldSetLastVolume ? this.lastVolume : this.config.value;
      this.media.intent.volume = (restore ? restore : this.sliderAptVolume) / 100;
      this.shouldMute = this.shouldSetLastVolume = false;
    }
  }
  setupAudio() {
    if (this.audioSetup || connectMediaToAudioManager(this.media.element) === "unavailable") return;
    this.gainNode = this.media.element._tmgGainNode;
    const DCN = this.media.element._tmgDynamicsCompressorNode;
    if (DCN) DCN.threshold.value = -30, DCN.knee.value = 20, DCN.ratio.value = 12, DCN.attack.value = 3e-3, DCN.release.value = 0.25;
    this.audioSetup = true;
  }
  cancelAudio() {
    this.media.intent.volume = clamp(0, (this.gainNode?.gain?.value ?? 2) / 2, 1);
    this.media.element.mediaElementSourceNode?.disconnect();
    this.gainNode?.disconnect();
    this.audioSetup = false;
  }
  toggleMute(option) {
    if (option === "auto" && this.shouldSetLastVolume && !this.lastVolume) {
      this.lastVolume = this.config.skip;
    }
    this.config.muted = !this.config.muted;
  }
  changeVolume(value) {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    let volume = this.shouldSetLastVolume ? this.lastVolume : this.config.value;
    if (sign === "-") {
      if (volume > this.config.min) volume -= volume % value ? volume % value : value;
    } else {
      if (volume < this.config.max) volume += volume % value ? value - volume % value : value;
    }
    this.shouldSetLastVolume ? this.lastVolume = volume : this.config.value = volume;
  }
  handleSliderInput(volume) {
    this.shouldMute = this.shouldSetLastVolume = false;
    this.config.value = volume;
    if (volume > 5) this.sliderAptVolume = volume;
  }
  handleNativeVolumeChange() {
    this.media.element.volume = 1;
    if (this.config.muted !== this.media.element.muted) this.toggleMute();
  }
};
VolumePlug3.plugName = "volume";

// src/ts/plugs/brightness.ts
var BrightnessPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.lastBrightness = 100;
    this.sliderAptBrightness = 100;
    this.shouldDark = false;
    this.shouldSetLastBrightness = false;
  }
  wire() {
    const configBrightness = this.config.value ?? this.ctlr.settings.css.brightness ?? 100;
    this.lastBrightness = clamp(this.config.min, configBrightness, this.config.max);
    this.shouldDark = this.shouldSetLastBrightness = this.config.dark ?? false;
    this.config.value = this.shouldDark ? 0 : this.lastBrightness;
    this.ctlr.config.set("settings.brightness.value", (value) => clamp(this.shouldDark ? 0 : this.config.min, value, this.config.max), { signal: this.signal });
    this.ctlr.config.watch("settings.brightness.value", this.forwardBrightness, { signal: this.signal, immediate: true });
    this.ctlr.config.watch("settings.brightness.dark", this.forwardDark, { signal: this.signal, immediate: true });
    this.media.on("intent.brightness", this.handleBrightnessIntent, { capture: true, signal: this.signal });
    this.media.on("intent.dark", this.handleDarkIntent, { capture: true, signal: this.signal });
    this.ctlr.config.on("settings.brightness.min", this.handleMin, { signal: this.signal });
    this.ctlr.config.on("settings.brightness.max", this.handleMax, { signal: this.signal });
    this.media.tech.features.brightness = true;
  }
  forwardBrightness(value) {
    this.media.intent.brightness = value;
  }
  forwardDark(value) {
    this.media.intent.dark = value;
  }
  handleBrightnessIntent(e) {
    if (e.resolved) return;
    this.handleBrightnessState(e.value);
    this.media.state.brightness = e.value;
    e.resolve(this.name);
  }
  handleDarkIntent(e) {
    if (e.resolved) return;
    this.handleDarkState(e.value);
    this.media.state.dark = e.value;
    e.resolve(this.name);
  }
  handleMin({ target }) {
    const min = target.value;
    if (this.config.value < min) this.config.value = min;
    if (this.lastBrightness < min) this.lastBrightness = min;
  }
  handleMax({ target }) {
    const max = target.value;
    if (this.config.value > max) this.config.value = max;
    if (this.lastBrightness > max) this.lastBrightness = max;
    this.ctlr.videoContainer.classList.toggle("tmg-video-brightness-boost", max > 100);
    this.ctlr.settings.css.brightnessSliderPercent = Math.round(100 / max * 100);
    this.ctlr.settings.css.maxBrightnessRatio = max / 100;
  }
  handleBrightnessState(value) {
    const b = clamp(this.shouldDark ? 0 : this.config.min, value, this.config.max), bLevel = b === 0 ? "dark" : b < 50 ? "low" : b <= 100 ? "high" : "boost", bPercent = (b - 0) / (this.config.max - 0);
    this.ctlr.settings.css.brightness = b;
    this.config.dark = b === 0;
    this.ctlr.videoContainer.dataset.brightnessLevel = bLevel;
    this.ctlr.settings.css.currentBrightnessTooltipPosition = `${10.5 + bPercent * 79.5}%`;
    if (this.config.max > 100) {
      if (b <= 100) {
        this.ctlr.settings.css.currentBrightnessSliderPosition = (b - 0) / (100 - 0);
        this.ctlr.settings.css.currentBrightnessSliderBoostPosition = 0;
        this.ctlr.settings.css.brightnessSliderBoostPercent = 0;
      } else {
        this.ctlr.settings.css.currentBrightnessSliderPosition = 1;
        this.ctlr.settings.css.currentBrightnessSliderBoostPosition = (b - 100) / (this.config.max - 100);
        this.ctlr.settings.css.brightnessSliderBoostPercent = this.ctlr.settings.css.brightnessSliderPercent;
      }
    } else this.ctlr.settings.css.currentBrightnessSliderPosition = bPercent;
  }
  handleDarkState(dark) {
    if (dark) {
      if (this.config.value) {
        this.lastBrightness = this.config.value;
        this.shouldSetLastBrightness = true;
      }
      this.shouldDark = true;
      if (this.config.value) this.config.value = 0;
    } else {
      const restore = this.shouldSetLastBrightness ? this.lastBrightness : this.config.value;
      this.config.value = restore ? restore : this.sliderAptBrightness;
      this.shouldDark = this.shouldSetLastBrightness = false;
    }
  }
  toggleDark(option) {
    if (option === "auto" && this.shouldSetLastBrightness && !this.lastBrightness) this.lastBrightness = this.config.skip;
    this.config.dark = !this.config.dark;
  }
  changeBrightness(value) {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    let brightness = this.shouldSetLastBrightness ? this.lastBrightness : this.config.value;
    if (sign === "-") {
      if (brightness > this.config.min) brightness -= brightness % value ? brightness % value : value;
    } else {
      if (brightness < this.config.max) brightness += brightness % value ? value - brightness % value : value;
    }
    this.shouldSetLastBrightness ? this.lastBrightness = brightness : this.config.value = brightness;
  }
  handleSliderInput(brightness) {
    this.shouldDark = this.shouldSetLastBrightness = false;
    this.config.value = brightness;
    if (brightness > 5) this.sliderAptBrightness = brightness;
  }
};
BrightnessPlug.plugName = "brightness";

// src/ts/plugs/playbackRate.ts
var PlaybackRatePlug = class extends BasePlug {
  wire() {
    this.media.set("intent.playbackRate", (value) => clamp(this.config.min, value, this.config.max), { signal: this.signal });
    this.ctlr.config.watch("settings.playbackRate.value", this.forwardRate, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.playbackRate.min", this.handleMinChange, { signal: this.signal });
    this.ctlr.config.on("settings.playbackRate.max", this.handleMaxChange, { signal: this.signal });
  }
  forwardRate(value) {
    this.media.intent.playbackRate = value;
  }
  handleMinChange({ value: min }) {
    if (this.config.value < min) this.config.value = min;
  }
  handleMaxChange({ value: max }) {
    if (this.config.value > max) this.config.value = max;
  }
  rotateRate(dir = "forwards") {
    this.config.value = rotate(this.config.value, { min: this.config.min, max: this.config.max, step: this.config.skip }, dir);
  }
  changeRate(value) {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    const rate = this.config.value;
    if (sign === "-") {
      if (rate > this.config.min) this.config.value -= rate % value ? rate % value : value;
    } else {
      if (rate < this.config.max) this.config.value += rate % value ? value - rate % value : value;
    }
  }
};
PlaybackRatePlug.plugName = "playbackRate";

// src/ts/plugs/captions.ts
var STYLE_PROPS = ["font.family", "font.size", "font.color", "font.opacity", "font.weight", "font.variant", "background.color", "background.opacity", "window.color", "window.opacity", "characterEdgeStyle", "textAlignment"];
var CaptionsPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.view = null;
    this.infoView = null;
  }
  mount() {
    this.view = ComponentRegistry.init("captions", this.ctlr);
    this.infoView = ComponentRegistry.init("captions", this.ctlr);
    if (this.view) this.ctlr.DOM.captionsContainer = this.view.element;
    this.view?.mount(), this.infoView?.mount();
  }
  wire() {
    STYLE_PROPS.forEach((prop) => {
      this.ctlr.config.watch(`settings.captions.${prop}.value`, (value) => (this.ctlr.settings.css[camelize(`captions.${prop}`, /\./)] = value, this.view?.syncSize()), { signal: this.signal, immediate: true });
    });
    this.media.on("status.loadedMetadata", this.syncUIState, { signal: this.signal, immediate: true });
    this.media.on("status.textTracks", this.syncUIState, { signal: this.signal });
    this.media.on("state.currentTextTrack", this.handleCurrentTextTrackState, { signal: this.signal, immediate: true });
    this.media.on("status.activeCue", this.handleActiveCueStatus, { signal: this.signal, immediate: true });
    this.view && this.media.on("state.currentTime", this.view.syncKaraoke, { signal: this.signal });
    this.ctlr.config.on("settings.captions.font.size.min", this.handleFontSizeMin, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.captions.font.size.max", this.handleFontSizeMax, { signal: this.signal, immediate: true });
    this.ctlr.settings.css.currentCaptionsX, this.ctlr.settings.css.currentCaptionsY;
  }
  handleDisabledConfig({ value }) {
    const cssPlug = this.ctlr.getPlug("css");
    this.ctlr.settings.css.currentCaptionsX = cssPlug?.CSSCache.currentCaptionsX, this.ctlr.settings.css.currentCaptionsY = cssPlug?.CSSCache.currentCaptionsY;
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return;
    !value ? this.ctlr.videoContainer.classList.add("tmg-video-captions") : this.ctlr.videoContainer.classList.remove("tmg-video-captions", "tmg-video-captions-preview");
    !value && this.infoView?.preview({ text: `${this.media.status.textTracks[this.media.state.currentTextTrack]?.label} ${this.ctlr.videoContainer.dataset.trackKind} 
 Click \u2699 for settings`, region: { viewportAnchorX: 10, viewportAnchorY: 10 } });
  }
  handleFontSizeMin({ value: min }) {
    if (this.config.font.size.value < min) this.config.font.size.value = min;
  }
  handleFontSizeMax({ value: max }) {
    if (this.config.font.size.value > max) this.config.font.size.value = max;
  }
  handleCurrentTextTrackState({ value }) {
    this.ctlr.videoContainer.dataset.trackKind = this.media.status.textTracks[value]?.kind || "captions";
  }
  handleActiveCueStatus({ value }) {
    !(!this.ctlr.isUIActive("captions") && this.ctlr.isUIActive("captionsPreview")) && this.view?.render(value);
  }
  syncUIState() {
    this.ctlr.videoContainer.classList.toggle("tmg-video-captions", this.media.status.textTracks.length > 0 && !this.config.disabled);
    this.ctlr.videoContainer.dataset.trackKind = this.media.status.textTracks[this.media.state.currentTextTrack]?.kind || "captions";
  }
  toggleCaptions() {
    if (!this.media.status.textTracks[this.media.state.currentTextTrack]) return this.view?.preview("No captions available for this video");
    this.config.disabled = !this.config.disabled;
  }
  changeFontSize(value) {
    const sign = value >= 0 ? "+" : "-";
    value = Math.abs(value);
    const size = Number(this.ctlr.settings.css.captionsFontSize);
    switch (sign) {
      case "-":
        if (size > this.config.font.size.min) this.config.font.size.value = size - (size % value ? size % value : value);
        break;
      default:
        if (size < this.config.font.size.max) this.config.font.size.value = size + (size % value ? size % value : value);
    }
    this.view && this.ctlr.config.stall(this.view.preview);
  }
  rotateProp(steps, prop, numeric = true) {
    if (!steps.length) return;
    const curr = this.ctlr.settings.css[camelize(prop.replace(".value", ""), /\./)];
    setAny(this.ctlr.settings, prop, rotate(numeric ? Number(curr) : String(curr), steps));
    this.view && this.ctlr.config.stall(this.view.preview);
  }
  rotateFontFamily() {
    this.rotateProp(parseUIObj(this.config).font.family.values, "captions.font.family.value", false);
  }
  rotateFontWeight() {
    this.rotateProp(parseUIObj(this.config).font.weight.values, "captions.font.weight.value", false);
  }
  rotateFontVariant() {
    this.rotateProp(parseUIObj(this.config).font.variant.values, "captions.font.variant.value", false);
  }
  rotateFontOpacity() {
    this.rotateProp(parseUIObj(this.config).font.opacity.values, "captions.font.opacity.value");
  }
  rotateBackgroundOpacity() {
    this.rotateProp(parseUIObj(this.config).background.opacity.values, "captions.background.opacity.value");
  }
  rotateWindowOpacity() {
    this.rotateProp(parseUIObj(this.config).window.opacity.values, "captions.window.opacity.value");
  }
  rotateCharacterEdgeStyle() {
    this.rotateProp(parseUIObj(this.config).characterEdgeStyle.values, "captions.characterEdgeStyle.value", false);
  }
  rotateTextAlignment() {
    this.rotateProp(parseUIObj(this.config).textAlignment.values, "captions.textAlignment.value", false);
  }
  onDestroy() {
    this.view?.destroy();
    if (this.ctlr.DOM.captionsContainer === this.view?.element) this.ctlr.DOM.captionsContainer = null;
  }
};
CaptionsPlug.plugName = "captions";

// src/ts/plugs/time.ts
var TimePlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.actualStart = 0;
    this.pseudoStart = 0;
    this.skipDuration = 0;
    this.skipDurationId = -1;
    this.currentSkipNotifier = null;
    this.guardedTimePaths = ["lightState.preview.time", "settings.time.min", "settings.time.max", "settings.time.start", "settings.time.end", "settings.auto.next.preview.time"];
  }
  wire() {
    this.pseudoStart = this.config.start ?? 0;
    this.guardTimeValues();
    this.media.set("intent.currentTime", () => clamp(this.config.min, this.config.value, this.config.max), { signal: this.signal });
    this.ctlr.config.watch("settings.time.value", this.forwardTimeValue, { signal: this.signal, immediate: "auto" });
    this.ctlr.config.watch("settings.time.start", (v) => v !== this.pseudoStart && (this.actualStart = +v), { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", this.handleCurrentTimeState, { signal: this.signal, immediate: true });
    this.media.on("status.waiting", this.handleWaitingStatus, { signal: this.signal });
  }
  forwardTimeValue(value) {
    this.media.intent.currentTime = value;
  }
  handleCurrentTimeState({ target }) {
    const curr = target.value, min = this.config.min, max = this.config.max, dur = this.media.status.duration, end = this.config.end;
    if (curr < min || curr > max) {
      this.media.intent.currentTime = this.config.loop ? min : curr;
      if (!this.config.loop) this.media.intent.paused = true;
    }
    if (this.media.status.readyState && curr && this.ctlr.state.readyState > 1) this.config.start = this.pseudoStart = curr > 3 && curr < (end ?? dur) - 3 ? curr : this.actualStart;
  }
  handleWaitingStatus({ value }) {
    if (value && IS_MOBILE && this.currentSkipNotifier) this.media.once("status.waiting", () => this.ctlr.getPlug("overlay")?.remove(), { signal: this.signal });
  }
  toTimeVal(value) {
    return parseIfPercent(value ?? 0, this.media.status.duration);
  }
  toTimeText(time = this.media.state.currentTime, useMode = false, showMs = false) {
    const format = this.config.format, duration = this.media.status.duration;
    if (!useMode || this.config.mode !== "remaining") return formatMediaTime({ time, format, elapsed: true, showMs });
    return `-${formatMediaTime({ time: duration - time, format, elapsed: false, showMs })}`;
  }
  get nextMode() {
    return this.config.mode === "elapsed" ? "remaining" : "elapsed";
  }
  toggleMode() {
    this.config.mode = this.nextMode;
  }
  get nextFormat() {
    const current = this.config.format;
    return current === "digital" ? "human" : current === "human" ? "human-long" : "digital";
  }
  rotateFormat() {
    this.config.format = this.nextFormat;
  }
  skip(duration) {
    const overlay = this.ctlr.getPlug("overlay"), notifier = duration > 0 ? this.ctlr.queryDOM(".tmg-video-fwd-notifier") : this.ctlr.queryDOM(".tmg-video-bwd-notifier");
    duration = duration > 0 ? this.media.status.duration - this.media.state.currentTime > duration ? duration : this.media.status.duration - this.media.state.currentTime : duration < 0 ? this.media.state.currentTime > Math.abs(duration) ? duration : -this.media.state.currentTime : 0;
    this.media.intent.currentTime = this.media.state.currentTime + duration;
    this.ctlr.settings.css.currentPlayedPosition = this.ctlr.settings.css.currentThumbPosition = safeNum(this.media.intent.currentTime / this.media.status.duration);
    const mdle = this.ctlr.getPlug("gesture")?.general;
    if (mdle?.state.skipPersist) {
      if (this.currentSkipNotifier && notifier !== this.currentSkipNotifier) {
        this.skipDuration = 0;
        this.currentSkipNotifier.classList.remove("tmg-video-control-persist");
      }
      overlay?.show();
      this.currentSkipNotifier = notifier;
      notifier?.classList.add("tmg-video-control-persist");
      this.skipDuration += duration;
      clearTimeout(this.skipDurationId);
      this.skipDurationId = setTimeout2(
        () => {
          mdle.deactivateSkipPersist();
          notifier?.classList.remove("tmg-video-control-persist");
          this.skipDuration = 0;
          this.currentSkipNotifier = null;
          !this.media.state.paused ? overlay?.remove() : overlay?.show();
        },
        parseCSSTime(this.ctlr.settings.css.notifiersAnimationTime),
        this.signal
      );
      return void notifier?.setAttribute("data-skip", String(Math.trunc(this.skipDuration)));
    } else this.currentSkipNotifier?.classList.remove("tmg-video-control-persist");
    notifier?.setAttribute("data-skip", String(Math.trunc(Math.abs(duration))));
  }
  guardTimeValues() {
    this.guardedTimePaths.forEach((p) => this.ctlr.config.get(p, this.toTimeVal, { signal: this.signal }));
  }
};
TimePlug.plugName = "time";

// src/ts/plugs/modes/fullscreen.ts
var FullscreenModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    this.inFullscreen = false;
  }
  // a quick notice flag for external deps
  wire() {
    this.ctlr.state.watch("docInFullscreen", this.handleDocInFullscreen, { signal: this.signal });
    this.ctlr.state.watch("screenOrientation", this.handleScreenOrientation, { signal: this.signal });
    this.ctlr.config.on("settings.modes.fullscreen.disabled", this.handleDisabledConfig, { signal: this.signal });
    this.media.on("intent.fullscreen", this.handleFullscreenIntent, { capture: true, signal: this.signal });
    this.media.tech.features.fullscreen = !this.config.disabled;
  }
  handleDisabledConfig({ value }) {
    this.media.tech.features.fullscreen = !value;
    if (value && this.ctlr.isUIActive("fullscreen")) this.media.intent.fullscreen = false;
  }
  handleFullscreenIntent(e) {
    if (e.resolved) return;
    if (this.config.disabled && !this.inFullscreen) return e.resolve(this.name);
    if (!this.ctlr.isUIActive("fullscreen")) {
      const fW = this.ctlr.getPlug("modes")?.pip?.floatingWindow;
      if (this.ctlr.isUIActive("floatingPlayer")) return fW?.addEventListener("pagehide", this.enter, { signal: this.signal }), fW?.close(), e.resolve(this.name);
      if (this.ctlr.isUIActive("pictureInPicture")) this.media.intent.pictureInPicture = false;
      this.media.intent.miniplayer = false;
      this.enter();
    } else {
      exitFullscreen(this.ctlr.videoContainer);
      this.inFullscreen = false;
    }
    e.resolve(this.name);
  }
  async enter() {
    await enterFullscreen(this.ctlr.videoContainer);
    this.inFullscreen = true;
  }
  async handleDocInFullscreen(docInFs) {
    const inFs = docInFs && queryFullscreenEl() === this.ctlr.videoContainer;
    if (inFs) {
      this.ctlr.videoContainer.classList.add("tmg-video-fullscreen");
      this.media.state.fullscreen = true;
    } else if (this.ctlr.isUIActive("fullscreen")) {
      this.ctlr.videoContainer.classList.remove("tmg-video-fullscreen");
      this.ctlr.settings.locked.disabled = true;
      this.inFullscreen = false;
      this.media.intent.miniplayer = "auto";
      this.media.state.fullscreen = false;
    }
    if (IS_MOBILE) await this.changeScreenOrientation(inFs ? this.config.orientationLock : false);
  }
  handleScreenOrientation(orientation) {
    if (!this.ctlr.state.mediaParentIntersecting || !IS_MOBILE || this.ctlr.state.readyState < 2 || this.config.onRotate === false || this.ctlr.isUIActive("fullscreen") || this.ctlr.isUIActive("miniplayer")) return;
    const deg = typeof this.config.onRotate === "boolean" ? 90 : parseInt(String(this.config.onRotate));
    if (orientation.angle === deg || orientation.angle === 360 - deg) this.media.intent.fullscreen = !this.inFullscreen;
  }
  async changeScreenOrientation(option = true) {
    const orientation = screen.orientation;
    if (option === false) return void orientation?.unlock?.();
    await orientation?.lock?.(option === "auto" ? this.media.status.videoHeight > this.media.status.videoWidth ? "portrait" : "landscape" : option === true ? orientation.angle === 0 ? "landscape" : "portrait" : option);
  }
};
FullscreenModule.moduleName = "fullscreen";

// src/ts/plugs/modes/theater.ts
var TheaterModule = class extends BaseModule {
  wire() {
    this.ctlr.config.on("settings.modes.theater.disabled", this.handleDisabledConfig, { signal: this.signal });
    this.media.on("intent.theater", this.handleTheaterIntent, { capture: true, signal: this.signal });
    this.media.tech.features.theater = !this.config.disabled;
  }
  handleDisabledConfig({ value }) {
    this.media.tech.features.theater = !value;
    if (value && this.ctlr.isUIActive("theater")) this.media.intent.theater = false;
  }
  handleTheaterIntent(e) {
    if (e.resolved) return;
    if (this.config.disabled && this.ctlr.isUIActive("theater")) return e.resolve(this.name);
    this.ctlr.videoContainer.classList.toggle("tmg-video-theater", e.value);
    this.media.state.theater = e.value;
    e.resolve(this.name);
  }
};
TheaterModule.moduleName = "theater";

// src/ts/plugs/modes/pictureInPicture.ts
var PictureInPictureModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    this.inFloatingPlayer = false;
    // a quick notice flag for external deps
    this.floatingWindow = null;
    this.whitelist = [];
    this.blacklist = [];
  }
  wire() {
    this.ctlr.config.on("settings.modes.pictureInPicture.disabled", this.handleDisabledConfig, { signal: this.signal });
    this.media.on("intent.pictureInPicture", this.handlePictureInPictureIntent, { capture: true, signal: this.signal });
    this.media.on("state.pictureInPicture", this.handlePictureInPictureState, { signal: this.signal });
    this.media.tech.features.pictureInPicture = !this.config.disabled;
  }
  handleDisabledConfig({ value }) {
    this.media.tech.features.pictureInPicture = !value;
    if (value && (this.ctlr.isUIActive("pictureInPicture") || this.ctlr.isUIActive("floatingPlayer"))) this.media.intent.pictureInPicture = false;
  }
  handlePictureInPictureIntent(e) {
    if (e.resolved) return;
    if (this.media.element !== this.media.tech.element && this.config.floatingPlayer.disabled) return e.reject(this.name);
    if (this.config.disabled && !this.ctlr.isUIActive("pictureInPicture") && !this.inFloatingPlayer) return e.resolve(this.name);
    if (this.ctlr.isUIActive("fullscreen")) this.media.intent.fullscreen = false;
    if (!this.ctlr.isUIActive("pictureInPicture") && window.documentPictureInPicture && !this.config.floatingPlayer.disabled) {
      !this.inFloatingPlayer ? this.initFloatingPlayer() : this.floatingWindow?.close();
      e.resolve(this.name);
    }
  }
  async handlePictureInPictureState({ value }) {
    if (this.floatingWindow) return;
    if (value) {
      this.ctlr.videoContainer.classList.add("tmg-video-picture-in-picture");
      this.ctlr.getPlug("overlay")?.show();
      this.media.intent.miniplayer = false;
      this.ctlr.getPlug("media")?.syncSession();
    } else {
      await mockAsync(180);
      this.ctlr.videoContainer.classList.remove("tmg-video-picture-in-picture");
      this.media.intent.miniplayer = "auto";
      this.ctlr.getPlug("overlay")?.delay();
    }
  }
  async initFloatingPlayer() {
    if (this.inFloatingPlayer) return;
    window.documentPictureInPicture?.window?.close?.();
    this.media.intent.miniplayer = false;
    this.floatingWindow = await window.documentPictureInPicture.requestWindow(this.config.floatingPlayer);
    this.inFloatingPlayer = true;
    this.floatingWindow.document.documentElement.style.cssText = `height:100%; background:url(${this.ctlr.config.media?.profile}) center / 32px no-repeat, url(${this.media.state.poster}) center / ${this.ctlr.settings.css.bgSafeObjectFit} no-repeat, black;`;
    await breath(this.floatingWindow);
    const cssTexts = [], whitelist = Object.keys(window.t007?._resourceCache ?? {}).concat(this.whitelist);
    for (const sheet of document.styleSheets) {
      try {
        if (whitelist.concat(this.blacklist).some((href) => isSameURL(href, sheet.href))) continue;
        for (const cssRule of sheet.cssRules) if (cssRule.selectorText?.includes(":root") || cssRule.cssText.includes("tmg") || cssRule.cssText.includes("t007")) cssTexts.push(cssRule.cssText);
      } catch {
        continue;
      }
    }
    this.floatingWindow.document.head.append(createEl("style", { textContent: cssTexts.join("\n") }));
    await Promise.all(whitelist.map((href) => href.includes(".css") && loadResource2(href, "style", void 0, this.floatingWindow)));
    this.ctlr.getPlug("skeleton")?.activatePseudoMode();
    this.ctlr.videoContainer.classList.add("tmg-video-floating-player", "tmg-video-progress-bar");
    this.floatingWindow.document.body.append(this.ctlr.videoContainer);
    this.floatingWindow.document.documentElement.id = document.documentElement.id;
    this.floatingWindow.document.documentElement.className = document.documentElement.className;
    document.documentElement.getAttributeNames().forEach((attr) => this.floatingWindow.document.documentElement.setAttribute(attr, document.documentElement.getAttribute(attr)));
    this.signal.addEventListener("abort", observeMutation(this.floatingWindow.document.documentElement, handleDOMMutation, { childList: true, subtree: true }), { once: true });
    this.floatingWindow.addEventListener("resize", this.handleFloatingPlayerResize, { signal: this.signal });
    this.floatingWindow.addEventListener("pagehide", this.handleFloatingPlayerClose, { signal: this.signal });
    this.media.state.pictureInPicture = true;
  }
  handleFloatingPlayerResize() {
    this.config.floatingPlayer.width = this.floatingWindow?.innerWidth ?? this.config.floatingPlayer.width;
    this.config.floatingPlayer.height = this.floatingWindow?.innerHeight ?? this.config.floatingPlayer.height;
  }
  handleFloatingPlayerClose() {
    this.inFloatingPlayer = false;
    this.floatingWindow = null;
    this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", this.ctlr.settings.controlPanel.progressBar);
    this.ctlr.videoContainer.classList.remove("tmg-video-floating-player");
    this.ctlr.getPlug("skeleton")?.deactivatePseudoMode();
    this.media.intent.miniplayer = "auto";
    this.media.state.pictureInPicture = false;
  }
};
PictureInPictureModule.moduleName = "pictureInPicture";

// src/ts/plugs/modes/miniplayer.ts
var MiniplayerModule = class extends BaseModule {
  constructor() {
    super(...arguments);
    this.lastMiniplayerPosX = 0;
    this.lastMiniplayerPosY = 0;
    this.lastMiniplayerPtrX = 0;
    this.lastMiniplayerPtrY = 0;
    this.nextMiniplayerX = "";
    this.nextMiniplayerY = "";
    this.wildMiniplayerX = "";
    this.wildMiniplayerY = "";
  }
  wire() {
    this.ctlr.state.watch("dimensions.window.width", this.handleWindowWidth, { signal: this.signal });
    this.ctlr.state.on("mediaParentIntersecting", this.handleMediaParentIntersecting, { signal: this.signal });
    this.ctlr.config.on("settings.modes.miniplayer.disabled", this.handleDisabledConfig, { signal: this.signal });
    this.media.on("intent.miniplayer", this.handleMiniplayerIntent, { capture: true, signal: this.signal });
    this.media.on("state.paused", this.handlePaused, { signal: this.signal, immediate: true });
    this.media.tech.features.miniplayer = !this.config.disabled;
  }
  handleWindowWidth(width) {
    if (!this.ctlr.isUIActive("fullscreen")) this.media.intent.miniplayer = "auto";
  }
  handleMediaParentIntersecting() {
    if (this.ctlr.state.readyState > 2) this.media.intent.miniplayer = "auto";
  }
  handleDisabledConfig({ value }) {
    this.media.tech.features.miniplayer = !value;
    if (value) this.media.intent.miniplayer = false;
  }
  handlePaused({ value }) {
    if (!value) this.media.intent.miniplayer = "auto";
  }
  handleMiniplayerIntent(e) {
    if (e.resolved) return;
    const active = this.ctlr.isUIActive("miniplayer");
    if (this.config.disabled && !active) return e.resolve(this.name);
    const modes3 = this.ctlr.getPlug("modes");
    if (e.value === true && !active || !active && !this.ctlr.isUIActive("pictureInPicture") && !modes3?.pip.inFloatingPlayer && !modes3?.fullscreen.inFullscreen && !this.ctlr.state.mediaParentIntersecting && window.innerWidth >= this.config.minWindowWidth && !this.media.state.paused) this.enter();
    else if (e.value === false && active || active && this.ctlr.state.mediaParentIntersecting || active && window.innerWidth < this.config.minWindowWidth) this.exit();
    e.resolve(this.name);
  }
  enter() {
    this.ctlr.getPlug("skeleton")?.activatePseudoMode();
    this.ctlr.videoContainer.classList.add("tmg-video-miniplayer", "tmg-video-progress-bar");
    ["mousedown", "touchstart"].forEach((type) => this.ctlr.videoContainer.addEventListener(type, this.handleDragStart, { signal: this.signal }));
    this.media.state.miniplayer = true;
  }
  exit(behavior) {
    if (behavior && inDocView(this.ctlr.pseudoVideoContainer)) this.ctlr.pseudoVideoContainer.scrollIntoView({ behavior, block: "center", inline: "center" });
    this.ctlr.getPlug("skeleton")?.deactivatePseudoMode();
    this.ctlr.videoContainer.classList.remove("tmg-video-miniplayer");
    this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", this.ctlr.settings.controlPanel.progressBar);
    ["mousedown", "touchstart"].forEach((type) => this.ctlr.videoContainer.removeEventListener(type, this.handleDragStart));
    this.media.state.miniplayer = false;
  }
  expand() {
    if (!this.ctlr.videoContainer.classList.contains("tmg-video-miniplayer")) return;
    this.exit("smooth");
    this.media.state.miniplayer = false;
  }
  remove() {
    this.media.intent.paused = true;
    this.exit();
    this.media.state.miniplayer = false;
  }
  handleDragStart(e) {
    const target = e.target, clientX = e.clientX ?? e.targetTouches?.[0]?.clientX ?? 0, clientY = e.clientY ?? e.targetTouches?.[0]?.clientY ?? 0;
    if (!this.ctlr.isUIActive("miniplayer") || target.scrollWidth > target.clientWidth || [this.ctlr.DOM.topControlsWrapper, inBoolArrOpt(this.ctlr.settings.controlPanel.draggable, "big") ? this.ctlr.DOM.bigControlsWrapper : null, this.ctlr.DOM.bottomControlsWrapper, this.ctlr.DOM.captionsContainer].some((w2) => w2?.contains(target)) || target.closest("[class$='toast-container']")) return;
    const { left, bottom } = getComputedStyle(this.ctlr.videoContainer);
    this.lastMiniplayerPosX = parseFloat(left), this.lastMiniplayerPosY = parseFloat(bottom);
    this.lastMiniplayerPtrX = clientX, this.lastMiniplayerPtrY = clientY;
    this.nextMiniplayerX = this.ctlr.settings.css.currentMiniplayerX, this.nextMiniplayerY = this.ctlr.settings.css.currentMiniplayerY;
    this.wildMiniplayerX = this.nextMiniplayerX, this.wildMiniplayerY = this.nextMiniplayerY;
    document.addEventListener("mousemove", this.handleDragging, { signal: this.signal });
    document.addEventListener("touchmove", this.handleDragging, { passive: false, signal: this.signal });
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => document.addEventListener(type, this.handleDragEnd, { signal: this.signal }));
    this.ctlr.videoContainer.style.setProperty("transition", "none", "important");
  }
  handleDragging(e) {
    if (e.touches?.length > 1) return;
    e.preventDefault();
    this.ctlr.getPlug("overlay")?.remove("force");
    this.ctlr.videoContainer.classList.add("tmg-video-player-dragging");
    this.ctlr.RAFLoop("miniplayerDragging", () => {
      const { innerWidth: ww, innerHeight: wh } = window, { offsetWidth: w2, offsetHeight: h } = this.ctlr.videoContainer, x = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0, y = e.clientY ?? e.changedTouches?.[0]?.clientY ?? 0, newX = this.lastMiniplayerPosX + (x - this.lastMiniplayerPtrX), newY = this.lastMiniplayerPosY - (y - this.lastMiniplayerPtrY), posX = clamp(w2 / 2, newX, ww - w2 / 2), posY = clamp(h / 2, newY, wh - h / 2);
      this.ctlr.videoContainer.style.setProperty("transform", `translate(${x - this.lastMiniplayerPtrX}px, ${y - this.lastMiniplayerPtrY}px)`, "important");
      this.nextMiniplayerX = `${posX / ww * 100}%`, this.nextMiniplayerY = `${posY / wh * 100}%`;
      this.wildMiniplayerX = `${newX / ww * 100}%`, this.wildMiniplayerY = `${newY / wh * 100}%`;
    });
  }
  handleDragEnd() {
    this.ctlr.cancelRAFLoop("miniplayerDragging");
    this.ctlr.videoContainer.classList.remove("tmg-video-player-dragging");
    this.ctlr.videoContainer.style.setProperty("left", this.wildMiniplayerX, "important");
    this.ctlr.videoContainer.style.setProperty("bottom", this.wildMiniplayerY, "important");
    this.ctlr.videoContainer.style.removeProperty("transform");
    setTimeout2(
      () => {
        this.ctlr.settings.css.currentMiniplayerX = this.nextMiniplayerX, this.ctlr.settings.css.currentMiniplayerY = this.nextMiniplayerY;
        ["transition", "left", "bottom"].forEach((prop) => this.ctlr.videoContainer.style.removeProperty(prop));
      },
      0,
      this.signal
    );
    document.removeEventListener("mousemove", this.handleDragging);
    document.removeEventListener("touchmove", this.handleDragging);
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => document.removeEventListener(type, this.handleDragEnd));
  }
  onDestroy() {
    document.removeEventListener("mousemove", this.handleDragging);
    document.removeEventListener("touchmove", this.handleDragging);
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((type) => document.removeEventListener(type, this.handleDragEnd));
    ["mousedown", "touchstart"].forEach((type) => this.ctlr.videoContainer.removeEventListener(type, this.handleDragStart));
  }
};
MiniplayerModule.moduleName = "miniplayer";

// src/ts/plugs/modes/index.ts
var ModesPlug = class extends BasePlug {
  constructor(ctlr, config) {
    super(ctlr, config);
    this.fullscreen = new FullscreenModule(this.ctlr, this.config.fullscreen);
    this.theater = new TheaterModule(this.ctlr, this.config.theater);
    this.pip = new PictureInPictureModule(this.ctlr, this.config.pictureInPicture);
    this.miniplayer = new MiniplayerModule(this.ctlr, this.config.miniplayer);
    if (this.ctlr.config.initialMode) this.media.intent[this.ctlr.config.initialMode] = true;
  }
  wire() {
    this.fullscreen.wire();
    this.theater.wire();
    this.pip.wire();
    this.miniplayer.wire();
  }
  onDestroy() {
    super.onDestroy();
    this.fullscreen?.destroy();
    this.theater?.destroy();
    this.pip?.destroy();
    this.miniplayer?.destroy();
  }
};
ModesPlug.plugName = "modes";

// src/ts/plugs/toasts.ts
var ToastsPlug = class extends BasePlug {
  wire() {
    this.ctlr.config.on("settings.toasts.disabled", this.handleDisabled, { signal: this.signal });
    this.ctlr.config.on("settings.toasts", this.handleToasts, { signal: this.signal });
  }
  handleDisabled({ value }) {
    value && t007?.toast?.dismissAll(this.ctlr.id);
  }
  handleToasts({ type, target: { path, key, value } }) {
    if (type !== "update" || path?.match(/disabled/) || !t007?.toast) return;
    t007.toast.doForAll("update", { [key]: value }, this.ctlr.id);
  }
  get toast() {
    if (this.config.disabled || !t007?.toaster) return null;
    return t007.toaster({ idPrefix: this.ctlr.id, rootElement: this.ctlr.videoContainer, ...this.config });
  }
};
ToastsPlug.plugName = "toasts";

// src/ts/plugs/locked.ts
var LockedPlug = class extends BasePlug {
  constructor(ctlr, config) {
    super(ctlr, config, { visible: false });
    this.lockOverlayDelayId = -1;
    this.control = null;
  }
  mount() {
    const wrapper = createEl("div", { className: "tmg-video-screen-locked-wrapper", innerHTML: `<p>Screen Locked</p><p>Tap to Unlock</p>` });
    this.control = ComponentRegistry.init("screenlocked", this.ctlr);
    this.ctlr.DOM.containerContentWrapper?.appendChild(wrapper);
    this.control && wrapper.prepend(this.control.element);
  }
  wire() {
    this.ctlr.videoContainer.addEventListener("click", this.handleScreenClick, { signal: this.signal });
    this.ctlr.config.on("settings.locked.disabled", this.handleLockChange, { signal: this.signal, immediate: true });
  }
  handleScreenClick() {
    if (this.config.disabled) return;
    this.state.visible ? this?.removeOverlay() : this?.showOverlay();
  }
  async handleLockChange({ value }) {
    if (!value) {
      setTimeout2(this.showOverlay, 0, this.signal);
      this.ctlr.videoContainer.classList.add("tmg-video-locked", "tmg-video-progress-bar");
      this.ctlr.getPlug("overlay")?.remove("force");
    } else {
      this.removeOverlay();
      await mockAsync(parseCSSTime(this.ctlr.settings.css.switchTransitionTime));
      this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", this.ctlr.settings.controlPanel.progressBar);
      this.ctlr.videoContainer.classList.remove("tmg-video-locked");
      this.ctlr.getPlug("overlay")?.show();
    }
  }
  showOverlay() {
    this.ctlr.videoContainer.classList.add("tmg-video-locked-overlay");
    this.state.visible = true;
    this.delayOverlay();
  }
  removeOverlay() {
    this.ctlr.videoContainer.classList.remove("tmg-video-locked-overlay");
    this.state.visible = false;
  }
  delayOverlay() {
    clearTimeout(this.lockOverlayDelayId);
    this.lockOverlayDelayId = setTimeout2(this.removeOverlay, this.ctlr.settings.overlay.delay, this.signal);
  }
  onDestroy() {
    this.control?.destroy();
  }
};
LockedPlug.plugName = "locked";

// src/ts/plugs/frame.ts
var FramePlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.exportCanvas = createEl("canvas");
    this.exportContext = this.exportCanvas.getContext("2d", { willReadFrequently: true });
  }
  async getFrame(display = "", time = this.media.state.currentTime, raw = false, min = 0, video = this.ctlr.pseudoVideo) {
    var _a;
    if (video !== this.media.element) {
      await this.ctlr.state.frameReadyPromise;
      if (Math.abs(video.currentTime - time) > 0.01 || !video.readyState) {
        (_a = this.ctlr.state).frameReadyPromise ?? (_a.frameReadyPromise = new Promise((res) => video.addEventListener(video.readyState ? "timeupdate" : "loadeddata", () => res(null), { once: true, signal: this.signal })));
        video.currentTime = time;
      }
      this.ctlr.state.frameReadyPromise = await this.ctlr.state.frameReadyPromise;
    }
    this.exportCanvas.width = video.videoWidth || min, this.exportCanvas.height = video.videoHeight || min;
    this.exportContext.filter = this.ctlr.settings.css.filter;
    display === "monochrome" && (this.exportContext.filter = `${this.exportContext.filter} grayscale(100%)`);
    this.exportContext.drawImage(video, 0, 0, this.exportCanvas.width, this.exportCanvas.height);
    this.exportContext.filter = "none";
    if (raw === true) return { canvas: this.exportCanvas, context: this.exportContext };
    const blob = (this.exportCanvas.width || this.exportCanvas.height) && await new Promise((res) => this.exportCanvas.toBlob(res));
    return { blob: blob || false, url: blob ? URL.createObjectURL(blob) : false };
  }
  async captureFrame(display = "", time = this.media.state.currentTime) {
    const toast = this.ctlr.getPlug("toasts")?.toast, tTxt = formatMediaTime({ time, format: "human", showMs: true }), fTxt = `video frame ${display === "monochrome" ? "in b&w " : ""}at ${tTxt}`, frameToastId = toast?.loading(`Capturing ${fTxt}...`, { delay: parseCSSTime(this.ctlr.settings.css.notifiersAnimationTime), image: window.TMG_VIDEO_ALT_IMG_SRC, tag: `tmg-${this.ctlr.config.media.title ?? "Video"}fcpa${tTxt}${display}` }), frame = await this.getFrame(display, time, false, 0, this.media.element), filename = `${this.ctlr.config.media.title ?? "Video"}_${display === "monochrome" ? `black&white_` : ""}at_${tTxt}.png`.replace(/[\/:*?"<>|\s]+/g, "_");
    const Save = () => {
      toast?.loading(frameToastId, { render: `Saving ${fTxt}`, actions: {} });
      createEl("a", { href: frame.url, download: filename })?.click?.();
      toast?.success(frameToastId, { delay: 1e3, render: `Saved ${fTxt}`, actions: {} });
    };
    const Share = () => {
      toast?.loading(frameToastId, { render: `Sharing ${fTxt}`, actions: {} });
      navigator.share?.({ title: this.ctlr.config.media.title ?? "Video", text: `Captured ${fTxt}`, files: [new File([frame.blob], filename, { type: frame.blob.type })] }).then(
        () => toast?.success(frameToastId, { render: `Shared ${fTxt}`, actions: {} }),
        () => toast?.error(frameToastId, { render: `Failed sharing ${fTxt}`, actions: { Save } })
      ) || toast?.warn(frameToastId, { delay: 1e3, render: `Couldn't share ${fTxt}`, actions: { Save } });
    };
    frame?.url ? toast?.success(frameToastId, { render: `Captured ${fTxt}`, image: frame.url, autoClose: this.config.captureAutoClose, actions: { Save, Share }, onClose: () => URL.revokeObjectURL(frame.url) }) : toast?.error(frameToastId, { render: `Failed capturing ${fTxt}` });
  }
  async findGoodTime({ time: t = this.media.state.currentTime, secondsLimit: s = 25, saturation: sat = 12, brightness: bri = 40 } = {}) {
    const end = clamp(0, t + s, this.media.status.duration);
    for (; t <= end; t += 0.333) {
      const rgb = await getDominantColor((await this.getFrame("", t, true, 1)).canvas, "rgb", true);
      if (rgb && getRGBBri(rgb) > bri && getRGBSat(rgb) > sat) return t;
    }
    return null;
  }
  async getMainColor(time, poster = this.media.element.poster, config = {}) {
    return getDominantColor(poster ? poster : (await this.getFrame("", time ? time : await this.findGoodTime(config) ?? void 0, true, 1)).canvas);
  }
  moveFrame(dir = "forwards") {
    this.media.state.paused && this.ctlr.throttle("frameStepping", () => this.media.intent.currentTime = clamp(0, Math.round(this.media.state.currentTime * this.config.fps) + (dir === "backwards" ? -1 : 1), Math.floor(this.media.status.duration * this.config.fps)) / this.config.fps, Math.round(1e3 / this.config.fps));
  }
};
FramePlug.plugName = "frame";

// src/ts/plugs/disabled.ts
var DisabledPlug = class extends BasePlug {
  wire() {
    this.media.on("state.paused", ({ value }) => !value && this.media.status.loadedMetadata && this.reactivate(), { signal: this.signal });
    this.ctlr.config.on("disabled", this.handleDisabled, { immediate: true, signal: this.signal });
  }
  handleDisabled({ value }) {
    if (value) {
      this.ctlr.cancelAllLoops();
      this.ctlr.videoContainer.classList.add("tmg-video-disabled");
      this.media.intent.paused = true;
      this.ctlr.getPlug("overlay")?.show();
      this.ctlr.DOM.containerContent?.setAttribute("inert", "");
      this.ctlr.getPlug("toasts")?.toast?.warn("You cannot access the custom controls when disabled");
      this.ctlr.log("You cannot access the custom controls when disabled", "warn");
    } else {
      this.ctlr.videoContainer.classList.remove("tmg-video-disabled");
      this.ctlr.DOM.containerContent?.removeAttribute("inert");
    }
  }
  deactivate(message) {
    this.ctlr.getPlug("overlay")?.show();
    this.state.message = message;
    this.ctlr.DOM.containerContent?.setAttribute("data-message", message);
    const timeline = this.ctlr.getPlug("controlPanel")?.getControl("timeline");
    if (timeline) {
      this.ctlr.setCanvasFallback(timeline["previewCanvas"], timeline["previewContext"]);
      this.ctlr.setCanvasFallback(timeline["thumbnailCanvas"], timeline["thumbnailContext"]);
    }
    this.ctlr.videoContainer.classList.add("tmg-video-inactive");
  }
  reactivate() {
    if (!this.ctlr.videoContainer.classList.contains("tmg-video-inactive") || !this.media.status.loadedMetadata) return;
    this.state.message = null;
    this.ctlr.DOM.containerContent?.removeAttribute("data-message");
    this.ctlr.videoContainer.classList.remove("tmg-video-inactive");
  }
};
DisabledPlug.plugName = "disabled";

// src/ts/plugs/errorMessages.ts
var ErrorMessagesPlug = class extends BasePlug {
  wire() {
    this.media.on("status.error", this.handleError, { signal: this.signal, immediate: true });
  }
  handleError({ value }) {
    if (!value) return;
    const code = value.code, mssg = this.config[code ?? 5] || value.message || "An unknown error occurred with the video :(";
    this.ctlr.getPlug("disabled")?.deactivate(mssg);
  }
};
ErrorMessagesPlug.plugName = "errorMessages";

// src/ts/plugs/persist.ts
var PersistPlug = class extends BasePlug {
  wire() {
    window.addEventListener("pagehide", this.onDestroy, { signal: this.signal });
    this.ctlr.state.on("docVisibilityState", ({ value }) => value === "hidden" && this.onDestroy(), { signal: this.signal });
    this.ctlr.config.on("settings.persist.adapter", this.handleAdapterChange, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.persist.disabled", this.handleDisabledChange, { signal: this.signal, immediate: true });
  }
  handleAdapterChange({ value }) {
    if (this.adapter && value === this.adapter.constructor) return;
    this.adapter?.remove("settings");
    this.adapter = new (value || LocalStorageAdapter)(this.ctlr.id);
    const saved = this.adapter.get("settings");
    if (saved) this.ctlr.settings = mergeObjs(this.ctlr.settings, saved);
  }
  handleDisabledChange({ value }) {
    this.ctlr.config.off("settings", this.throttleSave);
    if (value) this.adapter?.remove("settings");
    else this.ctlr.config.on("settings", this.throttleSave, { signal: this.signal, immediate: true });
  }
  throttleSave({ root: { settings } }) {
    this.ctlr.throttle("persist_save", () => this.adapter.set("settings", settings), this.config.throttle ?? 5e3);
  }
  onDestroy() {
    !this.config.disabled && this.adapter?.set("settings", this.ctlr.settings);
  }
};
PersistPlug.plugName = "persist";

// src/ts/plugs/timeTravel.ts
var TimeTravelPlug = class extends BasePlug {
  constructor() {
    super(...arguments);
    this.history = [];
    this.initialState = null;
    // The "Genesis" snapshot (Raw Data)
    this.isReplaying = false;
    // Flag to prevent recursive recording
    this.stopRequested = false;
    // The emergency brake for playSession
    this.currentFrame = -1;
    // The manual playhead
    this.playbackTimer = null;
  }
  onSetup() {
    this.initialState = this.media.snapshot();
    const opts = { signal: this.signal, capture: false };
    this.media.on("intent", this.record, opts);
    this.media.on("state", this.record, opts);
    this.media.on("settings", this.record, opts);
  }
  /**
   * RECORD: Chronicling the lifecycle of the system.
   */
  record(e) {
    if (this.isReplaying) return;
    this.history.push({ timestamp: Date.now(), path: e.target.path, type: e.staticType, value: e.value, phase: e.eventPhase, rejected: e.rejected });
  }
  exportSession() {
    return JSON.stringify({ initial: this.initialState, data: this.history });
  }
  loadSession(json) {
    try {
      const parsed = JSON.parse(json);
      this.pauseSession();
      this.history = parsed.data;
      this.initialState = parsed.initial;
      this.jumpTo(-1);
    } catch (e) {
      this.ctlr.log("Failed to load session", "error");
    }
  }
  /**
   * PLAY SESSION: Chronological re-enactment.
   * Replays the "Story" by respecting the delays between events.
   */
  async playSession() {
    if (this.isReplaying && !this.stopRequested) return;
    this.isReplaying = true;
    this.stopRequested = false;
    for (let i = this.currentFrame + 1; i < this.history.length; i++) {
      if (this.stopRequested) break;
      const e = this.history[i], delay = this.history[i + 1] ? this.history[i + 1].timestamp - e.timestamp : 0;
      this.currentFrame = i;
      await new Promise((res) => {
        this.playbackTimer = setTimeout2(() => (this.applyEntry(e), res(0)), Math.min(delay, 2e3));
      });
    }
    if (!this.stopRequested) this.isReplaying = false;
  }
  pauseSession() {
    this.stopRequested = true;
    clearTimeout(this.playbackTimer);
  }
  /**
   * JUMP TO (Teleport): Instant state reconstruction.
   * Collapses history into a single "Truth" map and injects it.
   */
  jumpTo(index) {
    this.isReplaying = true;
    this.currentFrame = Math.max(-1, Math.min(index, this.history.length - 1));
    const snapshot = /* @__PURE__ */ new Map();
    const loadBase = (obj, prefix) => Object.keys(obj).forEach((p) => snapshot.set(`${prefix}.${p}`, { value: obj[p], type: "set" }));
    loadBase(this.initialState.intent, "intent");
    loadBase(this.initialState.state, "state");
    loadBase(this.initialState.settings, "settings");
    if (this.currentFrame !== -1) {
      for (let i = 0; i <= this.currentFrame; i++) {
        const e = this.history[i];
        snapshot.set(e.path, { value: e.value, type: e.type });
      }
    }
    snapshot.forEach((entry, path) => {
      const isState = path.startsWith("state");
      entry.type === "delete" ? deleteAny(this.media, path) : setAny(this.media, path, entry.value);
      isState && this.media.tick(path.replace("state.", ""));
    });
    this.isReplaying = false;
  }
  step(forward = true) {
    this.pauseSession();
    forward ? this.jumpTo(this.currentFrame + 1) : this.jumpTo(this.currentFrame - 1);
  }
  /**
   * REWIND (The Ctrl+Z): Destructive undo.
   * Pops history entries and teleports the world to the new tail.
   */
  rewind(steps = 1) {
    this.isReplaying = true;
    while (steps-- > 0 && this.history.length) this.history.pop();
    this.jumpTo(this.history.length - 1);
    this.isReplaying = false;
  }
  /**
   * APPLY ENTRY: Internal dispatcher for single-event re-enactment.
   */
  applyEntry(e) {
    const isState = e.path.startsWith("state");
    e.type === "delete" ? deleteAny(this.media, e.path) : setAny(this.media, e.path, e.value);
    isState && this.media.tick(e.path.replace("state.", ""));
    if (e.rejected) this.ctlr.log(`Replaying REJECTED ${e.path}`, "warn");
  }
};
TimeTravelPlug.plugName = "timeTraveller";

// src/ts/components/index.ts
var components_exports = {};
__export(components_exports, {
  BaseComponent: () => BaseComponent,
  Buffer: () => Buffer2,
  CaptionsView: () => CaptionsView,
  Duration: () => Duration,
  PlayPause: () => PlayPause,
  RangeSlider: () => RangeSlider,
  ScreenLocked: () => ScreenLocked,
  Time: () => Time,
  TimeAndDuration: () => TimeAndDuration,
  Timeline: () => Timeline
});

// src/ts/components/base.ts
var BaseComponent = class extends Controllable {
  get name() {
    return this.constructor.componentName;
  }
  get el() {
    return this.element;
  }
  constructor(ctlr, config, state2) {
    super(ctlr, config, { disabled: false, hidden: false, ...state2 });
  }
  onSetup() {
    this.mount?.();
    if (this.ctlr.state.readyState) this.wire?.();
    else this.wire && this.ctlr.state.once("readyState", this.wire, { signal: this.signal });
  }
  onDestroy() {
    this.unmount();
  }
  // Must assign to this.element before returning
  mount() {
  }
  unmount() {
    this.element.isConnected && this.element.remove();
  }
  wire() {
  }
  // auto unwiring
  hide() {
    this.el.classList.toggle("tmg-video-control-hidden", this.state.hidden = true);
  }
  show() {
    this.el.classList.toggle("tmg-video-control-hidden", this.state.hidden = false);
  }
  disable() {
    this.el.classList.toggle("tmg-video-control-disabled", this.state.disabled = true);
  }
  enable() {
    this.el.classList.toggle("tmg-video-control-disabled", this.state.disabled = false);
  }
  getIcon(name) {
    return IconRegistry.get(name);
  }
  setBtnARIA(doubleKeyAction) {
    this.el.setAttribute("aria-label", this.state.label);
    this.el.setAttribute("aria-keyshortcuts", parseForARIAKS(this.state.cmd));
    if (doubleKeyAction) this.el.setAttribute("aria-description", `Double-press for ${doubleKeyAction}`);
    else if (this.el.hasAttribute("aria-description")) this.el.removeAttribute("aria-description");
  }
};
BaseComponent.isControl = false;

// src/ts/components/buffer.ts
var Buffer2 = class extends BaseComponent {
  create() {
    return this.element = createEl("div", { className: "tmg-video-buffer", innerHTML: `<div class="tmg-video-buffer-accent"></div><div class="tmg-video-buffer-eclipse"><div class="tmg-video-buffer-left"><div class="tmg-video-buffer-circle"></div></div><div class="tmg-video-buffer-right"><div class="tmg-video-buffer-circle"></div></div></div>` });
  }
  mount() {
    this.ctlr.DOM.controlsContainer?.prepend(this.element);
  }
};
Buffer2.componentName = "buffer";

// src/ts/components/captions-view.ts
var CaptionsView = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.isMain = false;
    this.lastCue = null;
    this.karaokeNodes = null;
    this.lastPreview = "";
    this.previewTimeoutId = -1;
    this.charW = 0;
    this.lineHPx = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this.lastPtrX = 0;
    this.lastPtrY = 0;
  }
  create() {
    return this.element = createEl("div", { className: "tmg-video-captions-container" }, { part: "region" });
  }
  mount() {
    this.ctlr.DOM.controlsContainer.prepend(this.element);
  }
  wire() {
    this.isMain = this.element === this.ctlr.DOM.captionsContainer;
    this.element.addEventListener("pointerdown", this.handleDragStart, { signal: this.signal });
    this.ctlr.state.watch("dimensions.container.width", () => (this.syncSize(), this.preview("")), { signal: this.signal, immediate: true });
  }
  syncSize() {
    this.element.style.setProperty("display", "block", "important");
    const measurer = createEl("span", { className: "tmg-video-captions-text", innerHTML: "abcdefghijklmnopqrstuvwxyz".repeat(2) }, {}, { visibility: "hidden" });
    this.element.append(measurer);
    this.charW = measurer.offsetWidth / 52;
    const { lineHeight, fontSize } = getComputedStyle(measurer);
    this.lineHPx = !safeNum(parseFloat(lineHeight), 0) ? safeNum(parseFloat(fontSize), 16) * 1.2 : parseFloat(lineHeight);
    measurer.remove(), this.element.style.removeProperty("display");
  }
  preview(preview = `${capitalize(this.ctlr.videoContainer.dataset.trackKind || "captions")} look like this`, flush = this.element.textContent.replace(/\s/g, "") === this.lastPreview?.replace(/\s/g, "")) {
    const text = "string" === typeof preview ? preview : preview.text || "", should = flush || !this.ctlr.isUIActive("captions") || !this.element.textContent;
    should && this.ctlr.videoContainer.classList.add("tmg-video-captions-preview");
    this.render(should ? isObj(preview) ? preview : { text: preview } : this.lastCue);
    clearTimeout(this.previewTimeoutId);
    this.previewTimeoutId = setTimeout2(
      (flush2 = this.element.textContent.replace(/\s/g, "") === text.replace(/\s/g, "")) => {
        this.ctlr.videoContainer.classList.remove("tmg-video-captions-preview");
        if (flush2) this.element.innerHTML = "";
      },
      this.ctlr.settings.captions.previewTimeout,
      this.signal
    );
    this.lastPreview = text;
  }
  render(cue) {
    const existing = this.element.querySelector(".tmg-video-captions-wrapper");
    if (!cue) return existing?.remove();
    const wrapper = existing ?? createEl("div", { className: "tmg-video-captions-wrapper", ariaLive: "off", ariaAtomic: "true" }, { part: "cue-display" }), { offsetWidth: vCWidth, offsetHeight: vCHeight } = this.ctlr.videoContainer, allowOverride = this.ctlr.settings.captions.allowVideoOverride || !this.isMain;
    ["style", "data-active", "data-scroll"].forEach((attr) => this.element.removeAttribute(attr));
    wrapper.innerHTML = "", cue.text || (cue.text = ""), this.lastCue = cue;
    const lines = cue.text.replace(/(<br\s*\/>)|\\N/gi, "\n").split(/\n/);
    lines.forEach((p) => formatVttLine(p, Math.floor(vCWidth / this.charW)).forEach((l) => wrapper.append(createEl("div", { className: "tmg-video-captions-line" }, cue.id ? { part: "cue", id: cue.id } : { part: "cue" }, allowOverride && cue.align ? { textAlign: cue.align } : void 0).appendChild(createEl("span", { className: "tmg-video-captions-text", innerHTML: parseVttText(l) })).parentElement)));
    !existing && this.element.append(wrapper);
    const { offsetWidth: cWidth, offsetHeight: cHeight } = this.element;
    this.isMain ? this.ctlr.settings.css.currentCaptionsContainerHeight = `${cHeight}px` : this.element.style.setProperty("--tmg-video-current-captions-container-height", `${cHeight}px`);
    this.isMain ? this.ctlr.settings.css.currentCaptionsContainerWidth = `${cWidth}px` : this.element.style.setProperty("--tmg-video-current-captions-container-width", `${cWidth}px`);
    if (allowOverride) {
      if (cue.region) {
        this.element.setAttribute("data-active", "");
        const { width, lines: regionLines, viewportAnchorX: vpAnX, viewportAnchorY: vpAnY, scroll } = cue.region;
        if (isDef(vpAnX)) this.element.style.setProperty("--tmg-video-current-captions-x", `${vpAnX}%`);
        if (isDef(vpAnY)) this.element.style.setProperty("--tmg-video-current-captions-y", `${100 - Number(vpAnY)}%`);
        if (isDef(width)) this.element.style.maxWidth = `${width}%`;
        if (isDef(regionLines)) this.element.style.maxHeight = `${Number(regionLines) * (this.lineHPx / vCHeight * 100)}%`;
        if (scroll === "up") {
          this.element.style.maxHeight = `${regionLines * (this.lineHPx / vCHeight * 100)}%`;
          this.element.dataset.scroll = scroll;
          this.ctlr.config.stall(() => this.element.scrollTop = wrapper.scrollHeight);
        }
      } else {
        if (isDef(cue.position) && cue.position !== "auto") {
          const elHalfWPct = cWidth / vCWidth * 100 / 2, posOffset = cue.positionAlign === "line-left" ? 0 : cue.positionAlign === "line-right" ? -2 * elHalfWPct : -elHalfWPct;
          this.element.style.setProperty("--tmg-video-current-captions-x", `calc(${cue.position}% + ${posOffset}% + ${elHalfWPct}%)`);
        }
        if (isDef(cue.line) && cue.line !== "auto") {
          const line = parseIfPercent(cue.line, 100), lhPct = this.lineHPx / vCHeight * 100, elHalfHPct = cHeight / vCHeight * 100 / 2, lAlign = cue.lineAlign && cue.lineAlign !== "auto" ? cue.lineAlign : line < 0 ? "end" : "start", lineOffset = lAlign === "start" ? -2 * elHalfHPct : lAlign === "end" ? 0 : -elHalfHPct, bottomVal = cue.snapToLines ? line < 0 ? (Math.abs(line) - 1) * lhPct : 100 - line * lhPct : 100 - line;
          this.element.style.setProperty("--tmg-video-current-captions-y", `calc(${bottomVal}% + ${lineOffset}% + ${elHalfHPct}%)`);
        }
        if (isDef(cue.size) && cue.size !== 100) this.element.style.maxWidth = `${cue.size}%`;
      }
      if (cue.vertical) this.element.style.writingMode = cue.vertical === "lr" ? "vertical-lr" : "vertical-rl";
    }
    this.karaokeNodes = Array.from(wrapper.querySelectorAll("[data-part='timed']")).map((el) => {
      const [, m, s, ms] = (el.dataset.time || "").match(/(\d+):(\d+)\.(\d+)/) || [];
      return { el, time: m ? +m * 60 + +s + +ms / 1e3 : 0 };
    });
    this.syncKaraoke();
  }
  syncKaraoke() {
    if (!this.karaokeNodes) return;
    for (const { el, time } of this.karaokeNodes) {
      const isPast = this.media.state.currentTime > time;
      el.toggleAttribute("data-past", isPast), el.toggleAttribute("data-future", !isPast);
    }
  }
  handleDragStart(e) {
    this.element.setPointerCapture(e.pointerId);
    const { left, bottom } = getComputedStyle(this.element);
    this.lastPosX = parseFloat(left), this.lastPosY = parseFloat(bottom);
    this.lastPtrX = e.clientX, this.lastPtrY = e.clientY;
    this.element.addEventListener("pointermove", this.handleDragging, { signal: this.signal });
    this.element.addEventListener("pointerup", this.handleDragEnd, { signal: this.signal });
  }
  handleDragging(e) {
    this.ctlr.videoContainer.classList.add("tmg-video-captions-dragging");
    this.ctlr.RAFLoop("captionsDragging", () => {
      const { offsetWidth: ww, offsetHeight: hh } = this.ctlr.videoContainer, { offsetWidth: w2, offsetHeight: h } = this.element, posX = clamp(w2 / 2, this.lastPosX + (e.clientX - this.lastPtrX), ww - w2 / 2), posY = clamp(h / 2, this.lastPosY - (e.clientY - this.lastPtrY), hh - h / 2);
      this.isMain ? this.ctlr.settings.css.currentCaptionsX = `${posX / ww * 100}%` : this.element.style.setProperty("--tmg-video-current-captions-x", `${posX / ww * 100}%`);
      this.isMain ? this.ctlr.settings.css.currentCaptionsY = `${posY / hh * 100}%` : this.element.style.setProperty("--tmg-video-current-captions-y", `${posY / hh * 100}%`);
    });
  }
  handleDragEnd() {
    this.ctlr.cancelRAFLoop("captionsDragging");
    this.ctlr.videoContainer.classList.remove("tmg-video-captions-dragging");
    this.element.removeEventListener("pointermove", this.handleDragging);
    this.element.removeEventListener("pointerup", this.handleDragEnd);
  }
};
CaptionsView.componentName = "captions";
CaptionsView.isControl = false;

// src/ts/components/duration.ts
var Duration = class extends BaseComponent {
  create() {
    return this.element = createEl("button", { className: "tmg-video-total-time" }, { draggableControl: "", controlId: this.name });
  }
  wire() {
    this.plug = this.ctlr.getPlug("time");
    this.plug && this.element.addEventListener("click", this.plug?.rotateFormat, { signal: this.signal });
    this.media.on("status.duration", this.updateUI, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.format", this.updateARIA, { signal: this.signal, immediate: true });
  }
  updateUI() {
    this.element.textContent = this.plug?.toTimeText(this.media.status.duration) ?? "--:--";
  }
  updateARIA() {
    this.state.label = "Switch time format";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.time.format);
    this.el.title = this.state.label;
    this.setBtnARIA();
  }
};
Duration.componentName = "duration";
Duration.isControl = true;

// src/ts/components/playPause.ts
var PlayPause = class extends BaseComponent {
  create() {
    return this.element = createEl("button", { className: "tmg-video-play-pause-btn", innerHTML: this.getIcon("play") + this.getIcon("pause") + this.getIcon("replay") }, { draggableControl: "", controlId: this.name });
  }
  wire() {
    this.el.addEventListener("click", this.togglePlay, { signal: this.signal });
    this.media.on("state.paused", this.updateUI, { signal: this.signal, immediate: true });
    this.media.on("status.ended", this.updateUI, { signal: this.signal });
    this.ctlr.config.on("settings.keys.shortcuts.playPause", this.updateARIA, { signal: this.signal });
  }
  updateUI() {
    this.updateARIA();
  }
  updateARIA() {
    this.state.label = this.media.status.ended ? "Replay" : this.media.state.paused ? "Play" : "Pause";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.playPause);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
  togglePlay() {
    if (this.media.status.ended) {
      this.media.intent.currentTime = 0;
      this.media.intent.paused = false;
    } else this.media.intent.paused = !this.media.state.paused;
  }
};
PlayPause.componentName = "playPause";
PlayPause.isControl = true;

// src/ts/components/range.ts
var RangeSlider = class extends BaseComponent {
  constructor(ctlr, config = {}) {
    const defaults = { label: "Range", min: 0, max: 100, value: 0, previewValue: 50, step: 1, scrub: { sync: false, relative: true, cancel: { delta: 15, timeout: 2e3 }, wheel: { disabled: false, axisRatio: 6 } } };
    super(ctlr, reactive({ ...defaults, ...config }), { scrubbing: false, shouldCancelScrub: false, stallCancelScrub: false });
    this.isVertical = false;
    this.isRTL = false;
    this.lastPtrPos = 0;
    this.lastThumbPos = 0;
    this.cancelScrubTimeoutId = null;
    this.handleKeyDown = (e) => {
      const key = e.key?.toLowerCase();
      if (["arrowleft", "arrowdown", "arrowright", "arrowup"].includes(key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const delta = e.shiftKey ? 2 : 1, direction = ["arrowleft", "arrowdown"].includes(key) ? -1 : 1;
        this.config.value += direction * delta * this.config.step;
      }
    };
  }
  create() {
    this.container = createEl("div", { className: "tmg-video-range-container", tabIndex: 0, role: "slider" });
    this.barsWrapper = createEl("div", { className: "tmg-video-bars-wrapper" });
    this.baseBar = createEl("div", { className: "tmg-video-bar tmg-video-base-bar" });
    this.valueBar = createEl("div", { className: "tmg-video-bar tmg-video-value-bar" });
    this.thumbIndicator = createEl("div", { className: "tmg-video-thumb-indicator" });
    this.barsWrapper.append(this.baseBar, this.valueBar);
    this.container.append(this.barsWrapper, this.thumbIndicator);
    return this.element = this.container;
  }
  wire() {
    this.container.addEventListener("pointerdown", this.handlePointerDown, { signal: this.signal });
    this.container.addEventListener("keydown", this.handleKeyDown, { signal: this.signal });
    this.container.addEventListener("wheel", this.handleWheel, { passive: false, signal: this.signal });
    this.barsWrapper.addEventListener("mousemove", this.handleInput, { signal: this.signal });
    ["mouseleave", "touchend", "touchcancel"].forEach((e) => this.barsWrapper.addEventListener(e, this.stopPreview, { signal: this.signal }));
    this.config.set("value", (value) => stepNum(value, this.config), { signal: this.signal });
    this.config.on("label", ({ value }) => this.container.ariaLabel = value, { signal: this.signal, immediate: true });
    this.config.on("min", ({ value }) => this.container.ariaValueMin = String(value), { signal: this.signal, immediate: true });
    this.config.on("max", ({ value }) => this.container.ariaValueMax = String(value), { signal: this.signal, immediate: true });
    this.config.on("value", this.handleValueChange, { signal: this.signal, immediate: true });
  }
  seek(value) {
    this.config.value = value;
  }
  handleValueChange({ target }) {
    const pos = this.getValueAsPos();
    this.updateThumbPosition(pos), this.updateValueBar(pos);
    if (!this.state.scrubbing) this.container.ariaValueNow = String(target.value);
  }
  handlePointerDown(e) {
    if (this.state.scrubbing) return;
    this.state.scrubbing = true;
    this.container.setPointerCapture(e.pointerId);
    this.rect = this.container.getBoundingClientRect();
    const s = window.getComputedStyle(this.container);
    this.isVertical = s.writingMode.includes("vertical");
    this.isRTL = s.direction === "rtl";
    this.lastPtrPos = this.getPos(e), this.lastThumbPos = this.getValueAsPos();
    this.handleInput(e);
    this.container.addEventListener("pointermove", this.handleInput, { signal: this.signal });
    this.container.addEventListener("pointerup", this.stopScrubbing, { signal: this.signal });
  }
  stopScrubbing() {
    if (!this.state.scrubbing) return;
    this.state.scrubbing = false;
    const newValue = this.state.shouldCancelScrub ? this.getPosAsValue(this.lastThumbPos) : this.config.value;
    this.seek(newValue);
    this.allowScrubbing();
    this.state.stallCancelScrub = true;
    this.container.removeEventListener("pointermove", this.handleInput);
    this.container.removeEventListener("pointerup", this.stopScrubbing);
  }
  stopPreview() {
  }
  // Subclasses can override to add preview cleanup logic
  cancelScrubbing() {
    if (this.state.stallCancelScrub || this.state.shouldCancelScrub || this.cancelScrubTimeoutId) return;
    this.state.shouldCancelScrub = true;
    this.cancelScrubTimeoutId = setTimeout2(() => this.allowScrubbing(false), this.config.scrub.cancel.timeout, this.signal);
  }
  allowScrubbing(reset = true) {
    this.state.stallCancelScrub = this.state.shouldCancelScrub = false;
    clearTimeout(this.cancelScrubTimeoutId);
    if (reset) this.cancelScrubTimeoutId = null;
  }
  handleInput(e) {
    this.ctlr.throttle(
      `${this.config.label}RangeInput`,
      () => {
        const dimension = this.isVertical ? this.rect.height : this.rect.width, progress = this.getPos(e), pos = clamp(0, !this.state.scrubbing || this.config.scrub.relative ? progress : this.lastThumbPos + progress - this.lastPtrPos, 1), value = this.getPosAsValue(pos);
        this.config.previewValue = value;
        if (this.state.scrubbing) {
          if (!this.config.scrub.sync) this.updateThumbPosition(pos);
          else this.seek(value);
          Math.abs(pos - this.lastThumbPos) < this.config.scrub.cancel.delta / dimension ? this.cancelScrubbing() : this.allowScrubbing();
        }
        this.onInput(e, pos);
      },
      30
    );
  }
  onInput(e, pos) {
  }
  // Subclasses override to add preview logic (timeline preview image, etc.)
  handleWheel(e) {
    if (this.config.wheel.disabled) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const dimension = this.isVertical ? window.innerHeight : window.innerWidth, pos = clamp(0, Math.abs(-e.deltaY), dimension * this.config.wheel.axisRatio) / (dimension * this.config.wheel.axisRatio), value = this.config.value + (-e.deltaY >= 0 ? pos : -pos) * (this.config.max - this.config.min);
    this.seek(Math.round(value));
  }
  updateThumbPosition(pos) {
    this.thumbIndicator.style.cssText = `${this.isVertical ? "inset-block-end" : "inset-inline-start"}: ${pos * 100}%`;
  }
  updateValueBar(pos) {
    this.valueBar.style.cssText = `${this.isVertical ? "block-size" : "inline-size"}: ${pos * 100}%`;
  }
  getValueAsPos(value = this.config.value) {
    return (value - this.config.min) / (this.config.max - this.config.min);
  }
  getPosAsValue(pos) {
    return pos * (this.config.max - this.config.min) + this.config.min;
  }
  getPos(e) {
    const p = this.isVertical ? (e.clientY - this.rect.top) / this.rect.height : (e.clientX - this.rect.left) / this.rect.width;
    return clamp(0, this.isRTL ? 1 - p : p, 1);
  }
};
RangeSlider.componentName = "Range";

// src/ts/components/screenlocked.ts
var ScreenLocked = class extends BaseComponent {
  create() {
    return this.element = createEl("button", {
      type: "button",
      title: "Unlock Screen",
      ariaLabel: "Unlock Screen",
      className: "tmg-video-screen-locked-btn",
      tabIndex: -1,
      innerHTML: `${this.getIcon("lock")}${this.getIcon("unlock")}<p>Unlock controls?</p>`
    });
  }
  wire() {
    this.plug = this.ctlr.getPlug("locked");
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    this.plug?.state.on("visible", this.updateUI, { signal: this.signal, immediate: true });
  }
  updateUI() {
    if (!this.plug?.state.visible) this.el.classList.remove("tmg-video-control-unlock");
  }
  handleClick(e) {
    e.stopPropagation();
    this.plug?.delayOverlay();
    if (this.el.classList.contains("tmg-video-control-unlock")) this.ctlr.settings.locked.disabled = true;
    else this.el.classList.add("tmg-video-control-unlock");
  }
};
ScreenLocked.componentName = "screenlocked";

// src/ts/components/time.ts
var Time = class extends BaseComponent {
  create() {
    return this.element = createEl("button", { className: "tmg-video-current-time" }, { draggableControl: "", controlId: this.name });
  }
  wire() {
    this.plug = this.ctlr.getPlug("time");
    addSafeClicks(this.element, this.plug?.toggleMode, this.plug?.rotateFormat, { signal: this.signal });
    this.media.on("state.currentTime", this.updateUI, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.mode", this.updateUI, { signal: this.signal });
    this.ctlr.config.on("settings.time.format", this.updateUI, { signal: this.signal });
    this.ctlr.config.on("settings.keys.shortcuts.timeMode", this.updateARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.keys.shortcuts.timeFormat", this.updateARIA, { signal: this.signal });
  }
  updateUI() {
    this.element.textContent = this.plug?.toTimeText(this.media.state.currentTime, true) || "-:--";
  }
  updateARIA() {
    this.state.label = `Show ${this.plug?.nextMode} time`;
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.time.mode);
    this.el.title = `Switch (mode${this.state.cmd} / DblClick\u2192format${formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.timeFormat)})`;
    this.setBtnARIA("Switch time format");
  }
};
Time.componentName = "time";
Time.isControl = true;

// src/ts/components/timeandduration.ts
var TimeAndDuration = class extends BaseComponent {
  create() {
    this.element = createEl("button", { className: "tmg-video-time-and-duration" }, { draggableControl: "", controlId: this.name });
    this.time = createEl("span", { className: "tmg-video-current-time" });
    this.bridge = createEl("span", { className: "tmg-video-time-bridge" });
    this.duration = createEl("span", { className: "tmg-video-duration-time" });
    this.element.append(this.time, this.bridge, this.duration);
    return this.element;
  }
  wire() {
    this.plug = this.ctlr.getPlug("time");
    addSafeClicks(this.element, this.plug?.toggleMode, this.plug?.rotateFormat, { signal: this.signal });
    this.media.on("state.currentTime", this.updateTime, { signal: this.signal });
    this.media.on("status.duration", this.updateDuration, { signal: this.signal });
    this.ctlr.config.on("settings.time.format", this.updateUI, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.mode", this.updateTime, { signal: this.signal });
    this.ctlr.config.on("settings.keys.shortcuts.timeMode", this.updateARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.keys.shortcuts.timeFormat", this.updateARIA, { signal: this.signal });
  }
  updateUI() {
    const bridgeText = { digital: "/", human: "of", "human-long": "out of" }[this.ctlr.settings.time.format];
    this.bridge.textContent = bridgeText || "/";
    this.updateTime(), this.updateDuration();
  }
  updateTime() {
    this.time.textContent = this.plug?.toTimeText(this.media.state.currentTime, true) || "-:--";
  }
  updateDuration() {
    this.duration.textContent = this.plug?.toTimeText(this.media.status.duration) || "--:--";
  }
  updateARIA() {
    this.state.label = `Show ${this.plug?.nextMode} time`;
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.time.mode);
    this.el.title = `Switch (mode${this.state.cmd} / DblClick\u2192format${formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.timeFormat)})`;
    this.setBtnARIA("Switch time format");
  }
};
TimeAndDuration.componentName = "timeandduration";
TimeAndDuration.isControl = true;

// src/ts/components/timeline.ts
var Timeline = class extends RangeSlider {
  constructor(ctlr, options = {}) {
    super(ctlr, { label: "Video timeline", ...options });
    this.previewContext = null;
    this.thumbnailContext = null;
    this.wasPaused = false;
    this.scrubbingId = -1;
  }
  create() {
    const element = super.create();
    this.timeline = createEl("div", { className: "tmg-video-timeline" });
    this.bufferedBar = createEl("div", { className: "tmg-video-bar tmg-video-buffered-bar" });
    this.previewBar = createEl("div", { className: "tmg-video-bar tmg-video-preview-bar" });
    this.previewContainer = createEl("div", { className: "tmg-video-preview-container" });
    this.previewImg = createEl("div", { className: "tmg-video-preview" });
    this.previewCanvas = createEl("canvas", { className: "tmg-video-preview" });
    this.thumbnailImg = createEl("div", { className: "tmg-video-thumbnail" });
    this.thumbnailCanvas = createEl("canvas", { className: "tmg-video-thumbnail" });
    this.container.dataset.controlId = this.name;
    this.previewContainer.append(this.previewImg, this.previewCanvas);
    this.barsWrapper.append(this.bufferedBar, this.previewBar);
    this.barsWrapper.replaceWith(this.timeline);
    this.timeline.append(this.barsWrapper, this.previewContainer);
    return element;
  }
  mount() {
    this.previewContext = this.previewCanvas.getContext("2d");
    this.thumbnailContext = this.thumbnailCanvas.getContext("2d");
    this.ctlr.DOM.controlsContainer?.prepend(this.thumbnailImg, this.thumbnailCanvas);
  }
  wire() {
    super.wire();
    this.plug = this.ctlr.getPlug("time");
    this.state.on("scrubbing", this.handleScrubbingChange, { signal: this.signal });
    this.config.on("previewValue", this.updatePreviewTime, { signal: this.signal });
    this.config.on("previews", this.handlePreviewChange, { signal: this.signal });
    this.ctlr.config.watch("settings.time.previews", (value) => this.config.previews = value, { signal: this.signal, immediate: true });
    this.ctlr.config.watch("settings.time.seekSync", (value) => this.config.scrub.sync = value, { signal: this.signal, immediate: true });
    this.media.on("state.paused", this.handlePausedState, { signal: this.signal, immediate: true });
    this.media.on("state.currentTime", this.handleCurrentTimeState, { signal: this.signal, immediate: true });
    this.media.on("status.loadedMetadata", this.handleLoadedMetadataStatus, { signal: this.signal, immediate: true });
    this.media.on("status.buffered", this.handleBufferedStatus, { signal: this.signal, immediate: true });
    this.media.on("status.duration", this.handleDurationStatus, { signal: this.signal, immediate: true });
    this.media.on("status.error", this.handleErrorStatus, { signal: this.signal, immediate: true });
    this.ctlr.state.on("dimensions.container", this.syncThumbnailSize, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.format", this.updatePreviewTime, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.mode", this.updatePreviewTime, { signal: this.signal });
    this.ctlr.config.on("settings.css.currentThumbnailWidth", ({ value }) => this.thumbnailCanvas.width = Number(value), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.css.currentThumbnailHeight", ({ value }) => this.thumbnailCanvas.height = Number(value), { signal: this.signal, immediate: true });
  }
  seek(value) {
    super.seek(value);
    this.media.intent.currentTime = safeNum(value / 100 * this.media.status.duration);
  }
  handlePausedState({ value }) {
    !value ? this.ctlr.RAFLoop("timelineUpdating", this.handleTimeUpdateLoop) : this.ctlr.cancelRAFLoop("timelineUpdating");
  }
  handleCurrentTimeState({ target }) {
    if (this.state.scrubbing) return;
    if (this.media.state.paused) this.handleTimeUpdateLoop(false);
    this.container.ariaValueText = `${formatMediaTime({ time: target.value, format: "human-long" })} out of ${formatMediaTime({ time: this.media.status.duration, format: "human-long" })}`;
  }
  handleLoadedMetadataStatus() {
    this.ctlr.pseudoVideo.addEventListener("timeupdate", (e) => e.target.ontimeupdate = this.syncCanvasPreviews, { signal: this.signal, once: true });
  }
  handleBufferedStatus() {
    const buffered = this.media.status.buffered;
    for (let i = 0; i < buffered.length; i++) {
      if (buffered.start(buffered.length - 1 - i) < this.media.state.currentTime) {
        this.bufferedBar.style.width = `${safeNum(buffered.end(buffered.length - 1 - i) / this.media.status.duration) * 100}%`;
        break;
      }
    }
  }
  handleDurationStatus({ value }) {
    this.container.ariaValueMax = String(Math.floor(value));
  }
  handleErrorStatus({ value }) {
    if (value) this.bufferedBar.style.width = "0";
  }
  handleTimeUpdateLoop(optimize = true) {
    if (optimize && !this.ctlr.state.mediaIntersecting) return;
    const duration = safeNum(this.media.status.duration, 60);
    if (!this.state.scrubbing) this.config.value = safeNum(this.media.state.currentTime / duration) * 100;
  }
  handleScrubbingChange({ value }) {
    if (!value) {
      this.media.intent.paused = this.wasPaused;
      cancelAnimationFrame(this.scrubbingId);
      this.ctlr.videoContainer.classList.remove("tmg-video-scrubbing");
    } else {
      this.wasPaused = this.media.state.paused;
      this.scrubbingId = requestAnimationFrame(() => {
        this.media.intent.paused = true;
        this.ctlr.videoContainer.classList.add("tmg-video-scrubbing");
      });
    }
    this.ctlr.videoContainer.classList.toggle("tmg-video-scrubbing", value);
    if (!value) this.stopPreview();
  }
  handlePreviewChange({ target }) {
    const value = target.value === true ? {} : target.value;
    if (!value) return void (this.ctlr.videoContainer.dataset.previewType = "none");
    const manual = value.address && (value.spf || value.cols && value.rows), type = manual ? value.cols && value.rows ? "sprite" : "image" : "canvas";
    this.ctlr.videoContainer.dataset.previewType = type;
    if (type === "sprite" && value.address) this.ctlr.settings.css.currentPreviewUrl = this.ctlr.settings.css.currentThumbnailUrl = `url(${value.address})`;
    else this.ctlr.settings.css.currentPreviewPosition = this.ctlr.settings.css.currentThumbnailPosition = "center";
    if (this.media.status.loadedMetadata) return;
    this.ctlr.setCanvasFallback(this.previewCanvas, this.previewContext), this.ctlr.setCanvasFallback(this.thumbnailCanvas, this.thumbnailContext);
    this.ctlr.pseudoVideo.ontimeupdate = null;
  }
  stopScrubbing() {
    if (!this.state.scrubbing) return;
    if (!this.state.shouldCancelScrub) this.media.intent.currentTime = this.config.value;
    super.stopScrubbing();
  }
  stopPreview() {
    setTimeout2(() => this.ctlr.videoContainer.classList.remove("tmg-video-previewing"), 0, this.signal);
  }
  onInput(e, pos) {
    this.ctlr.videoContainer.classList.add("tmg-video-previewing");
    const previewImgMin = this.previewContainer.offsetWidth / 2 / this.rect.width, previewImgPos = clamp(previewImgMin, pos, 1 - previewImgMin);
    this.previewContainer.style.left = `${previewImgPos * 100}%`;
    this.previewBar.style.width = `${pos * 100}%`;
    const previewConfig = this.config.previews, type = this.ctlr.videoContainer.dataset.previewType;
    if (type === "sprite" && previewConfig && typeof previewConfig !== "boolean" && previewConfig.cols && previewConfig.rows) {
      const duration = this.media.status.duration, spf = previewConfig.spf || 1, frameIndex = Math.floor(pos * (duration || 0) / spf) || 1, { cols, rows } = previewConfig, clampedI = Math.min(frameIndex, cols * rows - 1), xPercent = clampedI % cols * 100 / (cols - 1 || 1), yPercent = Math.floor(clampedI / cols) * 100 / (rows - 1 || 1);
      if (!IS_MOBILE) this.ctlr.settings.css.currentPreviewPosition = `${xPercent}% ${yPercent}%`;
      if (this.state.scrubbing) this.ctlr.settings.css.currentThumbnailPosition = `${xPercent}% ${yPercent}%`;
    } else if (type === "image" && previewConfig && typeof previewConfig !== "boolean" && previewConfig.address) {
      const duration = this.media.status.duration, spf = previewConfig.spf || 1, frameIndex = Math.floor(pos * (duration || 0) / spf) || 1, url = `url(${previewConfig.address.replace("$", String(frameIndex))})`;
      if (!IS_MOBILE) this.ctlr.settings.css.currentPreviewUrl = url;
      if (this.state.scrubbing) this.ctlr.settings.css.currentThumbnailUrl = url;
    } else if (previewConfig && !this.ctlr.state.frameReadyPromise && this.ctlr.pseudoVideo) {
      const duration = this.media.status.duration;
      this.ctlr.pseudoVideo.currentTime = pos * (duration || 0);
    }
  }
  updatePreviewTime() {
    if (this.plug) this.previewContainer.dataset.previewTime = this.plug.toTimeText(this.config.previewValue, true);
  }
  syncCanvasPreviews() {
    if (!this.media.status.loadedData || this.ctlr.state.frameReadyPromise || !this.ctlr.pseudoVideo) return;
    this.ctlr.throttle(
      "canvasPreviewSync",
      () => {
        const pseudoVideo = this.ctlr.pseudoVideo;
        if (!pseudoVideo || !this.previewContext || !this.thumbnailContext) return;
        this.previewCanvas.width = this.previewCanvas.offsetWidth || this.previewCanvas.width;
        this.previewCanvas.height = this.previewCanvas.offsetHeight || this.previewCanvas.height;
        this.previewContext.drawImage(pseudoVideo, 0, 0, this.previewCanvas.width, this.previewCanvas.height);
        if (this.state.scrubbing) this.thumbnailContext.drawImage(pseudoVideo, 0, 0, this.thumbnailCanvas.width, this.thumbnailCanvas.height);
      },
      33
    );
  }
  syncThumbnailSize() {
    if (!this.thumbnailCanvas || !this.thumbnailImg) return;
    const { width = this.ctlr.videoContainer.offsetWidth, height = this.ctlr.videoContainer.offsetHeight } = getRenderedBox(this.media.element);
    this.ctlr.settings.css.currentThumbnailHeight = height + 1 + "px";
    this.ctlr.settings.css.currentThumbnailWidth = width + 1 + "px";
  }
};
Timeline.componentName = "timeline";
Timeline.isControl = true;

// src/ts/consts/index.ts
var consts_exports = {};
__export(consts_exports, {
  DEFAULT_MEDIA_INTENT: () => DEFAULT_MEDIA_INTENT,
  DEFAULT_MEDIA_SETTINGS: () => DEFAULT_MEDIA_SETTINGS,
  DEFAULT_MEDIA_STATE: () => DEFAULT_MEDIA_STATE,
  DEFAULT_MEDIA_STATUS: () => DEFAULT_MEDIA_STATUS,
  DEFAULT_VIDEO_BUILD: () => DEFAULT_VIDEO_BUILD,
  DEFAULT_VIDEO_ITEM_BUILD: () => DEFAULT_VIDEO_ITEM_BUILD,
  FN_KEY: () => FN_KEY,
  LUID_KEY: () => LUID_KEY,
  aptAutoplayOptions: () => aptAutoplayOptions,
  bigControls: () => bigControls,
  controls: () => controls,
  errorCodes: () => errorCodes,
  keyShortcutActions: () => keyShortcutActions,
  moddedKeyShortcutActions: () => moddedKeyShortcutActions,
  modes: () => modes,
  orientationOptions: () => orientationOptions,
  whiteListedKeys: () => whiteListedKeys
});

// src/index.ts
if (typeof window !== "undefined") {
  window.tmg ?? (window.tmg = {});
  window.TMG_VIDEO_ALT_IMG_SRC ?? (window.TMG_VIDEO_ALT_IMG_SRC = "/TMG_MEDIA_PROTOTYPE/assets/icons/movie-tape.png");
  window.TMG_VIDEO_CSS_SRC ?? (window.TMG_VIDEO_CSS_SRC = "/TMG_MEDIA_PROTOTYPE/prototype-3/prototype-3-video.css");
  window.T007_TOAST_CSS_SRC ?? (window.T007_TOAST_CSS_SRC = "/T007_TOOLS/T007_toast_library/T007_toast.css");
  window.T007_TOAST_JS_SRC ?? (window.T007_TOAST_JS_SRC = "/T007_TOOLS/T007_toast_library/T007_toast.js");
  window.T007_INPUT_CSS_SRC ?? (window.T007_INPUT_CSS_SRC = "/T007_TOOLS/T007_input_library/T007_input.css");
  window.T007_INPUT_JS_SRC ?? (window.T007_INPUT_JS_SRC = "/T007_TOOLS/T007_input_library/T007_input.js");
  console.log("%cTMG Media Player Available", "color: darkturquoise");
  loadResource2(window.TMG_VIDEO_CSS_SRC), loadResource2(window.T007_TOAST_JS_SRC, "script", { module: true }), loadResource2(window.T007_INPUT_JS_SRC, "script");
  init();
} else {
  console.log("\x1B[38;2;139;69;19mTMG Media Player Unavailable\x1B[0m");
  console.error("TMG Media Player cannot run in a terminal!"), console.warn("Consider moving to a browser environment to use the TMG Media Player");
}
export {
  AUDIO_CONTEXT,
  AUDIO_LIMITER,
  AsyncQueue,
  BaseRegistry,
  ComponentRegistry,
  Controllable,
  Controller,
  Controllers,
  INDIFFABLE,
  INERTIA,
  IS_DOC_TRANSIENT,
  IconRegistry,
  LocalStorageAdapter,
  OrderedRegistry,
  Player,
  PlugRegistry,
  RAW,
  REJECTABLE,
  Reactor,
  ReactorEvent,
  SSVERSION,
  StorageAdapter,
  TERMINATOR,
  TechRegistry,
  VERSION,
  components_exports as comps,
  connectMediaToAudioManager,
  consts_exports as consts,
  handleDOMMutation,
  handleVidMutation,
  init,
  media_exports as media,
  mixins_exports as mixins,
  mountMedia,
  plugs_exports as plugs,
  startAudioManager,
  unmountMedia,
  utils_exports as utils
};
//# sourceMappingURL=tmg-player.mjs.map
