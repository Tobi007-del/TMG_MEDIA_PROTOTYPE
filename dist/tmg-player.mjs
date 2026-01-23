var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
  isUISetting: () => isUISetting,
  mergeObjs: () => mergeObjs,
  parseAnyObj: () => parseAnyObj,
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
function isUISetting(obj) {
  return isObj(obj) && "options" in obj && isArr(obj.options);
}
function assignDef(target, key, value) {
  isDef(value) && target != null && assignAny(target, key, value);
}
function assignHTMLConfig(target, attr, value) {
  const path = attr.replace("tmg--", "");
  const parsedValue = (() => {
    if (value.includes(",")) return value.split(",")?.map((v) => v.replace(/\s+/g, ""));
    if (/^(true|false|null|\d+)$/.test(value)) return JSON.parse(value);
    return value;
  })();
  assignAny(target, path, parsedValue, "--", (p) => camelize(p));
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
function parseAnyObj(obj, separator = ".", keyFunc = (p) => p, visited = /* @__PURE__ */ new WeakSet()) {
  if (!isObj(obj) || visited.has(obj)) return obj;
  visited.add(obj);
  const result = {};
  Object.entries(obj).forEach(([k, v]) => k.includes(separator) ? assignAny(result, k, parseAnyObj(v, separator, keyFunc, visited), separator, keyFunc) : result[k] = isObj(v) ? parseAnyObj(v, separator, keyFunc, visited) : v);
  return result;
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
function getTrailRecord(obj, path) {
  const parts = path.split("."), record = [["*", obj, obj]];
  let acc = "", currObj = obj;
  for (let i = 0; i < parts.length; i++) {
    acc += (i === 0 ? "" : ".") + parts[i];
    record.push([acc, currObj, currObj = Reflect.get(currObj, parts[i])]);
  }
  return record;
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
  safeNum: () => safeNum
});
function clamp(min = 0, val, max = Infinity) {
  return Math.min(Math.max(val, min), max);
}
function isValidNumber(val) {
  return !isNaN(val ?? NaN) && val !== Infinity;
}
function safeNum(number, fallback = 0) {
  return isValidNumber(number) ? number : fallback;
}
function parseIfPercent(percent, amount = 100) {
  return percent?.endsWith?.("%") ? safeNum(percent.slice(0, -1) / 100 * amount) : percent;
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
var _Reactor = class _Reactor {
  constructor(obj = {}, options = {}) {
    this.getters = /* @__PURE__ */ new Map();
    this.setters = /* @__PURE__ */ new Map();
    this.watchers = /* @__PURE__ */ new Map();
    this.listenersRecord = /* @__PURE__ */ new Map();
    this.batch = /* @__PURE__ */ new Map();
    this.isBatching = false;
    this.queue = /* @__PURE__ */ new Set();
    // tasks to run after _flush
    this.proxyCache = /* @__PURE__ */ new WeakMap();
    this._schedule = (path, payload) => (this.batch.set(path, payload), this._initBatching());
    this.stall = (task) => (this.queue.add(task), this._initBatching());
    this.nostall = (task) => this.queue.delete(task);
    this.noget = (path, cb) => this.getters.get(path)?.delete(cb);
    this.noset = (path, cb) => this.setters.get(path)?.delete(cb);
    this.nowatch = (path, cb) => this.watchers.get(path)?.delete(cb);
    this.once = (path, cb, options) => this.on(path, cb, { ...options, once: true });
    this.cascade = ({ type, currentTarget: { path, value: news, oldValue: olds } }, objSafe = true) => {
      if (!isObj(news) || !isObj(olds) || type !== "set" && type !== "delete") return;
      for (const [key, value] of Object.entries(objSafe ? mergeObjs(olds, news) : news)) assignAny(this.core, `${path}.${key}`, value);
    };
    this.rejectable = options.rejectable ?? false;
    this.core = this._proxify(obj);
  }
  _proxify(obj, path = "") {
    if (!(isObj(obj) || isArr(obj)) || "symbol" === typeof obj || "function" === typeof obj || obj instanceof Map || obj instanceof Set || obj instanceof WeakMap || obj instanceof Promise || obj instanceof Element || obj instanceof EventTarget) return obj;
    if (this.proxyCache.has(obj)) return this.proxyCache.get(obj);
    const proxy = new Proxy(obj, {
      get: (object, key, receiver) => {
        const safeKey = String(key), fullPath = path ? `${path}.${safeKey}` : safeKey, target = { path: fullPath, value: Reflect.get(object, key, receiver), key: safeKey, object }, payload = { type: "get", target, currentTarget: target, root: this.core };
        if (this.getters.has(fullPath)) return this._mediate(fullPath, payload, false);
        return this._proxify(target.value, fullPath);
      },
      set: (object, key, value, receiver) => {
        const safeKey = String(key), fullPath = path ? `${path}.${safeKey}` : safeKey, target = { path: fullPath, value, oldValue: Reflect.get(object, key, receiver), key: safeKey, object }, payload = { type: "set", target, currentTarget: target, root: this.core };
        if (this.setters.has(fullPath)) target.value = this._mediate(fullPath, payload, true);
        return target.value !== TERMINATOR && Reflect.set(object, key, target.value, receiver) && this._notify(fullPath, payload), true;
      },
      deleteProperty: (object, key) => {
        const safeKey = String(key), fullPath = path ? `${path}.${safeKey}` : safeKey, target = { path: fullPath, oldValue: Reflect.get(object, key), key: safeKey, object }, payload = { type: "delete", target, currentTarget: target, root: this.core };
        if (this.setters.has(fullPath)) target.value = this._mediate(fullPath, payload, true);
        return target.value !== TERMINATOR && Reflect.deleteProperty(object, key) && this._notify(fullPath, payload), true;
      }
    });
    this.proxyCache.set(obj, proxy);
    return proxy;
  }
  _mediate(path, payload, set) {
    let terminated = false, value = payload.target.value;
    const fns = (set ? this.setters : this.getters)?.get(path);
    if (!fns?.size) return value;
    const arr = Array.from(fns);
    for (let i = set ? 0 : arr.length - 1; i !== (set ? arr.length : -1); i += set ? 1 : -1) {
      terminated || (terminated = value === TERMINATOR);
      const response = arr[i](value, terminated, payload);
      if (!terminated) value = response;
    }
    return value;
  }
  _notify(path, payload) {
    if (this.watchers.has(path)) for (const fn of this.watchers.get(path)) fn(payload.target.value, payload);
    this._schedule(path, payload);
  }
  _initBatching() {
    if (!this.isBatching) return;
    this.isBatching = true;
    queueMicrotask(() => this._flush());
  }
  _flush() {
    this.tick(this.batch.keys()), this.batch.clear(), this.isBatching = false;
    for (const task of this.queue) task();
    this.queue.clear();
  }
  _wave(path, payload) {
    const e = new Event({ ...payload, rejectable: this.rejectable }), chain = getTrailRecord(this.core, path);
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
    e.currentTarget = { path, value, oldValue: e.type !== "update" ? e.target.oldValue : void 0, key: path.split(".").pop() || "", object };
    for (const record of [...records]) {
      if (e.immediatePropagationStopped) break;
      if (record.capture !== isCapture) continue;
      if (record.once) records.delete(record);
      record.cb(e);
    }
    e.type = originalType;
  }
  tick(paths) {
    if (!paths) return this._flush();
    for (const path of "string" === typeof paths ? [paths] : paths) this.batch.has(path) && (this._wave(path, this.batch.get(path)), this.batch.delete(path));
  }
  get(path, cb, lazy) {
    const task = () => (this.getters.get(path) ?? this.getters.set(path, /* @__PURE__ */ new Set()).get(path)).add(cb);
    lazy ? this.stall(task) : task();
    return () => (lazy && this.nostall(task), this.noget(path, cb));
  }
  // undefined - no search list, boolean - result
  set(path, cb, lazy) {
    const task = () => (this.setters.get(path) ?? this.setters.set(path, /* @__PURE__ */ new Set()).get(path)).add(cb);
    lazy ? this.stall(task) : task();
    return () => (lazy && this.nostall(task), this.noset(path, cb));
  }
  watch(path, cb, lazy) {
    const task = () => (this.watchers.get(path) ?? this.watchers.set(path, /* @__PURE__ */ new Set()).get(path)).add(cb);
    lazy ? this.stall(task) : task();
    return () => (lazy && this.nostall(task), this.nowatch(path, cb));
  }
  on(path, cb, options) {
    const records = this.listenersRecord.get(path), capture = _Reactor.parseEOpt(options, "capture");
    let added = false;
    for (const record of records ?? []) {
      if (record.cb === cb && capture === record.capture) {
        added = true;
        break;
      }
    }
    if (!added) (records ?? this.listenersRecord.set(path, /* @__PURE__ */ new Set()).get(path)).add({ cb, capture, once: _Reactor.parseEOpt(options, "once") });
    return () => this.off(path, cb, options);
  }
  off(path, cb, options) {
    const records = this.listenersRecord.get(path), capture = _Reactor.parseEOpt(options, "capture");
    if (!records) return void 0;
    for (const record of [...records]) {
      if (record.cb === cb && record.capture === capture) return records.delete(record), !records.size && this.listenersRecord.delete(path), true;
    }
    return false;
  }
  reset() {
    this.getters.clear(), this.setters.clear(), this.watchers.clear(), this.listenersRecord.clear();
    this.queue.clear(), this.batch.clear(), this.isBatching = false;
    this.proxyCache = /* @__PURE__ */ new WeakMap();
    this.core = null;
  }
};
_Reactor.parseEOpt = (options = false, opt) => "boolean" === typeof options ? options : !!options?.[opt];
var Reactor = _Reactor;

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
  chores_exports as chores,
  dom_exports as dom,
  num_exports as num,
  obj_exports as obj,
  reactor_exports as reactor,
  str_exports as str
};
//# sourceMappingURL=tmg-player.mjs.map
