# sia-reactor

> The Programmable Data DOM. A high-performance State & Intent Architecture (S.I.A.) Engine featuring zero-allocation loops, DOM-style event propagation, microtask batching, and structural sharing.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/sia-reactor.svg)](https://www.npmjs.com/package/sia-reactor)

[Live Demo & Benchmarks](https://tobi007-del.github.io/t007-tools/packages/sia-reactor/src/index.html) | [Report Bug](https://github.com/Tobi007-del/t007-tools/issues)

[CHRONICLES](https://github.com/Tobi007-del/tmg-media-player/blob/main/CHRONICLES.md) | [FOLKLORE](https://github.com/Tobi007-del/tmg-media-player/blob/main/FOLKLORE.md)

---

## Table of contents

- [sia-reactor](#sia-reactor)
  - [Table of contents](#table-of-contents)
  - [Overview: The Paradigm Shift](#overview-the-paradigm-shift)
  - [The Philosophy: Collecting Like Terms](#the-philosophy-collecting-like-terms)
  - [State vs. Intent](#state-vs-intent)
  - [The Art of Resolution: The Power Line](#the-art-of-resolution-the-power-line)
  - [The Triad of Notifications](#the-triad-of-notifications)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [API Reference](#api-reference)
  - [Inspirations](#inspirations)
  - [Benchmarks](#benchmarks)
  - [Author](#author)
  - [Acknowledgments](#acknowledgments)
  - [Star History](#star-history)

---

## Overview: The Paradigm Shift

**sia-reactor** is not just another state management library. It is an architectural paradigm shift. 

Instead of treating your application's data as a flat object, the S.I.A. Engine converts your data into a **Programmable Data DOM**. Deeply nested object properties now possess the exact same lifecycle as HTML elements: they support strict event phases (Capture, Target, Bubble), they can intercept intents before memory is written, and they batch mutations synchronously to guarantee 60FPS UI renders.

Built for engineer surgeons, this engine allows you to wire up massive, deeply nested UIs with zero-allocation performance.

---

## The Philosophy: Collecting Like Terms

Most developers build systems that are entirely too rigid. They create Adapters, Contexts, and Request Managers just to make two different entities behave the same way. 

> Picture a room with air conditioners. When the entity inside gets hot, the AC should turn on.
> A standard developer sees a human in the room and writes: *"When human sweats, AC on."*
> Then, the human is replaced by a pig. Pigs don't sweat. Now the developer has to build an entire adapter layer just to simulate fake sweat so the AC will trigger.

**The S.I.A. approach is declarative state pluralism.** We do not care *why* or *how* the entity gets hot. We establish a stable core and collect like terms: **"If entity is hot, turn AC on."** The adapter simply gives the entity a state (`hot = false`). When the entity gets hot, it flips the state to `true`. We just listen.

---

## State vs. Intent

We divide the world into two concepts to completely eliminate the need for bloated class methods (`makeNervous()`, `straightenNose()`).

1. **State (Fact):** The current reality of the system. It can only be determined *after* something happens. The UI is a mirror reflecting this state.
2. **Intent (Request/Wish):** A request to change reality. 

Instead of learning complex APIs to trigger actions, you simply declare your intent:
`pig.intent.hot = true` (The Request) 
↳ *The system internally evaluates* ↳ `pig.state.hot = true` (The Fact).

This brings the "appeal" directly into the state tree. 

---

### Semantic Structuring: Plain State vs. Intentful State

You are not forced to use Intents. If you are building a simple application where data updates are immediate and undisputed, the S.I.A. engine functions perfectly as a hyper-fast, standard state manager. You can strictly use plain state and ignore the complexities of the rejection event loop.

However, the moment you introduce Intents into your architecture, **semantics matter**. 

> If you use an `intent` object to capture user requests, your `state` object must act strictly as the factual mirror to that `intent`. Because `state` is now semantically locked to your intents, you must separate your other data. 

Do not pollute your `state` object with data that doesn't require an intent. Instead, categorize them semantically:
- **`intent`**: For asynchronous requests or delayed validations (e.g., `intent.playing = true`).
- **`state`**: The factual mirror of granted intents (e.g., `state.playing = true`).
- **`settings` / `config`**: For immediate, undisputed user preferences (e.g., `settings.playbackRate = 2`).
- **`status`**: For read-only system facts (e.g., `status.network = "offline"`).

```javascript
import { reactive, intent } from 'sia-reactor';

// A perfectly structured S.I.A. Data DOM
const player = reactive({
  intent: intent({ playing: false, fullscreen: false }), // Can be rejected
  state: { playing: false, fullscreen: false },          // The factual mirror
  settings: { volume: 50, theme: "dark" },               // Immediate, plain state
  status: { buffering: false, duration: 120 }            // System facts
});
```

---

## The Art of Resolution: The Power Line

Because an **Intent** is just a wish, the system must be able to reject it. This introduces a political hierarchy; a Chain of Responsibility driven by the Event Loop.

### The Parable of the King
Imagine a King wishes to fly: `man.intent.flying = true`.
You cannot stop him from wishing it. But the system can determine if it will grant the wish. 

Everything crucial happens in the **Capture Phase**:
1. **The Higher Power:** A plugin that registers first. It intercepts the wish and can choose to `resolve(message)` or `reject(reason)`.
2. **The Adviser (The Tech):** Listens further down the capture line. If it sees `e.resolved`, it stands down. If it sees `e.rejected`, it knows the Higher Power failed and can attempt to save the situation or allow the failure.
3. **The Observers (The UI):** Listens on the **Bubble Phase**. They don't get involved in politics; they just watch the aftermath.

#### The Observer Types
- **The Smart Optimist (Court Man):** Checks if the intent was rejected before updating the UI.
- **The Reckless Optimist (Artist):** Doesn't care about rejections and paints the wish immediately, trusting the system will snap back later if needed.

---

## The Triad of Notifications

This architecture replaces the chaos of traditional state management with three distinct layers of surgical precision.

### 1. The Gatekeepers (Mediators) - `get`, `set`, `delete`
Synchronous operations that occur *before* or *during* a state change. 
- Use `.set()` for data integrity and sanitization. You can intercept a value, modify it, or completely block the memory write by returning the `TERMINATOR` symbol.
- Use `.get()` to format or derive output on the fly without altering the underlying data.

### 2. The Rule of Survival (Watchers) - `watch`
Synchronous operations that occur *immediately after* a state change.
- Use `.watch()` when the very next line of code will crash if a system isn't updated instantly (e.g., `video.src`, internal engine states). This bypasses the async event loop for immediate execution.

### 3. The Rule of the Cloud (Listeners) - `on`
Asynchronous operations that run in the next microtask.
- Use `.on()` for **all UI updates** (e.g., `volume`, `brightness`). The reactor will automatically smash 1,000 synchronous mutations into a single `queueMicrotask` UI render tick. 

---

## Tech Stack

### Built with
- ECMAScript 2015+ Proxy API
- `queueMicrotask` Async Batching
- Bitwise Operations & Zero-Allocation Caching
- Bundled via `tsup` (ESM, CJS, IIFE outputs)

---

## Getting Started

### Installation

Install via your preferred package manager:

```bash
npm install sia-reactor
# or
yarn add sia-reactor
# or
pnpm add sia-reactor
```

```javascript
// 1. Core Engine
import { reactive, Reactor, TERMINATOR } from 'sia-reactor';

// 2. Deep Object Utilities
import { setAny, getAny, mergeObjs } from 'sia-reactor/utils';
```

---

## Usage

### Modern Bundlers (ESM)

```javascript
import { reactive, Reactor } from 'sia-reactor'; // also attached to window.sia in non-module scripts
```

### CDN / Browser (Global)

```javascript
const { reactive, Reactor } = window.sia;
```

## API Reference

### Initialization (`reactive` & `Reactor`)

The primary way to use the engine is to wrap an object using `reactive()`, which directly mixes the reactor methods into your target object for a pristine, flat API.

```javascript
const state = reactive({ player: { volume: 50 } });

// Methods are attached directly to the object!
state.set("player.volume", (val) => Math.min(val, 100));
state.on("player.volume", (e) => console.log(e.value));

state.player.volume = 150; // Triggers mediation, clamps to 100, fires listener.
```

Alternatively, you can instantiate the `Reactor` class directly to keep the API separate from your data:
```javascript
const engine = new Reactor({ player: { volume: 50 } }, { debug: true, referenceTracking: true });
engine.core.player.volume = 100;
```

### Memory & Granular Control Flags

You can wrap properties in special flags *before* initializing the reactor to dictate exactly how the Proxy treats them.

- **`inert(obj)` / `live(obj)`**: Tells the proxy to completely ignore an object. It will not be deeply tracked.
- **`intent(obj)` / `state(obj)`**: Marks an object as rejectable. Allows listeners to call `e.reject()` during the Capture phase.
- **`volatile(obj)` / `stable(obj)`**: Forces the engine to fire event waves even if the new value is identical to the old value (bypassing the Proxy's unchanged performance check).

```javascript
import { reactive, intent, volatile, inert } from 'sia-reactor';

const data = reactive({
  apiResponse: inert({ heavy: "data" }), // Proxy won't traverse this
  userWish: intent({ flying: false }),  // Can be rejected by a Higher Power
  trigger: volatile({ clickCount: 0 })  // Fires events even if set to 0 again
});
```

### Core Methods

All methods are available on `Reactor` instances or objects wrapped in `reactive()`.

#### **Mediators (Synchronous Gatekeepers)**
- **`set(path, callback, options)`**: Intercept memory writes. Return a value to modify it, or return `TERMINATOR` to block the write entirely.
- **`get(path, callback, options)`**: Intercept and format data during retrieval.
- **`delete(path, callback, options)`**: Intercept property deletion.

#### **Watchers (Synchronous Observers)**
- **`watch(path, callback, options)`**: Fires instantly after a mutation. Use strictly for critical internal engine syncing.

#### **Listeners (Asynchronous/Batched UI Observers)**
- **`on(path, callback, options)`**: Attach DOM-style event listeners. Supports `{ capture: true, depth: 1, once: true, immediate: true }`.
- **`once(path, callback, options)`**: Fires once and self-destructs.
- **`off(path, callback, options)`**: Removes a listener.

#### **Lifecycle & Utilities**
- **`tick(path)`**: Forces a synchronous flush of the batch queue for a specific path.
- **`stall(task)` / `nostall(task)`**: Manually stall the queue to wait for calculations before rendering.
- **`cascade(payload)`**: Manually trigger deep-object event waves, bypassing strict unchanged-proxy traps. Perfect for dumping massive API payloads into the tree.
- **`snapshot(raw)`**: Generates a strict, structurally-shared, un-proxied clone of the current state tree.

---

## Inspirations

S.I.A. Reactor synthesizes core concepts from the heavyweights of web and media engineering into a single, zero-allocation engine:

* **Video.js (VJS):** The philosophy of "Intent vs. State" MEDIATION, ensuring UI actions only commit when the underlying engine allows it.
* **The Browser DOM:** Treating a raw JSON state tree like HTML nodes, complete with deep, path-based event bubbling.
* **The JavaScript Event Loop:** Utilizing `queueMicrotask` to batch thousands of synchronous state mutations into a single, noiseless render tick.
* **Vue & MobX:** Leveraging native ES6 Proxies for instant, deep reactivity without forcing clunky `get()` or `set()` wrapper functions.
 
---

## Benchmarks

No fancy screenshots here. True engineers look at performance metrics.

To see the S.I.A Engine handle deep DAG mutations, DOM-style event routing, and microtask batching in real-time, visit the **[Live Demo](https://tobi007-del.github.io/t007-tools/packages/sia-reactor/src/index.html)**, open your DevTools console, and run the built-in Grand Master Stress Suite directly on your own CPU.

---

## Author

- Architect & Developer - [Oketade Oluwatobiloba (Tobi007-del)](https://github.com/Tobi007-del)
- Project - [t007-tools](https://github.com/Tobi007-del/t007-tools)

Ah, my bad bro! You want it punchy and straight to the point. I got you. Let's strip away the essays and just hit them with the heavy one-liners. 

Copy and paste this clean, stripped-down version into your README:

## Acknowledgments

Designed to bring absolute architectural dominance and rendering efficiency to complex front-end systems. The foundational data layer of the `@t007` ecosystem.

## Star History

If you find this project useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Tobi007-del/t007-tools&type=Date)](https://github.com/Tobi007-del/t007-tools)

**[⬆ Back to Top](#sia-reactor)**