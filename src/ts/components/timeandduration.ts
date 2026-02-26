import { BaseComponent, ComponentState } from ".";
import { addSafeClicks, createEl, formatKeyForDisplay } from "../utils";
import type { TimePlug } from "../plugs";

export type TimeAndDurationConfig = undefined;

export class TimeAndDuration extends BaseComponent<TimeAndDurationConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "timeandduration";
  public static readonly isControl: boolean = true;
  protected plug?: TimePlug;
  protected time!: HTMLElement;
  protected bridge!: HTMLElement;
  protected duration!: HTMLElement;

  public create() {
    this.element = createEl("button", { className: "tmg-video-time-and-duration" }, { draggableControl: "", controlId: this.name });
    this.time = createEl("span", { className: "tmg-video-current-time" });
    this.bridge = createEl("span", { className: "tmg-video-time-bridge" });
    this.duration = createEl("span", { className: "tmg-video-duration-time" });
    this.element.append(this.time, this.bridge, this.duration);
    return this.element;
  }

  public wire(): void {
    this.plug = this.ctlr.getPlug<TimePlug>("time");
    addSafeClicks(this.element, this.plug?.toggleMode, this.plug?.rotateFormat, { signal: this.signal });
    this.ctlr.media.on("state.currentTime", this.updateTime, { signal: this.signal });
    this.ctlr.media.on("status.duration", this.updateDuration, { signal: this.signal });
    this.ctlr.config.on("settings.time.format", this.updateUI, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.mode", this.updateTime, { signal: this.signal });
    this.ctlr.config.on("settings.keys.shortcuts.timeMode", this.updateARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.keys.shortcuts.timeFormat", this.updateARIA, { signal: this.signal });
  }

  protected updateUI(): void {
    const bridgeText = { digital: "/", human: "of", "human-long": "out of" }[this.ctlr.config.settings.time.format];
    this.bridge.textContent = bridgeText || "/";
    (this.updateTime(), this.updateDuration());
  }
  protected updateTime(): void {
    this.time.textContent = this.plug?.toTimeText(this.ctlr.media.state.currentTime, true) || "-:--";
  }
  protected updateDuration(): void {
    this.duration.textContent = this.plug?.toTimeText(this.ctlr.media.status.duration) || "--:--";
  }
  protected updateARIA() {
    this.state.label = `Show ${this.plug?.nextMode} time`;
    this.state.cmd = formatKeyForDisplay(this.ctlr.config.settings.time.mode);
    this.el.title = `Switch (mode${this.state.cmd} / DblClick→format${formatKeyForDisplay(this.ctlr.config.settings.keys.shortcuts.timeFormat)})`;
    this.setBtnARIA("Switch time format");
  }
}
