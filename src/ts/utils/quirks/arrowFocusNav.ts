import { clamp } from "..";

// Key sets
const H_NAV_KEYS = ["ArrowRight", "ArrowLeft", "Home", "End"] as const;
const V_NAV_KEYS = ["ArrowUp", "ArrowDown", "PageDown", "PageUp"] as const;
const NAV_KEYS = [...H_NAV_KEYS, ...V_NAV_KEYS];

export interface ArrowNavConfig {
  enabled?: boolean | null;
  selector?: string;
  focusOnHover?: boolean;
  loop?: boolean;
  virtual?: boolean;
  typeahead?: boolean;
  resetMs?: number;
  rtl?: boolean | null;
  rovingTabIndex?: boolean | null;
  defaultTabbableIndex?: number | null;
  activeClass?: string;
  inputSelector?: string;
  scrollIntoView?: ScrollIntoViewOptions;
  focusOptions?: FocusOptions;
  grid?: Partial<Record<"x" | "y" | "vY", number>>;
  onSelect?: (el: HTMLElement, e: Partial<KeyboardEvent> & { key: string }) => void;
  onFocusOut?: () => void;
}

const DEFAULT_CONFIG: Required<ArrowNavConfig> = {
  enabled: null,
  selector: "[data-arrow-item]",
  focusOnHover: true,
  loop: true,
  virtual: false,
  typeahead: false,
  rovingTabIndex: null,
  defaultTabbableIndex: null,
  resetMs: 500,
  rtl: null,
  grid: {},
  activeClass: "focus-outlined",
  inputSelector: "input[value],textarea,[contenteditable='true']",
  focusOptions: { preventScroll: false },
  scrollIntoView: { block: "nearest", inline: "nearest" },
  onSelect: () => {},
  onFocusOut: () => {},
};

type KeyEvent = Partial<KeyboardEvent> & { key: string };

const getCommonAncestor = (a?: Element | null, b?: Element | null): Element | null => {
  if (!a || !b) return a || b || null;
  const ancestors = new Set<Element>();
  let node: Element | null = a;
  while (node) {
    ancestors.add(node);
    node = node.parentElement;
  }
  node = b;
  while (node) {
    if (ancestors.has(node)) return node;
    node = node.parentElement;
  }
  return null;
};

const getGrid = (all: HTMLElement[], x = true, y = true, vY = true) => {
  const len = all.length;
  const grid: ArrowNavConfig["grid"] = {};
  if (!len) return grid;
  let cols = all.findIndex((el) => el.offsetTop !== all[0].offsetTop);
  cols = cols > 0 ? cols : len;
  if (x) grid.x = cols;
  let rows = Math.ceil(len / cols);
  if (y) grid.y = rows;
  if (vY) {
    const containerHeight = getCommonAncestor(all[0], all[1])?.clientHeight ?? 0;
    const itemHeight = all[0].offsetHeight ?? 0;
    rows = clamp(1, Math.floor(containerHeight / itemHeight), rows) || rows;
    grid.vY = rows;
  }
  return grid;
};

const getTargetIndex = ({ key, currIndex, length, gridX, gridY, vGridY, loop, ctrlKey = false, rtl }: { key: string; currIndex: number; length: number; gridX: number; gridY: number; vGridY: number; loop: boolean; ctrlKey?: boolean; rtl: boolean }): number => {
  const rowStart = currIndex - (currIndex % gridX);
  const rowEnd = Math.min(rowStart + gridX - 1, length - 1);
  const colStart = currIndex % gridX;
  const colEnd = Math.min(colStart + gridX * (gridY - 1), length - 1);
  const canX = gridX > 1,
    canY = gridY > 1;
  const horizontalMove = rtl ? { ArrowRight: canX ? -1 : 0, ArrowLeft: canX ? 1 : 0 } : { ArrowRight: canX ? 1 : 0, ArrowLeft: canX ? -1 : 0 };
  const move =
    {
      ...horizontalMove,
      ArrowDown: canY ? gridX : 0,
      ArrowUp: canY ? -gridX : 0,
      Home: ctrlKey ? 0 : rowStart,
      End: ctrlKey ? length - 1 : rowEnd,
      PageDown: (vGridY - 1) * gridX,
      PageUp: -(vGridY - 1) * gridX,
    }[key] ?? 0;

  let targetIndex = key === "Home" || key === "End" ? move : currIndex + move;
  if (key === "ArrowDown") {
    if (targetIndex < gridX) targetIndex = 0;
    if (!loop && targetIndex >= length) targetIndex -= move;
  } else if (key === "ArrowUp") {
    if (!loop && targetIndex < 0) targetIndex += Math.abs(move);
  } else if (key === "PageDown") {
    if (!loop && targetIndex >= length) targetIndex = colEnd;
  } else if (key === "PageUp") {
    if (!loop && targetIndex < 0) targetIndex = colStart;
  }

  return loop ? (targetIndex + length) % length : clamp(0, targetIndex, length - 1);
};

