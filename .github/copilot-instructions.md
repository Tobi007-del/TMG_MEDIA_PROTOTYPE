# TMG Media Player - AI Agent Instructions

## Architecture Overview

TMG Media Player is a **zero-dependency, TypeScript-based video player** with a unique reactive architecture called **SIA (State & Intent Architecture)**. The player is built around a surgical Proxy-based state management system that enables optimistic UI updates with rejection capabilities.

### Core Architecture: SIA (State & Intent Architecture)

The foundation is **The Reactor** - a low-level, path-addressable state kernel with:

- **State**: Facts (what IS) - read from this, listen to changes
- **Intent**: Requests (what you WANT) - write to this, can be rejected
- **Status**: Read-only media properties (readyState, duration, buffered)
- **Event capture/bubble phases**: Rejection happens in capture, listening in bubble

**Critical Concept**: State and Intent are separate frequencies. Intent flows through capture phase (where it can be rejected), then state updates, then listeners fire in bubble phase. This enables "smart optimistic" UIs that show intent but revert if rejected.

See [PHILOSOPHY.md](../PHILOSOPHY.md) for the "King's Height" parable and [CHRONICLES.md](../CHRONICLES.md) for full technical details.

### Media Contract - NEVER Touch `.element` Directly

```typescript
// ❌ WRONG - Element gets swapped on tech changes, you'll lose reference
this.ctl.media.element.currentTime = 50;

// ✅ CORRECT - Use state/intent/status contracts
const current = this.ctl.media.state.currentTime; // Reading current value
this.ctl.media.intent.currentTime = 50; // Requesting change
const dur = this.ctl.media.status.duration; // Read-only status
```

Original video element is preserved in memory to restore later. Always use the contract, never direct element access.

### Three Pillars: Controller, Plugs, Components

**Controller** (`src/ts/core/controller.ts`):

- Orchestrator that boots the system, connects plugs, manages tech
- Stores: `config` (reactified settings), `media` (state/intent/status contracts), `runtime` (shared reactive state)
- Access plugs: `this.ctl.getPlug<PlugType>("plugName")`
- Public properties: `videoContainer`, `pseudoVideo`, `DOM` (major shared elements only)

**Plugs** (logic, no DOM):

- Extend `BasePlug<Config, State>`, managed by `PlugRegistry`
- Handle state management, business logic, cross-cutting concerns
- Export their config types for modular build.d.ts
- Examples: `media`, `overlay`, `persist`, `locked`, `gesture`, `time`
- Multi-module plugs: Gesture has `.general`, `.wheel`, `.touch` modules

**Components** (visual elements with DOM):

- Extend `BaseComponent<Config, State, Element>`, managed by `ComponentRegistry`
- Create DOM in `create()`, attach listeners in `onSetup()`, cleanup in `onDestroy()`
- Example hierarchy: `RangeSlider` → `Timeline` (extends with preview config)

### Controllable Lifecycle Pattern

All plugs/components extend `Controllable<Config, State>`:

```typescript
constructor(ctl: Controller, config: Config, state?: State) {
  super(ctl, config, state);  // Config can be reactive object or plain value
  // guardAllMethods called by super, signal inherited from controller
}

protected onSetup(): void {
  // Called automatically by base class after setup()
  this.mount?.();  // Optional: Create DOM (components) or pre-wire setup (plugs)
  if (this.ctl.runtime.readyState) this.wire?.();
  else this.wire && this.ctl.runtime.once("readyState", this.wire, { signal: this.signal });
}

protected onDestroy(): void {
  // Called by destroy(), signal already aborted
  // Optional: Destroy children, clear maps
  // DON'T manually null properties - nuke() handles this
  super.onDestroy();  // Can call at end if needed
}
```

**Critical**: `signal` enables automatic cleanup via `AbortController`. All listeners/timers use `{ signal: this.signal }`.

## Code Style - Terse & Surgical

