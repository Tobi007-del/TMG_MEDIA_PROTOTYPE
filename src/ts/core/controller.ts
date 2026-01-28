import type { RuntimeState } from "./runtime";
import type { VideoBuild } from "../types/build";
import type { MediaIntent, MediaState, MediaStatus, MediaSettings } from "../types/contract";
import { reactified, type Reactified, bindMethods } from "../mixins";
import { TechRegistry, PlugRegistry } from "./registry";
import { TechConstructor, BaseTech, HTML5Tech } from "../media";
import { type BasePlug as Plug } from "../plugs";
import { clamp, cloneMedia, getMediaReport, isSameURL, observeIntersection, observeResize, queryFullscreen } from "../utils";

// --- CONTROLLER (The Orchestrator) ---
export class Controller {
  // --- CORE SYSTEM ---
  public readonly id: string;
  public plugs = new Map<string, Plug>();
  private aborter = new AbortController();
  public get signal() {
    return this.aborter.signal;
  }
  // --- MEMORY ---
  public buildCache: VideoBuild;
  public config: Reactified<VideoBuild>;
  public media: {
    element: HTMLVideoElement;
    intent: Reactified<MediaIntent>;
    state: Reactified<MediaState>;
    status: Reactified<MediaStatus>;
    settings: Reactified<MediaSettings>;
  };
  // --- RUNTIME (Global Controller States) ---
  public runtime: Reactified<RuntimeState>;
  // --- ENGINE ---
  public tech!: BaseTech;
  private techClass: TechConstructor | null = null;
  // DOM References (Utilized by Core Plugs)
  public videoContainer: HTMLElement = null as any; // core plugs will see to their creation
  public pseudoVideo: HTMLVideoElement = null as any;
  public pseudoVideoContainer: HTMLElement = null as any;
  // --- UTILS CACHE ---
  private throttleMap = new Map<string, any>();
  private rafLoopMap = new Map<string, number>();
  private rafLoopFnMap = new Map<string, Function>();
  // --- FLAGS (Essential Only) ---
  public mutatingDOMM = true; // Critical for Player wrapper to know when swapping modes

  constructor(medium: HTMLVideoElement, build: VideoBuild) {
    this.setReadyState(0, medium);
    this.id = build.id;
    this.buildCache = { ...build };
    this.bindMethods();
    this.runtime = reactified<RuntimeState>({
      readyState: 0,
      audioContextReady: false,
      mediaIntersecting: true,
      mediaParentIntersecting: true,
      dimensions: {
        container: { width: 0, height: 0, tier: "x" },
        pseudoContainer: { width: 0, height: 0, tier: "x" },
        window: { width: window.innerWidth, height: window.innerHeight },
      },
      screenOrientation: window.screen.orientation,
      docVisibilityState: document.visibilityState,
      docInFullscreen: queryFullscreen(),
    });
    const defaults = getMediaReport(medium); // returns defaults and initials
    this.media = {
      element: medium,
      intent: reactified({ ...defaults.intent }, { rejectable: true }),
      state: reactified({ ...defaults.state }),
      status: reactified({ ...defaults.status }),
      settings: reactified({ ...defaults.settings }),
    };
    this.config = reactified({ ...build });
    this.boot(build.src || medium.currentSrc || medium.src);
  }

  private boot(src: string) {
    this.connectPlugs();
    this.loadTech(src);
    this.plugRuntime();
    // Object.keys(this.config).forEach((key) => this.config[key] = this.config[key]);
    setTimeout(() => (this.mutatingDOMM = false));
  }

  private connectPlugs() {
    PlugRegistry.getOrdered().forEach((PlugClass) => {
      const key = PlugClass.plugName;
      if (this.config.exclusions.includes(key)) return this.log(`Plug '${key}' excluded by config.`, "warn");
      let config = (this.config as any)[key] || (this.config.settings as any)[key];
      if (!config && PlugClass.isCore) config = {}; // Core plugs get auto config
      if (!config) return;
      try {
        const plug = new PlugClass(config || {});
        plug.setup(this);
        this.plugs.set(key, plug);
      } catch (err) {
        this.log(`Failed to connect plug '${key}': ${err}`, "error");
      }
    });
  }

  private loadTech(src: string = "") {
    !this.runtime.readyState && this.media.intent.on("src", ({ target: { value } }) => this.loadTech(value), true);
    const NewClass = TechRegistry.pick(src) || HTML5Tech;
    if (isSameURL(src, this.media.state.src) || (this.tech && NewClass === this.techClass)) return;
    if (this.tech) (this.log(`Switching tech from '${this.tech.name}' -> '${NewClass.name}'`, "log"), this.tech.destroy());
    this.techClass = NewClass;
    this.tech = new NewClass({ element: this.media.element });
    this.tech.wire(this);
    this.tech.mount();
  }

