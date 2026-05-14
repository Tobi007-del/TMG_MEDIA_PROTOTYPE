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
    super(ctlr, { label: "Volume", ...config });
  }

  public override wire(): void {
    super.wire();
    // Ctlr Media Listeners
    this.media.on("state.volume", this.handleVolumeState, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.volume.max", ({ value }) => (this.config.max = value!), { signal: this.signal, immediate: true });
  }
  protected override seek(value: number): void {
    super.seek(value), this.plug?.handleSliderInput(value);
  }
  public override syncBarPos(): void {}

  protected handleVolumeState({ value }: REvent<CtlrMedia, "state.volume">): void {
    this.config.value = value;
  }
}
