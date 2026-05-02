import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";

export type TheaterConfig = undefined;

export class TheaterButton extends BaseComponent<TheaterConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "theater";
  public static readonly isControl: boolean = true;

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-theater-btn", type: "button", innerHTML: IconRegistry.get("entertheater") + IconRegistry.get("leavetheater") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.theater", this.syncUI, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.theater", this.syncARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("settings.modes.theater.disabled", this.syncUI, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.media.intent.theater = !this.media.state.theater;
  }

  protected syncUI(): void {
    this.ctlr.settings.modes.theater.disabled ? this.disable() : this.enable();
    this.syncARIA();
  }
  protected syncARIA(): void {
    this.state.label = this.media.state.theater ? "Default view" : "Cinema mode";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.theater);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
