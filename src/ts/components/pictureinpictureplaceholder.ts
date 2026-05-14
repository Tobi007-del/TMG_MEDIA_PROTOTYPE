import { BaseComponent, ComponentState } from ".";
import { createEl } from "../utils";
import { IconRegistry } from "../super";

export type PictureInPicturePlaceholderConfig = undefined;

export class PictureInPicturePlaceholder extends BaseComponent<PictureInPicturePlaceholderConfig, ComponentState, HTMLDivElement> {
  public static readonly componentName = "pictureinpictureplaceholder";
  protected iconButton!: HTMLButtonElement;

  public override create() {
    this.iconButton = createEl("button", { className: "tmg-media-picture-in-picture-icon-wrapper", innerHTML: IconRegistry.get("pipplaceholder") });
    return (this.element = createEl("div", { className: "tmg-media-picture-in-picture-placeholder", innerHTML: `<p>Playing in picture-in-picture</p>` }));
  }

  public override mount(): void {
    // DOM Injection
    this.element.prepend(this.iconButton), this.ctlr.DOM.controlsContainer?.prepend(this.element);
  }

  public override wire(): void {
    // Event Listeners
    this.iconButton.addEventListener("click", () => (this.media.intent.pictureInPicture = !this.media.state.pictureInPicture), { signal: this.signal });
  }
}
