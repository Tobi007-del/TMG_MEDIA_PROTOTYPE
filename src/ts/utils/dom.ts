import { isSameURL } from ".";

// Types
type Direction = "x" | "y";
type Position = "before" | "after" | "at";
type ResourceType = "style" | "script" | string;
type SafeClickEl = HTMLElement & {
  _clickHandler?: (e: MouseEvent) => void;
  _dblClickHandler?: (e: MouseEvent) => void;
  _clickTimeoutId?: ReturnType<typeof setTimeout>;
};

interface LoadResourceOptions {
  module?: boolean;
  media?: string;
  crossOrigin?: string;
  integrity?: string;
}

// Element Factory
export function createEl<K extends keyof HTMLElementTagNameMap>(tag: K, props?: Partial<HTMLElementTagNameMap[K]>, dataset?: Record<string, string | number>, styles?: Partial<CSSStyleDeclaration>): HTMLElementTagNameMap[K];
export function createEl(tag: string, props?: Partial<HTMLElement>, dataset?: Record<string, string | number>, styles?: Partial<CSSStyleDeclaration>): HTMLElement | null;
export function createEl(tag: string, props: Record<string, unknown> = {}, dataset: Record<string, string | number> = {}, styles: Partial<CSSStyleDeclaration> = {}): HTMLElement | null {
  const el = tag ? (document.createElement(tag) as HTMLElement) : null;
  if (!el) return null;
  Object.entries(props).forEach(([k, v]) => {
    if (v !== undefined) (el as unknown as Record<string, unknown>)[k] = v;
  });
  Object.entries(dataset).forEach(([k, v]) => {
    if (v !== undefined) (el.dataset as DOMStringMap)[k] = String(v);
  });
  Object.entries(styles).forEach(([k, v]) => {
    if (v !== undefined) (el.style as unknown as Record<string, unknown>)[k] = v;
  });
  return el;
}

// Resource Loading
const resourceCache: Partial<Record<string, Promise<HTMLElement | void>>> = {};

export function loadResource(src: string, type: ResourceType = "style", { module, media, crossOrigin, integrity }: LoadResourceOptions = {}): Promise<HTMLElement | void> {
  if (resourceCache[src]) return resourceCache[src];
  if (type === "script" ? [...document.scripts].some((s) => isSameURL(s.src, src)) : type === "style" ? [...document.styleSheets].some((s) => isSameURL((s as CSSStyleSheet).href ?? "", src)) : false) return Promise.resolve();
  resourceCache[src] = new Promise<HTMLElement | void>((resolve, reject) => {
    if (type === "script") {
      const script = createEl("script", { src, type: module ? "module" : "text/javascript", crossOrigin, integrity, onload: () => resolve(script as HTMLElement), onerror: () => reject(new Error(`Script load error: ${src}`)) } as Partial<HTMLScriptElement>);
      if (!script) return reject(new Error(`Script load error: ${src}`));
      document.body.append(script);
    } else if (type === "style") {
      const link = createEl("link", { rel: "stylesheet", href: src, media, onload: () => resolve(link as HTMLElement), onerror: () => reject(new Error(`Stylesheet load error: ${src}`)) } as Partial<HTMLLinkElement>);
      if (!link) return reject(new Error(`Stylesheet load error: ${src}`));
      document.head.append(link);
    } else reject(new Error(`Unsupported resource type: ${type}`));
  });
  return resourceCache[src];
}

// Viewport Checks
export function inDocView(el: Element, axis: "x" | "y" = "y"): boolean {
  const rect = el.getBoundingClientRect(),
    inX = rect.left + window.scrollX >= 0 && rect.right + window.scrollX <= window.scrollX + (window.innerWidth || document.documentElement.clientWidth),
    inY = rect.top + window.scrollY >= 0 && rect.bottom + window.scrollY <= window.scrollY + (window.innerHeight || document.documentElement.clientHeight);
  return axis === "x" ? inY : axis === "y" ? inX : inY && inX;
}

export const getElSiblingAt = (p: number, dir: Direction, els: Element[], pos: Position = "after"): Element | undefined => {
  return els?.reduce(
    (closest: { offset: number; element: Element | undefined }, child) => {
      const { top: cT, left: cL, width: cW, height: cH } = child.getBoundingClientRect(),
        offset = p - (dir === "y" ? cT : cL) - (dir === "y" ? cH : cW) / 2,
        condition = pos === "after" ? offset < 0 && offset > closest.offset : pos === "before" ? offset > 0 && offset < closest.offset : pos === "at" ? Math.abs(offset) <= (dir === "y" ? cH : cW) / 2 && Math.abs(offset) < Math.abs(closest.offset) : false;
      return condition ? { offset, element: child } : closest;
    },
    { offset: pos === "after" ? -Infinity : Infinity, element: undefined }
  ).element;
};

// Fullscreen & Picture-in-Picture
export const queryFullscreen = (): boolean => Boolean((document as Document & { fullscreen?: Element; webkitIsFullscreen?: boolean; mozFullscreen?: Element; msFullscreenElement?: Element }).fullscreenElement || (document as Document & { fullscreen?: Element }).fullscreen || (document as Document & { webkitIsFullscreen?: boolean }).webkitIsFullscreen || (document as Document & { mozFullscreen?: Element }).mozFullscreen || (document as Document & { msFullscreenElement?: Element }).msFullscreenElement);

export const supportsFullscreen = (): boolean => Boolean((document as Document & { mozFullscreenEnabled?: boolean; msFullscreenEnabled?: boolean; webkitFullscreenEnabled?: boolean; webkitSupportsFullscreen?: boolean }).fullscreenEnabled || (document as Document & { mozFullscreenEnabled?: boolean }).mozFullscreenEnabled || (document as Document & { msFullscreenEnabled?: boolean }).msFullscreenEnabled || (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled || (document as Document & { webkitSupportsFullscreen?: boolean }).webkitSupportsFullscreen || ((HTMLVideoElement.prototype as HTMLVideoElement & { webkitEnterFullscreen?: unknown }).webkitEnterFullscreen as unknown));

export const supportsPictureInPicture = (): boolean => Boolean((document as Document & { pictureInPictureEnabled?: boolean }).pictureInPictureEnabled || (HTMLVideoElement.prototype as HTMLVideoElement & { requestPictureInPicture?: unknown }).requestPictureInPicture || (window as Window & { documentPictureInPicture?: unknown }).documentPictureInPicture);

// Safe Click Handling
export function addSafeClicks(el: SafeClickEl | null | undefined, onClick?: (e: MouseEvent) => void, onDblClick?: (e: MouseEvent) => void, options?: boolean | AddEventListenerOptions): void {
  el && removeSafeClicks(el);
  el?.addEventListener("click", (el._clickHandler = (e: MouseEvent) => (clearTimeout(el._clickTimeoutId), (el._clickTimeoutId = setTimeout(() => onClick?.(e), 300)))), options);
  el?.addEventListener("dblclick", (el._dblClickHandler = (e: MouseEvent) => (clearTimeout(el._clickTimeoutId), onDblClick?.(e))), options);
}

export const removeSafeClicks = (el: SafeClickEl | null | undefined): void => (el?.removeEventListener("click", el._clickHandler as EventListener), el?.removeEventListener("dblclick", el._dblClickHandler as EventListener));
