import { BasePlug, CONTROL_PANEL_BUILD, ControlPanel, ControlPanelBottomTuple, ControlPanelCurrentZoneWs, ControlPanelDraggablePin, ControlPanelZoneWs, Row, ROWS_ARR, AnyControl, ZoneSlot, ZoneW } from "../..";
import type { Controller } from "../../../core/controller";
import type { CtlrConfig } from "../../../types/config";
import { type REvent } from "sia-reactor";
import { BaseComponent, Timeline } from "../../../components";
import { ComponentRegistry } from "../../../core/registry";
import { isBool, createEl, parsePanelBottomObj, observeResize } from "../../../utils";
import { initScrollAssist, removeScrollAssist } from "@t007/utils/hooks/vanilla";
import { fanout } from "sia-reactor/utils";

export class ControlPanelPlug extends BasePlug<ControlPanel> {
  public static readonly plugName: string = "controlPanel";
  public static readonly build = CONTROL_PANEL_BUILD;
  public controls = new Map<string, BaseComponent<any, any>>();
  public draggable!: ControlPanelDraggablePin;
  public zoneWs!: ControlPanelZoneWs;
  public cZoneWs!: ControlPanelCurrentZoneWs;
  public zonesArr!: HTMLElement[];
  protected topW!: HTMLElement;
  protected bottomW!: HTMLElement;
  protected scrollers: HTMLElement[] = [];
  public getCtrl<T extends BaseComponent = BaseComponent>(name: string): T | undefined {
    return this.controls.get(name) as T | undefined;
  }
  public getCtrlEl<T extends HTMLElement = HTMLElement>(name: string): T | undefined {
    return this.getCtrl(name)?.element as T | undefined;
  }

  constructor(ctlr: Controller, config: ControlPanel) {
    super(ctlr, config);
    this.draggable = new ControlPanelDraggablePin(this.ctlr, this.config.draggable).setup();
  }

