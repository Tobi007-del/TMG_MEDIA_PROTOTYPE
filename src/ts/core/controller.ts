import { AUDIO_CONTEXT, type RuntimeState } from "../tools/runtime";
import type { VideoBuild } from "../types/build";
import type { CtlrMedia } from "../types/contract";
import type { Volatile } from "../types/reactor";
import { reactive, type Reactive, guardAllMethods, guardMethod, nuke, inert, intent, state, volatile } from "../tools/mixins";
import { TechRegistry, PlugRegistry } from "./registry";
import { TechConstructor, BaseTech, HTML5Tech } from "../media";
import { PlugConstructor, ToastsPlug, type BasePlug as Plug } from "../plugs";
import { setTimeout, requestAnimationFrame, getWindow, clamp, uncamelize, cloneMedia, getMediaReport, isSameURL, isSameSources, observeIntersection, observeResize, queryFullscreen, getSizeTier, createEl } from "../utils";

interface LifePayload {
  readyState: number;
  initialized: boolean;
  destroyed: boolean;
  instance: Controller;
}

// --- CONTROLLER (The Orchestrator) ---
export class Controller {
  // --- CORE SYSTEM ---
  public readonly id: string;
  public plugs = new Map<string, Plug>();
  public getPlug<T extends Plug = Plug>(name: string): T | undefined {
    return this.plugs.get(name) as T | undefined;
  }
  private ac = new AbortController();
  public readonly signal = this.ac.signal;
  // --- RUNTIME (Global Controller States) ---
  public config: Reactive<Volatile<VideoBuild>>;
  public state: Reactive<RuntimeState> & Record<string, any>; // runtime state and states to be populated for easy reach
  public media: Reactive<CtlrMedia>;
  public settings!: VideoBuild["settings"]; // for easy reach, better devx
  // --- MEMORY ---
  public buildCache: VideoBuild;
  private _payload: LifePayload = { instance: this } as any; // must use getter for payload
  // DOM References (Utilized by Plugs)
  public pseudoVideo: HTMLVideoElement = createEl("video");
  public videoContainer: HTMLElement = createEl("div");
  public pseudoVideoContainer: HTMLElement = createEl("div");
  public DOM: Record<string, HTMLElement | null> = {}; // To be populated with common elements for easy reach
  // --- UTILS CACHE ---
  private throttleMap = new Map<string, any>();
  private rafLoopMap = new Map<string, number>();
  private rafLoopFnMap = new Map<string, Function>();
  protected clups: (() => void)[] = [];
  // --- FLAGS (Essential Only) ---
  public mutatingDOMM = true; // Critical for Player wrapper to know when swapping modes

  constructor(medium: HTMLVideoElement, build: VideoBuild) {
    this.setReadyState(0, medium);
    guardAllMethods(this, this.guard, true);
    this.id = build.id;
    this.config = reactive(volatile(build)); // `referenceTracking: false` so clone before reassigning objects already in state
    this.state = reactive<RuntimeState>({
      readyState: 0,
      audioContextReady: !!AUDIO_CONTEXT,
      mediaIntersecting: true,
      mediaParentIntersecting: true,
      dimensions: { container: { width: 0, height: 0, tier: "x" }, pseudoContainer: { width: 0, height: 0, tier: "x" }, window: { width: window.innerWidth, height: window.innerHeight } },
      screenOrientation: window.screen.orientation,
      docVisibilityState: document.visibilityState,
      docInFullscreen: queryFullscreen(),
    });
    const defs = getMediaReport(medium); // returns defaults and initials
    this.media = reactive<CtlrMedia>({
      tech: inert({} as BaseTech), // dummy tech to be replaced on boot
      element: inert(medium),
      intent: volatile(intent(defs.intent)),
      state: state(defs.state),
      status: state(defs.status),
      settings: state(defs.settings),
    });
    this.config.watch("settings", (value) => (this.settings = value), { immediate: true, signal: this.signal }); // COMPUTED: settings can lose reference
    this.buildCache = this.config.snapshot();
    this.media.set("tech", (t) => inert(t!), { signal: this.signal });
    this.boot();
  }

