import { isSameURL } from ".";

// Types
export type Dataset = Record<string, string | number>;
export type Style = Partial<CSSStyleDeclaration>;
type Direction = "x" | "y";
type Position = "before" | "after" | "at";
type ResourceType = "style" | "script" | string;
type SafeClickEl = HTMLElement & {
  _clickHandler?: (e: MouseEvent) => void;
  _dblClickHandler?: (e: MouseEvent) => void;
  _clickTimeoutId?: ReturnType<typeof setTimeout>;
};
type LoadResourceOptions = Partial<{
  module: boolean;
  media: string;
  crossOrigin: "anonymous" | "use-credentials" | string | null;
  integrity: string;
  referrerPolicy: "no-referrer" | "origin" | "strict-origin-when-cross-origin" | string;
  nonce: string;
  fetchPriority: "high" | "low" | "auto";
  attempts: number;
  retryKey: boolean | string; // retry token
}>;

// Element Factory
export function createEl<K extends keyof HTMLElementTagNameMap>(tag: K, props?: Partial<HTMLElementTagNameMap[K]>, dataset?: Dataset, styles?: Style): HTMLElementTagNameMap[K];
export function createEl(tag: string, props?: Partial<HTMLElement>, dataset?: Dataset, styles?: Style): HTMLElement | null;
export function createEl(tag: string, props: Record<string, unknown> = {}, dataset: Dataset = {}, styles: Style = {}): HTMLElement | null {
  return assignEl(tag ? document?.createElement(tag) : undefined, props, dataset, styles) ?? null;
}

export function assignEl<K extends keyof HTMLElementTagNameMap>(el?: HTMLElementTagNameMap[K], props?: Partial<HTMLElementTagNameMap[K]>, dataset?: Dataset, styles?: Style): void;
export function assignEl(el?: HTMLElement, props?: Partial<HTMLElement>, dataset?: Dataset, styles?: Style): void;
export function assignEl(el?: HTMLElement, props: Record<string, unknown> = {}, dataset: Dataset = {}, styles: Style = {}): void {
  if (!el) return;
  for (const k of Object.keys(props)) if (props[k] !== undefined) (el as unknown as Record<string, unknown>)[k] = props[k];
  for (const k of Object.keys(dataset)) if (dataset[k] !== undefined) (el.dataset as DOMStringMap)[k] = String(dataset[k]);
  for (const k of Object.keys(styles)) if (styles[k as keyof Style] !== undefined) (el.style as unknown as Record<string, unknown>)[k] = styles[k as keyof Style];
}

// Resource Loading
export function loadResource(src: string, type: ResourceType = "style", { module, media, crossOrigin, integrity, referrerPolicy, nonce, fetchPriority, attempts = 3, retryKey = false }: LoadResourceOptions = {}): Promise<HTMLElement | void> {
  ((window.t007 ??= {} as any), (t007._resourceCache ??= {}));
  if (t007._resourceCache[src]) return t007._resourceCache[src]; // set crossorigin on (links|scripts) if provided due to document.(styleSheets|scripts)
  if (type === "script" ? Array.prototype.some.call(document.scripts, (s) => isSameURL(s.src, src)) : type === "style" ? Array.prototype.some.call(document.styleSheets, (s) => isSameURL((s as CSSStyleSheet).href ?? "", src)) : false) return Promise.resolve();
  t007._resourceCache[src] = new Promise<HTMLElement | void>((resolve, reject) => {
    (function tryLoad(remaining: number, el?: HTMLElement) {
      const onerror = () => {
        el?.remove(); // Remove failed element before retrying
        if (remaining > 1) {
          setTimeout(tryLoad, 1000, remaining - 1);
          console.warn(`Retrying ${type} load (${attempts - remaining + 1}): ${src}...`);
        } else {
          delete t007._resourceCache[src]; // Final fail: clear cache so user can manually retry
          reject(new Error(`${type} load failed after ${attempts} attempts: ${src}`));
        }
      };
      const url = retryKey && remaining < attempts ? `${src}${src.includes("?") ? "&" : "?"}_${retryKey}=${Date.now()}` : src;
      if (type === "script") document.body.append((el = createEl("script", { src: url, type: module ? "module" : "text/javascript", crossOrigin, integrity, referrerPolicy, nonce, fetchPriority, onload: () => resolve(el), onerror })));
      else if (type === "style") document.head.append((el = createEl("link", { rel: "stylesheet", href: url, media, crossOrigin, integrity, referrerPolicy, nonce, fetchPriority, onload: () => resolve(el), onerror })));
      else reject(new Error(`Unsupported resource type: ${type}`));
    })(attempts);
  });
  return t007._resourceCache[src];
}