**Read [PATTERNS.md](../PATTERNS.md) completely before ANY changes.** This codebase follows a terse style matching the JavaScript prototype.

### Non-Negotiable Rules

1. **No comments explaining code** - "stop tyna write comments to explain my own code to me"
2. **Combine adjacent const declarations** with commas: `const x = 5, y = 10;`
3. **Use direct methods**, not arrow functions: `protected method() {}` (allows super calls)
4. **No braces on simple if/else**: `if (condition) doSomething();`
5. **Use payload data directly**: `target.value!` not `const value = target.value!` unless used 3+ times
6. **Import from index files**: `import { Time, Duration } from "./"` not individual files

### Utils - Remove `tmg.` Prefix

All `tmg.*` functions from JS exist in TS **without the prefix**. See [UTILS_MAP.md](../UTILS_MAP.md).

```typescript
// ❌ WRONG
tmg.createEl("div", { className: "foo" });
tmg.formatMediaTime({ time: 123 });

// ✅ CORRECT
import { createEl, formatMediaTime } from "../utils";
createEl("div", { className: "foo" });
formatMediaTime({ time: 123 });
```

### Event Handling - Use Payload, Not Controller

```typescript
// ✅ CORRECT - Data from event payload
handleChange = ({ target, root }: Event<Config, "value">): void => {
  const pos = (target.value - target.min) / (target.max - target.min);
  formatMediaTime({ time: target.value, format: root.time.format });
};

// ❌ WRONG - Reaching for this.ctl when data is in payload
handleChange = (): void => {
  const dur = this.ctl.media.status.duration; // BAD if available in payload
};
```

## Critical Development Patterns

### ReadyState Progression (0 → 1 → 2+)

- **0**: Boot time, plugs connecting
- **1**: Light state (minimal listeners, fast startup)
- **2+**: Heavy controls (all event listeners)

Gesture/heavy features wait: `this.ctl.runtime.on("readyState", ({ value }) => value! > 0 && this.setup())`

### Always Use Signal for Cleanup

```typescript
// ✅ CORRECT
element.addEventListener("click", this.handler, { signal: this.signal });
this.config.on("value", this.handler, { signal: this.signal, immediate: true });
setTimeout(() => {}, 1000, this.signal);

// ❌ WRONG - Missing signal = memory leaks
element.addEventListener("click", this.handler);
```

### Component Listeners Need `immediate: true`

Settings/state-based listeners need initial rendering:

```typescript
this.config.on("value", this.updateUI, { signal: this.signal, immediate: true });
// immediate: true calls handler immediately to show initial state
```

### Accessing Other Plugs/Components

```typescript
// ✅ CORRECT - Use generics for type safety
const overlay = this.ctl.getPlug<OverlayPlug>("overlay");
overlay?.show();

const timeline = this.ctl.getPlug<ControlPanelPlug>("controlPanel")?.getControl<Timeline>("timeline");
timeline?.stopScrubbing();

// ❌ WRONG - Methods aren't on controller
this.ctl.showOverlay();
```

### Type Exports - Every Plug/Component

```typescript
// ✅ CORRECT - Export type at top
export interface Overlay {
  delay: number;
  behavior: "persistent" | "auto" | "strict" | "hidden";
}

export class OverlayPlug extends BasePlug<Overlay> {
  constructor(ctl: Controller, config: Overlay) {
    super(ctl, config); // Config handled by controller
  }
}

// For booleans/primitives
export type Locked = boolean;

export class LockedPlug extends BasePlug<Locked> {
  constructor(ctl: Controller, config: Locked) {
    super(ctl, config); // Don't reactify primitives
  }
}
```

This keeps build.d.ts short - it imports types instead of defining them inline.

## Build & Development

**Build System**: esbuild + TypeScript + Sass

```bash
npm run build          # Development build
npm run build:prod     # Production build (minified)
npm run typecheck      # Type checking watch mode
```

**Output**: `dist/tmg-player.js` (IIFE), `dist/tmg-player.mjs` (ESM), `dist/tmg-player.d.ts`

