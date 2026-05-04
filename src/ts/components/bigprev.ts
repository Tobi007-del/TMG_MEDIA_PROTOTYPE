import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";
import type { PlaylistPlug } from "../plugs";

export type BigPrevConfig = undefined;

export class BigPrevButton extends BaseComponent<BigPrevConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "bigprev";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.plug<PlaylistPlug>("playlist");
  }

  public override create() {
    this.element = createEl("button", { className: "tmg-video-big-prev-btn", type: "button", innerHTML: IconRegistry.get("prev") }, { draggableControl: "", dragId: "big", controlId: this.name });
    return this.hide(), this.element;
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.shortcuts.prev", this.syncARIA, { signal: this.signal, immediate: true });
    this.ctlr.config.on("playlist", this.syncUI, { signal: this.signal, immediate: true, depth: 1 });
  }

  protected handleClick(): void {
    this.plug?.previous();
  }

  public syncUI(): void {
    this[this.ctlr.config.playlist && this.ctlr.config.playlist.length > 1 ? "show" : "hide"](), this[this.plug?.atFirst ?? true ? "disable" : "enable"]();
  }
  public syncARIA(): void {
    this.state.label = "Previous";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.prev);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