  private boot() {
    this.connectPlugs();
    this.wireTechOverseer();
    this.wireRuntimeState();
    this.setReadyState(); // boot complete
    if (!this.media.state.paused) this.setReadyState();
    else this.media.wonce("state.paused", () => this.setReadyState(), { signal: this.signal }); // first play
    setTimeout(() => (this.mutatingDOMM = false), 0, this.signal);
  }

  private connectPlugs() {
    for (const PlugClass of PlugRegistry.getOrdered()) {
      const key = PlugClass.plugName;
      this.plugin(PlugClass, key in this.config ? (this.config as any)[key] : (this.config.settings as any)[key]);
    }
  }
  public plugin(PlugClass: PlugConstructor, config?: any): void {
    if (this.config.noPlugList.includes(PlugClass.plugName) && !PlugClass.isCore) return; // Core plugs are mandatory
    this.getPlug(PlugClass.plugName)?.destroy();
    const plug = new PlugClass(this, config);
    this.plugs.set(PlugClass.plugName, (plug.setup(), plug));
  }

  protected wireTechOverseer() {
    const opts = { capture: true, signal: this.signal };
    // Media Listeners
    this.media.on("intent.src", () => this.overseeTech(), { ...opts, immediate: true }); // load initial
    this.media.on("intent.sources", () => this.overseeTech(), opts);
    this.media.on("state.src", () => this.overseeTech("state"), opts); // just in case
    this.media.on("state.sources", () => this.overseeTech("intent"), opts); // just in case
    this.media.on("settings.srcObject", () => this.overseeTech(), opts);
  }
  protected overseeTech(pref: "state" | "intent" = "intent") {
    const { src: prefSrc, sources: prefSources } = pref === "intent" ? this.media.intent : this.media.state,
      { src: altSrc, sources: altSources } = pref === "intent" ? this.media.state : this.media.intent;
    if (this.media.settings.srcObject) return this.switchTech(HTML5Tech);
    let selectedTech: TechConstructor | null = null,
      selectedSource: string | null = null;
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
    if (selectedSource !== prefSrc && !this.media.tech.features.sources) this.media.intent.src = selectedSource!; // since tech can't handle sources
  }
  public switchTech(TechClass: TechConstructor, config = this.media): void {
    if (this.media.tech && TechClass === this.media.tech.constructor) return;
    if (this.media.tech) (this.media.tech.destroy(), this.log(`Switching tech from '${this.media.tech.name}' -> '${TechClass.name}'`));
    (this.media.tech = new TechClass(this, config)).setup();
  }

  private wireRuntimeState() {
    this.clups.push(observeIntersection(this.videoContainer.parentElement!, (entry) => (this.state.mediaParentIntersecting = entry.isIntersecting)));
    this.clups.push(observeIntersection(this.videoContainer, (entry) => (this.state.mediaIntersecting = entry.isIntersecting)));
    this.clups.push(observeResize(this.videoContainer, () => (this.state.dimensions.container = getSizeTier(this.videoContainer))));
    this.clups.push(observeResize(this.pseudoVideoContainer, () => (this.state.dimensions.pseudoContainer = getSizeTier(this.pseudoVideoContainer))));
  }

  public get payload() {
    const readyState = this.state?.readyState ?? 0;
    ((this._payload.readyState = readyState), (this._payload.initialized = readyState > 0), (this._payload.destroyed = readyState < 0));
    return this._payload;
  }
  public setReadyState(state?: number, medium?: HTMLVideoElement) {
    const readyState = !this.state ? 0 : clamp(0, state ?? this.state.readyState + 1, 3);
    if (this.state) this.state.readyState = readyState;
    this.fire("tmgreadystatechange", this.payload, medium);
  }

