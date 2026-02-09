import { BaseComponent } from "./";
import { createEl } from "../utils";
import type { Controller } from "../core/controller";

export class Buffer extends BaseComponent {
  static componentName = "buffer";

  public create(): HTMLElement {
    this.element = createEl("div", { className: "tmg-video-buffer", innerHTML: `<div class="tmg-video-buffer-accent"></div><div class="tmg-video-buffer-eclipse"><div class="tmg-video-buffer-left"><div class="tmg-video-buffer-circle"></div></div><div class="tmg-video-buffer-right"><div class="tmg-video-buffer-circle"></div></div></div>` });
    return this.element;
  }
}
