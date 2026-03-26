import { BasePlug } from "..";
import type { Controller } from "../../core/controller";
import type { CtlrConfig } from "../../types/config";
import type { REvent } from "../../types/reactor";
import { controls, bigControls } from "../../consts/generics";
import { BaseComponent, Timeline } from "../../components";
import { ComponentRegistry } from "../../core/registry";
import type { DeepPartial } from "../../types/obj";
import { createEl, parsePanelBottomObj, initScrollAssist, observeResize, removeScrollAssist, IS_MOBILE } from "../../utils";
import { DraggableModule, DRAGGABLE_BUILD, type DraggableModuleConfig } from "./draggable";

export * from "./draggable";

export type Control = (typeof controls)[number];
export type SControl = Control | "spacer";
export type BigControl = (typeof bigControls)[number];
export type ControlPanelBottomTuple = Record<1 | 2 | 3, SControl[]>;
export type ControlPanel = {
  profile: string | boolean;
  title: string | boolean;
  artist: string | boolean;
  top: SControl[] | boolean;
  center: BigControl[] | boolean;
  bottom: boolean | SControl[] | SControl[][] | Partial<ControlPanelBottomTuple>;
  buffer: "eclipse" | "accent" | boolean;
  timeline: { thumbIndicator: boolean; seek: { relative: boolean; cancel: { delta: number; timeout: number } } };
  progressBar: boolean;
  draggable: DraggableModuleConfig;
};

const rowsArr = [1, 2, 3] as const;
export type Row = (typeof rowsArr)[number];
export type ZoneW = { cover?: HTMLElement; zone: HTMLElement };
export type ZoneSlot = ZoneW | HTMLElement;
export type ControlPanelZoneWs = { top: Record<"left" | "center" | "right", ZoneW>; center: ZoneW; bottom: Record<Row, Record<"left" | "center" | "right", ZoneW>> };
export type ControlPanelCurrentZoneWs = { top: Record<"left" | "center" | "right", ZoneSlot>; center: ZoneSlot; bottom: Record<Row, Record<"left" | "center" | "right", ZoneSlot>> };

export class ControlPanelPlug extends BasePlug<ControlPanel> {
  public static readonly plugName: string = "controlPanel";
  public static readonly isCore: boolean = false;
  public controls = new Map<string, BaseComponent<any, any>>();
  public draggable!: DraggableModule;
  public zoneWs!: ControlPanelZoneWs;
  public cZoneWs!: ControlPanelCurrentZoneWs;
  public zonesArr!: HTMLElement[];
  protected topW!: HTMLElement;
  protected bottomW!: HTMLElement;
  protected scrollAssistEls: HTMLElement[] = [];
  public getControl<T extends BaseComponent = BaseComponent>(name: string): T | undefined {
    return this.controls.get(name) as T | undefined;
  }
  public getControlEl<T extends HTMLElement = HTMLElement>(name: string): T | undefined {
    return this.getControl(name)?.element as T | undefined;
  }

  constructor(ctlr: Controller, config: ControlPanel) {
    super(ctlr, config);
    this.draggable = new DraggableModule(this.ctlr, this.config.draggable);
  }