**Entry**: `src/index.ts` → Exports `Controller`, `Player`, utils

**No tests** - Manual testing via prototypes and examples

## Common Patterns

### State vs Config vs Runtime

- **config**: Reactified settings from user, persisted
- **state**: Internal reactive state for external observers (output, not input to self)
- **runtime**: Shared state across plugs (2+ methods need it): `gestureTouchXCheck`, `readyState`

### Mobile Checks

```typescript
import { IS_MOBILE, IS_IOS, IS_SAFARI } from "../utils";

if (!IS_MOBILE) this.updatePreviewCSS(); // Don't remove these checks!
```

### Validation After Edits

**ALWAYS run after file changes**:

```bash
npm run typecheck  # or use get_errors tool
```

Fix type errors incrementally, don't accumulate broken builds.

## Key Integration Points

### Gesture → Overlay

Gesture modules **call** overlay methods, don't implement overlay logic:

```typescript
this.ctl.getPlug<OverlayPlug>("overlay")?.delay();
this.ctl.getPlug<OverlayPlug>("overlay")?.remove();
```

### Timeline Preview System

Three types handled in `onInput()`:

1. **Sprite**: Grid positioning via background-position
2. **Image**: URL template with `$` replaced by frameIndex
3. **Canvas**: `this.ctl.pseudoVideo.currentTime = percent * duration`

Check `this.ctl.videoContainer.dataset.previewType` for active mode.

### Time Plug → Components

Time utilities live on plug, not controller:

```typescript
const timePlug = this.ctl.getPlug<TimePlug>("time");
const text = timePlug!.toTimeText(time, useMode, showMs);
```

## Porting from JavaScript

When porting features from `prototype-3.js`:

1. **Read PATTERNS.md completely first**
2. **Read UTILS_MAP.md** - Check if utils already exist
3. **Read JS prototype line-by-line** for feature (not summaries)
4. **Match terse style exactly** - No comments, combine consts, direct usage
5. **Use `get_errors` after changes** - Fix TypeScript errors immediately

"Every line means every line" - User wants complete reconstruction with exact logic from JS, just properly typed in TS.

## How to Write a Plug (Step-by-Step)

### 1. Pre-Implementation Checklist

**BEFORE writing any logic, answer these questions:**

- [ ] What is the plug's **single responsibility**? (state management, logic coordination, cross-cutting concern)
- [ ] What **config** does it need? (object, primitive, or undefined)
- [ ] Does it need **internal state** for external observers? (Create `state` interface)
- [ ] Does it need **shared runtime state**? (Use `this.ctl.runtime`)
- [ ] Is it **core** (always loaded) or **optional**? (Set `isCore` static property)
- [ ] Will it have **public methods** for other plugs to call?
- [ ] Does it need **multi-module** architecture? (Like gesture with wheel/touch/general)

### 2. File Structure Template

**Simple Plug** (`src/ts/plugs/plugname.ts`):

