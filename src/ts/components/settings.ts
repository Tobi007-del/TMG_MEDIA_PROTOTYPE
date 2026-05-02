import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";

export type SettingsConfig = undefined;

export class SettingsButton extends BaseComponent<SettingsConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "settings";
  public static readonly isControl: boolean = true;
  // protected get plug() {
  //   return this.ctlr.plug<SettingsPlug>("settings");
  // }

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-settings-btn", type: "button", innerHTML: IconRegistry.get("settings") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.shortcuts.settings", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    // JS: this.plug?.toggleSettingsView();
  }

  protected syncARIA(): void {
    this.state.label = "Settings";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.settings);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
