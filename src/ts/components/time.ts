import { BaseComponent, ComponentState } from "./";
import { addSafeClicks, createEl, formatKeyForDisplay } from "../utils";
import type { TimePlug } from "../plugs";

export type TimeConfig = undefined;

export class Time extends BaseComponent<TimeConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "time";
  public static readonly isControl: boolean = true;
  protected plug?: TimePlug;

  public create() {
    this.element = createEl("button", { className: "tmg-video-current-time" }, { draggableControl: "", controlId: this.name });
    return this.element;
  }

  public wire(): void {
    this.plug = this.ctl.getPlug<TimePlug>("time");
    addSafeClicks(this.element, this.plug?.toggleMode, this.plug?.rotateFormat, { signal: this.signal });
    this.ctl.media.on("state.currentTime", this.updateUI, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.time.mode", this.updateUI, { signal: this.signal });
    this.ctl.config.on("settings.time.format", this.updateUI, { signal: this.signal });
    this.ctl.config.on("settings.keys.shortcuts.timeMode", this.updateARIA, { signal: this.signal, immediate: true });
    this.ctl.config.on("settings.keys.shortcuts.timeFormat", this.updateARIA, { signal: this.signal });
  }

  protected updateUI(): void {
    this.element.textContent = this.plug?.toTimeText(this.ctl.media.state.currentTime, true) || "-:--";
  }
  protected updateARIA() {
    this.state.label = `Show ${this.plug?.nextMode} time`;
    this.state.cmd = formatKeyForDisplay(this.ctl.config.settings.time.mode);
    this.el.title = `Switch (mode${this.state.cmd} / DblClick→format${formatKeyForDisplay(this.ctl.config.settings.keys.shortcuts.timeFormat)})`;
    this.setBtnARIA("Switch time format");
  }
}
