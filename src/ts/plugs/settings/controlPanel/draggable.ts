import { BasePin, ControlPanelPlug, OverlayPlug } from "../..";
import { getPath, setPath } from "sia-reactor/utils";
import { getElSiblingAt, inBoolArrOpt, setTimeout, requestAnimationFrame } from "../../../utils";
import type { ControlPanelDraggable, ZoneW, ZoneSlot, AnyControl } from "./types";

export class ControlPanelDraggablePin extends BasePin<ControlPanelPlug, ControlPanelDraggable> {
  public static readonly pinName: string = "draggable";
  public static readonly plugName: string = "controlPanel";
  protected draggingEl: HTMLElement | null = null;
  protected replaced: { target: HTMLElement; child: HTMLElement } | null = null;
  protected safeTimeoutId = -1;

  public override wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.controlPanel.draggable", ({ value }) => this.setDragEventListeners(value ? "add" : "remove"), { signal: this.signal, immediate: true });
  }

  public setDragEventListeners(action: "add" | "remove"): void {
    this.ctlr.queryDOM("[data-draggable-control]", true).forEach((c) => {
      c.dataset.dragId = c.dataset.dragId ?? "";
      const act = !inBoolArrOpt(this.config, c.dataset.dragId) ? "remove" : action;
      c.dataset.draggableControl = String((c.draggable = act === "add"));
      c[`${act}EventListener` as "addEventListener"]("dragstart", this.handleDragStart, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("drag", this.handleDrag, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("dragend", this.handleDragEnd, { signal: this.signal });
    });
    [...this.ctlr.queryDOM("[data-drop-zone][data-drag-id]", true), ...this.plug.zonesArr].forEach((c) => {
      c.dataset.dragId = c.dataset.dragId ?? "";
      const act = !inBoolArrOpt(this.config, c.dataset.dragId) ? "remove" : action;
      c.dataset.dropZone = String(act === "add");
      c[`${act}EventListener` as "addEventListener"]("dragenter", this.handleDragEnter, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("dragover", this.handleDragOver, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("drop", this.handleDrop, { signal: this.signal });
      c[`${act}EventListener` as "addEventListener"]("dragleave", this.handleDragLeave, { signal: this.signal });
    });
  }

  protected getUIZoneWCoord(target: HTMLElement, zoneW = false): string | { coord: string; zoneW: ZoneW } {
    let key = "";
    const pos = ({ 0: "left", 1: "center", 2: "right" } as const)[[...target.parentElement!.children].indexOf(target) as 0 | 1 | 2],
      cws = this.ctlr.queryDOM(".tmg-media-top-controls-wrapper, .tmg-media-bottom-sub-controls-wrapper", true);
    cws.forEach((w, i) => w.contains(target) && (key = ({ 0: "top.", 1: "bottom.1.", 2: "bottom.2.", 3: "bottom.3." } as const)[i as 0 | 1 | 2 | 3]));
    return zoneW ? { coord: key + pos, zoneW: getPath(this.plug.zoneWs as any, (key + pos) as any) } : key + pos;
  }

  public syncConfig(): void {
    const id = (el: HTMLElement) => el.dataset.controlId,
      derive = (zoneW: ZoneSlot, center = false) => [center ? "spacer" : "", ...(zoneW instanceof HTMLElement ? [id(zoneW)] : Array.from(zoneW.zone.children as HTMLCollectionOf<HTMLElement>, id)), center && (zoneW instanceof HTMLElement ? true : zoneW.zone.children.length) ? "spacer" : ""].filter(Boolean) as AnyControl[]; // at least one spacer
    this.ctlr.settings.controlPanel.top = [...derive(this.plug.cZoneWs.top.left), ...derive(this.plug.cZoneWs.top.center, true), ...derive(this.plug.cZoneWs.top.right)];
    this.ctlr.settings.controlPanel.center = derive(this.plug.zoneWs.center);
    this.ctlr.settings.controlPanel.bottom = { 1: [...derive(this.plug.cZoneWs.bottom[1].left), ...derive(this.plug.cZoneWs.bottom[1].center, true), ...derive(this.plug.cZoneWs.bottom[1].right)], 2: [...derive(this.plug.cZoneWs.bottom[2].left), ...derive(this.plug.cZoneWs.bottom[2].center, true), ...derive(this.plug.cZoneWs.bottom[2].right)], 3: [...derive(this.plug.cZoneWs.bottom[3].left), ...derive(this.plug.cZoneWs.bottom[3].center, true), ...derive(this.plug.cZoneWs.bottom[3].right)] };
  }

  protected noDropOff(t: HTMLElement, drop = this.draggingEl): boolean {
    return t.dataset.dropZone !== "true" || !drop?.tagName || (t.dataset.dragId !== drop.dataset.dragId && (t.dataset.dragId === "wrapper" || drop.dataset.dragId === "wrapper"));
  }

  protected handleDragStart(e: DragEvent): void {
    const { target: t, dataTransfer } = e as DragEvent & { target: HTMLElement };
    if (t.dataset.draggableControl !== "true" || !t?.tagName) return;
    if (t.matches(":has(input:is(:hover, :active))")) return e.preventDefault();
    dataTransfer!.effectAllowed = "move";
    this.draggingEl = t;
    requestAnimationFrame(() => t.classList.add("tmg-media-control-draggingEl"), this.signal);
    this.safeTimeoutId = setTimeout(() => t.classList.remove("tmg-media-control-draggingEl"), 1000, this.signal); // for mobile browsers supporting the API but not living up
    if (t.dataset.dragId !== "wrapper" || t.parentElement?.dataset.dragId !== "wrapper") return;
    const { coord, zoneW } = this.getUIZoneWCoord(t, true) as { coord: string; zoneW: ZoneW };
    setPath(this.plug.cZoneWs as any, coord as any, zoneW);
    this.replaced = { target: t.parentElement!, child: zoneW.cover! };
  }

  protected handleDrag(): void {
    this.ctlr.plug<OverlayPlug>("overlay")?.delay();
    clearTimeout(this.safeTimeoutId);
  }

  protected handleDragEnd(e: DragEvent): void {
    const t = e.target as HTMLElement;
    t.classList.remove("tmg-media-control-draggingEl");
    this.replaced = this.draggingEl = null;
    if (t.dataset.dragId === "wrapper" && t.parentElement?.dataset.dragId === "wrapper") setPath(this.plug.cZoneWs as any, this.getUIZoneWCoord(t) as any, t);
    this.syncConfig();
  }

  protected handleDragEnter(e: DragEvent): void {
    !this.noDropOff(e.target as HTMLElement) && this.draggingEl && (e.target as HTMLElement).classList.add("tmg-media-dragover");
  }

  protected handleDragOver(e: DragEvent): void {
    const { target: t, clientX: x, dataTransfer } = e as DragEvent & { target: HTMLElement };
    if (this.noDropOff(t)) return;
    e.preventDefault();
    dataTransfer!.dropEffect = "move";
    this.ctlr.throttle(
      "dragOver",
      () => {
        if (t.dataset.dragId === "wrapper") {
          const atWrapper = getElSiblingAt(x, "x", t.querySelectorAll<HTMLElement>('.tmg-media-side-controls-wrapper-cover:has([data-drop-zone="true"][data-drag-id=""]:empty)'), "at") as HTMLElement | undefined;
          if (!atWrapper) return;
          this.replaced?.target.replaceChild(this.replaced.child, this.draggingEl!);
          this.replaced = { target: t, child: atWrapper };
          return t.replaceChild(this.draggingEl!, atWrapper);
        }
        const afterControl = getElSiblingAt(x, "x", t.querySelectorAll<HTMLElement>("[draggable=true]:not(.tmg-media-control-draggingEl)"));
        afterControl ? t.insertBefore(this.draggingEl!, afterControl) : t.append(this.draggingEl!);
        !t.dataset.dragId && this.plug.zonesArr.forEach(this.plug.handleControlsView);
      },
      500,
      false
    );
  }

  protected handleDrop(e: DragEvent): void {
    !this.noDropOff(e.target as HTMLElement) && (e.target as HTMLElement).classList.remove("tmg-media-dragover");
  }

  protected handleDragLeave(e: DragEvent): void {
    !this.noDropOff(e.target as HTMLElement) && (e.target as HTMLElement).classList.remove("tmg-media-dragover");
  }
}
