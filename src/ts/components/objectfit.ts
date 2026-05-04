import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";
import type { ObjectFitPlug, ObjectFit } from "../plugs";

export type ObjectFitConfig = undefined;

export class ObjectFitButton extends BaseComponent<ObjectFitConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "objectfit";
  public static readonly isControl: boolean = true;

  protected get plug() {
    return this.ctlr.plug<ObjectFitPlug>("objectFit");
  }

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-object-fit-btn", type: "button", innerHTML: IconRegistry.get("objectFitContain") + IconRegistry.get("objectFitCover") + IconRegistry.get("objectFitFill") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.objectFit", this.syncARIA, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.objectFit", this.syncARIA, { signal: this.signal, immediate: true });
    // Feature Gating
    this.media.tech.features.on("objectFit", this.gate, { signal: this.signal });
  }

  protected handleClick(): void {
    this.plug?.rotateObjectFit();
  }

  public syncARIA(): void {
    this.state.label = { contain: "Fit to screen", cover: "Stretch", fill: "Crop to fit" }[this.media.state.objectFit];
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.objectFit);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
