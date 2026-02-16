# TMG Media Player - Code Patterns & Lifecycle Rules

**Last Updated**: February 10, 2026  
**Purpose**: Definitive guide for plug/component implementation patterns extracted from working TypeScript codebase

---

## 🏗️ ARCHITECTURE HIERARCHY

```
Controllable (base lifecycle)
    ├── BasePlug (logic, no DOM)
    │   └── Concrete Plugs (VolumePlug, TimePlug, etc.)
    └── BaseComponent (UI, has DOM)
        └── Concrete Components (Timeline, PlayPause, etc.)
```

**Golden Rule**: Plugs manage **state/logic**, Components manage **DOM/visuals**. No plug touches DOM directly.

---

## 📋 LIFECYCLE METHODS (Execution Order)

### **Important: guardAllMethods Auto-Binding**
All methods in Controllables (plugs/components) are **automatically bound and error-guarded** via `guardAllMethods(this, this.guard, true)` in the Controllable constructor. This means:

- **No need for arrow functions** - Regular methods work fine: `protected handleClick() {}`
- **No need for .bind()** - Methods maintain correct `this` context automatically
- **Automatic error handling** - All method errors are caught and logged via `this.guard`
- **Can use `super` calls** - Regular methods allow extending parent behavior

```typescript
// ✅ CORRECT - Regular method (preferred)
protected handleClick(e: MouseEvent): void {
  this.doSomething();
}
this.el.addEventListener("click", this.handleClick, { signal: this.signal });

// ❌ WRONG - Arrow function (unnecessary, can't use super)
protected handleClick = (e: MouseEvent): void => {
  this.doSomething();
};

// ❌ WRONG - Manual binding (unnecessary, creates new function)
this.el.addEventListener("click", this.handleClick.bind(this), { signal: this.signal });
```

### **1. Constructor**
```typescript
constructor(ctl: Controller, config: Config, state?: State)
```
- **Plugs**: `super(ctl, config)`
- **Components**: `super(ctl, config, { disabled: false, hidden: false, ...state })`
- Initialize **class properties only** (no side effects)
- Set default state values

### **2. setup() → onSetup()**
Called by Controller during boot. **NEVER call this manually.**

```typescript
protected onSetup(): void {
  this.mount?.();  // Create DOM (components only)
  if (this.ctl.state.readyState) this.wire?.();
  else this.wire && this.ctl.state.once("readyState", this.wire, { signal: this.signal });
}
```

**Auto-executed by base classes**. Don't override unless you know what you're doing.

### **3. mount() - Optional**
**When to implement**:
- **Components**: ALWAYS (create/append DOM)
- **Plugs**: Only if needs setup before `wire()` (rare)

```typescript
// Component pattern
public mount(): void {
  this.ctl.DOM.controlsContainer?.append(this.element);
  // Initialize DOM-dependent state (canvas contexts, etc.)
}

// Plug pattern (rare)
public mount(): void {
  this.ctl.config.set("some.path", (value) => transform(value));
  // Pre-wire setup that doesn't require media ready
}
```

### **4. wire() - Optional but Common**
**When to implement**: For event listeners, reactive subscriptions, media-dependent setup

```typescript
public wire(): void {
  // 1. Register event listeners (DOM or state)
  this.el.addEventListener("click", this.handleClick, { signal: this.signal });
  
  // 2. Subscribe to reactive state
  this.ctl.media.state.on("currentTime", this.handleTimeUpdate, { 
    signal: this.signal, 
    immediate: true  // Fire once on subscribe
  });
  
  // 3. Subscribe to config changes
  this.ctl.config.on("settings.volume.value", this.handleValueChange, { signal: this.signal });
  
  // 4. Initialize dependent state
  const timePlug = this.ctl.getPlug<TimePlug>("time");
  if (timePlug) { /* use plug API */ }
}
```

