import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";
import type { PlaylistPlug } from "../plugs";

export type BigNextConfig = undefined;

export class BigNextButton extends BaseComponent<BigNextConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "bignext";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.plug<PlaylistPlug>("playlist");
  }

  public override create() {
    this.element = createEl("button", { className: "tmg-video-big-next-btn", type: "button", innerHTML: IconRegistry.get("next") }, { draggableControl: "", dragId: "big", controlId: this.name });
    return this.hide(), this.element;
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.shortcuts.next", this.syncARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("playlist", this.syncUI, { signal: this.signal, immediate: true, depth: 1 });
  }

  protected handleClick(): void {
    this.plug?.next();
  }

  public syncUI(): void {
    this[this.ctlr.config.playlist && this.ctlr.config.playlist.length > 1 ? "show" : "hide"](), this[this.plug?.atLast ?? true ? "disable" : "enable"]();
  }
  public syncARIA(): void {
    this.state.label = "Next";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.next);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