```typescript
import { BasePlug } from ".";
import { reactive, type Reactive } from "../tools/mixins";
import type { Controller } from "../core/controller";
import type { Event } from "../types/reactor";
import type { VideoBuild } from "../types/build";
// Import utils needed
import { setTimeout, clamp } from "../utils";

// 1. EXPORT CONFIG TYPE (always first, even for primitives)
export interface PlugName {
  property1: string;
  property2: number;
  nested: { value: boolean };
}

// 2. EXPORT STATE INTERFACE (if needed)
export interface PlugNameState {
  active: boolean;
  visible: boolean;
}

// 3. CLASS DECLARATION
export class PlugNamePlug extends BasePlug<PlugName> {
  // Static properties
  static plugName = "plugName"; // MUST match exactly
  static isCore = false; // true if always needed

  // Public state (if needed) - for multi-module or complex state
  // Usually inherited from Controllable, no need to declare

  // Private/protected state
  protected timerId = -1;

  // 4. CONSTRUCTOR (only if config needs special handling or modules)
  constructor(ctl: Controller, config: PlugName) {
    super(ctl, config); // Config passed as-is, controller handles reactivity
    // Initialize modules if multi-module plug
    // this.moduleA = new ModuleA(this.ctl, config.moduleA);
  }

  // 5. MOUNT - OPTIONAL PRE-WIRE SETUP
  public mount(): void {
    // Setup mediators, transformers, early initialization
    // this.ctl.config.set("settings.plugName.value", (v) => transform(v));
  }

  // 6. WIRE - ATTACH ALL LISTENERS
  public wire(): void {
    // Listen to config changes
    this.ctl.config.on("settings.plugName.property1", this.handlePropertyChange, {
      signal: this.signal,
      immediate: true,
    });

    // Listen to media state
    this.ctl.media.on("state.paused", this.handlePauseChange, {
      signal: this.signal,
      immediate: true,
    });

    // Wait for heavy features until readyState > 1
    if (this.ctl.runtime.readyState > 1) this.heavySetup();
    else this.ctl.runtime.once("readyState", () => this.heavySetup(), { signal: this.signal });
  }

  // 7. EVENT HANDLERS (protected methods, auto-bound by guardAllMethods)
  protected handlePropertyChange({ target, root }: Event<VideoBuild, "settings.plugName.property1">): void {
    // Use target.value for the changed property
    // Use root for sibling properties
    // DON'T reach for this.ctl if data is in payload
  }

  protected handlePauseChange({ target }: Event<any, "paused">): void {
    // React to pause state
    // Update internal state at END of method (output for observers)
    this.state.active = !target.value!;
  }

  // 8. PUBLIC API METHODS (for other plugs to call)
  public activate(): void {
    if (this.state.active) return;
    // Do work
    this.state.active = true; // Update state at end
  }

  public deactivate(): void {
    if (!this.state.active) return;
    clearTimeout(this.timerId);
    // Do work
    this.state.active = false; // Update state at end
  }

  // 9. ONDESTROY (only if has cleanup like child modules)
  protected onDestroy(): void {
    super.onDestroy(); // Signal already aborted, calls config/state reset
    // Destroy modules if multi-module
    this.moduleA?.destroy();
    // Clear maps if needed
    this.someMap?.clear();
  }
}
```

### 3. Multi-Module Plug Template

**Parent Plug** (`src/ts/plugs/parent/index.ts`):

```typescript
import { BasePlug } from "..";
import { ModuleA, type ModuleAConfig } from "./moduleA";
import { ModuleB, type ModuleBConfig } from "./moduleB";

// Export composite type
export type Parent = {
  shared: string;
  moduleA: ModuleAConfig;
  moduleB: ModuleBConfig;
};

export class ParentPlug extends BasePlug<Parent> {
  static plugName = "parent";

  // Public module instances
  public moduleA!: ModuleA;
  public moduleB!: ModuleB;

  constructor(ctl: Controller, config: Parent) {
    super(ctl, config);
    // Create modules with config slices
    this.moduleA = new ModuleA(this.ctl, this.config.moduleA);
    this.moduleB = new ModuleB(this.ctl, this.config.moduleB);
  }

  public wire(): void {
    // Setup modules after controller ready
    (this.moduleA.setup(), this.moduleB.setup());
  }

  protected onDestroy(): void {
    super.onDestroy();
    this.moduleA?.destroy();
    this.moduleB?.destroy();
  }
}
```

**Module File** (`src/ts/plugs/parent/moduleA.ts`):

```typescript
import { BaseModule } from "../";
import { setTimeout } from "../../utils";

export interface ModuleAConfig {
  enabled: boolean;
  timeout: number;
}

export class ModuleA extends BaseModule<ModuleAConfig> {
  static moduleName = "moduleA";

  public wire(): void {
    // Wait for readyState if needed for heavy listeners
    if (this.ctl.runtime.readyState > 1) this.attachListeners();
    else this.ctl.runtime.once("readyState", () => this.attachListeners(), { signal: this.signal });
  }

  protected attachListeners(): void {
    // Attach heavy listeners here
    this.ctl.DOM.controlsContainer?.addEventListener("click", this.handleClick, {
      signal: this.signal,
    });
  }

  protected handleClick(e: MouseEvent): void {
    // Module-specific logic
  }
}
```

