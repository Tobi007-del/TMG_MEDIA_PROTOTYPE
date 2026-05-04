import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { ModesPlug } from "../plugs";
import { createEl } from "../utils";

export type FullscreenOrientationConfig = undefined;

export class FullscreenOrientationButton extends BaseComponent<FullscreenOrientationConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "fullscreenorientation";
  public static readonly isControl: boolean = true;
  protected get pin() {
    return this.ctlr.plug<ModesPlug>("modes")?.fullscreen;
  }

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-fullscreen-orientation-btn", type: "button", innerHTML: IconRegistry.get("fullscreenorientation") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Feature Gating
    this.media.tech.features.on("fullscreen", this.gate, { signal: this.signal });
    // Post Wiring
    this.syncARIA();
  }

  protected handleClick(): void {
    this.pin?.changeScreenOrientation();
  }

  public syncARIA(): void {
    this.el.title = this.state.label = "Change orientation";
    this.setBtnARIA();
  }
}
