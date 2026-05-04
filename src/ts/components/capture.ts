import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { FramePlug } from "../plugs";
import { addSafeClicks, createEl, formatKeyForDisplay } from "../utils";

export type CaptureConfig = undefined;

export class CaptureButton extends BaseComponent<CaptureConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "capture";
  public static readonly isControl: boolean = true;
  protected get plug() {
    return this.ctlr.plug<FramePlug>("frame");
  }

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-capture-btn", type: "button", innerHTML: IconRegistry.get("capture") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    addSafeClicks(this.el, this.handleClick, this.handleDblClick, { signal: this.signal });
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.keys.shortcuts.capture", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.plug?.captureFrame();
  }
  protected handleDblClick(): void {
    this.plug?.captureFrame("monochrome");
  }

  public syncARIA(): void {
    this.state.label = "Capture frame";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.capture);
    this.el.title = `Capture${this.state.cmd} ↔ DblClick→B&W (+alt)`;
    this.setBtnARIA("Capture monochrome frame");
  }
}