### 4. Critical Plug Patterns

**Always Use Signal:**

```typescript
// ALL listeners, timers, RAF must have signal
element.addEventListener("click", this.handler, { signal: this.signal });
setTimeout(() => {}, 1000, this.signal);
requestAnimationFrame(this.handler, this.signal);
this.config.on("value", this.handler, { signal: this.signal });
```

**Immediate: true for Settings/State:**

```typescript
// If listener needs initial state, use immediate: true
this.ctl.config.on("settings.overlay.behavior", this.handleBehavior, {
  signal: this.signal,
  immediate: true, // Fires immediately with current value
});
```

**State Update at End:**

```typescript
// DON'T listen to own state changes
// Update state at END of methods as output
public lock(): void {
  // Do all the work
  this.ctl.videoContainer.classList.add("tmg-video-locked");
  this.cleanup();
  // Update state LAST
  this.state.locked = true;  // External observers react to this
}
```

**Accessing Other Plugs:**

```typescript
// Always use generics and optional chaining
const overlay = this.ctl.getPlug<OverlayPlug>("overlay");
overlay?.show();

// For components
const timeline = this.ctl.getPlug<ControlPanelPlug>("controlPanel")?.getControl<Timeline>("timeline");
timeline?.stopScrubbing();
```

### Reactive Patterns: watch() vs on()

**Use `on()` for event-style listening** (fires when value changes):

```typescript
// Fires when value changes, with event payload
this.ctl.config.on(
  "settings.volume.value",
  ({ target, oldValue }) => {
    console.log(`Changed from ${oldValue} to ${target.value}`);
  },
  { signal: this.signal, immediate: true }
);
```

**Use `watch()` for value-style observation** (just get new value):

```typescript
// Fires when value changes, gets value directly
this.ctl.config.watch(
  "settings.volume.value",
  (newValue) => {
    this.localValue = newValue!;
  },
  { signal: this.signal, immediate: true }
);
```

**Use `get()` for transformation/mediation** (intercepts getting):

```typescript
// Transform value when accessed (lazy getter)
this.ctl.config.get(
  "settings.time.min",
  (value) => {
    return parseIfPercent(value ?? 0, this.ctl.media.status.duration);
  },
  { signal: this.signal, lazy: true }
);
```

**Use `set()` for validation/transformation** (intercepts setting):

```typescript
// Transform/validate value when set
this.ctl.config.set(
  "settings.volume.value",
  (value) => {
    return clamp(this.config.min, value!, this.config.max);
  },
  { signal: this.signal }
);
```

### Storage Adapter Pattern

For persisting state across sessions:

```typescript
import { LocalStorageAdapter } from "../core/storage";

// In plug constructor or mount
const storage = new LocalStorageAdapter("tmg-player");

// Save state
storage.set("volume", this.config.value);

// Load state
const savedVolume = storage.get("volume");
if (savedVolume !== undefined) this.config.value = savedVolume;

// Remove item
storage.remove("volume");
```

### Registry Usage

**Icon Registry** (for SVG icons):

```typescript
import { IconRegistry } from "../core/registry";

// Register icon
IconRegistry.register("play", "<svg>...</svg>");

// Get icon
const iconSVG = IconRegistry.get("play"); // Returns SVG string
```

**Tech Registry** (for media technologies):

```typescript
import { TechRegistry, HTML5Tech } from "../media";

// Register tech
TechRegistry.register(HTML5Tech);

// Pick tech for source
const TechClass = TechRegistry.pick("video.mp4");

// Get specific tech
const Tech = TechRegistry.get<MyTech>("myTech");
```

**Plug Registry** (automatic via index export):

