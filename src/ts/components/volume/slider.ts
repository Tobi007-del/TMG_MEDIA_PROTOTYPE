import { RangeSlider, type RangeConfig, type RangeState } from "..";
import type { Controller } from "../../core/controller";
import type { CtlrMedia } from "../../types/contract";
import type { REvent } from "sia-reactor";
import type { VolumePlug } from "../../plugs";

export type VolumeSliderConfig = Partial<RangeConfig>;

export class VolumeSlider extends RangeSlider<RangeConfig, RangeState> {
  protected get plug() {
    return this.ctlr.plug<VolumePlug>("volume");
  }

  constructor(ctlr: Controller, config?: VolumeSliderConfig) {
    super(ctlr, { label: "Volume", min: 0, max: 100, step: 1, value: 0, previewValue: 0, scrub: { sync: true, relative: true, cancel: { delta: 15, timeout: 2000 } }, wheel: { disabled: false, axisRatio: 6 }, ...config });
  }

  public override wire(): void {
    super.wire();
    // Ctlr Media Listeners
    this.media.on("state.volume", this.handleVolumeState, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.volume.max", ({ value }) => (this.config.max = value!), { signal: this.signal, immediate: true });
  }
  public override syncBarPos(): void {}

  protected override seek(value: number): void {
    super.seek(value), this.plug?.handleSliderInput(value);
  }

  protected handleVolumeState({ value }: REvent<CtlrMedia, "state.volume">): void {
    this.config.value = value;
  }
}
