import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl, formatKeyForDisplay } from "../utils";

export type PictureInPictureConfig = undefined;

export class PictureInPictureButton extends BaseComponent<PictureInPictureConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "pictureinpicture";
  public static readonly isControl: boolean = true;

  public override create() {
    return (this.element = createEl("button", { className: "tmg-video-picture-in-picture-btn", type: "button", innerHTML: IconRegistry.get("enterpip") + IconRegistry.get("leavepip") }, { draggableControl: "", controlId: this.name }));
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.pictureInPicture", this.syncARIA, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.pictureInPicture", this.syncARIA, { signal: this.signal, immediate: true });
    // Feature Gating
    this.media.tech.features.on("pictureInPicture", this.gate, { signal: this.signal });
  }

  protected handleClick(): void {
    this.media.intent.pictureInPicture = !this.media.state.pictureInPicture;
  }

  public syncARIA(): void {
    this.state.label = this.media.state.pictureInPicture ? "Exit picture in picture" : "Picture in picture";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.pictureInPicture);
    this.el.title = this.state.label + this.state.cmd;
    this.setBtnARIA();
  }
}