```typescript
import { PlugRegistry } from "../core/registry";

// Register plug (done in plugs/index.ts)
PlugRegistry.register(VolumePlug);

// Get ordered list
const plugs = PlugRegistry.getOrdered();
```

**Component Registry** (automatic via index export):

```typescript
import { ComponentRegistry } from "../core/registry";

// Initialize component
const buffer = ComponentRegistry.init("buffer", this.ctl);

// Get all registered
const allComponents = ComponentRegistry.getAll();
```

## How to Write a Component (Step-by-Step)

### 1. Pre-Implementation Checklist

**BEFORE writing any logic, answer these questions:**

- [ ] What **DOM structure** does it create? (button, range, container)
- [ ] Does it extend an **existing component**? (Timeline extends RangeSlider)
- [ ] What **config** does it need? (Extend parent config if inheriting)
- [ ] What **state** does it need? (Extend ComponentState)
- [ ] Is it a **control** in the control panel? (Set `isControl = true`)
- [ ] What **media/settings** does it listen to? (paused, volume, time.format)
- [ ] Does it need **user interaction** handlers? (click, drag, keyboard)

### 2. File Structure Template

**Simple Component** (`src/ts/components/componentname.ts`):

```typescript
import { BaseComponent, ComponentState } from ".";
import { createEl, formatKeyForDisplay } from "../utils";
import type { Controller } from "../core/controller";
import type { Event } from "../types/reactor";

// 1. EXPORT CONFIG TYPE (use type for undefined, interface for objects)
export type ComponentNameConfig = undefined;
// OR
export interface ComponentNameConfig {
  autoHide: boolean;
  position: "left" | "right";
}

// 2. EXPORT STATE INTERFACE (if extending ComponentState)
export interface ComponentNameState extends ComponentState {
  expanded: boolean;
}

// 3. CLASS DECLARATION
export class ComponentName extends BaseComponent<
  ComponentNameConfig,
  ComponentNameState,
  HTMLButtonElement // Element type (HTMLElement if div)
> {
  // Static properties
  static componentName = "componentName"; // MUST match exactly
  static isControl = true; // false if not in control panel

  // DOM element references (created in create())
  protected wrapper!: HTMLElement;
  protected icon!: HTMLElement;

  // 4. CONSTRUCTOR (only if config needs setup before super)
  constructor(ctl: Controller, options: Partial<ComponentNameConfig> = {}) {
    const defaults = { autoHide: false, position: "left" as const };
    super(ctl, { ...defaults, ...options }, { expanded: false });
  }

  // 5. CREATE - BUILD DOM, RETURN ROOT ELEMENT
  public create(): HTMLButtonElement {
    this.element = createEl(
      "button",
      {
        className: "tmg-video-component-name",
        innerHTML: this.getIcon("iconName"),
      },
      {
        draggableControl: "", // If draggable control
        controlId: "componentname",
      }
    );

    this.wrapper = createEl("div", { className: "tmg-wrapper" });
    this.element.append(this.wrapper);

    return this.element;
  }

  // 6. MOUNT (optional) - INJECT INTO DOM
  public mount(): void {
    // Inject element into specific location
    this.ctl.DOM.controlsContainer?.prepend(this.element);
  }

  // 7. WIRE - ATTACH ALL LISTENERS (runs after readyState > 0)
  public wire(): void {
    // User interaction
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    this.el.addEventListener("keydown", this.handleKeyDown, { signal: this.signal });

    // Media state listeners
    this.ctl.media.state.on("paused", this.updateUI, {
      signal: this.signal,
      immediate: true, // Update UI with initial state
    });

    this.ctl.media.status.on("ended", this.updateUI, { signal: this.signal });

    // Config listeners
    this.ctl.config.on("settings.componentName.autoHide", this.handleAutoHide, {
      signal: this.signal,
      immediate: true,
    });

    this.ctl.config.on("settings.keys.shortcuts.action", this.updateARIA, {
      signal: this.signal,
    });
  }

  // 8. EVENT HANDLERS (protected methods, auto-bound by guardAllMethods)
  protected handleClick(): void {
    // Use intent for media changes
    this.ctl.media.intent.paused = !this.ctl.media.state.paused;
  }

  protected handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.handleClick();
    }
  }

  protected updateUI(): void {
    // Update visual state
    const paused = this.ctl.media.state.paused;
    this.el.classList.toggle("active", !paused);
    this.updateARIA();
  }

  protected updateARIA(): void {
    // Update accessibility attributes
    this.state.label = this.ctl.media.state.paused ? "Play" : "Pause";
    this.state.cmd = formatKeyForDisplay(this.ctl.config.settings.keys.shortcuts.playPause);
    this.el.title = this.state.label + this.state.cmd;
    this.setBaseARIA(); // Inherited method
  }

  // 9. PUBLIC METHODS (for external control)
  public expand(): void {
    this.state.expanded = true;
    this.el.classList.add("expanded");
  }

  public collapse(): void {
    this.state.expanded = false;
    this.el.classList.remove("expanded");
  }

  // 10. ONDESTROY (only if has specific cleanup)
  public onDestroy(): void {
    super.onDestroy(); // MUST call first - aborts signal
    // Destroy children if any
    this.childComponent?.destroy();
  }
}
```

