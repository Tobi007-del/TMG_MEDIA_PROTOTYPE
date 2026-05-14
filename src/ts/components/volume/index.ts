import { BaseComponent, type ComponentState } from "..";
import { IconRegistry } from "../../core/registry";
import { createEl, formatKeyForDisplay, setTimeout } from "../../utils";
import type { CtlrMedia } from "../../types/contract";
import type { REvent } from "sia-reactor";
import { VolumeSlider, type VolumeSliderConfig } from "./slider";
import { OverlayPlug, type VolumePlug } from "../../plugs";

export type VolumeConfig = VolumeSliderConfig;

export class VolumeControl extends BaseComponent<VolumeConfig, ComponentState> {
  public static readonly componentName: string = "volume";
  public static readonly isControl: boolean = true;
  public slider!: VolumeSlider;
  protected button!: HTMLButtonElement;
  protected sliderWrapper!: HTMLSpanElement;
  protected delayActiveId?: number;
  protected get plug() {
    return this.ctlr.plug<VolumePlug>("volume");
  }

  public override create(): HTMLElement {
    // Variables Assignments
    this.slider = new VolumeSlider(this.ctlr, this.config);
    this.button = createEl("button", { className: "tmg-media-mute-btn tmg-media-vb-btn", type: "button", innerHTML: IconRegistry.get("volumehigh") + IconRegistry.get("volumelow") + IconRegistry.get("volumemuted") });
    this.sliderWrapper = createEl("span", { className: "tmg-media-volume-slider-wrapper tmg-media-vb-slider-wrapper" });
    const slider = this.slider.create(),
      container = createEl("div", { className: "tmg-media-volume-container tmg-media-vb-container" }, { draggableControl: "", controlId: this.name });
    // DOM Injection
    slider.classList.add("tmg-media-vb-slider", "tmg-media-volume-slider");
    this.sliderWrapper.append(slider);
    container.append(this.button, this.sliderWrapper);
    return (this.element = container);
  }

  public override mount(): void {
    this.slider.setup();
  }

  public override wire(): void {
    // Event Listeners
    this.button.addEventListener("click", this.handleClick, { signal: this.signal });
    this.el.addEventListener("mousemove", this.startActive, { signal: this.signal });
    this.el.addEventListener("mouseleave", this.stopActive, { signal: this.signal });
    // State Listeners
    this.slider.config.on("value", this.delayActive, { signal: this.signal });
    // Ctlr Media Listeners
    this.media.on("state.volume", this.handleVolumeState, { signal: this.signal, immediate: true });
    this.media.on("state.muted", this.syncARIA, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.mute", this.syncARIA, { signal: this.signal });
  }

  protected handleClick(): void {
    this.plug?.toggleMute("auto");
  }

  protected handleVolumeState({ value }: REvent<CtlrMedia, "state.volume">): void {
    this.sliderWrapper.dataset.volume = String(Math.round(value));
    this.syncARIA();
  }

  protected startActive(): void {
    this.slider.element.classList.add("tmg-media-control-active"), this.delayActive();
  }
  protected delayActive(): void {
    this.ctlr.plug<OverlayPlug>("overlay")?.delay();
    clearTimeout(this.delayActiveId);
    this.delayActiveId = setTimeout(() => this.stopActive(), this.ctlr.settings.overlay.delay, this.signal);
  }
  protected stopActive = (): void => {
    if (this.slider.element.matches(":active")) return this.delayActive();
    clearTimeout(this.delayActiveId), this.slider.element.classList.remove("tmg-media-control-active");
  };

  public syncARIA(): void {
    this.state.label = this.media.state.muted || this.media.state.volume === 0 ? "Unmute" : "Mute";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.mute);
    this.button.title = this.state.label + this.state.cmd;
    this.setBtnARIA(undefined, this.button);
  }

  protected override onDestroy(): void {
    this.slider.destroy(), super.onDestroy();
  }
}