### **5. destroy() → onDestroy()**
```typescript
protected onDestroy(): void {
  this.unmount();  // Components only
  // Custom cleanup if needed (rare - signal handles most)
}
```

**Auto-cleanup**: `signal` aborts all listeners/timers automatically. No manual cleanup needed 99% of time.

---

## 🔌 PLUG PATTERNS

### **Required Properties**
```typescript
export class MyPlug extends BasePlug<Config> {
  public static readonly plugName: string = "myPlug";  // REQUIRED, camelCase
  public static readonly isCore: boolean = false;      // true = essential (css, media, skeleton)
  
  // Config type parameter defines settings.myPlug shape
}
```

### **Config Management**
```typescript
// Reading config
this.config.value          // Direct access
this.config.min, this.config.max

// Watching config changes (in wire)
this.ctl.config.on("settings.myPlug.value", this.handleValueChange, { signal: this.signal });

// Setting config
this.config.value = newValue  // Triggers reactive updates

// Transforming config values (in mount)
this.ctl.config.set("settings.myPlug.nested", (value) => transformedValue);
```

### **State Management Patterns**

#### **Pattern 1: Local Protected State** (most common)
```typescript
export class VolumePlug extends BasePlug<Volume> {
  protected lastVolume = 0;              // Private state
  protected sliderAptVolume = 5;         // Not reactive
  protected shouldMute = false;          // Flags for logic
  
  public wire(): void {
    // Use in handlers
    this.shouldMute ? this.lastVolume : this.config.value
  }
}
```

#### **Pattern 2: Reactive State** (when components need to observe)
```typescript
export class MyPlug extends BasePlug<Config, State> {
  // Pass state to super constructor in extended class
  // BaseComponent does this automatically
  
  public wire(): void {
    // Components can subscribe
    this.state.on("someValue", handler, { signal: this.signal });
  }
}
```

### **Intent Handling** (media control pattern)
```typescript
protected handleVolumeIntent(e: Event<MediaIntent, "volume">): void {
  if (e.resolved) return;  // Another plug already handled it
  
  const clamped = clamp(this.config.min, e.value ?? 0, this.config.max);
  this.config.value = clamped;  // Update config
  
  e.resolve(this.name);  // Mark as handled
}

// Register in wire()
this.ctl.media.intent.on("volume", this.handleVolumeIntent, { 
  capture: true,  // Capture phase (before bubble)
  signal: this.signal 
});
```

### **Public Methods** (API surface)
```typescript
// Provide user-facing API for actions
public toggleMute(option?: "auto"): void {
  if (option === "auto" && this.shouldSetLastVolume && !this.lastVolume) 
    this.lastVolume = this.config.skip ?? 10;
  this.config.muted = !this.config.muted;
}

public changeVolume(value: number): void {
  const sign = value >= 0 ? "+" : "-";
  // ... logic
}
```

### **Multi-Module Plug Pattern**
For complex plugs split into logical modules (e.g., gesture with wheel/touch/general):

```typescript
// Parent Plug (src/ts/plugs/gesture/index.ts)
import { BasePlug } from "..";
import { WheelModule, type WheelConfig } from "./wheel";
import { TouchModule, type TouchConfig } from "./touch";

export type Gesture = {
  wheel: WheelConfig;
  touch: TouchConfig;
};

export class GesturePlug extends BasePlug<Gesture> {
  public static readonly plugName = "gesture";
  
  // Public module instances
  public wheel!: WheelModule;
  public touch!: TouchModule;

  constructor(ctl: Controller, config: Gesture) {
    super(ctl, config);
    // Create modules in constructor
    this.wheel = new WheelModule(this.ctl, this.config.wheel);
    this.touch = new TouchModule(this.ctl, this.config.touch);
  }

  public wire(): void {
    // Setup modules after controller ready
    (this.wheel.setup(), this.touch.setup());
  }

  protected onDestroy(): void {
    super.onDestroy();
    this.wheel?.destroy();
    this.touch?.destroy();
  }
}

// Module (src/ts/plugs/gesture/wheel.ts)
import { BaseModule } from "../base";

export interface WheelConfig {
  enabled: boolean;
  sensitivity: number;
}

export class WheelModule extends BaseModule<WheelConfig> {
  public static readonly moduleName = "wheel";

  public wire(): void {
    // Wait for heavy features if needed
    if (this.ctl.state.readyState > 1) this.attachListeners();
    else this.ctl.state.once("readyState", () => this.attachListeners(), { signal: this.signal });
  }

  protected attachListeners(): void {
    this.ctl.videoContainer.addEventListener("wheel", this.handleWheel, { 
      signal: this.signal, 
      passive: false 
    });
  }

  protected handleWheel(e: WheelEvent): void {
    // Module-specific logic
  }
}
```