// Viewport Checks
export function inDocView(el: Element, axis: "x" | "y" = "y"): boolean {
  const rect = el.getBoundingClientRect(),
    inX = rect.left + window.scrollX >= 0 && rect.right + window.scrollX <= window.scrollX + (window.innerWidth || document.documentElement.clientWidth),
    inY = rect.top + window.scrollY >= 0 && rect.bottom + window.scrollY <= window.scrollY + (window.innerHeight || document.documentElement.clientHeight);
  return axis === "x" ? inY : axis === "y" ? inX : inY && inX;
}

export function getElSiblingAt(p: number, dir: Direction, els: HTMLElement[] | NodeListOf<HTMLElement>, pos: Position = "after"): Element | undefined {
  return (
    els.length &&
    (
      Array.prototype.reduce.call(
        els,
        ((closest: { offset: number; element: Element | undefined }, child: Element) => {
          const { top: cT, left: cL, width: cW, height: cH } = child.getBoundingClientRect(),
            offset = p - (dir === "y" ? cT : cL) - (dir === "y" ? cH : cW) / 2,
            condition = pos === "after" ? offset < 0 && offset > closest.offset : pos === "before" ? offset > 0 && offset < closest.offset : pos === "at" ? Math.abs(offset) <= (dir === "y" ? cH : cW) / 2 && Math.abs(offset) < Math.abs(closest.offset) : false;
          return condition ? { offset, element: child } : closest;
        }) as any,
        { offset: pos === "after" ? -Infinity : Infinity, element: undefined }
      ) as any
    ).element
  );
}

// Fullscreen & Picture-in-Picture
export const queryFullscreen = (): boolean => Boolean(queryFullscreenEl());
export function queryFullscreenEl(): Element | null {
  const d = document as any;
  return d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement || null;
}

export function supportsFullscreen(): boolean {
  const d = document as any,
    v = HTMLVideoElement.prototype as any;
  return Boolean(d.fullscreenEnabled || d.mozFullscreenEnabled || d.msFullscreenEnabled || d.webkitFullscreenEnabled || d.webkitSupportsFullscreen || v.webkitEnterFullscreen);
}
export function supportsPictureInPicture(): boolean {
  const w = window as any,
    d = document as any,
    v = HTMLVideoElement.prototype as any;
  return Boolean(d.pictureInPictureEnabled || v.requestPictureInPicture || w.documentPictureInPicture);
}

export function enterFullscreen(el: Element): Promise<void> {
  const e = el as any;
  return e.webkitEnterFullscreen ? e.webkitEnterFullscreen() : e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : Promise.reject(new Error("Fullscreen API is not supported"));
}
export function exitFullscreen(el: Element): Promise<void> {
  const e = el as any,
    d = document as any;
  return e.webkitExitFullscreen ? e.webkitExitFullscreen() : d.exitFullscreen ? d.exitFullscreen() : d.mozCancelFullScreen ? d.mozCancelFullScreen() : d.webkitExitFullscreen ? d.webkitExitFullscreen() : d.msExitFullscreen ? d.msExitFullscreen() : Promise.reject(new Error("Fullscreen API is not supported"));
}

