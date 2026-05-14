import { RangeSlider, type RangeConfig, type RangeState } from "..";
import type { Controller } from "../../core/controller";
import type { CtlrMedia } from "../../types/contract";
import type { REvent } from "sia-reactor";
import type { BrightnessPlug } from "../../plugs";

export type BrightnessSliderConfig = Partial<RangeConfig>;

export class BrightnessSlider extends RangeSlider<RangeConfig, RangeState> {
  protected get plug() {
    return this.ctlr.plug<BrightnessPlug>("brightness");
  }

  constructor(ctlr: Controller, config?: BrightnessSliderConfig) {
    super(ctlr, { label: "Brightness", ...config });
  }

  public override wire(): void {
    super.wire();
    // Ctlr Media Listeners
    this.media.on("state.brightness", this.handleBrightnessState, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.brightness.max", ({ value }) => (this.config.max = value!), { signal: this.signal, immediate: true });
  }
  protected override seek(value: number): void {
    super.seek(value), this.plug?.handleSliderInput(value);
  }
  public override syncBarPos(): void {}

  protected handleBrightnessState({ value }: REvent<CtlrMedia, "state.brightness">): void {
    this.config.value = value;
  }
}