  public mount(): void {
    // Variables Assignment
    const buffer = ComponentRegistry.init("buffer", this.ctlr);
    this.topW = createEl("div", { className: "tmg-video-top-controls-wrapper tmg-video-apt-controls-wrapper" }, { dropZone: "", dragId: "wrapper" });
    this.bottomW = createEl("div", { className: "tmg-video-bottom-controls-wrapper" });
    buffer && this.controls.set("buffer", buffer);
    ComponentRegistry.getAll().forEach((Comp) => Comp.isControl && this.controls.set(Comp.componentName, ComponentRegistry.init(Comp.componentName, this.ctlr)!));
    this.zoneWs = { top: {}, center: {}, bottom: { 1: {}, 2: {}, 3: {} } } as ControlPanelZoneWs;
    this.zoneWs.top = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") };
    this.zoneWs.center = { zone: createEl("div", { className: "tmg-video-big-controls-wrapper" }, { dropZone: "", dragId: "big" }) };
    rowsArr.forEach((i) => (this.zoneWs.bottom[i] = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") }));
    this.cZoneWs = { top: {}, center: this.zoneWs.center, bottom: { 1: {}, 2: {}, 3: {} } } as ControlPanelCurrentZoneWs;
    this.zonesArr = [...Object.values(this.zoneWs.top), ...Object.values(this.zoneWs.bottom).map((v) => Object.values(v))].flat().map((w) => w.zone);
    // DOM Injection
    buffer?.mount?.();
    this.topW.append(this.zoneWs.top.left.cover!, this.zoneWs.top.center.cover!, this.zoneWs.top.right.cover!);
    rowsArr.forEach((i) => {
      const row = createEl("div", { className: `tmg-video-bottom-sub-controls-wrapper tmg-video-bottom-${i}-sub-controls-wrapper tmg-video-apt-controls-wrapper` }, { dropZone: "", dragId: "wrapper" });
      row.append(this.zoneWs.bottom[i].left.cover!, this.zoneWs.bottom[i].center.cover!, this.zoneWs.bottom[i].right.cover!);
      this.bottomW.append(row);
    });
    this.ctlr.DOM.controlsContainer?.append(this.topW, this.zoneWs.center.zone, this.bottomW);
  }

  public wire(): void {
    // Ctlr Config Setters
    this.ctlr.config.set("settings.controlPanel.bottom", (value) => parsePanelBottomObj(value), { immediate: true });
    // ----------- Listeners
    (["settings.controlPanel.title", "settings.controlPanel.artist", "settings.controlPanel.profile"] as const).forEach((e) => this.ctlr.config.on(e, this.handleMetaLayout, { signal: this.signal, immediate: true }));
    this.ctlr.config.on("settings.controlPanel.top", this.handleTopLayout, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.center", this.handleCenterLayout, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.bottom", this.handleBottomLayout, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.buffer", ({ value }) => (this.ctlr.videoContainer.dataset.buffer = String(value)), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.thumbIndicator", ({ value }) => (this.ctlr.videoContainer.dataset.thumbIndicator = String(value)), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.seek", this.handleTimelineSeek, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.progressBar", ({ value }) => this.ctlr.videoContainer.classList.toggle("tmg-video-progress-bar", !!value), { signal: this.signal, immediate: true });
    // Post Wiring
    this.initScrollAndResize();
  }

  protected handleMetaLayout({ target: { key, value } }: REvent<CtlrConfig, "settings.controlPanel.title" | "settings.controlPanel.artist" | "settings.controlPanel.profile">): void {
    // const meta = this.getControl<Meta>("meta");
    // value !== true && (meta[key][key === "profile" ? "src" : "textContent"] = meta[key].dataset["video" + capitalize(key)] = value || "");
  }

  protected handleTopLayout({ value }: REvent<CtlrConfig, "settings.controlPanel.top">): void {
    if (!value || typeof value === "boolean") return;
    const { left, center, right } = this.getSplitControls(value);
    this.fillSWrapper(this.topW, [(this.cZoneWs.top.left = this.getZoneW(left, this.zoneWs.top.left)), (this.cZoneWs.top.center = this.getZoneW(center, this.zoneWs.top.center)), (this.cZoneWs.top.right = this.getZoneW(right, this.zoneWs.top.right))]);
    (this.fillZone(this.cZoneWs.top.left, left), this.fillZone(this.cZoneWs.top.center, center), this.fillZone(this.cZoneWs.top.right, right));
  }

  protected handleCenterLayout({ value }: REvent<CtlrConfig, "settings.controlPanel.center">): void {
    if (!value || typeof value === "boolean") return;
    this.fillZone(this.cZoneWs.center, value);
  }

  protected handleBottomLayout({ value }: REvent<CtlrConfig, "settings.controlPanel.bottom">): void {
    if (!value || typeof value === "boolean") return;
    ([1, 2, 3] as Row[]).forEach((i) => {
      const { left, center, right } = this.getSplitControls((value as ControlPanelBottomTuple)[i]);
      this.fillSWrapper(this.bottomW.children[i - 1] as HTMLElement, [(this.cZoneWs.bottom[i].left = this.getZoneW(left, this.zoneWs.bottom[i].left)), (this.cZoneWs.bottom[i].center = this.getZoneW(center, this.zoneWs.bottom[i].center)), (this.cZoneWs.bottom[i].right = this.getZoneW(right, this.zoneWs.bottom[i].right))]);
      (this.fillZone(this.cZoneWs.bottom[i].left, left), this.fillZone(this.cZoneWs.bottom[i].center, center), this.fillZone(this.cZoneWs.bottom[i].right, right));
    });
  }

  protected handleTimelineSeek({ currentTarget: { value } }: REvent<CtlrConfig, "settings.controlPanel.timeline.seek">): void {
    const timeline = this.getControl<Timeline>("timeline");
    if (timeline) timeline.config.scrub.relative = value!.relative;
    if (timeline) timeline.config.scrub.cancel = value!.cancel;
  }

  protected buildWSkel(side: string): ZoneW {
    const zone = createEl("div", { className: `tmg-video-side-controls-wrapper tmg-video-${side}-side-controls-wrapper` }, { dropZone: "", scroller: side === "right" ? "reverse" : "" }),
      cover = createEl("div", { className: `tmg-video-side-controls-wrapper-cover tmg-video-${side}-side-controls-wrapper-cover` });
    return (cover.append(zone), { cover, zone });
  }

  protected getSplitControls(row: SControl[]): { left: SControl[]; center: SControl[]; right: SControl[] } {
    if (!row?.length) return { left: [], center: [], right: [] };
    const s1 = row.indexOf("spacer"),
      s2 = row.indexOf("spacer", s1 + 1);
    return s1 === -1 ? { left: row, center: [], right: [] } : s2 === -1 ? { left: row.slice(0, s1), center: [], right: row.slice(s1 + 1) } : { left: row.slice(0, s1), center: row.slice(s1 + 1, s2), right: row.slice(s2 + 1) };
  }

  protected getZoneW(ids: SControl[], fallback: ZoneW): ZoneSlot {
    return ids.length === 1 ? (ids.includes("meta") ? (this.getControlEl("meta") ?? fallback) : ids.includes("timeline") ? (this.getControlEl("timeline") ?? fallback) : fallback) : fallback;
  }

  protected fillSWrapper(wrapper: HTMLElement, zoneWs: ZoneSlot[]): void {
    wrapper.innerHTML = "";
    wrapper.append(...zoneWs.map((zoneW) => (zoneW instanceof HTMLElement ? zoneW : (zoneW.cover ?? zoneW.zone))));
  }

  protected fillZone(zoneW: ZoneSlot, ids: SControl[] | BigControl[]): void {
    if (zoneW instanceof HTMLElement || !zoneW.zone) return;
    zoneW.zone.innerHTML = "";
    ids.forEach((id) => this.controls.get(id)?.element && zoneW.zone.append(this.controls.get(id)!.element));
    this.handleControlsView(zoneW.zone);
  }

  protected initScrollAndResize(): void {
    // const meta = this.getControl<Meta>("meta");
    // if (meta) this.scrollAssistEls.push((initScrollAssist(meta.title, { pxPerSecond: 60 }), meta.title));
    // if (meta) this.scrollAssistEls.push((initScrollAssist(meta.artist, { pxPerSecond: 30 }), meta.artist));
    this.zonesArr.forEach((zone) => {
      this.handleControlsView(zone);
      this.scrollAssistEls.push((initScrollAssist(zone, { pxPerSecond: 60 }), zone));
      observeResize(zone, () => this.handleControlsView(zone), this.signal);
      zone.addEventListener("scroll", this.handleDirtyScroll, { passive: true, signal: this.signal });
    });
  }

  public handleControlsView(w: HTMLElement): void {
    if (!w.isConnected) return;
    let spacer: HTMLElement | undefined,
      c: HTMLElement | null = w.firstElementChild as HTMLElement | null;
    do {
      c?.setAttribute("data-displayed", getComputedStyle(c).display !== "none" ? "true" : "false");
      c?.setAttribute("data-spacer", "false");
      if (c?.dataset.displayed === "true" && !spacer) spacer = c;
    } while ((c = (c?.nextElementSibling ?? null) as HTMLElement | null));
    this.ctlr.settings.css.currentTopWrapperHeight = `${this.topW.offsetHeight}px`;
    this.ctlr.settings.css.currentBottomWrapperHeight = `${this.bottomW.offsetHeight}px`;
    if (w.dataset.scroller !== "reverse") return;
    spacer?.setAttribute("data-spacer", "true");
    if (w.dataset.resetScrolled === "true") w.dataset.hasScrolled = "false";
    if (w.dataset.hasScrolled === "true" || w.scrollWidth <= w.clientWidth || w.scrollLeft === w.scrollWidth - w.clientWidth) return void (w.scrollWidth <= w.clientWidth && (w.dataset.hasScrolled = "false"));
    w.addEventListener("scroll", () => (w.dataset.hasScrolled = "false"), { once: true, signal: this.signal });
    w.scrollLeft = w.scrollWidth - w.clientWidth;
  }

  protected handleDirtyScroll(e: globalThis.Event): void {
    const el = e.currentTarget as HTMLElement;
    if (el.scrollLeft > 0) el.dataset.hasScrolled = "true";
    el.dataset.resetScrolled = String(el.scrollLeft === (el.dataset.scroller === "reverse" ? el.scrollWidth - el.clientWidth : 0));
  }

  protected onDestroy(): void {
    this.draggable?.destroy();
    this.scrollAssistEls.forEach(removeScrollAssist);
    (this.controls.forEach((instance) => instance.destroy()), this.controls.clear());
  }
}

export const CONTROL_PANEL_BUILD: DeepPartial<ControlPanel> = {
  profile: true,
  title: true,
  artist: true,
  top: ["expandminiplayer", "spacer", "meta", "spacer", "capture", "fullscreenlock", "fullscreenorientation", "removeminiplayer"],
  center: ["bigprev", "bigplaypause", "bignext"],
  bottom: {
    1: [],
    2: ["spacer", "timeline", "spacer"] as const,
    3: [...(!IS_MOBILE ? (["prev", "playpause", "next"] as const) : []), "brightness", "volume", "timeandduration", "spacer", "captions", "settings", "objectfit", "pictureinpicture", "theater", "fullscreen"] as const,
  },
  buffer: "eclipse",
  timeline: { thumbIndicator: true, seek: { relative: !IS_MOBILE, cancel: { delta: 15, timeout: 2000 } } },
  progressBar: IS_MOBILE,
  draggable: DRAGGABLE_BUILD,
};
