import { BaseComponent, ComponentState } from ".";
import { addSafeClicks, createEl, formatKeyForDisplay } from "../utils";
import type { TimePlug } from "../plugs";

export type TimeAndDurationConfig = undefined;

export class TimeAndDurationButton extends BaseComponent<TimeAndDurationConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "timeandduration";
  public static readonly isControl: boolean = true;
  protected time!: HTMLElement;
  protected bridge!: HTMLElement;
  protected duration!: HTMLElement;
  protected get plug() {
    return this.ctlr.plug<TimePlug>("time");
  }

  public override create() {
    // Variables Assignments
    this.element = createEl("button", { className: "tmg-video-time-and-duration" }, { draggableControl: "", controlId: this.name });
    this.time = createEl("span", { className: "tmg-video-current-time" });
    this.bridge = createEl("span", { className: "tmg-video-time-bridge" });
    this.duration = createEl("span", { className: "tmg-video-duration-time" });
    // DOM Injection
    return this.element.append(this.time, this.bridge, this.duration), this.element;
  }

  public override wire(): void {
    // Event Listeners
    addSafeClicks(this.element, this.handleClick, this.handleDblClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.currentTime", this.syncTime, { signal: this.signal });
    this.media.on("status.duration", this.syncDuration, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.time.format", this.syncUI, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.time.mode", this.syncTime, { signal: this.signal });
    this.ctlr.config.on("settings.keys.shortcuts.timeMode", this.syncARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.keys.shortcuts.timeFormat", this.syncARIA, { signal: this.signal });
  }

  protected handleClick(): void {
    this.plug?.toggleMode();
  }
  protected handleDblClick(): void {
    this.plug?.rotateFormat();
  }

  public syncUI(): void {
    this.bridge.textContent = { digital: "/", human: "of", "human-long": "out of" }[this.ctlr.settings.time.format] || "/";
    this.syncTime(), this.syncDuration();
  }
  public syncTime(): void {
    this.time.textContent = this.plug?.toTimeText(this.media.state.currentTime, true) || "-:--";
  }
  public syncDuration(): void {
    this.duration.textContent = this.plug?.toTimeText(this.media.status.duration) || "--:--";
  }
  public syncARIA() {
    this.state.label = `Show ${this.plug?.nextMode} time`;
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.timeMode);
    this.el.title = `Switch (mode${this.state.cmd} / DblClick→format${formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.timeFormat)})`;
    this.setBtnARIA("Switch time format");
  }
}