**Key Points**:
- Modules extend `BaseModule<Config>` (similar to BasePlug but for sub-components)
- Parent plug creates modules in constructor
- Parent plug calls `module.setup()` in its `wire()` method
- Parent plug destroys modules in `onDestroy()`
- Modules have same lifecycle as plugs (mount/wire/destroy)

---

## 🎨 COMPONENT PATTERNS

### **Required Properties**
```typescript
export class MyComponent extends BaseComponent<Config, State, HTMLButtonElement> {
  public static readonly componentName: string = "myComponent";  // REQUIRED, camelCase
  public static readonly isControl: boolean = true;              // true = draggable control
  
  // Generic params: <Config, State, ElementType>
}
```

### **Element Type Pattern**
```typescript
// HTMLElement = generic
export class Range extends BaseComponent<Config, State, HTMLElement> {
  protected container!: HTMLElement;
  protected valueBar!: HTMLElement;
}

// HTMLButtonElement = specific
export class PlayPause extends BaseComponent<Config, State, HTMLButtonElement> {
  // this.el is typed as HTMLButtonElement
  // this.element is typed as HTMLButtonElement
}
```

### **DOM Creation** (create method - ALWAYS REQUIRED)
```typescript
public create(): HTMLButtonElement {
  // Pattern 1: Simple button
  return (this.element = createEl("button", 
    { className: "tmg-video-play-pause-btn", innerHTML: this.getIcon("play") }, 
    { draggableControl: "", controlId: this.name }
  ));
}

// Pattern 2: Complex hierarchy
public create(): HTMLElement {
  this.container = createEl("div", { className: "tmg-video-range-container" });
  this.barsWrapper = createEl("div", { className: "tmg-video-bars-wrapper" });
  this.baseBar = createEl("div", { className: "tmg-video-bar" });
  this.valueBar = createEl("div", { className: "tmg-video-bar" });
  
  this.barsWrapper.append(this.baseBar, this.valueBar);
  this.container.append(this.barsWrapper);
  
  return (this.element = this.container);  // MUST assign to this.element before returning
}
```

### **Dataset Attributes** (from prototype-3.js pattern)
```typescript
// In create()
this.element.dataset.controlId = this.name;  // For drag-drop identification
this.element.dataset.draggableControl = "";  // Makes control draggable
this.element.dataset.dropZone = "";          // Marks as drop target
this.element.dataset.dragId = "big";         // Drag type: "", "big", "wrapper"
```

### **ARIA Management**
```typescript
// Protected helper (called in create and update methods)
protected setBaseARIA(doubleKeyAction?: string): void {
  this.el.setAttribute("aria-label", this.state.label);
  this.el.setAttribute("aria-keyshortcuts", parseForARIAKS(this.state.cmd));
  if (doubleKeyAction) 
    this.el.setAttribute("aria-description", `Double-press for ${doubleKeyAction}`);
}

// Update on state changes
protected updateARIA(): void {
  this.state.label = this.ctl.media.state.paused ? "Play" : "Pause";
  this.state.cmd = formatKeyForDisplay(this.ctl.config.settings.keys.shortcuts.playPause);
  this.el.title = this.state.label + this.state.cmd;
  this.setBaseARIA();
}
```