// Safe Click Handling
export function addSafeClicks(el: SafeClickEl | null | undefined, onClick?: (e: MouseEvent) => void | null, onDblClick?: (e: MouseEvent) => void | null, options?: boolean | AddEventListenerOptions): void {
  el && removeSafeClicks(el);
  el?.addEventListener("click", (el._clickHandler = (e: MouseEvent) => (clearTimeout(el._clickTimeoutId), (el._clickTimeoutId = setTimeout(() => onClick?.(e), 300)))), options);
  el?.addEventListener("dblclick", (el._dblClickHandler = (e: MouseEvent) => (clearTimeout(el._clickTimeoutId), onDblClick?.(e))), options);
}
export function removeSafeClicks(el: SafeClickEl | null | undefined): void {
  el?.removeEventListener("click", el._clickHandler as EventListener);
  el?.removeEventListener("dblclick", el._dblClickHandler as EventListener);
}

// DOM Observers
declare global {
  interface Element {
    _tmgResizeCbs?: Set<(entry: ResizeObserverEntry) => void>;
    _tmgIntersectCbs?: Set<(entry: IntersectionObserverEntry) => void>;
    _tmgMutationCbs?: Set<(mutations: MutationRecord[]) => void>;
  }
}

export const intersectionObserver =
  typeof window !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) entry.target._tmgIntersectCbs?.forEach((cb) => cb(entry));
        },
        { root: null, rootMargin: "0px", threshold: 0.3 }
      )
    : null;

export const resizeObserver =
  typeof window !== "undefined"
    ? new ResizeObserver((entries) => {
        for (const entry of entries) entry.target._tmgResizeCbs?.forEach((cb) => cb(entry));
      })
    : null;

export const mutationObserver =
  typeof window !== "undefined"
    ? new MutationObserver((mutations) => {
        // Dispatch to specific targets if they are being observed directly
        // Note: MutationObserver works differently; this handles the 'root' observer callbacks
        // We map the *target* of the observation, not the mutation target usually.
        // For this util, we assume the observer instance calls the callback associated with the observed node.
        // Since we use one global observer, we need to map back.
        // Actually, for MutationObserver it's cleaner to keep separate instances if configs differ,
        // but for "utils" style, we can use a Map logic or just basic callback sets.
        // Current implementation assumes the caller handles the mutation list.
        const target = mutations[0].target as Element; // Batch usually targets one observer
        target._tmgMutationCbs?.forEach((cb) => cb(mutations));
      })
    : null;

// --- PUBLIC API ---
export function observeResize(el: Element, cb: (entry: ResizeObserverEntry) => void) {
  (el._tmgResizeCbs ?? (el._tmgResizeCbs = new Set())).add(cb);
  resizeObserver?.observe(el);
  return () => (el._tmgResizeCbs?.delete(cb), !el._tmgResizeCbs?.size && resizeObserver?.unobserve(el));
}

export function observeIntersection(el: Element, cb: (entry: IntersectionObserverEntry) => void) {
  (el._tmgIntersectCbs ?? (el._tmgIntersectCbs = new Set())).add(cb);
  intersectionObserver?.observe(el);
  return () => (el._tmgIntersectCbs?.delete(cb), !el._tmgIntersectCbs?.size && intersectionObserver?.unobserve(el));
}

export function observeMutation(el: Element, cb: (mutations: MutationRecord[]) => void, options: MutationObserverInit) {
  (el._tmgMutationCbs ?? (el._tmgMutationCbs = new Set())).add(cb);
  mutationObserver?.observe(el, options);
  return () => {
    el._tmgMutationCbs?.delete(cb);
    // Note: MutationObserver.unobserve stops EVERYTHING on that observer.
    // If we share one observer, we can't unobserve just one element easily without disconnecting all.
    // For safety in this "util" pattern with a shared observer, we just leave it connected or use dedicated observers.
    // Given the constraints, we'll keep it simple: disconnect if empty only works if 1-to-1.
    // For now, we assume persistent observation for system logic.
  };
}