  private plugRuntime() {
    const cleanups = [] as Function[];
    cleanups.push(observeIntersection(this.videoContainer.parentElement!, (entry) => (this.runtime.mediaParentIntersecting = entry.isIntersecting)));
    cleanups.push(observeIntersection(this.videoContainer, (entry) => (this.runtime.mediaIntersecting = entry.isIntersecting)));
    cleanups.push(observeResize(this.videoContainer, () => (this.runtime.dimensions.container = this.getSizeTier(this.videoContainer))));
    cleanups.push(observeResize(this.pseudoVideoContainer, () => (this.runtime.dimensions.pseudoContainer = this.getSizeTier(this.pseudoVideoContainer))));
    this.signal.addEventListener("abort", () => cleanups.forEach((cb) => cb()));
  }

  public get payload() {
    const readyState = this.runtime?.readyState ?? 0;
    return { readyState, initialized: readyState > 0, destroyed: readyState < 0, Controller: this };
  }

  public setReadyState(state?: number, medium?: HTMLVideoElement) {
    const readyState = !this.runtime ? 0 : clamp(0, state ?? this.runtime.readyState + 1, 3);
    if (this.runtime) this.runtime.readyState = readyState;
    this.fire("tmgreadystatechange", this.payload, medium);
  }

  get toast() {
    if (this.config.settings.toasts.disabled) return null;
    return window.t007.toaster?.({ idPrefix: this.id, rootElement: this.videoContainer, ...this.config.settings.toasts });
  }

  public log(mssg: any, type?: "error" | "warn" | "log", action?: "swallow") {
    if (!this.config.debug) return;
    switch (type) {
      case "error":
        return action === "swallow" ? console.warn(`[TMG Controller] swallowed an error:`, mssg) : console.error(`[TMG Controller] error:`, mssg);
      case "warn":
        return console.warn(`[TMG Controller] warning:`, mssg);
      default:
        return console.log(`[TMG Controller] log:`, mssg);
    }
  }

  public fire = (eN: string, detail: any = null, el: HTMLElement | EventTarget = this.media.element, bubbles = true, cancelable = true) => eN && el?.dispatchEvent(new CustomEvent(eN, { detail, bubbles, cancelable }));

  private bindMethods() {
    bindMethods(this, (method: string) => {
      const fn = (this as any)[method].bind(this);
      (this as any)[method] = (...args: any[]) => {
        const onError = (e: any) => {
          this.log?.(e, "error", "swallow");
          if (method !== "togglePlay") this.toast?.("Something went wrong", { tag: "tmg-stwr" });
        };
        try {
          const result = fn(...args);
          return result instanceof Promise ? result.catch(onError) : result;
        } catch (e) {
          onError(e);
        }
      };
    });
  }

  public throttle(key: string, fn: Function, delay = 30, strict = true) {
    if (strict) {
      const now = performance.now();
      if (now - ((this.throttleMap.get(key) as number) ?? 0) < delay) return;
      return (this.throttleMap.set(key, now), fn());
    }
    if (this.throttleMap.has(key)) return;
    const id = setTimeout(() => this.throttleMap.delete(key), delay); // uses timeout so code runs when sync thread is free
    return (this.throttleMap.set(key, id), fn());
  }

  public RAFLoop(key: string, fn: Function) {
    this.rafLoopFnMap.set(key, fn);
    const loop = () => (this.rafLoopFnMap.get(key)?.(), this.rafLoopMap.set(key, requestAnimationFrame(loop)));
    !this.rafLoopMap.has(key) && this.rafLoopMap.set(key, requestAnimationFrame(loop));
  }

  public cancelRAFLoop = (key: string) => (cancelAnimationFrame(this.rafLoopMap.get(key)!), this.rafLoopFnMap.delete(key), this.rafLoopMap.delete(key));

  public cancelAllLoops = () => Array.from(this.rafLoopMap.keys()).forEach(this.cancelRAFLoop);

  private getSizeTier(container: HTMLElement) {
    const { offsetWidth: w, offsetHeight: h } = container;
    return { width: w, height: h, tier: h <= 130 ? "xxxxx" : w <= 280 ? "xxxx" : w <= 380 ? "xxx" : w <= 480 ? "xx" : w <= 630 ? "x" : "" };
  }

  public destroy() {
    this.setReadyState(-1);
    this.cancelAllLoops();
    this.aborter.abort();
    [...this.plugs.values()].reverse().forEach((p) => p.dispose());
    this.tech.destroy();
    return (this.media.element = this.config.cloneOnDetach ? cloneMedia(this.media.element) : this.media.element);
  }
}
