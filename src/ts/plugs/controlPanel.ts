import { BasePlug, OverlayPlug } from ".";
import type { VideoBuild } from "../types/build";
import type { Event } from "../types/reactor";
import { controls, bigControls } from "../consts/generics";
import { BaseComponent } from "../components/base";
import { ComponentRegistry } from "../core/registry";
import { createEl, parsePanelBottomObj, inBoolArrOpt, getElSiblingAt, setAny, getAny, setTimeout } from "../utils";
import { Timeline } from "../components";

export type Control = (typeof controls)[number];
export type SControl = Control | "spacer";
export type BigControl = (typeof bigControls)[number];
export type ControlPanelBottomTuple = Record<1 | 2 | 3, SControl[]>;

export interface ControlPanel {
  profile: string | boolean;
  title: string | boolean;
  artist: string | boolean;
  top: SControl[] | boolean;
  center: BigControl[] | boolean;
  bottom: boolean | SControl[] | SControl[][] | Partial<ControlPanelBottomTuple>;
  buffer: "eclipse" | "accent" | boolean;
  timeline: { thumbIndicator: boolean; seek: { relative: boolean; cancel: { delta: number; timeout: number } } };
  progressBar: boolean;
  draggable: ("" | "big" | "wrapper")[] | boolean;
}

type ZoneW = { cover?: HTMLElement; zone: HTMLElement };
type Row = 1 | 2 | 3;

export class ControlPanelPlug extends BasePlug<ControlPanel> {
  public static readonly plugName: string = "controlPanel";
  public static readonly isCore: boolean = false;
  public controls = new Map<string, { element: HTMLElement; instance?: BaseComponent<any, any> }>();
  public getControl<T extends BaseComponent = BaseComponent>(name: string): T | undefined {
    return this.controls.get(name)?.instance as T | undefined;
  }
  public getControlEl<T extends HTMLElement = HTMLElement>(name: string): T | undefined {
    return this.getControl(name)?.element as T | undefined;
  }
  protected zoneWs!: { top: Record<"left" | "center" | "right", ZoneW>; center: ZoneW; bottom: Record<Row, Record<"left" | "center" | "right", ZoneW>> };
  protected cZoneWs!: { top: Record<"left" | "center" | "right", ZoneW>; center: ZoneW; bottom: Record<Row, Record<"left" | "center" | "right", ZoneW>> };
  protected dragging: HTMLElement | null = null;
  protected dragReplaced: { target: HTMLElement; child: HTMLElement } | null = null;
  protected dragSafeTimeoutId: number = -1;

  public mount(): void {
    this.ctl.config.set("settings.controlPanel.bottom", (value) => parsePanelBottomObj(value));
    const cc = this.ctl.DOM.controlsContainer,
      buffer = ComponentRegistry.init("buffer", this.ctl);
    buffer && this.controls.set("buffer", buffer);
    buffer && cc?.prepend(buffer.element);
    this.zoneWs = { top: {}, center: {}, bottom: { 1: {}, 2: {}, 3: {} } } as typeof this.zoneWs;
    this.zoneWs.top = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") };
    this.zoneWs.center = { zone: createEl("div", { className: "tmg-video-big-controls-wrapper" }, { dropZone: "", dragId: "big" }) };
    ([1, 2, 3] as Row[]).forEach((i) => (this.zoneWs.bottom[i] = { left: this.buildWSkel("left"), center: this.buildWSkel("center"), right: this.buildWSkel("right") }));
    const topW = createEl("div", { className: "tmg-video-top-controls-wrapper tmg-video-apt-controls-wrapper" }, { dropZone: "", dragId: "wrapper" });
    topW.append(this.zoneWs.top.left.cover!, this.zoneWs.top.center.cover!, this.zoneWs.top.right.cover!);
    const bottomW = createEl("div", { className: "tmg-video-bottom-controls-wrapper" });
    ([1, 2, 3] as Row[]).forEach((i) => {
      const row = createEl("div", { className: `tmg-video-bottom-sub-controls-wrapper tmg-video-bottom-${i}-sub-controls-wrapper tmg-video-apt-controls-wrapper` }, { dropZone: "", dragId: "wrapper" });
      row.append(this.zoneWs.bottom[i].left.cover!, this.zoneWs.bottom[i].center.cover!, this.zoneWs.bottom[i].right.cover!);
      bottomW.append(row);
    });
    cc?.append(topW, this.zoneWs.center.zone, bottomW);
    ComponentRegistry.getAll().forEach((Comp) => {
      Comp.isControl && this.controls.set(Comp.componentName, ComponentRegistry.init(Comp.componentName, this.ctl)!);
    });
  }

