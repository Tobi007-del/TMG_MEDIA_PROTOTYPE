# Utils Migration Map: JS (tmg.*) → TypeScript

This document maps all `tmg.*` utility functions from prototype-3.js to their TypeScript equivalents WITHOUT the tmg prefix.

## String Utils (utils/str.ts)
| JS Prototype                | TypeScript              | Notes                    |
| --------------------------- | ----------------------- | ------------------------ |
| `tmg.capitalize(str)`       | `capitalize(str)`       | Capitalizes first letter |
| `tmg.camelize(str)`         | `camelize(str)`         | Converts to camelCase    |
| `tmg.uncamelize(str, sep)`  | `uncamelize(str, sep)`  | Converts from camelCase  |
| `tmg.uid(prefix)`           | `uid(prefix)`           | Generates unique ID      |
| `tmg.isSameURL(src1, src2)` | `isSameURL(src1, src2)` | Compares URLs            |

## Object Utils (utils/obj.ts)
| JS Prototype                         | TypeScript                       | Notes                       |
| ------------------------------------ | -------------------------------- | --------------------------- |
| `tmg.isDef(val)`                     | `isDef(val)`                     | Checks if defined           |
| `tmg.isArr(obj)`                     | `isArr(obj)`                     | Type guard for arrays       |
| `tmg.isObj(obj)`                     | `isObj(obj)`                     | Type guard for objects      |
| `tmg.isIter(obj)`                    | `isIter(obj)`                    | Checks if iterable          |
| `tmg.isUISetting(obj)`               | `isUISetting(obj)`               | Type guard for UI settings  |
| `tmg.inBoolArrOpt(opt, str)`         | `inBoolArrOpt(opt, str)`         | Checks array/boolean option |
| `tmg.assignDef(target, key, val)`    | `assignDef(target, key, val)`    | Assigns if defined          |
| `tmg.assignHTMLConfig(t, attr, val)` | `assignHTMLConfig(t, attr, val)` | Assigns from HTML attr      |
| `tmg.setAny(target, key, val)`       | `setAny(target, key, val)`       | Sets nested property        |
| `tmg.getAny(source, key)`            | `getAny(source, key)`            | Gets nested property        |
| `tmg.deleteAny(target, key)`         | `deleteAny(target, key)`         | Deletes nested property     |
| `tmg.parseUIObj(obj)`                | `parseUIObj(obj)`                | Parses UI object            |
| `tmg.parseAnyObj(obj)`               | `parseAnyObj(obj)`               | Parses nested object        |
| `tmg.parsePanelBottomObj(obj)`       | `parsePanelBottomObj(obj)`       | Parses control panel bottom |

## Number Utils (utils/num.ts)
| JS Prototype                     | TypeScript                   | Notes                     |
| -------------------------------- | ---------------------------- | ------------------------- |
| `tmg.clamp(min, val, max)`       | `clamp(min, val, max)`       | Clamps value              |
| `tmg.safeNum(val, fallback)`     | `safeNum(val, fallback)`     | Safe number parse         |
| `tmg.parseCSSUnit(val)`          | `parseCSSUnit(val)`          | Parses CSS unit to number |
| `tmg.parseCSSTime(val)`          | `parseCSSTime(val)`          | Parses CSS time to ms     |
| `tmg.parseIfPercent(val, whole)` | `parseIfPercent(val, whole)` | Converts percent to value |

## Time Utils (utils/time.ts)
| JS Prototype                   | TypeScript                 | Notes                     |
| ------------------------------ | -------------------------- | ------------------------- |
| `tmg.formatMediaTime(opts)`    | `formatMediaTime(opts)`    | Formats time string       |
| `tmg.createTimeRanges(ranges)` | `createTimeRanges(ranges)` | Creates TimeRanges object |

## DOM Utils (utils/dom.ts)
| JS Prototype                              | TypeScript                            | Notes                        |
| ----------------------------------------- | ------------------------------------- | ---------------------------- |
| `tmg.createEl(tag, props, data, style)`   | `createEl(tag, props, data, style)`   | Creates element              |
| `tmg.assignEl(el, props, data, style)`    | `assignEl(el, props, data, style)`    | Assigns to element           |
| `tmg.loadResource(src, type, opts)`       | `loadResource(src, type, opts)`       | Loads external resource      |
| `tmg.inDocView(el, axis)`                 | `inDocView(el, axis)`                 | Checks viewport visibility   |
| `tmg.getElSiblingAt(p, dir, els, pos)`    | `getElSiblingAt(p, dir, els, pos)`    | Gets sibling at position     |
| `tmg.queryFullscreen()`                   | `queryFullscreen()`                   | Checks fullscreen state      |
| `tmg.queryFullscreenEl()`                 | `queryFullscreenEl()`                 | Gets fullscreen element      |
| `tmg.supportsFullscreen()`                | `supportsFullscreen()`                | Checks fullscreen support    |
| `tmg.supportsPictureInPicture()`          | `supportsPictureInPicture()`          | Checks PiP support           |
| `tmg.enterFullscreen(el)`                 | `enterFullscreen(el)`                 | Enters fullscreen            |
| `tmg.exitFullscreen(el)`                  | `exitFullscreen(el)`                  | Exits fullscreen             |
| `tmg.addSafeClicks(el, click, dbl, opts)` | `addSafeClicks(el, click, dbl, opts)` | Adds click/dblclick handlers |
| `tmg.removeSafeClicks(el)`                | `removeSafeClicks(el)`                | Removes safe click handlers  |
| `tmg.intersectionObserver`                | `intersectionObserver`                | Global intersection observer |
| `tmg.resizeObserver`                      | `resizeObserver`                      | Global resize observer       |
| `tmg.mutationObserver`                    | `mutationObserver`                    | Global mutation observer     |
| `tmg.observeResize(el, cb)`               | `observeResize(el, cb)`               | Observes element resize      |
| `tmg.observeIntersection(el, cb)`         | `observeIntersection(el, cb)`         | Observes intersection        |
| `tmg.observeMutation(el, cb, opts)`       | `observeMutation(el, cb, opts)`       | Observes mutations           |

