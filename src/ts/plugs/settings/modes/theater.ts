import { BasePin, ModesPlug, ModesTheater } from "../..";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../../../types/contract";
import type { CtlrConfig } from "../../../types/config";

export class ModesTheaterPin extends BasePin<ModesPlug, ModesTheater> {
  public static readonly pinName: string = "theater";
  public static readonly plugName: string = "modes";

  public override wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.modes.theater.disabled", this.handleDisabled, { signal: this.signal, immediate: true });
    // ---- Media --------
    this.media.on("intent.theater", this.handleTheaterIntent, { capture: true, signal: this.signal });
  }

  protected handleDisabled({ value }: REvent<CtlrConfig, "settings.modes.theater.disabled">): void {
    this.media.tech.features.theater = !value;
    if (value && this.ctlr.isUIActive("theater")) this.media.intent.theater = false;
  }

  protected handleTheaterIntent(e: REvent<CtlrMedia, "intent.theater">): void {
    if (e.resolved) return;
    if (this.config.disabled && this.ctlr.isUIActive("theater")) return e.resolve(this.name);
    this.media.container.classList.toggle("tmg-media-theater", e.value);
    this.media.state.theater = e.value;
    e.resolve(this.name);
  }
}
