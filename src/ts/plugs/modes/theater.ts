import { BaseModule } from "../";
import type { Event } from "../../types/reactor";
import type { CtlrMedia } from "../../types/contract";
import type { VideoBuild } from "../../types/build";

export type TheaterConfig = {
  disabled: boolean;
};

export class TheaterModule extends BaseModule<TheaterConfig> {
  public static readonly moduleName = "theater";

  public wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.modes.theater.disabled", this.handleDisabledConfig, { signal: this.signal });
    // ---- Media --------
    this.ctlr.media.on("intent.theater", this.handleTheaterIntent, { capture: true, signal: this.signal });
    // Post Wiring
    this.ctlr.media.tech.features.theater = !this.config.disabled;
  }

  protected handleDisabledConfig({ value }: Event<VideoBuild, "settings.modes.theater.disabled">): void {
    this.ctlr.media.tech.features.theater = !value;
    if (value && this.ctlr.isUIActive("theater")) this.ctlr.media.intent.theater = false;
  }

  protected handleTheaterIntent(e: Event<CtlrMedia, "intent.theater">): void {
    if (e.resolved) return;
    if (this.config.disabled && this.ctlr.isUIActive("theater")) return e.resolve(this.name);
    this.ctlr.videoContainer.classList.toggle("tmg-video-theater", e.value);
    this.ctlr.media.state.theater = e.value;
    e.resolve(this.name);
  }
}
