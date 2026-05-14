import { BaseComponent, type ComponentState } from "..";
import { IconRegistry } from "../../core/registry";
import { createEl, formatKeyForDisplay, setTimeout } from "../../utils";
import type { CtlrMedia } from "../../types/contract";
import type { REvent } from "sia-reactor";
import { BrightnessSlider, type BrightnessSliderConfig } from "./slider";
import type { BrightnessPlug, OverlayPlug } from "../../plugs";

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
    this.button = createEl("button", { className: "tmg-media-dark-btn tmg-media-vb-btn", type: "button", innerHTML: IconRegistry.get("brightnesshigh") + IconRegistry.get("brightnesslow") + IconRegistry.get("brightnessdark") });
    this.sliderWrapper = createEl("span", { className: "tmg-media-brightness-slider-wrapper tmg-media-vb-slider-wrapper" });
    const sliderEl = this.slider.create(),
      container = createEl("div", { className: "tmg-media-brightness-container tmg-media-vb-container" }, { draggableControl: "", controlId: this.name });
    // DOM Injection
    sliderEl.classList.add("tmg-media-vb-slider", "tmg-media-brightness-slider");
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
    // State Listeners
    this.slider.config.on("value", this.delayActive, { signal: this.signal });
    // ---- Media Listeners
    this.media.on("state.brightness", this.handleBrightnessState, { signal: this.signal, immediate: true });
    this.media.on("state.dark", this.syncARIA, { signal: this.signal });
    // ---- Config --------
    this.ctlr.config.on("settings.keys.shortcuts.dark", this.syncARIA, { signal: this.signal });
  }

  protected handleClick(): void {
    this.plug?.toggleDark("auto");
  }

  protected handleBrightnessState({ value }: REvent<CtlrMedia, "state.brightness">): void {
    this.sliderWrapper.dataset.brightness = String(Math.round(value));
    this.syncARIA();
  }

  protected startActive(): void {
    this.slider.element.classList.add("tmg-media-control-active"), this.delayActive();
  }
  protected delayActive(): void {
    this.ctlr.plug<OverlayPlug>("overlay")?.delay();
    clearTimeout(this.delayActiveId);
    this.delayActiveId = setTimeout(() => this.stopActive(), this.ctlr.settings.overlay.delay);
  }
  protected stopActive = (): void => {
    if (this.slider.element.matches(":active")) return this.delayActive();
    clearTimeout(this.delayActiveId), this.slider.element.classList.remove("tmg-media-control-active");
  };

  public syncARIA(): void {
    this.state.label = this.media.state.dark || this.media.state.brightness === 0 ? "Brighten" : "Darken";
    this.state.cmd = formatKeyForDisplay(this.ctlr.settings.keys.shortcuts.dark);
    this.button.title = this.state.label + this.state.cmd;
    this.setBtnARIA(undefined, this.button);
  }

  protected override onDestroy(): void {
    this.slider.destroy(), super.onDestroy();
  }
}
