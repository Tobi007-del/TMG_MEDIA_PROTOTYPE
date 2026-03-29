import { Player } from "./player";
import { type Controller } from "../core/controller";
import { setTimeout, queryFullscreen, observeMutation, type Dimensions, isDef } from "../utils";

// Defines states explicitly managed by the TMG Environment Observers
export interface CtlrState {
  readyState: number;
  audioContextReady: boolean;
  mediaIntersecting: boolean;
  mediaParentIntersecting: boolean;
  dimensions: {
    container: Dimensions & { tier: string };
    pseudoContainer: Dimensions & { tier: string };
    window: Dimensions;
  };
  screenOrientation: ScreenOrientation;
  docVisibilityState: DocumentVisibilityState;
  docInFullscreen: boolean;
  frameReadyPromise?: Promise<null> | null;
}

// --- GLOBAL STATE ---
const w = isDef(window) ? window : undefined;
const flagMutationSet = new WeakSet<HTMLElement>(); // weak set for true magic
let flagMutationId: number | undefined;
// --- EXPORTS ---
export let AUDIO_CONTEXT: AudioContext | null = null;
export let AUDIO_LIMITER: DynamicsCompressorNode | null = null;
export let IS_DOC_TRANSIENT = false;
export const STATE_BUILD: CtlrState = {
  readyState: 0,
  audioContextReady: !!AUDIO_CONTEXT,
  mediaIntersecting: true,
  mediaParentIntersecting: true,
  dimensions: { container: { width: 0, height: 0, tier: "x" }, pseudoContainer: { width: 0, height: 0, tier: "x" }, window: { width: w?.innerWidth!, height: w?.innerHeight! } },
  screenOrientation: w?.screen.orientation!,
  docVisibilityState: w?.document.visibilityState!,
  docInFullscreen: queryFullscreen(),
};
export const Controllers: Controller[] = [];

export function handleVidMutation(mutations: MutationRecord[]) {
  for (const mutation of mutations) {
    if (mutation.type !== "attributes") continue;
    const target = mutation.target as HTMLMediaElement;
    if (mutation.attributeName === "tmgcontrols") !flagMutationSet.has(target) && (target.tmgcontrols = target.hasAttribute("tmgcontrols"));
    else if (mutation.attributeName?.startsWith("tmg")) target.hasAttribute(mutation.attributeName) && target.tmgPlayer?.fetchCustomOptions();
    else if (mutation.attributeName === "controls") target.hasAttribute("tmgcontrols") && target.removeAttribute("controls");
  }
}

export function handleDOMMutation(mutations: MutationRecord[]) {
  for (const mutation of mutations) {
    for (const node of Array.from(mutation.addedNodes)) {
      if (!(node instanceof HTMLElement)) continue;
      const videos = node.matches("video:not(.tmg-media)") ? [node] : node.querySelectorAll("video:not(.tmg-media)");
      videos.forEach((el) => {
        observeMutation(el, handleVidMutation, { attributes: true });
        (el as HTMLMediaElement).tmgcontrols = el.hasAttribute("tmgcontrols");
      });
    }
    for (const node of Array.from(mutation.removedNodes)) {
      if (!(node instanceof HTMLElement)) continue;
      const videos = node.matches(".tmg-media") ? [node] : node.querySelectorAll(".tmg-media");
      videos.forEach((el) => {
        !(el as HTMLMediaElement).tmgPlayer?.Controller?.mutatingDOMM && (el as HTMLMediaElement).tmgPlayer?.detach(); // a div el without tmgcontrols eg. youtube tech
      });
    }
  }
}

function flagMutation(m: HTMLElement, check = true) {
  !flagMutationSet.has(m) && check && flagMutationSet.add(m);
}

function freeMutation(m: HTMLElement) {
  clearTimeout(flagMutationId);
  flagMutationId = setTimeout(() => !(flagMutationId = undefined) && flagMutationSet.delete(m));
}

export function mountMedia() {
  if (!isDef(HTMLVideoElement)) return;
  Object.defineProperty(HTMLVideoElement.prototype, "tmgcontrols", {
    get: function () {
      return this.hasAttribute("tmgcontrols");
    },
    set: async function (value) {
      if (value) {
        flagMutation(this);
        await ((this as HTMLMediaElement).tmgPlayer || new Player()).attach(this);
        this.setAttribute("tmgcontrols", "");
        freeMutation(this);
      } else {
        flagMutation(this, this.hasAttribute("tmgcontrols"));
        this.removeAttribute("tmgcontrols");
        (this as HTMLMediaElement).tmgPlayer?.detach();
        freeMutation(this);
      }
    },
    enumerable: true,
    configurable: true,
  });
}

export function unmountMedia() {
  delete (HTMLVideoElement.prototype as any).tmgcontrols;
}

export function startAudioManager() {
  if (!AUDIO_CONTEXT && IS_DOC_TRANSIENT) {
    AUDIO_CONTEXT = new (w!.AudioContext || (w as any).webkitAudioContext)() as AudioContext;
    const L = (AUDIO_LIMITER = AUDIO_CONTEXT!.createDynamicsCompressor());
    ((L.threshold.value = -1.0), (L.knee.value = 0.0), (L.ratio.value = 20), (L.attack.value = 0.001), (L.release.value = 0.05));
    Controllers.forEach((c) => c.state && (c.state.audioContextReady = true));
  } else if (AUDIO_CONTEXT?.state === "suspended") AUDIO_CONTEXT.resume();
}

export function connectMediaToAudioManager(medium: HTMLMediaElement) {
  if (!AUDIO_CONTEXT) return "unavailable";
  medium.mediaElementSourceNode ??= AUDIO_CONTEXT.createMediaElementSource(medium);
  medium._tmgGainNode ??= AUDIO_CONTEXT.createGain();
  medium._tmgDynamicsCompressorNode ??= AUDIO_CONTEXT.createDynamicsCompressor();
  medium.mediaElementSourceNode.connect(medium._tmgDynamicsCompressorNode);
  medium._tmgDynamicsCompressorNode.connect(medium._tmgGainNode);
  medium._tmgGainNode.connect(AUDIO_LIMITER!);
  AUDIO_LIMITER!.connect(AUDIO_CONTEXT!.destination);
}

export function init() {
  mountMedia();
  ["click", "pointerdown", "keydown"].forEach((e) => document.addEventListener(e, () => ((IS_DOC_TRANSIENT = true), startAudioManager()), true));
  document.querySelectorAll("video").forEach((medium: any) => {
    observeMutation(medium, handleVidMutation, { attributes: true });
    medium.tmgcontrols = medium.hasAttribute("tmgcontrols");
  });
  observeMutation(document.documentElement, handleDOMMutation, { childList: true, subtree: true });
  w!.addEventListener("resize", () => Controllers.forEach((c) => c.state && (c.state.dimensions.window = { width: w!.innerWidth, height: w!.innerHeight })));
  screen.orientation.addEventListener("change", (e) => Controllers.forEach((c) => c.state && (c.state.screenOrientation = e?.target as ScreenOrientation)));
  document.addEventListener("visibilitychange", () => Controllers.forEach((c) => c.state && (c.state.docVisibilityState = document.visibilityState)));
  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach((e) => document.addEventListener(e, () => Controllers.forEach((c) => (c.state.docInFullscreen = queryFullscreen()))));
}
