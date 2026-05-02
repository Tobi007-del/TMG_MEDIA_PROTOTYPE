import { BaseComponent, ComponentState } from "./";
import { createEl } from "../utils";

export type BufferConfig = undefined;

export class Buffer extends BaseComponent<BufferConfig, ComponentState, HTMLDivElement> {
  static readonly componentName = "buffer";

  public override create() {
    return (this.element = createEl("div", { className: "tmg-video-buffer", innerHTML: `<div class="tmg-video-buffer-accent"></div><div class="tmg-video-buffer-eclipse"><div class="tmg-video-buffer-left"><div class="tmg-video-buffer-circle"></div></div><div class="tmg-video-buffer-right"><div class="tmg-video-buffer-circle"></div></div></div>` }));
  }

  public override mount(): void {
    // DOM Injection
    this.ctlr.DOM.controlsContainer?.prepend(this.element);
  }
}
