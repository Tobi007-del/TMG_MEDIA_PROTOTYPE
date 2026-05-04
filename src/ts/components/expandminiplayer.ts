import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { ModesPlug } from "../plugs";
import { createEl } from "../utils";

export type ExpandMiniplayerConfig = undefined;

export class ExpandMiniplayerButton extends BaseComponent<ExpandMiniplayerConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "expandminiplayer";
  public static readonly isControl: boolean = true;
  protected get pin() {
    return this.ctlr.plug<ModesPlug>("modes")?.miniplayer;
  }

  public override create(): HTMLButtonElement {
    return (this.element = createEl("button", { className: "tmg-video-expandminiplayer-btn", type: "button", innerHTML: IconRegistry.get("expandminiplayer") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Post Wiring
    this.syncARIA();
  }

  protected handleClick(): void {
    this.pin?.expand();
  }

  public syncARIA(): void {
    this.el.title = this.state.label = "Expand miniplayer";
    this.setBtnARIA();
  }
}
