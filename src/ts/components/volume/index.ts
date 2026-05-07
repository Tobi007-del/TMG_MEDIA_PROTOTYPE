import { BaseComponent, type ComponentState } from "..";
import type { Controller } from "../../core/controller";
import { IconRegistry } from "../../core/registry";
import { createEl, formatKeyForDisplay } from "../../utils";
import type { CtlrMedia } from "../../types/contract";
import type { REvent } from "sia-reactor";
import type { RangeState } from "../range";
import { VolumeSlider, type VolumeSliderConfig } from "./slider";
import type { VolumePlug } from "../../plugs";

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
    this.button = createEl("button", { className: "tmg-video-mute-btn tmg-video-vb-btn", type: "button", innerHTML: IconRegistry.get("volumehigh") + IconRegistry.get("volumelow") + IconRegistry.get("volumemuted") });
    this.sliderWrapper = createEl("span", { className: "tmg-video-volume-slider-wrapper tmg-video-vb-slider-wrapper" });
    const sliderEl = this.slider.create(),
      container = createEl("div", { className: "tmg-video-volume-container tmg-video-vb-container" }, { draggableControl: "", controlId: this.name });
    // DOM Injection
    sliderEl.classList.add("tmg-video-vb-slider", "tmg-video-volume-slider");
    this.sliderWrapper.append(sliderEl);
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
    // ---- State Listeners
    this.slider.state.on("scrubbing", this.syncActive, { signal: this.signal });
    // ---- Media Listeners
    this.media.on("state.volume", this.handleVolumeState, { signal: this.signal, immediate: true });
    this.media.on("state.muted", this.syncARIA, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.mute", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.plug?.toggleMute("auto");
  }

  protected handleVolumeState({ value }: REvent<CtlrMedia, "state.volume">): void {
    this.sliderWrapper.dataset.volume = String(Math.round(value));
    this.syncARIA();
  }

  protected startActive(): void {
    this.el.classList.add("tmg-video-control-active");
    this.delayActive();
  }

  protected delayActive(): void {
    clearTimeout(this.delayActiveId);
    this.delayActiveId = window.setTimeout(() => this.stopActive(), this.ctlr.settings.overlay.delay);
  }

  protected stopActive = (): void => {
    if (this.slider.element?.matches(":active")) return this.delayActive();
    clearTimeout(this.delayActiveId);
    this.el.classList.remove("tmg-video-control-active");
  };

  protected syncActive(): void {
    this.el.classList.toggle("tmg-video-control-active", this.slider.state.scrubbing || this.el.matches(":hover") || this.el.matches(":focus-within"));
  }
  public syncARIA(): void {
    this.state.label = this.media.state.muted || this.media.state.volume === 0 ? "Unmute" : "Mute";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.mute);
    this.button.title = this.state.label + this.state.cmd;
    this.setBtnARIA(undefined, this.button);
  }

  protected override onDestroy(): void {
    clearTimeout(this.delayActiveId);
    this.slider.destroy(), super.onDestroy();
  }
}