### 3. Extended Component Template

**Extending Existing Component** (`src/ts/components/timeline.ts`):

```typescript
import { RangeSlider, type RangeConfig, type RangeState } from "./";
import { createEl, clamp } from "../utils";
import type { Controller } from "../core/controller";
import type { Event } from "../types/reactor";

// 1. EXTEND PARENT CONFIG
export interface TimelineConfig extends RangeConfig {
  preview: PreviewConfig; // Add timeline-specific config
  seekSync: boolean;
}

// 2. CLASS EXTENDS PARENT WITH GENERIC
export class Timeline extends RangeSlider<TimelineConfig> {
  static componentName = "timeline";
  static isControl = true;

  // Additional DOM elements
  protected previewContainer!: HTMLElement;
  protected bufferedBar!: HTMLElement;

  // 3. CONSTRUCTOR - MODIFY OPTIONS BEFORE SUPER
  constructor(ctl: Controller, options: Partial<TimelineConfig> = {}) {
    // Merge with parent defaults + timeline defaults
    super(ctl, {
      label: "Video timeline",
      ...options,
      preview: options.preview ?? true,
    });
  }

  // 4. OVERRIDE CREATE - CALL SUPER, ADD MORE ELEMENTS
  public create(): HTMLElement {
    const element = super.create(); // Get parent structure

    // Add timeline-specific elements
    this.bufferedBar = createEl("div", {
      className: "tmg-video-bar tmg-video-buffered-bar",
    });
    this.previewContainer = createEl("div", {
      className: "tmg-video-preview-container",
    });

    // Modify parent structure
    this.barsWrapper.append(this.bufferedBar, this.previewContainer);

    return element;
  }

  // 5. OVERRIDE WIRE - CALL SUPER, ADD MORE LISTENERS
  public wire(): void {
    super.wire(); // Parent listeners

    // Timeline-specific listeners
    this.container.addEventListener("keydown", this.handleKeyDown, {
      signal: this.signal,
    });

    this.ctl.media.state.on("currentTime", this.handleTimeUpdate, {
      signal: this.signal,
      immediate: true,
    });
  }

  // 6. OVERRIDE PARENT METHODS (if needed)
  protected onInput(e: MouseEvent | PointerEvent, rect: DOMRect, percent: number): void {
    // Call parent if needed
    // super.onInput(e, rect, percent);

    // Add timeline-specific preview logic
    this.updatePreviewPosition(percent);
    this.updateThumbnail(percent);
  }

  // 7. NEW METHODS
  protected updatePreviewPosition(percent: number): void {
    // Timeline-specific logic
  }

  public stopScrubbing(): void {
    if (!this.state.isScrubbing) return;

    // Timeline-specific behavior before calling parent
    if (!this.state.shouldCancelScrub) {
      this.ctl.media.intent.currentTime = this.config.value;
    }

    super.stopScrubbing(); // Call parent cleanup
  }
}
```

