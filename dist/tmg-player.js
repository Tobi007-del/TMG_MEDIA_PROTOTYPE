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
    chores: () => chores_exports,
    dom: () => dom_exports,
    num: () => num_exports,
    obj: () => obj_exports,
    reactor: () => reactor_exports,
    str: () => str_exports
  });

  // prototype-3/src/ts/core/reactor.ts
  var reactor_exports = {};
  __export(reactor_exports, {
    Event: () => Event,
    TERMINATOR: () => TERMINATOR,
    default: () => Reactor
  });

  // prototype-3/src/ts/utils/dom.ts
  var dom_exports = {};
  __export(dom_exports, {
    inDocView: () => inDocView
  });
  function inDocView(el, axis = "y") {
    const rect = el.getBoundingClientRect(), inX = rect.left + window.scrollX >= 0 && rect.right + window.scrollX <= window.scrollX + (window.innerWidth || document.documentElement.clientWidth), inY = rect.top + window.scrollY >= 0 && rect.bottom + window.scrollY <= window.scrollY + (window.innerHeight || document.documentElement.clientHeight);
    return axis === "x" ? inY : axis === "y" ? inX : inY && inX;
  }

  // prototype-3/src/ts/utils/obj.ts
  var obj_exports = {};
  __export(obj_exports, {
    assignAny: () => assignAny,
    assignDef: () => assignDef,
    assignHTMLConfig: () => assignHTMLConfig,
    deriveAny: () => deriveAny,
    getTrailPaths: () => getTrailPaths,
    getTrailRecord: () => getTrailRecord,
    isArr: () => isArr,
    isIter: () => isIter,
    isObj: () => isObj,
    parseUIObj: () => parseUIObj
  });
  function isIter(obj) {
    return obj != null && "function" === typeof obj[Symbol.iterator];
  }
  function isObj(obj) {
    return "object" === typeof obj && obj !== null && !isArr(obj) && "function" !== typeof obj;
  }
  function isArr(obj) {
    return Array.isArray(obj);
  }
  function assignDef(target, key, value) {
    isDef(value) && target != null && assignAny(target, key, value);
  }
  function assignHTMLConfig(target, attr, value) {
    assignAny(
      target,
      attr.replace("tmg--", ""),
      (() => {
        if (value.includes(",")) return value.split(",")?.map((v) => v.replace(/\s+/g, ""));
        if (/^(true|false|null|\d+)$/.test(value)) return JSON.parse(value);
        return value;
      })(),
      "--",
      (p) => camelize(p)
    );
  }
  function assignAny(target, key, value, separator = ".", keyFunc = (p) => p) {
    const keys = key.split(separator).map((p) => keyFunc(p));
    let currObj = target;
    keys.forEach((key2, i) => {
      var _a, _b;
      const match = key2.match(/^([^\[\]]+)\[(\d+)\]$/);
      if (match) {
        const [, key3, iStr] = match;
        if (!isArr(currObj[key3])) currObj[key3] = [];
        if (i === keys.length - 1) currObj[key3][Number(iStr)] = value;
        else (_a = currObj[key3])[_b = Number(iStr)] || (_a[_b] = {}), currObj = currObj[key3][Number(iStr)];
      } else {
        if (i === keys.length - 1) currObj[key2] = value;
        else currObj[key2] || (currObj[key2] = {}), currObj = currObj[key2];
      }
    });
  }
  function deriveAny(source, key, separator = ".", keyFunc = (p) => p) {
    const keys = key.split(separator).map((p) => keyFunc(p));
    let currObj = source;
    for (const key2 of keys) {
      const match = key2.match(/^([^\[\]]+)\[(\d+)\]$/);
      if (match) {
        const [, key3, iStr] = match;
        if (!isArr(currObj[key3])) return void 0;
        currObj = currObj[key3][Number(iStr)];
      } else {
        if (!isObj(currObj) || !(key2 in currObj)) return void 0;
        currObj = currObj[key2];
      }
    }
    return currObj;
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
  function getTrailRecord(obj, path) {
    const parts = path.split("."), record = [["*", obj, obj]];
    let acc = "", currObj = obj;
    for (let i = 0; i < parts.length; i++) {
      acc += (i === 0 ? "" : ".") + parts[i];
      record.push([acc, currObj, currObj = Reflect.get(currObj, parts[i])]);
    }
    return record;
  }
  function isUISetting(obj) {
    return isObj(obj) && "options" in obj && isArr(obj.options);
  }
  function parseUIObj(obj) {
    const result = {};
    for (const key of Object.keys(obj)) {
      const entry = obj[key];
      if (!isObj(entry)) continue;
      if (isUISetting(entry)) {
        result[key] = {
          values: entry.options.map((opt) => "value" in opt ? opt.value : opt),
          displays: entry.options.map((opt) => "display" in opt ? opt.display : `${opt}`)
        };
      } else result[key] = parseUIObj(entry);
    }
    return result;
  }

  // prototype-3/src/ts/utils/chores.ts
  var chores_exports = {};
  __export(chores_exports, {
    isDef: () => isDef,
    remToPx: () => remToPx,
    uid: () => uid
  });
  function uid(prefix = "tmg-") {
    return `${prefix}${Date.now().toString(36)}_${performance.now().toString(36).replace(".", "")}_${Math.random().toString(36).slice(2)}`;
  }
  function remToPx(val) {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) * val;
  }
  function isDef(val) {
    return val !== void 0;
  }

  // prototype-3/src/ts/utils/num.ts
  var num_exports = {};
  __export(num_exports, {
    clamp: () => clamp,
    isValidNumber: () => isValidNumber,
    parseCSSTime: () => parseCSSTime,
    parseCSSUnit: () => parseCSSUnit,
    parseIfPercent: () => parseIfPercent,
    parseNumber: () => parseNumber
  });
  function clamp(min = 0, val, max = Infinity) {
    return Math.min(Math.max(val, min), max);
  }
  function isValidNumber(val) {
    return !isNaN(val ?? NaN) && val !== Infinity;
  }
  function parseNumber(number, fallback = 0) {
    return isValidNumber(number) ? number : fallback;
  }
  function parseIfPercent(percent, amount = 100) {
    return percent?.endsWith?.("%") ? parseNumber(percent.slice(0, -1) / 100 * amount) : percent;
  }
  function parseCSSTime(time) {
    return time.endsWith("ms") ? parseFloat(time) : parseFloat(time) * 1e3;
  }
  function parseCSSUnit(val) {
    return val.endsWith("px") ? parseFloat(val) : remToPx(parseFloat(val));
  }

  // prototype-3/src/ts/utils/str.ts
  var str_exports = {};
  __export(str_exports, {
    camelize: () => camelize,
    capitalize: () => capitalize,
    uncamelize: () => uncamelize
  });
  function capitalize(word = "") {
    return word.replace(/^(\s*)([a-z])/i, (_, s, l) => s + l.toUpperCase());
  }
  function camelize(str = "", { source } = /[\s_-]+/, { preserveInnerCase: pIC = true, upperFirst: uF = false } = {}) {
    return (pIC ? str : str.toLowerCase()).replace(new RegExp(`${source}(\\w)`, "g"), (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c[uF ? "toUpperCase" : "toLowerCase"]());
  }
  function uncamelize(str = "", separator = " ") {
    return str.replace(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase();
  }

  // prototype-3/src/ts/core/reactor.ts
  var TERMINATOR = /* @__PURE__ */ Symbol("TERMINATOR");
  var _Event = class _Event {
    constructor(payload) {
      this.eventPhase = _Event.NONE;
      this._propagationStopped = false;
      this._immediatePropagationStopped = false;
      this._rejected = "";
      this.type = payload.type;
      this.target = payload.target;
      this.currentTarget = payload.currentTarget;
      this.value = payload.target.value;
      this.oldValue = payload.target.oldValue;
      this.path = payload.target.path;
      this.bubbles = payload.bubbles ?? true;
      this.rejectable = payload.rejectable ?? true;
      this.timestamp = Date.now();
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
    get rejected() {
      return this._rejected;
    }
    reject(reason) {
      if (!this.rejectable) return console.warn(`Ignored reject() call on a non-rejectable "${this.type}" at "${this.path}"`);
      if (this.eventPhase !== _Event.CAPTURING_PHASE) console.warn(`Rejecting an intent on "${this.type}" at "${this.path}" outside of the capture phase is unadvised.`);
      if (this.rejectable) console.log(this._rejected = reason || `Couldn't ${this.type} intended value at "${this.path}"`);
    }
    composedPath() {
      return getTrailPaths(this.path);
    }
  };
  _Event.NONE = 0;
  _Event.CAPTURING_PHASE = 1;
  _Event.AT_TARGET = 2;
  _Event.BUBBLING_PHASE = 3;
  var Event = _Event;
  var Reactor = class {
    constructor(obj, options = {}) {
      this.getters = /* @__PURE__ */ new Map();
      this.setters = /* @__PURE__ */ new Map();
      this.listenersRecord = /* @__PURE__ */ new Map();
      this.batch = /* @__PURE__ */ new Map();
      this.isBatching = false;
      this.proxyCache = /* @__PURE__ */ new WeakMap();
      this.cascade = ({ type, currentTarget: { path, value: sets } }) => {
        if (!sets || type !== "set" && type !== "delete") return;
        for (const [k, v] of Object.entries(sets)) assignAny(this.root, `${path}.${k}`, v);
      };
      this.tick = this._flush;
      this.root = this._proxify(obj);
      this.rejectable = options.rejectable ?? false;
    }
    _proxify(target, path = "") {
      if (target instanceof Element || target instanceof Window || target instanceof EventTarget) return target;
      if (this.proxyCache.has(target)) return this.proxyCache.get(target);
      const proxy = new Proxy(target, {
        get: (object, key, receiver) => {
          const safeKey = String(key), fullPath = path ? `${path}.${safeKey}` : safeKey, target2 = { path: fullPath, value: Reflect.get(object, key, receiver), key: safeKey, object }, payload = { type: "get", target: target2, currentTarget: target2, root: this.root };
          if (this.getters.has(fullPath)) return this._mediate(fullPath, payload, false);
          if (typeof key === "symbol" || !(isObj(target2.value) || isArr(target2.value))) return target2.value;
          return this._proxify(target2.value, fullPath);
        },
        set: (object, key, value, receiver) => {
          const safeKey = String(key), fullPath = path ? `${path}.${safeKey}` : safeKey, target2 = { path: fullPath, value, oldValue: Reflect.get(object, key, receiver), key: safeKey, object }, payload = { type: "set", target: target2, currentTarget: target2, root: this.root };
          if (this.setters.has(fullPath)) target2.value = this._mediate(fullPath, payload, true);
          if (target2.value === TERMINATOR) return false;
          if (!Reflect.set(object, key, target2.value, receiver)) return false;
          return this._schedule(fullPath, payload), true;
        },
        deleteProperty: (object, key) => {
          const safeKey = String(key), fullPath = path ? `${path}.${safeKey}` : safeKey, target2 = { path: fullPath, oldValue: Reflect.get(object, key), key: safeKey, object }, payload = { type: "delete", target: target2, currentTarget: target2, root: this.root };
          if (this.setters.has(fullPath)) target2.value = this._mediate(fullPath, payload, true);
          if (target2.value === TERMINATOR) return false;
          if (!Reflect.deleteProperty(object, key)) return false;
          return this._schedule(fullPath, payload), true;
        }
      });
      this.proxyCache.set(target, proxy);
      return proxy;
    }
    _mediate(path, payload, set) {
      let terminated = false, value = payload.target.value;
      const fns = (set ? this.setters : this.getters)?.get(path);
      if (!fns?.size) return value;
      const arr = Array.from(fns);
      for (let i = set ? 0 : arr.length - 1; i !== (set ? arr.length : -1); i += set ? 1 : -1) {
        terminated || (terminated = value === TERMINATOR);
        value = terminated ? TERMINATOR : arr[i](value, terminated, payload);
      }
      return value;
    }
    _wave(path, payload) {
      const e = new Event({ ...payload, rejectable: this.rejectable }), chain = getTrailRecord(this.root, path);
      e.eventPhase = Event.CAPTURING_PHASE;
      for (let i = 0; i <= chain.length - 2; i++) {
        if (e.propagationStopped) break;
        this._fire(chain[i], e, true);
      }
      if (e.propagationStopped) return;
      e.eventPhase = Event.AT_TARGET;
      this._fire(chain[chain.length - 1], e, true);
      !e.immediatePropagationStopped && this._fire(chain[chain.length - 1], e, false);
      if (!e.bubbles) return;
      e.eventPhase = Event.BUBBLING_PHASE;
      for (let i = chain.length - 2; i >= 0; i--) {
        if (e.propagationStopped) break;
        this._fire(chain[i], e, false);
      }
      if (e.rejected) return;
    }
    _fire([path, object, value], e, isCapture) {
      const records = this.listenersRecord.get(path);
      if (!records?.size) return;
      const originalType = e.type;
      e.type = path !== e.target.path ? "update" : e.type;
      e.currentTarget = { path, value, key: path.split(".").pop() || "", object };
      for (const record of [...records]) {
        if (e.immediatePropagationStopped) break;
        if (record.capture !== isCapture) continue;
        if (record.once) records.delete(record);
        record.cb(e);
      }
      e.type = originalType;
    }
    _schedule(path, payload) {
      this.batch.set(path, payload);
      if (this.isBatching) return;
      this.isBatching = true;
      queueMicrotask(() => this._flush());
    }
    _flush() {
      for (const [path, payload] of this.batch.entries()) this._wave(path, payload);
      this.batch.clear(), this.isBatching = false;
    }
    get(path, cb) {
      (this.getters.get(path) ?? this.getters.set(path, /* @__PURE__ */ new Set()).get(path)).add(cb);
    }
    noget(path, cb) {
      this.getters.get(path)?.delete(cb);
    }
    set(path, cb) {
      (this.setters.get(path) ?? this.setters.set(path, /* @__PURE__ */ new Set()).get(path)).add(cb);
    }
    noset(path, cb) {
      this.setters.get(path)?.delete(cb);
    }
    on(path, cb, options) {
      const records = this.listenersRecord.get(path), capture = _getOpt(options, "capture");
      let hasRecord = false;
      for (const record of records ?? []) {
        if (record.cb === cb && capture === record.capture) {
          hasRecord = true;
          break;
        }
      }
      if (!hasRecord) (records ?? this.listenersRecord.set(path, /* @__PURE__ */ new Set()).get(path)).add({ cb, capture, once: _getOpt(options, "once") });
      return () => this.off(path, cb, options);
    }
    off(path, cb, options) {
      const records = this.listenersRecord.get(path), capture = _getOpt(options, "capture");
      if (!records) return;
      let recordToDelete = null;
      for (const record of records) {
        if (record.cb === cb && record.capture === capture) {
          recordToDelete = record;
          break;
        }
      }
      if (recordToDelete) records.delete(recordToDelete);
      if (!records.size) this.listenersRecord.delete(path);
    }
    reset() {
      this.getters.clear(), this.setters.clear(), this.listenersRecord.clear();
      this.batch.clear(), this.isBatching = false;
      this.proxyCache = /* @__PURE__ */ new WeakMap();
      this.root = null;
    }
  };
  var _getOpt = (options = false, opt) => "boolean" === typeof options ? options : !!options?.[opt];

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
