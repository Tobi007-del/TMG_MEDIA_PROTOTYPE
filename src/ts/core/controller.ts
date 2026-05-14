import type { CtlrConfig } from "../types/config";
import type { CtlrMedia } from "../types/contract";
import { TechRegistry, PlugRegistry } from "./registry";
import { STATE_BUILD, type CtlrState } from "../tools/runtime";
import { TechConstructor, HTML5Tech } from "../techs";
import { PlugConstructor, ToastsPlug, type BasePlug as Plug } from "../plugs";
import { guardAllMethods, guardMethod, setTimeout, getWindow, clamp, uncamelize, cloneMedia, getMediaReport, isSameURL, isSameSources, observeIntersection, observeResize, getSizeTier, createEl, throttle, cancelRAFLoop, RAFLoop, rafLoopMap } from "../utils";
import { type Volatile, reactive, type Reactive, inert, intent, state, volatile } from "sia-reactor";
import { nuke } from "sia-reactor/utils";

// --- CONTROLLER (The Orchestrator) ---
export class Controller {
  // --- CORE SYSTEM ---
  public readonly id: string;
  public plugs = new Map<string, Plug>();
  private ac = new AbortController();
  public readonly signal = this.ac.signal;
  // --- RUNTIME (Global Controller States) ---
  public config: Reactive<Volatile<CtlrConfig>>;
  public state: Reactive<CtlrState> & Record<string, any>; // runtime state and states to be populated for easy reach
  public media: Reactive<CtlrMedia>;
  public settings!: CtlrConfig["settings"]; // for easy reach, better devx
  // --- MEMORY ---
  public _build: CtlrConfig; // Build Cache
  private _payload: { readyState: number; initialized: boolean; destroyed: boolean; instance: Controller } = { instance: this } as any; // must use getter for payload
  // DOM References (Utilized by Plugs)
  public DOM: Record<string, HTMLElement | null> = {}; // To be populated with common elements for easy reach
  // --- FLAGS (Essential Only) ---
  public mutatingDOMM = true; // Critical for Player wrapper to know when swapping modes

  constructor(medium: HTMLMediaElement, build: CtlrConfig) {
    this.setReadyState(0, medium);
    guardAllMethods(this, this.guard);
    this.id = build.id;
    this.config = reactive(volatile(build)); // `lineageTracing: false` so clone before reassigning "already in state" objects
    this.state = reactive<CtlrState>(STATE_BUILD);
    const defs = getMediaReport(medium); // returns defaults and initials
    this.media = reactive({ intent: volatile(intent(defs.intent)), state: state(defs.state), status: state(defs.status), settings: state(defs.settings), tech: inert({}), type: build.mediaType, element: inert(medium), pseudoElement: inert(createEl(build.mediaType)), container: inert(createEl("div")), pseudoContainer: inert(createEl("div")) }) as any;
    this.media.set("tech", (t) => inert(t!), { signal: this.signal });
    this.config.watch("settings", (v) => (this.settings = v), { immediate: true, signal: this.signal }); // COMPUTED: settings can lose reference
    this._build = this.config.snapshot(); // clone initial config for resets and fast subsequent cloning
    this.boot();
  }

  private boot(): void {
    this.connectPlugs(), this.wireTechHandler(), this.wireStateHandler();
    this.setReadyState(); // boot complete
    !this.media.state.paused ? this.setReadyState() : this.media.wonce("state.paused", () => this.setReadyState(), { signal: this.signal }); // first play(ed)
    setTimeout(() => (this.mutatingDOMM = false), 0, this.signal);
  }

  private connectPlugs(): void {
    for (const PlugClass of PlugRegistry.getOrdered()) this.plugIn(PlugClass, PlugClass.isMain ? (this.config as any)[PlugClass.plugName] : (this.config.settings as any)[PlugClass.plugName]);
  }
  public plugIn(PlugClass: PlugConstructor, config?: any) {
    if (this.config.noPlugList.includes(PlugClass.plugName) && !PlugClass.isCore) return; // Core plugs are mandatory
    this.plug(PlugClass.plugName)?.destroy();
    return this.plugs.set(PlugClass.plugName, new PlugClass(this, config).setup()), this; // for devx chaining
  }
  public plug<T extends Plug = Plug>(name: string): T | undefined {
    return this.plugs.get(name) as T | undefined;
  }

  protected wireTechHandler(): void {
    this.media.on("intent.src", () => this.handleTech(), { capture: true, signal: this.signal, immediate: true }); // load initial
    this.media.on("intent.sources", () => this.handleTech(), { capture: true, signal: this.signal });
    this.media.on("state.src", () => this.handleTech("state"), { capture: true, signal: this.signal }); // just in case :)
    this.media.on("state.sources", () => this.handleTech("state"), { capture: true, signal: this.signal }); // just in case :)
    this.media.on("settings.srcObject", () => this.handleTech(), { capture: true, signal: this.signal });
  }
  protected handleTech(pref: "state" | "intent" = "intent"): void {
    const { src: prefSrc, sources: prefSources } = pref === "intent" ? this.media.intent : this.media.state,
      { src: altSrc, sources: altSources } = pref === "intent" ? this.media.state : this.media.intent;
    if (this.media.settings.srcObject) return this.switchTech();
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
    this.switchTech(selectedTech || undefined);
    if (selectedSource !== prefSrc && !this.media.tech.features.sources) this.media.intent.src = selectedSource!; // since tech can't handle sources
  }
  public switchTech(TechClass: TechConstructor = HTML5Tech, config = this.media): void {
    if (this.media.tech && TechClass === this.media.tech.constructor) return;
    if (this.media.tech) this.media.tech.destroy(), this.log(`Switching tech from '${this.media.tech.name}' -> '${TechClass.name}'`);
    this.media.tech = new TechClass(this, config).setup();
  }