  public wire(): void {
    this.ctl.config.on("settings.controlPanel.top", this.handleTopLayout, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.controlPanel.center", this.handleCenterLayout, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.controlPanel.bottom", this.handleBottomLayout, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.controlPanel.buffer", ({ target: { value } }) => (this.ctl.videoContainer.dataset.buffer = String(value)), { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.controlPanel.timeline.thumbIndicator", ({ target: { value } }) => (this.ctl.videoContainer.dataset.thumbIndicator = String(value)), { signal: this.signal, immediate: true });
    this.ctl.config.on(
      "settings.controlPanel.timeline.seek",
      ({ target: { value } }) => {
        const timeline = this.getControl<Timeline>("timeline");
        if (!timeline) return;
        timeline.config.scrub.relative = value!.relative;
        timeline.config.scrub.cancel = value!.cancel;
      },
      { signal: this.signal, immediate: true }
    );
    this.ctl.config.on("settings.controlPanel.progressBar", ({ target: { value } }) => this.ctl.videoContainer.classList.toggle("tmg-video-progress-bar", !!value), { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.controlPanel.draggable", ({ target: { value } }) => this.setDragEventListeners(value ? "add" : "remove"), { signal: this.signal, immediate: true });
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

  protected fillZone(zoneW: ZoneW, ids: SControl[] | BigControl[]): void {
    if (!zoneW.zone) return;
    zoneW.zone.innerHTML = "";
    ids.forEach((id) => this.controls.get(id)?.element && zoneW.zone.append(this.controls.get(id)!.element));
  }

  protected getZones(): HTMLElement[] {
    return [...Object.values(this.zoneWs.top), ...Object.values(this.zoneWs.bottom).map((v) => Object.values(v))].flat().map((w) => w.zone);
  }

  protected handleTopLayout({ target: { value } }: Event<VideoBuild, "settings.controlPanel.top">): void {
    if (!value || typeof value === "boolean") return;
    const { left, center, right } = this.getSplitControls(value);
    this.fillZone(this.zoneWs.top.left, left);
    this.fillZone(this.zoneWs.top.center, center);
    this.fillZone(this.zoneWs.top.right, right);
  }

  protected handleCenterLayout({ target: { value } }: Event<VideoBuild, "settings.controlPanel.center">): void {
    if (!value || typeof value === "boolean") return;
    this.fillZone(this.zoneWs.center, value);
  }

  protected handleBottomLayout({ target: { value } }: Event<VideoBuild, "settings.controlPanel.bottom">): void {
    if (!value || typeof value === "boolean") return;
    ([1, 2, 3] as Row[]).forEach((i) => {
      const { left, center, right } = this.getSplitControls((value as ControlPanelBottomTuple)[i] ?? []);
      this.fillZone(this.zoneWs.bottom[i].left, left);
      this.fillZone(this.zoneWs.bottom[i].center, center);
      this.fillZone(this.zoneWs.bottom[i].right, right);
    });
  }

  protected getDraggableControls(): NodeListOf<HTMLElement> {
    return this.ctl.queryDOM("[data-draggable-control]", true);
  }

  protected getDropZones(): HTMLElement[] {
    return [...this.ctl.queryDOM("[data-drop-zone][data-drag-id]", true), ...this.getZones()];
  }

  protected setDragEventListeners(action: "add" | "remove"): void {
    const draggable = this.ctl.config.settings.controlPanel.draggable;
    this.getDraggableControls().forEach((c) => {
      c.dataset.dragId = c.dataset.dragId ?? "";
      const act = !inBoolArrOpt(draggable, c.dataset.dragId) ? "remove" : action;
      c.dataset.draggableControl = String((c.draggable = act === "add"));
      c[`${act}EventListener` as "addEventListener"]("dragstart", this.handleDragStart, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("drag", this.handleDrag, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("dragend", this.handleDragEnd, { signal: this.signal });
    });
    this.getDropZones().forEach((c) => {
      c.dataset.dragId = c.dataset.dragId ?? "";
      const act = !inBoolArrOpt(draggable, c.dataset.dragId) ? "remove" : action;
      c.dataset.dropZone = String(act === "add");
      c[`${act}EventListener` as "addEventListener"]("dragenter", this.handleDragEnter, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("dragover", this.handleDragOver, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("drop", this.handleDrop, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("dragleave", this.handleDragLeave, { signal: this.signal });
    });
  }

  protected getUIZoneWCoord(target: HTMLElement, zoneW = false): string | { coord: string; zoneW: ZoneW } {
    let key = "";
    const pos = ({ 0: "left", 1: "center", 2: "right" } as const)[[...target.parentElement!.children].indexOf(target) as 0 | 1 | 2];
    const cws = this.ctl.queryDOM(".tmg-video-top-controls-wrapper, .tmg-video-bottom-sub-controls-wrapper", true);
    cws.forEach((w, i) => w.contains(target) && (key = ({ 0: "top.", 1: "bottom.1.", 2: "bottom.2.", 3: "bottom.3." } as const)[i as 0 | 1 | 2 | 3]));
    return zoneW ? { coord: key + pos, zoneW: getAny(this.zoneWs as any, (key + pos) as any) } : key + pos;
  }

  protected syncControlPanelToUI(): void {
    const id = (el: HTMLElement) => el.dataset.controlId;
    const derive = (zoneW: ZoneW | HTMLElement, center = false) => {
      const zone = "zone" in zoneW ? zoneW.zone : zoneW;
      return [center ? "spacer" : "", ...(zone ? Array.from(zone.children as HTMLCollectionOf<HTMLElement>, id) : [id(zoneW as HTMLElement)]), center && (zone ? zone.children.length : true) ? "spacer" : ""].filter(Boolean) as SControl[];
    };
    this.ctl.config.settings.controlPanel.top = [...derive(this.cZoneWs.top.left), ...derive(this.cZoneWs.top.center, true), ...derive(this.cZoneWs.top.right)];
    this.ctl.config.settings.controlPanel.center = derive(this.zoneWs.center) as unknown as BigControl[];
    this.ctl.config.settings.controlPanel.bottom = {
      1: [...derive(this.cZoneWs.bottom[1].left), ...derive(this.cZoneWs.bottom[1].center, true), ...derive(this.cZoneWs.bottom[1].right)],
      2: [...derive(this.cZoneWs.bottom[2].left), ...derive(this.cZoneWs.bottom[2].center, true), ...derive(this.cZoneWs.bottom[2].right)],
      3: [...derive(this.cZoneWs.bottom[3].left), ...derive(this.cZoneWs.bottom[3].center, true), ...derive(this.cZoneWs.bottom[3].right)],
    };
  }

  protected noDropOff(t: HTMLElement, drop = this.dragging): boolean {
    return t.dataset.dropZone !== "true" || !drop?.tagName || t.dataset.dragId !== drop.dataset.dragId;
  }

  protected handleDragStart(e: DragEvent): void {
    const t = e.target as HTMLElement;
    if (t.dataset.draggableControl !== "true" || !t?.tagName) return;
    if (t.matches(":has(input:is(:hover, :active))")) return e.preventDefault();
    e.dataTransfer!.effectAllowed = "move";
    this.dragging = t;
    requestAnimationFrame(() => t.classList.add("tmg-video-control-dragging"));
    this.dragSafeTimeoutId = setTimeout(() => t.classList.remove("tmg-video-control-dragging"), 1000, this.signal); // for mobile browsers supporting the API but not living up
    if (t.dataset.dragId !== "wrapper" || t.parentElement?.dataset.dragId !== "wrapper") return;
    const { coord, zoneW } = this.getUIZoneWCoord(t, true) as { coord: string; zoneW: ZoneW };
    setAny(this.cZoneWs as any, coord as any, zoneW);
    this.dragReplaced = { target: t.parentElement!, child: zoneW.cover! };
  }

  protected handleDrag(): void {
    this.ctl.getPlug<OverlayPlug>("overlay")?.delay();
    clearTimeout(this.dragSafeTimeoutId);
  }

  protected handleDragEnd(e: DragEvent): void {
    const t = e.target as HTMLElement;
    t.classList.remove("tmg-video-control-dragging");
    this.dragReplaced = this.dragging = null;
    if (t.dataset.dragId === "wrapper" && t.parentElement?.dataset.dragId === "wrapper") setAny(this.cZoneWs as any, this.getUIZoneWCoord(t) as any, t);
    this.syncControlPanelToUI();
  }

  protected handleDragEnter(e: DragEvent): void {
    !this.noDropOff(e.target as HTMLElement) && this.dragging && (e.target as HTMLElement).classList.add("tmg-video-dragover");
  }

  protected handleDragOver(e: DragEvent): void {
    const t = e.target as HTMLElement;
    const x = e.clientX;
    if (this.noDropOff(t)) return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
    this.ctl.throttle(
      "dragOver",
      () => {
        if (t.dataset.dragId === "wrapper") {
          const atWrapper = getElSiblingAt(x, "x", t.querySelectorAll<HTMLElement>('.tmg-video-side-controls-wrapper-cover:has([data-drop-zone="true"][data-drag-id=""]:empty)'), "at") as HTMLElement | undefined;
          if (!atWrapper) return;
          this.dragReplaced?.target.replaceChild(this.dragReplaced.child, this.dragging!);
          this.dragReplaced = { target: t, child: atWrapper };
          return t.replaceChild(this.dragging!, atWrapper);
        }
        const afterControl = getElSiblingAt(x, "x", t.querySelectorAll<HTMLElement>("[draggable=true]:not(.tmg-video-control-dragging)"));
        afterControl ? t.insertBefore(this.dragging!, afterControl) : t.append(this.dragging!);
      },
      500,
      false
    );
  }

  protected handleDrop(e: DragEvent): void {
    !this.noDropOff(e.target as HTMLElement) && (e.target as HTMLElement).classList.remove("tmg-video-dragover");
  }

  protected handleDragLeave(e: DragEvent): void {
    !this.noDropOff(e.target as HTMLElement) && (e.target as HTMLElement).classList.remove("tmg-video-dragover");
  }

  protected onDestroy(): void {
    this.controls.forEach(({ instance }) => instance?.destroy());
    this.controls.clear();
  }
}
