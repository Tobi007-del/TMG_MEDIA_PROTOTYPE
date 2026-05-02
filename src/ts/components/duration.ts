import { BaseComponent, ComponentState } from "./";
import { createEl, formatKeyForDisplay } from "../utils";
import type { TimePlug } from "../plugs";

export type DurationConfig = undefined;

export class DurationButton extends BaseComponent<DurationConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "duration";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.plug<TimePlug>("time");
  }

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-total-time" }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.element.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("status.duration", this.syncUI, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.time.format", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.plug?.rotateFormat();
  }

  protected syncUI(): void {
    this.element.textContent = this.plug?.toTimeText(this.media.status.duration) ?? "--:--";
  }
  protected syncARIA() {
    this.state.label = "Switch time format";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.time.format);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