  public override mount(): void {
    // Variables Assignment
    const buffer = ComponentRegistry.init("buffer", this.ctlr);
    this.topW = createEl("div", { className: "tmg-media-top-controls-wrapper tmg-media-apt-controls-wrapper" }, { dropZone: "", dragId: "wrapper" });
    this.bottomW = createEl("div", { className: "tmg-media-bottom-controls-wrapper" });
    buffer && this.controls.set("buffer", buffer);
    ComponentRegistry.getAll().forEach((Comp) => Comp.isControl && this.controls.set(Comp.componentName, ComponentRegistry.init(Comp.componentName, this.ctlr)!));
    this.zoneWs = { top: {}, center: {}, bottom: { 1: {}, 2: {}, 3: {} } } as ControlPanelZoneWs;
    this.zoneWs.top = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") };
    this.zoneWs.center = { zone: createEl("div", { className: "tmg-media-big-controls-wrapper" }, { dropZone: "", dragId: "big" }), cover: createEl("div", { className: "tmg-media-big-controls-wrapper-cover" }) };
    ROWS_ARR.forEach((i) => (this.zoneWs.bottom[i] = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") }));
    this.cZoneWs = { top: {}, center: this.zoneWs.center, bottom: { 1: {}, 2: {}, 3: {} } } as ControlPanelCurrentZoneWs;
    this.zonesArr = [...Object.values(this.zoneWs.top), ...Object.values(this.zoneWs.bottom).map((v) => Object.values(v))].flat().map((w) => w.zone);
    // DOM Injection
    this.zoneWs.center.cover!.append(this.zoneWs.center.zone);
    this.topW.append(this.zoneWs.top.left.cover!, this.zoneWs.top.center.cover!, this.zoneWs.top.right.cover!);
    ROWS_ARR.forEach((i) => {
      const row = createEl("div", { className: `tmg-media-bottom-sub-controls-wrapper tmg-media-bottom-${i}-sub-controls-wrapper tmg-media-apt-controls-wrapper` }, { dropZone: "", dragId: "wrapper" });
      this.bottomW.append((row.append(this.zoneWs.bottom[i].left.cover!, this.zoneWs.bottom[i].center.cover!, this.zoneWs.bottom[i].right.cover!), row));
    });
    this.ctlr.DOM.controlsContainer?.append(this.topW, this.zoneWs.center.cover!, this.bottomW);
  }

  public override wire(): void {
    // Ctlr Config Setters
    this.ctlr.config.set("settings.controlPanel.bottom", (value) => parsePanelBottomObj(value), { immediate: true });
    // ----------- Listeners
    this.ctlr.config.on("settings.controlPanel.top", this.handleTop, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.center", this.handleCenter, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.bottom", this.handleBottom, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.buffer", ({ value }) => (this.media.container.dataset.buffer = String(value)), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.thumbIndicator", ({ value }) => (this.media.container.dataset.thumbIndicator = String(value)), { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.seek", this.handleTimelineSeek, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.timeline.previews", this.handleTimelinePreview, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.controlPanel.progressBar", ({ value }) => this.media.container.classList.toggle("tmg-media-progress-bar", !!value), { signal: this.signal, immediate: true });
    // Post Wiring
    this.initScrollAndResize();
  }

  protected handleTop({ value }: REvent<CtlrConfig, "settings.controlPanel.top">): void {
    if (!value || isBool(value)) return;
    const { left, center, right } = this.getSplitControls(value);
    this.fillSWrapper(this.topW, [(this.cZoneWs.top.left = this.getZoneW(left, this.zoneWs.top.left)), (this.cZoneWs.top.center = this.getZoneW(center, this.zoneWs.top.center)), (this.cZoneWs.top.right = this.getZoneW(right, this.zoneWs.top.right))]);
    this.fillZone(this.cZoneWs.top.left, left), this.fillZone(this.cZoneWs.top.center, center), this.fillZone(this.cZoneWs.top.right, right);
  }
  protected handleCenter({ value }: REvent<CtlrConfig, "settings.controlPanel.center">): void {
    if (!value || isBool(value)) return;
    this.fillZone(this.cZoneWs.center, value);
  }
  protected handleBottom({ value }: REvent<CtlrConfig, "settings.controlPanel.bottom">): void {
    if (!value || isBool(value)) return;
    ROWS_ARR.forEach((i) => {
      const { left, center, right } = this.getSplitControls((value as ControlPanelBottomTuple)[i]);
      this.fillSWrapper(this.bottomW.children[i - 1] as HTMLElement, [(this.cZoneWs.bottom[i].left = this.getZoneW(left, this.zoneWs.bottom[i].left)), (this.cZoneWs.bottom[i].center = this.getZoneW(center, this.zoneWs.bottom[i].center)), (this.cZoneWs.bottom[i].right = this.getZoneW(right, this.zoneWs.bottom[i].right))]);
      this.fillZone(this.cZoneWs.bottom[i].left, left), this.fillZone(this.cZoneWs.bottom[i].center, center), this.fillZone(this.cZoneWs.bottom[i].right, right);
    });
  }
  protected handleTimelineSeek({ currentTarget: { value } }: REvent<CtlrConfig, "settings.controlPanel.timeline.seek">, timeline = this.getCtrl<Timeline>("timeline")): void {
    if (timeline) fanout(timeline.config.scrub, value);
  }
  protected handleTimelinePreview({ currentTarget: { value } }: REvent<CtlrConfig, "settings.controlPanel.timeline.previews">, timeline = this.getCtrl<Timeline>("timeline")): void {
    if (timeline) timeline.config.previews = value;
  }

  protected buildWSkel(side: string): ZoneW {
    const zone = createEl("div", { className: `tmg-media-side-controls-wrapper tmg-media-${side}-side-controls-wrapper` }, { dropZone: "", scroller: side === "right" ? "reverse" : "" }),
      cover = createEl("div", { className: `tmg-media-side-controls-wrapper-cover tmg-media-${side}-side-controls-wrapper-cover` });
    return cover.append(zone), { cover, zone };
  }

  protected getSplitControls(row: AnyControl[]): { left: AnyControl[]; center: AnyControl[]; right: AnyControl[] } {
    if (!row?.length) return { left: [], center: [], right: [] };
    const s1 = row.indexOf("spacer"),
      s2 = row.indexOf("spacer", s1 + 1);
    return s1 === -1 ? { left: row, center: [], right: [] } : s2 === -1 ? { left: row.slice(0, s1), center: [], right: row.slice(s1 + 1) } : { left: row.slice(0, s1), center: row.slice(s1 + 1, s2), right: row.slice(s2 + 1) };
  }
  protected getZoneW(ids: AnyControl[], fallback: ZoneW): ZoneSlot {
    return ids.length === 1 ? (ids.includes("meta") ? this.getCtrlEl("meta") ?? fallback : ids.includes("timeline") ? this.getCtrlEl("timeline") ?? fallback : fallback) : fallback;
  }

  protected fillSWrapper(wrapper: HTMLElement, zoneWs: ZoneSlot[]): void {
    wrapper.innerHTML = "";
    wrapper.append(...zoneWs.map((zoneW) => (zoneW instanceof HTMLElement ? zoneW : zoneW.cover ?? zoneW.zone)));
  }
  protected fillZone(zoneW: ZoneSlot, ids: AnyControl[]): void {
    if (zoneW instanceof HTMLElement || !zoneW.zone) return;
    zoneW.zone.innerHTML = "";
    ids.forEach((id) => this.controls.get(id)?.element && zoneW.zone.append(this.controls.get(id)!.element));
    this.handleControlsView(zoneW.zone);
  }

  protected initScrollAndResize(): void {
    [...this.zonesArr, this.zoneWs.center.zone].forEach((el) => {
      this.handleControlsView(el);
      this.scrollers.push((initScrollAssist(el, { pxPerSecond: el.dataset.dragId === "big" ? 120 : 60 }), el));
      observeResize(el, () => this.handleControlsView(el), this.signal);
      el.addEventListener("scroll", this.handleDirtyScroll, { passive: true, signal: this.signal });
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

  protected override onDestroy(): void {
    this.scrollers.forEach(removeScrollAssist);
    this.draggable.destroy(), this.controls.forEach((instance) => instance.destroy()), this.controls.clear();
  }
}

export type * from "./types";
export * from "./build";
export * from "./draggable";
