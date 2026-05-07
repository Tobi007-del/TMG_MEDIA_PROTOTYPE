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
    super(ctlr, { label: "Brightness", min: 0, max: 100, step: 1, value: 100, previewValue: 100, scrub: { sync: true, relative: true, cancel: { delta: 15, timeout: 2000 } }, wheel: { disabled: false, axisRatio: 6 }, ...config });
  }

  public override wire(): void {
    super.wire();
    // Ctlr Media Listeners
    this.media.on("state.brightness", this.handleBrightnessState, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.brightness.max", ({ value }) => (this.config.max = value!), { signal: this.signal, immediate: true });
  }
  public override syncBarPos(): void {}

  protected override seek(value: number): void {
    super.seek(value), this.plug?.handleSliderInput(value);
  }

  protected handleBrightnessState({ value }: REvent<CtlrMedia, "state.brightness">): void {
    this.config.value = value;
  }
}
