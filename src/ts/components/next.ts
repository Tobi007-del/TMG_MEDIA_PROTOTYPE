import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";
import type { PlaylistPlug } from "../plugs";

export type NextConfig = undefined;

export class NextButton extends BaseComponent<NextConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "next";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.plug<PlaylistPlug>("playlist");
  }

  public override create() {
    this.element = createEl("button", { className: "tmg-video-next-btn", type: "button", innerHTML: IconRegistry.get("next") }, { draggableControl: "", controlId: this.name });
    return (this.hide(), this.element);
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Plug Listeners
    this.plug?.state.on("currentIndex", () => this[this.plug!.atLast ? "hide" : "show"](), { signal: this.signal, immediate: true });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.shortcuts.next", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.plug?.next();
  }

  protected syncARIA(): void {
    this.state.label = "Next";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.next);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
