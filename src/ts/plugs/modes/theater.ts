import { BaseModule } from "../";
import type { REvent } from "../../sia-reactor";
import type { CtlrMedia } from "../../types/contract";
import type { CtlrConfig } from "../../types/config";
import { IS_MOBILE } from "../../utils";

export type TheaterConfig = {
  disabled: boolean;
};

export class TheaterModule extends BaseModule<TheaterConfig> {
  public static readonly moduleName = "theater";

  public wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.modes.theater.disabled", this.handleDisabledConfig, { signal: this.signal });
    // ---- Media --------
    this.media.on("intent.theater", this.handleTheaterIntent, { capture: true, signal: this.signal });
    // Post Wiring
    this.media.tech.features.theater = !this.config.disabled;
  }

  protected handleDisabledConfig({ value }: REvent<CtlrConfig, "settings.modes.theater.disabled">): void {
    this.media.tech.features.theater = !value;
    if (value && this.ctlr.isUIActive("theater")) this.media.intent.theater = false;
  }

  protected handleTheaterIntent(e: REvent<CtlrMedia, "intent.theater">): void {
    if (e.resolved) return;
    if (this.config.disabled && this.ctlr.isUIActive("theater")) return e.resolve(this.name);
    this.ctlr.videoContainer.classList.toggle("tmg-video-theater", e.value);
    this.media.state.theater = e.value;
    e.resolve(this.name);
  }
}

export const THEATER_BUILD: Partial<TheaterConfig> = { disabled: !IS_MOBILE };