### **Component State Pattern** (reactive UI updates)
```typescript
export interface ComponentState {
  label: string;        // ARIA label
  cmd: string;          // Keyboard shortcut display
  hidden: boolean;      // Visibility
  disabled: boolean;    // Interactive state
}

// Wire pattern
public wire(): void {
  this.ctl.media.state.on("paused", this.updateUI, { signal: this.signal, immediate: true });
}

protected updateUI(): void {
  this.updateARIA();
  // Update visual state
}
```

---

## 🎯 EVENT LISTENER PATTERNS

### **Golden Rule: Handlers are Class Methods**
```typescript
// ✅ CORRECT: Direct class method reference (auto-bound by guardAllMethods)
this.el.addEventListener("click", this.handleClick, { signal: this.signal });

// ❌ WRONG: Inline arrow function (creates new function, can't be guarded)
this.el.addEventListener("click", (e) => { /* ... */ });

// ❌ WRONG: .bind() (creates new function, can't be guarded)
this.el.addEventListener("click", this.handleClick.bind(this));
```

### **Handler Naming Convention**
```typescript
// Pattern: handle<Action><Subject>
protected handleClick(e: MouseEvent): void {}
protected handleTimeUpdate(e: Event<MediaState, "currentTime">): void {}
protected handleValueChange(e: Event<Config, "value">): void {}
protected handlePointerDown(e: PointerEvent): void {}
protected handleKeyDown(e: KeyboardEvent): void {}

// Specialized handlers
protected handleVolumeIntent(e: Event<MediaIntent, "volume">): void {}
protected handleMutedChange(e: Event<VideoBuild, "settings.volume.muted">): void {}
```

### **Signal Pattern** (auto-cleanup)
```typescript
// All listeners MUST use signal for automatic cleanup
{ signal: this.signal }

// AbortSignal is inherited from Controller and auto-aborts on destroy
// No removeEventListener needed (handled by signal abort)
```

### **Reactive Event Listeners**
```typescript
// State path listener
this.ctl.media.state.on("currentTime", this.handleTimeUpdate, { 
  signal: this.signal, 
  immediate: true  // Call once immediately with current value
});

// Config path listener
this.ctl.config.on("settings.volume.value", this.handleValueChange, { 
  signal: this.signal 
});

// Multiple paths (array forEach pattern)
(["settings.time.min", "settings.time.max"] as const).forEach((p) => 
  this.ctl.config.get(p, this.toTimeVal, { signal: this.signal })
);
```

### **Event Handler Signatures**
```typescript
// DOM events: Native Event type
protected handleClick(e: MouseEvent): void {}
protected handleKeyDown(e: KeyboardEvent): void {}

// Reactive events: Event<Source, Key>
protected handleTimeUpdate(e: Event<MediaState, "currentTime">): void {
  const time = e.target.value!;  // value from target
  const oldTime = e.oldValue;    // previous value
}

// Destructured pattern (common)
protected handleValueChange({ target, oldValue }: Event<Config, "value">): void {
  const newValue = target.value!;
}
```

---

## 🔄 REACTIVE STATE PATTERNS

### **Reading Reactive Values**
```typescript
// Direct access
this.ctl.media.state.currentTime
this.config.volume.value

// Path-based access (when path is string)
this.ctl.config.get("settings.volume.value")
```

### **Writing Reactive Values**
```typescript
// Assignment triggers listeners
this.config.value = 50;
this.ctl.media.intent.paused = true;

// Nested updates
this.config.volume.muted = false;
this.ctl.config.settings.css.currentVolumeSliderPosition = 0.5;
```

### **Watching Changes**
```typescript
// Single path
this.ctl.config.on("settings.volume.value", handler, { signal });

// Immediate callback
this.ctl.config.on("settings.volume.value", handler, { signal, immediate: true });

// Capture phase (before bubble)
this.ctl.media.intent.on("volume", handler, { capture: true, signal });

// Once (auto-removes after first fire)
this.ctl.state.once("readyState", handler, { signal });
```