## Function Utils (utils/fn.ts)
| JS Prototype                             | TypeScript                           | Notes                          |
| ---------------------------------------- | ------------------------------------ | ------------------------------ |
| `tmg.setTimeout(handler, timeout, sig)`  | `setTimeout(handler, timeout, sig)`  | setTimeout with AbortSignal    |
| `tmg.setInterval(handler, timeout, sig)` | `setInterval(handler, timeout, sig)` | setInterval with AbortSignal   |
| `tmg.requestAnimationFrame(cb, sig)`     | `requestAnimationFrame(cb, sig)`     | rAF with AbortSignal           |
| `tmg.mockAsync(timeout)`                 | `mockAsync(timeout)`                 | Creates delay promise          |
| `tmg.limited(fn, opts)`                  | `limited(fn, opts)`                  | Limits function calls          |
| `tmg.oncePerSession(fn)`                 | `oncePerSession(fn)`                 | Calls once per session         |
| `tmg.onceEver(fn, key)`                  | `onceEver(fn, key)`                  | Calls once ever (localStorage) |
| `tmg.deprecate(message)`                 | `deprecate(message)`                 | Logs deprecation warning       |
| `tmg.deprecateForMajor(v, old, new)`     | `deprecateForMajor(v, old, new)`     | Logs major version deprecation |

## Media Utils (utils/media.ts)
| JS Prototype                     | TypeScript                   | Notes                 |
| -------------------------------- | ---------------------------- | --------------------- |
| `tmg.getSources(video)`          | `getSources(video)`          | Gets video sources    |
| `tmg.addSources(sources, video)` | `addSources(sources, video)` | Adds sources to video |
| `tmg.removeSources(video)`       | `removeSources(video)`       | Removes all sources   |
| `tmg.getTracks(video)`           | `getTracks(video)`           | Gets text tracks      |
| `tmg.addTracks(tracks, video)`   | `addTracks(tracks, video)`   | Adds text tracks      |
| `tmg.removeTracks(video)`        | `removeTracks(video)`        | Removes all tracks    |
| `tmg.cloneVideo(video)`          | `cloneVideo(video)`          | Clones video element  |

## Color Utils (utils/color.ts)
| JS Prototype            | TypeScript          | Notes               |
| ----------------------- | ------------------- | ------------------- |
| `tmg.hexToRgb(hex)`     | `hexToRgb(hex)`     | Converts hex to RGB |
| `tmg.rgbToHex(r, g, b)` | `rgbToHex(r, g, b)` | Converts RGB to hex |
| `tmg.parseColor(color)` | `parseColor(color)` | Parses color string |

## Key Utils (utils/keys.ts)
| JS Prototype              | TypeScript            | Notes                     |
| ------------------------- | --------------------- | ------------------------- |
| `tmg.fetchKeyShortcuts()` | `fetchKeyShortcuts()` | Gets key bindings config  |
| `tmg.isModdedKey(e)`      | `isModdedKey(e)`      | Checks if key is modified |

## File Utils (utils/file.ts)
| JS Prototype                       | TypeScript                     | Notes                   |
| ---------------------------------- | ------------------------------ | ----------------------- |
| `tmg.downloadBlob(blob, filename)` | `downloadBlob(blob, filename)` | Downloads blob as file  |
| `tmg.captureCanvas(canvas, type)`  | `captureCanvas(canvas, type)`  | Captures canvas to blob |

## Browser Utils (utils/browser.ts)
| JS Prototype    | TypeScript  | Notes                     |
| --------------- | ----------- | ------------------------- |
| `tmg.ON_MOBILE` | `ON_MOBILE` | Boolean: is mobile device |
| `tmg.IS_IOS`    | `IS_IOS`    | Boolean: is iOS           |
| `tmg.IS_SAFARI` | `IS_SAFARI` | Boolean: is Safari        |

---

## Usage Example

**Before (JS):**
```javascript
const time = tmg.formatMediaTime({ time: 123 });
const el = tmg.createEl("div", { className: "foo" });
tmg.addSafeClicks(button, onClick, onDblClick);
```

**After (TS):**
```typescript
import { formatMediaTime, createEl, addSafeClicks } from "../utils";

const time = formatMediaTime({ time: 123 });
const el = createEl("div", { className: "foo" });
addSafeClicks(button, onClick, onDblClick);
```

---

**KEY RULE**: All utils exist in TS exactly as in JS but WITHOUT the `tmg.` prefix. Import from `"../utils"`.