export type ArrowNavHandle = {
  goToIndex: (index: number, e?: KeyEvent) => void;
  simulateKey: (e: KeyEvent) => void;
  getAbleIndex: (targetIndex: number, e?: KeyEvent) => number | null;
  typeAhead: (key: string) => void;
  items: () => HTMLElement[];
  activeItem: () => HTMLElement | null;
  getGrid: () => { x: number; y: number; vY: number };
  destroy: () => void;
};

export const initArrowFocusNav = (container: HTMLElement, cfg: ArrowNavConfig = {}): ArrowNavHandle => {
  const { enabled: isEnabled, selector, focusOnHover, loop, virtual, typeahead, resetMs, activeClass, inputSelector, defaultTabbableIndex, grid, rtl: isRtl, focusOptions, scrollIntoView, onSelect, onFocusOut, rovingTabIndex } = { ...DEFAULT_CONFIG, ...cfg };

  let gridX = grid.x || 1;
  let gridY = grid.y || 1;
  let vGridY = grid.vY || 1;
  let activeIndex = -1;
  let buffer = "";
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let items: HTMLElement[] = [];

  const enabled = isEnabled ?? virtual;
  const roving = rovingTabIndex ?? !virtual;
  const rtl = isRtl ?? getComputedStyle(container).direction === "rtl";

  const shouldSnub = () => !enabled || !container;
  const isItemDisabled = (el?: HTMLElement) => !el || el.hasAttribute("disabled") || el.hasAttribute("aria-disabled");
  const getItems = () => (items = Array.from(container.querySelectorAll<HTMLElement>(selector)));

  const getAbleIndex = (targetIndex: number, e: KeyEvent = { key: "ArrowRight", ctrlKey: false }) => {
    if (shouldSnub()) return null;
    if (!items.length) return null;
    let index = targetIndex;
    let attempts = 0;
    while (attempts < items.length) {
      if (!isItemDisabled(items[index])) return index;
      index = getTargetIndex({ key: e.key, currIndex: index, gridX, gridY, vGridY, length: items.length, loop, ctrlKey: e.ctrlKey, rtl });
      attempts++;
    }
    return null;
  };

  const goToIndex = (targetIndex: number, e: KeyEvent = { key: "ArrowRight" }) => {
    if (shouldSnub()) return;
    const idx = getAbleIndex(targetIndex, e);
    if (idx === null) return;
    activeIndex = idx;
    onSelect?.(items[idx], e);
    if (virtual) {
      items[idx]?.scrollIntoView(scrollIntoView);
      container.setAttribute("aria-activedescendant", items[idx].id || "");
    } else {
      items[idx]?.focus(focusOptions);
    }
    updateDOM();
  };

  const updateDOM = () => {
    if (shouldSnub()) return;
    if (!virtual && !roving) return;
    if (!items.length) return;
    const tabbableIndex = defaultTabbableIndex !== null && defaultTabbableIndex !== undefined && !isItemDisabled(items[defaultTabbableIndex]) ? defaultTabbableIndex : getAbleIndex(0);
    items.forEach((el, i) => {
      const isActive = i === activeIndex;
      if (roving) {
        const shouldBeTabbable = i === activeIndex || (activeIndex === -1 && i === tabbableIndex);
        el.setAttribute("tabindex", shouldBeTabbable ? "0" : "-1");
      } else if (virtual && activeIndex > 0) {
        const shouldBeTabbable = i > activeIndex;
        el.setAttribute("tabindex", shouldBeTabbable ? "0" : "-1");
      } else el.setAttribute("tabindex", "0");
      if (virtual) {
        el.setAttribute("aria-selected", `${isActive}`);
        el.classList.toggle(activeClass, isActive);
      }
    });
  };

  const typeAhead = (key: string) => {
    if (shouldSnub() || !typeahead) return;
    buffer += key.toLowerCase();
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => (buffer = ""), resetMs);
    const start = activeIndex >= 0 ? activeIndex + 1 : 0;
    for (let i = 0; i < items.length; i++) {
      const idx = (start + i) % items.length;
      const label = (items[idx].getAttribute("data-label") || items[idx].innerText || "").trim().toLowerCase();
      if (label.startsWith(buffer)) return goToIndex(idx);
    }
  };

  const simulateKey = (e: KeyEvent) => {
    if (shouldSnub()) return;
    if (document.activeElement?.matches("option")) return;
    const { key } = e;
    if (!items.length) return;
    if (virtual && (key === " " || key === "Enter")) return items[activeIndex]?.click();
    if (typeahead && key.length === 1 && /^[a-z0-9]$/i.test(key)) return typeAhead(key);
    if (!NAV_KEYS.includes(key as any)) return;
    if (!((e.currentTarget as HTMLElement)?.matches(DEFAULT_CONFIG.inputSelector) && gridX <= 1 && H_NAV_KEYS.includes(key as any))) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    const currIndex = virtual ? activeIndex : items.indexOf(document.activeElement as HTMLElement);
    const targetIndex = getTargetIndex({ currIndex, gridX, gridY, vGridY, length: items.length, loop, rtl, key, ctrlKey: (e as KeyboardEvent).ctrlKey });
    goToIndex(targetIndex, e);
  };

  // Setup
  const refresh = () => (getItems(), updateDOM());
  refresh();

  // Keydown binding
  const interactiveEls = !virtual ? [container] : [container.querySelector<HTMLElement>(inputSelector)];
  interactiveEls.forEach((el) => el?.addEventListener("keydown", simulateKey as EventListener));

  // Focus out handling
  const handleFocusOut = (evt: FocusEvent) => {
    if (!container.contains(evt.relatedTarget as Node)) {
      activeIndex = -1;
      return onFocusOut?.();
    }
    const among = items.includes(evt.relatedTarget as HTMLElement);
    if (!among && (defaultTabbableIndex ?? -1) >= 0) return (activeIndex = -1);
    if (virtual) activeIndex = -1;
  };
  container.addEventListener("focusout", handleFocusOut);

  // Hover handling
  const handleHover = (evt: Event) => {
    if (!enabled || !focusOnHover) return;
    const el = evt.currentTarget as HTMLElement;
    const i = items.indexOf(el);
    if (i !== -1) goToIndex(i);
  };

  // Mutation handling
  const mutationObserver = new MutationObserver(() => {
    const oldEl = items[activeIndex];
    refresh();
    const newEl = items[activeIndex];
    if (oldEl && newEl && oldEl === newEl) return;
    activeIndex = -1;
  });
  mutationObserver.observe(container, { childList: true, subtree: true });

  // Grid handling (ResizeObserver)
  const setGrid = (g: Required<ArrowNavConfig>["grid"]) => {
    if (g.x !== undefined) gridX = g.x;
    if (g.y !== undefined) gridY = g.y;
    if (g.vY !== undefined) vGridY = g.vY;
  };
  setGrid(grid);
  const calcGrid = () => setGrid(getGrid(items, !grid.x, !grid.y, !grid.vY));
  calcGrid();
  const resizeObserver = new ResizeObserver(() => calcGrid());
  const ancestor = items.length > 1 ? getCommonAncestor(items[0], items[1]) : container;
  ancestor && resizeObserver.observe(ancestor);

  // Hover listeners on items
  const bindHover = () => items.forEach((el) => el.addEventListener("mouseenter", handleHover));
  const unbindHover = () => items.forEach((el) => el.removeEventListener("mouseenter", handleHover));
  bindHover();

  const destroy = () => {
    interactiveEls.forEach((el) => el?.removeEventListener("keydown", simulateKey as EventListener));
    container.removeEventListener("focusout", handleFocusOut);
    unbindHover();
    mutationObserver.disconnect();
    resizeObserver.disconnect();
    if (timeout) clearTimeout(timeout);
  };

  return {
    goToIndex,
    simulateKey,
    getAbleIndex,
    typeAhead,
    items: () => items,
    activeItem: () => items[activeIndex] ?? null,
    getGrid: () => ({ x: gridX, y: gridY, vY: vGridY }),
    destroy,
  };
};
