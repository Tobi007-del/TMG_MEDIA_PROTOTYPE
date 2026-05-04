import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";
import type { PlaylistPlug } from "../plugs";

export type PrevConfig = undefined;

export class PrevButton extends BaseComponent<PrevConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "prev";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.plug<PlaylistPlug>("playlist");
  }

  public override create() {
    this.element = createEl("button", { className: "tmg-video-prev-btn", type: "button", innerHTML: IconRegistry.get("prev") }, { draggableControl: "", controlId: this.name });
    return this.hide(), this.element;
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Plug Listeners
    this.plug?.state.on("currentIndex", () => this[this.plug!.atFirst ? "hide" : "show"](), { signal: this.signal, immediate: true });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.shortcuts.prev", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.plug?.previous();
  }

  public syncARIA(): void {
    this.state.label = "Previous";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.prev);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
