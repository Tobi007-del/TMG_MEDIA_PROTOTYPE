import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";

export type FullscreenConfig = undefined;

export class FullscreenButton extends BaseComponent<FullscreenConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "fullscreen";
  public static readonly isControl: boolean = true;

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-fullscreen-btn", type: "button", innerHTML: IconRegistry.get("enterfullscreen") + IconRegistry.get("leavefullscreen") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.fullscreen", this.syncARIA, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.fullscreen", this.syncARIA, { signal: this.signal, immediate: true });
    // Feature Gating
    this.media.tech.features.on("fullscreen", this.gate, { signal: this.signal });
  }

  protected handleClick(): void {
    this.media.intent.fullscreen = !this.media.state.fullscreen;
  }

  protected syncARIA(): void {
    this.state.label = this.media.state.fullscreen ? "Exit full screen" : "Full screen";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.fullscreen);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
