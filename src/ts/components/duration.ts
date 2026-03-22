import { BaseComponent, ComponentState } from "./";
import { createEl, formatKeyForDisplay } from "../utils";
import type { TimePlug } from "../plugs";

export type DurationConfig = undefined;

export class Duration extends BaseComponent<DurationConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "duration";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.getPlug<TimePlug>("time");
  }

  public create() {
    return (this.element = createEl("button", { className: "tmg-video-total-time" }, { draggableControl: "", controlId: this.name }));
  }

  public wire(): void {
    // Event Listeners
    this.plug && this.element.addEventListener("click", this.plug?.rotateFormat, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("status.duration", this.updateUI, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.time.format", this.updateARIA, { signal: this.signal, immediate: true });
  }

  protected updateUI(): void {
    this.element.textContent = this.plug?.toTimeText(this.media.status.duration) ?? "--:--";
  }
  protected updateARIA() {
    this.state.label = "Switch time format";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.time.format);
    this.el.title = this.state.label;
    this.setBtnARIA();
  }
}
