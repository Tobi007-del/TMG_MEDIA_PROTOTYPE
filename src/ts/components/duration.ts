import { BaseComponent, ComponentState } from "./";
import { createEl, formatKeyForDisplay } from "../utils";
import type { Controller } from "../core/controller";
import type { TimePlug } from "../plugs";

export type DurationConfig = undefined;

export class Duration extends BaseComponent<DurationConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "duration";
  public static readonly isControl: boolean = true;
  protected plug?: TimePlug;

  public create() {
    this.element = createEl("button", { className: "tmg-video-total-time" }, { draggableControl: "", controlId: this.name });
    return this.element;
  }

  public wire(): void {
    this.plug = this.ctlr.getPlug<TimePlug>("time");
    this.plug && this.element.addEventListener("click", this.plug?.rotateFormat, { signal: this.signal });
    this.ctlr.media.on("status.duration", this.updateUI, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.format", this.updateARIA, { signal: this.signal, immediate: true });
  }

  protected updateUI(): void {
    this.element.textContent = this.plug?.toTimeText(this.ctlr.media.status.duration) ?? "--:--";
  }
  protected updateARIA() {
    this.state.label = "Switch time format";
    this.state.cmd = formatKeyForDisplay(this.ctlr.config.settings.time.format);
    this.el.title = this.state.label;
    this.setBtnARIA();
  }
}