### **Transform Pattern** (config.get)
```typescript
// Auto-transform value before use
(["settings.time.min", "settings.time.max"] as const).forEach((p) => 
  this.ctl.config.get(p, this.toTimeVal, { signal: this.signal })
);

public toTimeVal(value: number | string | undefined | null): number {
  return parseIfPercent(value ?? 0, this.ctl.media.status.duration);
}
```

### **watch() vs on() vs set() vs get()**
```typescript
// on() - Event-style listening (fires when value changes, full event payload)
this.ctl.config.on("settings.volume.value", ({ target, oldValue }) => {
  console.log(`Changed from ${oldValue} to ${target.value}`);
}, { signal: this.signal, immediate: true });

// watch() - Value-style observation (just get new value directly)
this.ctl.config.watch("settings.volume.value", (newValue) => {
  this.localValue = newValue!;
}, { signal: this.signal, immediate: true });

// get() - Intercept/transform when accessing (lazy getter mediation)
this.ctl.config.get("settings.time.min", (value) => {
  return parseIfPercent(value ?? 0, this.ctl.media.status.duration);
}, { signal: this.signal, lazy: true });

// set() - Validate/transform when setting (setter mediation)
this.ctl.config.set("settings.volume.value", (value) => {
  return clamp(this.config.min, value!, this.config.max);
}, { signal: this.signal });
```
```

---

## 🧩 COMMON IMPLEMENTATION PATTERNS

### **Protected vs Public**
```typescript
// Protected: Internal implementation, handlers, helpers
protected handleClick(e: MouseEvent): void {}
protected updateUI(): void {}
protected lastVolume = 0;

// Public: External API, controller calls, component access
public toggleMute(): void {}
public changeVolume(value: number): void {}
public element: HTMLElement;
```

### **Null Safety with Optional Chaining**
```typescript
// DOM may not exist yet
this.ctl.DOM.controlsContainer?.append(this.element);
this.ctl.DOM.controlsContainer?.addEventListener(...);

// Plug may not be registered
const timePlug = this.ctl.getPlug<TimePlug>("time");
if (timePlug) timePlug.toggleMode();
```

### **Throttling Pattern**
```typescript
protected handleInput(e: MouseEvent | PointerEvent): void {
  this.ctl.throttle(
    `${this.config.label}RangeInput`,  // Unique key
    () => {
      // Expensive operation (DOM reads/writes)
    },
    30,    // ms delay
    false  // leading edge (false = trailing edge only)
  );
}
```

### **RAF Loop Pattern** (smooth animations)
```typescript
// Start RAF loop
protected startDragging(): void {
  this.state.isDragging = true;
  this.ctl.RAFLoop("dragLoop", this.updateDragPosition);
}

// RAF callback
protected updateDragPosition(): void {
  if (!this.state.isDragging) return;
  // Update position based on pointer
  this.element.style.left = `${this.dragX}px`;
}

// Stop RAF loop
protected stopDragging(): void {
  this.state.isDragging = false;
  this.ctl.cancelRAFLoop("dragLoop");  // ✅ CORRECT - Use cancelRAFLoop method
}
```

### **Clamp Pattern** (boundary enforcement)
```typescript
import { clamp } from "../utils";

const value = clamp(this.config.min, userInput, this.config.max);
const percent = clamp(0, position / dimension, 1);
```

---

## 🚨 ANTI-PATTERNS (DON'T DO THIS)

### ❌ **Blind Copying from JS Prototype**
```typescript
// ❌ WRONG: Copy-paste without understanding lifecycle
public create() {
  this.element = createEl("div");
  this.wire();  // NO! wire() is called by onSetup()
  return this.element;
}

