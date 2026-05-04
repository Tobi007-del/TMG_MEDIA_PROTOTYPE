import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { ModesPlug } from "../plugs";
import { createEl } from "../utils";

export type RemoveMiniplayerConfig = undefined;

export class RemoveMiniplayerButton extends BaseComponent<RemoveMiniplayerConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "removeminiplayer";
  public static readonly isControl: boolean = true;
  protected get pin() {
    return this.ctlr.plug<ModesPlug>("modes")?.miniplayer;
  }

  public override create(): HTMLButtonElement {
    return (this.element = createEl("button", { className: "tmg-video-removeminiplayer-btn", type: "button", innerHTML: IconRegistry.get("removeminiplayer") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Post Wiring
    this.syncARIA();
  }

  protected handleClick(): void {
    this.pin?.remove();
  }

  public syncARIA(): void {
    this.state.label = "Remove miniplayer";
    this.state.cmd = " (Escape)";
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
