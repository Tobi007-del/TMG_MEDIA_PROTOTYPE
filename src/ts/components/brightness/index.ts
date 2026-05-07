import { BaseComponent, type ComponentState } from "..";
import type { Controller } from "../../core/controller";
import { IconRegistry } from "../../core/registry";
import { createEl, formatKeyForDisplay } from "../../utils";
import type { CtlrMedia } from "../../types/contract";
import type { REvent } from "sia-reactor";
import type { RangeState } from "../range";
import { BrightnessSlider, type BrightnessSliderConfig } from "./slider";
import type { BrightnessPlug } from "../../plugs";

export type BrightnessConfig = BrightnessSliderConfig;

export class BrightnessControl extends BaseComponent<BrightnessConfig, ComponentState> {
  public static readonly componentName: string = "brightness";
  public static readonly isControl: boolean = true;
  public slider!: BrightnessSlider;
  protected button!: HTMLButtonElement;
  protected sliderWrapper!: HTMLSpanElement;
  protected delayActiveId?: number;
  protected get plug() {
    return this.ctlr.plug<BrightnessPlug>("brightness");
  }

  public override create(): HTMLElement {
    // Variables Assignments
    this.slider = new BrightnessSlider(this.ctlr, this.config);
    this.button = createEl("button", { className: "tmg-video-dark-btn tmg-video-vb-btn", type: "button", innerHTML: IconRegistry.get("brightnesshigh") + IconRegistry.get("brightnesslow") + IconRegistry.get("brightnessdark") });
    this.sliderWrapper = createEl("span", { className: "tmg-video-brightness-slider-wrapper tmg-video-vb-slider-wrapper" });
    const sliderEl = this.slider.create(),
      container = createEl("div", { className: "tmg-video-brightness-container tmg-video-vb-container" }, { draggableControl: "", controlId: this.name });
    // DOM Injection
    sliderEl.classList.add("tmg-video-vb-slider", "tmg-video-brightness-slider");
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
    this.media.on("state.brightness", this.handleBrightnessState, { signal: this.signal, immediate: true });
    this.media.on("state.dark", this.syncARIA, { signal: this.signal, immediate: true });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.dark", this.syncARIA, { signal: this.signal, immediate: true });
  }

  protected handleClick(): void {
    this.plug?.toggleDark("auto");
  }

  protected handleBrightnessState({ value }: REvent<CtlrMedia, "state.brightness">): void {
    this.sliderWrapper.dataset.brightness = String(Math.round(value));
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
    this.state.label = this.media.state.dark || this.media.state.brightness === 0 ? "Brighten" : "Darken";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.dark);
    this.button.title = this.state.label + this.state.cmd;
    this.setBtnARIA(undefined, this.button);
  }

  protected override onDestroy(): void {
    clearTimeout(this.delayActiveId);
    this.slider.destroy(), super.onDestroy();
  }
}