// ✅ CORRECT: Let lifecycle handle it
public create() {
  return (this.element = createEl("div"));
}
public wire() {
  // Listeners here
}
```

### ❌ **Inline Listeners**
```typescript
// ❌ WRONG: Can't be guarded, no method reuse
this.el.addEventListener("click", (e) => { this.doThing(); });

// ✅ CORRECT: Class method
protected handleClick(e: MouseEvent): void { this.doThing(); }
this.el.addEventListener("click", this.handleClick, { signal: this.signal });
```

### ❌ **Manual Event Cleanup**
```typescript
// ❌ WRONG: Unnecessary (signal handles it)
public destroy() {
  this.el.removeEventListener("click", this.handleClick);
  super.destroy();
}

// ✅ CORRECT: Signal auto-aborts all listeners
// No cleanup needed if you used { signal: this.signal }
```

### ❌ **Missing Static Properties**
```typescript
// ❌ WRONG: Will throw runtime error
export class MyPlug extends BasePlug {
  // Missing plugName!
}

// ✅ CORRECT: Always declare at top
export class MyPlug extends BasePlug {
  public static readonly plugName: string = "myPlug";
  public static readonly isCore: boolean = false;
}
```

### ❌ **DOM in Plugs**
```typescript
// ❌ WRONG: Plugs don't touch DOM
export class MyPlug extends BasePlug {
  public wire() {
    this.button = createEl("button");  // NO!
  }
}

// ✅ CORRECT: Create component for UI
export class MyComponent extends BaseComponent {
  public create() {
    return (this.element = createEl("button"));
  }
}
```

---

## 📚 IMPORT PATTERNS

### **Type Imports**
```typescript
import type { Controller } from "../core/controller";
import type { Event } from "../types/reactor";
import type { MediaState } from "../types/contract";
```

### **Value Imports**
```typescript
import { BasePlug } from ".";
import { BaseComponent } from "./";
import { createEl, clamp, formatMediaTime } from "../utils";
```

### **Mixed Imports**
```typescript
import { VolumePlug, type TimePlug } from ".";
```

---

## 📝 CODING STYLE & CONVENTIONS

### **Comma Const Style**
Declare related constants together using comma separation (matching JS prototype style), **BUT** stop the comma chain when the next assignment is multi-line to prevent unwanted indentation:

```typescript
// ✅ CORRECT - Comma const for one-liner assignments
const count = clamp(1, Math.round(duration - currentTime), this.config.next),
  v = this.ctl.config.playlist[index + 1],
  toastsPlug = this.ctl.getPlug<ToastsPlug>("toasts"),
  timePlug = this.ctl.getPlug<TimePlug>("time");
// Stop comma chain before multi-line expression  
const nVTId = toastsPlug?.toast?.("", {
  autoClose: count * 1000,
  hideProgressBar: false,
  // ... multi-line object
});
// Resume comma const for related one-liners
const cleanUp = (permanent = false) => (/* ... */),
  cleanUpWhenNeeded = () => !ended && cleanUp(),
  removeListeners = () => events.forEach((e) => remove(e));

// ❌ WRONG - Continuing comma into multi-line (causes indent)
const count = clamp(1, 2, 3),
  nVTId = toastsPlug?.toast?.("", {
    autoClose: 1000,
    // This gets indented awkwardly
  });

// ❌ WRONG - Separate const for simple related values
const count = clamp(1, Math.round(duration - currentTime), this.config.next);
const v = this.ctl.config.playlist[index + 1];
const toastsPlug = this.ctl.getPlug<ToastsPlug>("toasts");
```

**Rule of thumb**: Use comma const when all assignments fit comfortably on one line or are simple arrow functions. Break to new `const` for multi-line objects, long function calls, or complex expressions.

### **Media Status Properties**
Always use `media.status` properties instead of custom flags or readyState checks:

```typescript
// ✅ CORRECT - Use media.status properties
const loaded = this.ctl.media.status.loadedMetadata,  // Do we know duration?
  waiting = this.ctl.media.status.waiting,            // Spinner active?
  seeking = this.ctl.media.status.seeking;            // Scrubbing?