  private wireStateHandler(): void {
    observeIntersection(this.media.container.parentElement!, (entry) => (this.state.mediaParentIntersecting = entry.isIntersecting), this.signal);
    observeIntersection(this.media.container, (entry) => (this.state.mediaIntersecting = entry.isIntersecting), this.signal);
    observeResize(this.media.container, () => (this.state.dimensions.container = getSizeTier(this.media.container)), this.signal);
    observeResize(this.media.pseudoContainer, () => (this.state.dimensions.pseudoContainer = getSizeTier(this.media.pseudoContainer)), this.signal);
  }

  public get payload() {
    const rS = this.state?.readyState ?? 0;
    return ((this._payload.readyState = rS), (this._payload.initialized = rS > 0), (this._payload.destroyed = rS < 0)), this._payload;
  } // cached due to frequent access
  public setReadyState(state?: number, medium?: HTMLMediaElement): void {
    const readyState = !this.state ? 0 : clamp(0, state ?? this.state.readyState + 1, 3);
    this.state && (this.state.readyState = readyState), this.fire("tmgreadystatechange", this.payload, medium);
  }

  public guard = <Fn extends Function>(fn: Fn, { silent = false } = {}) => {
    return guardMethod(fn, (e) => (this.log(e, "error", "swallow"), !silent && this.plug<ToastsPlug>("toasts")?.toast?.("Something went wrong", { tag: "tmg-stwr" }))); // treated as one log identity
  }; // `()=>{}`: needs to be bounded even before initialization

  public log(mssg: any, type: "error" | "warn" | "log" = "log", action?: "swallow") {
    if (!this.config.debug) return;
    if (type === "error") return action === "swallow" ? console.warn(`[TMG Controller] swallowed error:`, mssg) : console.error(`[TMG Controller] error:`, mssg);
    else type === "warn" ? console.warn(`[TMG Controller] warning:`, mssg) : console.log(`[TMG Controller] log:`, mssg);
  }

  public fire(eN: string, detail: any = null, el: HTMLElement | EventTarget = this.media.element, bubbles = true, cancelable = true): void {
    eN && el?.dispatchEvent(new CustomEvent(eN, { detail, bubbles, cancelable }));
  }

  public throttle(key: string, fn: Function, delay = 30, strict = true) {
    throttle(this.id + key, fn, delay, strict, this.signal, getWindow(this.media.container));
  }

  public RAFLoop(key: string, fn: Function): void {
    RAFLoop(this.id + key, fn, this.signal, getWindow(this.media.container));
  }
  public cancelRAFLoop(key: string): void {
    cancelRAFLoop(this.id + key);
  }
  public cancelAllLoops(): void {
    rafLoopMap.keys().forEach((k) => k.startsWith(this.id) && this.cancelRAFLoop(k));
  }

  public isUIActive(mode: string, el = this.media.container): boolean {
    return el.classList.contains(`tmg-media-${uncamelize(mode === "settings" ? "settings-view" : mode, "-")}`);
  }

  public queryDOM<K extends keyof HTMLElementTagNameMap>(query: K, all: true, isPseudo?: boolean): NodeListOf<HTMLElementTagNameMap[K]>;
  public queryDOM<E extends Element = HTMLElement>(query: string, all: true, isPseudo?: boolean): NodeListOf<E>;
  public queryDOM<K extends keyof HTMLElementTagNameMap>(query: K, all?: false, isPseudo?: boolean): HTMLElementTagNameMap[K] | null;
  public queryDOM<E extends Element = HTMLElement>(query: string, all?: false, isPseudo?: boolean): E | null;
  public queryDOM(query: string, all = false, isPseudo = false) {
    return all ? (isPseudo ? this.media.pseudoContainer : this.media.container).querySelectorAll(query) : (isPseudo ? this.media.pseudoContainer : this.media.container).querySelector(query);
  }

  setImgLoadState<Ev extends Pick<Event, "target">>({ target: img }: Ev): void {
    img instanceof HTMLImageElement && img?.setAttribute("data-loaded", String(img.complete && img.naturalWidth > 0));
  }
  setImgFallback<Ev extends Pick<Event, "target">>({ target: img }: Ev): void {
    img instanceof HTMLImageElement && (img.src = window.TMG_VIDEO_ALT_IMG_SRC!);
  }
  setCanvasFallback(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, img?: HTMLImageElement): void {
    img = canvas && createEl("img", { src: window.TMG_VIDEO_ALT_IMG_SRC, onload: () => context?.drawImage(img!, 0, 0, canvas.width, canvas.height) });
  }

  public destroy() {
    this.mutatingDOMM = true; // destruction will mutate, flag external watchers
    this.setReadyState(-1);
    this.ac.abort("[TMG Controller] Instance is being destroyed");
    [...this.plugs.values()].reverse().forEach((p) => p.destroy()), this.media.tech.destroy();
    this.media.destroy(), this.state.destroy(), this.config.destroy(), this.plugs.clear();
    const el = this.config.cloneOnDetach ? cloneMedia(this.media.element) : this.media.element;
    return nuke(this), el;
  }
}