### 4. Critical Component Patterns

**Element Type Generic:**

```typescript
// Specify element type for proper this.el typing
export class Button extends BaseComponent<Config, State, HTMLButtonElement> {
  // this.el is typed as HTMLButtonElement
}

export class Container extends BaseComponent<Config, State, HTMLDivElement> {
  // this.el is typed as HTMLDivElement
}
```

**Create vs Mount vs Wire:**

```typescript
// create() - Build DOM, return root element (runs first)
public create(): HTMLElement {
  this.element = createEl("div");
  return this.element;
}

// mount() - Inject into DOM (runs after create, before wire)
public mount(): void {
  this.ctl.DOM.parent?.append(this.element);
}

// wire() - Attach listeners (runs after readyState > 0)
public wire(): void {
  this.element.addEventListener("click", this.handler, { signal: this.signal });
}
```

**Inherited Utility Methods:**

```typescript
// From BaseComponent
this.getIcon("play"); // Get SVG icon
this.hide(); // Add hidden class
this.show(); // Remove hidden class
this.disable(); // Add disabled class
this.enable(); // Remove disabled class
this.setBaseARIA(); // Set aria-label and aria-keyshortcuts
```

**Config Get with Transform:**

```typescript
// Transform config value on get
const timePlug = this.ctl.getPlug<TimePlug>("time");
if (timePlug) {
  this.config.get("value", timePlug.toTimeVal, { signal: this.signal });
  // Now config.value is always transformed through toTimeVal
}
```

## Registration & Export

### Plug Registration

**In `src/ts/plugs/index.ts`:**

```typescript
export { PlugNamePlug } from "./plugname";
// Types exported for build.d.ts
export type { PlugName, PlugNameState } from "./plugname";

// Register in PlugRegistry (in same file)
PlugRegistry.register(PlugNamePlug);
```

### Component Registration

**In `src/ts/components/index.ts`:**

```typescript
export { ComponentName } from "./componentname";
export type { ComponentNameConfig, ComponentNameState } from "./componentname";

// Register in ComponentRegistry (in same file)
ComponentRegistry.register(ComponentName);
```

### Type Exports for build.d.ts

**All config types must be importable:**

```typescript
// In build.d.ts or types file
import type { PlugName, PlugNameState } from "../plugs";
import type { ComponentNameConfig } from "../components";

interface Settings {
  plugName: PlugName; // Imported, not inline
  componentName: ComponentNameConfig;
}
```

## Validation Checklist

Before submitting plug/component:

- [ ] Type exported at top of file
- [ ] Static `plugName`/`componentName` matches filename
- [ ] Static `isCore`/`isControl` set correctly
- [ ] All listeners have `{ signal: this.signal }`
- [ ] Settings/state listeners have `immediate: true`
- [ ] `onDestroy` calls `super.onDestroy()` FIRST
- [ ] No manual property nulling in destroy (nuke() handles it)
- [ ] Event handlers use arrow functions
- [ ] No comments explaining the code
- [ ] Adjacent consts combined with commas
- [ ] Payload data used directly (no extracting to const unless 3+ uses)
- [ ] Imported from utils without `tmg.` prefix
- [ ] Registered in index.ts
- [ ] Type exported for build.d.ts
- [ ] Run `get_errors` tool after changes

## Essential Reading Order

For new features or major changes:

1. **PATTERNS.md** (architecture rules, code style)
2. **UTILS_MAP.md** (JS→TS function mappings)
3. **PHILOSOPHY.md** (SIA mental model)
4. **SPEC.md** (current implementation specs)
5. **Relevant JS prototype code** (line-by-line)

Update these docs immediately when patterns emerge or rules clarify.