if (!loaded || waiting) return;

// ❌ WRONG - Custom flags or readyState checks
const loaded = this.ctl.media.status.readyState > 0;
const buffering = this.ctl.state.readyState < 3;
this.loaded = true;  // Don't create custom flags
```

**Key media.status properties**:
- `loadedMetadata: boolean` - Duration known
- `loadedData: boolean` - Frame 1 renderable
- `waiting: boolean` - Buffering/spinner active
- `seeking: boolean` - Scrubbing in progress
- `canPlay: boolean` - Can start playback
- `canPlayThrough: boolean` - Can play to end
- `ended: boolean` - Playback complete

### **Time Formatting with TimePlug**
Never create inline time formatting utilities. Use `TimePlug.toTimeText()`:

```typescript
// ✅ CORRECT - Use TimePlug for time formatting
const timePlug = this.ctl.getPlug<TimePlug>("time");
const formattedTime = timePlug?.toTimeText(duration) ?? "0:00";
const formattedTimeWithMode = timePlug?.toTimeText(currentTime, true) ?? "0:00";

// ❌ WRONG - Creating own time formatting
protected formatTime(time: number): string {
  return formatMediaTime({ time, format: this.ctl.config.settings.time.format });
}
```

**TimePlug.toTimeText() signature**:
```typescript
public toTimeText(time = currentTime, useMode = false, showMs = false): string
```
- Respects `settings.time.format` (digital/human/human-long)
- Respects `settings.time.mode` (elapsed/remaining) when `useMode = true`
- Returns properly formatted time string with elapsed/remaining prefix

### **Utility Checks Before Creating**
Always search `src/ts/utils/` for existing utilities before creating inline helpers:

```typescript
// ✅ CORRECT - Import from utils
import { clamp, rotate, addSources, formatMediaTime } from "../utils";

// ❌ WRONG - Creating duplicate utilities
protected clampValue(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
```

**Available utilities** (see `src/ts/utils/index.ts`):
- **Math**: `clamp`, `rotate`, `lerp`, `normalize`
- **Media**: `addSources`, `removeSources`, `getSources`, `isSameSources`
- **Time**: `formatMediaTime`, `parseIfPercent`
- **DOM**: `createEl`, `queryDOM`

---

## 🎓 TRANSLATION CHECKLIST (JS → TS)

When porting from prototype-3.js:

- [ ] **Identify type**: Plug (logic) or Component (UI)?
- [ ] **Add static properties**: `plugName`/`componentName`, `isCore`/`isControl`
- [ ] **Split lifecycle**: JS inline code → `mount()` and `wire()` methods
- [ ] **Extract handlers**: Inline callbacks → protected class methods with `handle` prefix
- [ ] **Add signal**: All listeners MUST have `{ signal: this.signal }`
- [ ] **Type everything**: Config interface, State interface, Element generic
- [ ] **State management**: Local protected variables or reactive state?
- [ ] **Check dataset attributes**: Preserved from JS for drag-drop, control ID, etc.
- [ ] **ARIA updates**: Implement `setBaseARIA()` and update on state changes
- [ ] **Test lifecycle**: Does `mount()` → `wire()` → `destroy()` work correctly?

---

## 🔍 PATTERN DISCOVERY COMMANDS

```bash
# Find all handler methods
grep -r "protected handle" src/ts --include="*.ts"

# Find all static properties
grep -r "public static readonly" src/ts --include="*.ts"

# Find all wire() implementations
grep -r "public wire()" src/ts --include="*.ts"

# Find listener patterns
grep -r "addEventListener.*this\." src/ts --include="*.ts"
```

---

**Next Steps**: Read this before implementing any new plug or component. Reference working examples in `src/ts/plugs/volume.ts` and `src/ts/components/timeline.ts` for complete pattern demonstrations.