  public guard = <T extends Function>(fn: T, { silent = false } = {}) => {
    return guardMethod(fn, (e) => (this.log(e, "error", "swallow"), !silent && this.getPlug<ToastsPlug>("toasts")?.toast?.("Something went wrong", { tag: "tmg-stwr" })));
  }; // ()=>{}: needs to be bounded even before initialization
  public log(mssg: any, type: "error" | "warn" | "log" = "log", action?: "swallow") {
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
  public fire(eN: string, detail: any = null, el: HTMLElement | EventTarget = this.media.element, bubbles = true, cancelable = true) {
    eN && el?.dispatchEvent(new CustomEvent(eN, { detail, bubbles, cancelable }));
  }

  public throttle(key: string, fn: Function, delay = 30, strict = true) {
    if (strict) {
      const now = performance.now();
      if (now - (this.throttleMap.get(key) ?? 0) < delay) return;
      return (this.throttleMap.set(key, now), fn());
    }
    if (this.throttleMap.has(key)) return;
    const id = setTimeout(() => this.throttleMap.delete(key), delay, this.signal, getWindow(this.videoContainer)); // uses timeout so code runs when sync thread is free
    return (this.throttleMap.set(key, id), fn());
  }
  public RAFLoop(key: string, fn: Function) {
    this.rafLoopFnMap.set(key, fn);
    const loop = () => (this.rafLoopFnMap.get(key)?.(), this.rafLoopMap.set(key, requestAnimationFrame(loop, this.signal, getWindow(this.videoContainer))));
    !this.rafLoopMap.has(key) && this.rafLoopMap.set(key, requestAnimationFrame(loop, this.signal, getWindow(this.videoContainer)));
  }
  public cancelRAFLoop(key: string) {
    (getWindow(this.videoContainer)?.cancelAnimationFrame(this.rafLoopMap.get(key)!), this.rafLoopFnMap.delete(key), this.rafLoopMap.delete(key));
  }
  public cancelAllLoops = (): void => this.rafLoopMap.keys().forEach(this.cancelRAFLoop);

  public queryDOM<K extends keyof HTMLElementTagNameMap>(query: K, all: true, isPseudo?: boolean): NodeListOf<HTMLElementTagNameMap[K]>;
  public queryDOM<K extends keyof SVGElementTagNameMap>(query: K, all: true, isPseudo?: boolean): NodeListOf<SVGElementTagNameMap[K]>;
  public queryDOM<E extends Element = HTMLElement>(query: string, all: true, isPseudo?: boolean): NodeListOf<E>;
  public queryDOM<K extends keyof HTMLElementTagNameMap>(query: K, all?: false, isPseudo?: boolean): HTMLElementTagNameMap[K] | null;
  public queryDOM<K extends keyof SVGElementTagNameMap>(query: K, all?: false, isPseudo?: boolean): SVGElementTagNameMap[K] | null;
  public queryDOM<E extends Element = HTMLElement>(query: string, all?: false, isPseudo?: boolean): E | null;
  public queryDOM(query: string, all = false, isPseudo = false) {
    const container = isPseudo ? this.pseudoVideoContainer : this.videoContainer;
    return all ? container.querySelectorAll(query) : container.querySelector(query);
  }
  setImgLoadState<T extends { target: HTMLImageElement }>({ target: img }: T): void {
    img?.setAttribute("data-loaded", String(img.complete && img.naturalWidth > 0));
  }
  setImgFallback<T extends { target: HTMLImageElement }>({ target: img }: T): void {
    img.src = window.TMG_VIDEO_ALT_IMG_SRC;
  }
  setCanvasFallback(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, img?: HTMLImageElement): void {
    img = canvas && createEl("img", { src: window.TMG_VIDEO_ALT_IMG_SRC, onload: () => context?.drawImage(img!, 0, 0, canvas.width, canvas.height) });
  }
  public isUIActive(mode: string, el = this.videoContainer): boolean {
    if (mode === "settings") mode = "settings-view";
    return el.classList.contains(`tmg-video-${uncamelize(mode, "-")}`);
  }

  public destroy() {
    this.mutatingDOMM = true; // destruction will mutate, flag external watchers
    this.setReadyState(-1);
    this.cancelAllLoops();
    this.ac.abort("[TMG Controller] Instance is being destroyed");
    this.clups.forEach((cleanup) => cleanup());
    [...this.plugs.values()].reverse().forEach((p) => p.destroy());
    this.media.tech.destroy();
    (this.plugs.clear(), this.throttleMap.clear(), this.rafLoopMap.clear(), this.rafLoopFnMap.clear());
    (this.media.destroy(), this.state.destroy(), this.config.destroy());
    const el = this.config.cloneOnDetach ? cloneMedia(this.media.element) : this.media.element;
    return (nuke(this), el);
  }
}
