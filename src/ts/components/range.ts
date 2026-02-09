import { BaseComponent, ComponentState } from "./";
import { reactive, type Reactive } from "../tools/mixins";
import { createEl, clamp, setTimeout, stepNum } from "../utils";
import type { Controller } from "../core/controller";
import type { Event } from "../types/reactor";
import type { AptRange } from "../types/generics";

export interface RangeConfig extends AptRange {
  value: number;
  previewValue: number;
  label: string;
  scrub: {
    sync: boolean;
    relative: boolean;
    cancel: { delta: number; timeout: number };
  };
  wheel: {
    disabled: boolean;
    axisRatio: number;
  };
}

export interface RangeState extends ComponentState {
  scrubbing: boolean;
  shouldCancelScrub: boolean;
  stallCancelScrub: boolean;
}

export class RangeSlider<Config extends RangeConfig = RangeConfig, State extends RangeState = RangeState> extends BaseComponent<Reactive<Config>, State> {
  declare public config: Reactive<Config> & Reactive<RangeConfig>;
  public static readonly componentName: string = "Range";
  protected container!: HTMLElement;
  protected barsWrapper!: HTMLElement;
  protected baseBar!: HTMLElement;
  protected valueBar!: HTMLElement;
  protected thumbIndicator!: HTMLElement;
  protected lastPointerP = 0;
  protected lastThumbPosition = 0;
  protected cancelScrubTimeoutId: number | null = null;
  protected rect!: DOMRect;
  protected isVertical = false;
  protected isRTL = false;

  constructor(ctl: Controller, options: Partial<Config> = {}) {
    const defaults = { label: "Range", min: 0, max: 100, value: 0, previewValue: 50, step: 1, scrub: { sync: false, relative: true, cancel: { delta: 15, timeout: 2000 }, wheel: { disabled: false, axisRatio: 6 } } };
    super(ctl, reactive({ ...defaults, ...options }) as unknown as Reactive<Config>, { scrubbing: false, shouldCancelScrub: false, stallCancelScrub: false } as State);
  }

  public create(): HTMLElement {
    this.container = createEl("div", { className: "tmg-video-range-container", tabIndex: 0, role: "slider" });
    this.barsWrapper = createEl("div", { className: "tmg-video-bars-wrapper" });
    this.baseBar = createEl("div", { className: "tmg-video-bar tmg-video-base-bar" });
    this.valueBar = createEl("div", { className: "tmg-video-bar tmg-video-value-bar" });
    this.thumbIndicator = createEl("div", { className: "tmg-video-thumb-indicator" });
    this.barsWrapper.append(this.baseBar, this.valueBar);
    this.container.append(this.barsWrapper, this.thumbIndicator);
    return (this.element = this.container);
  }

  public wire(): void {
    this.container.addEventListener("pointerdown", this.handlePointerDown, { signal: this.signal });
    this.container.addEventListener("keydown", this.handleKeyDown, { signal: this.signal });
    this.container.addEventListener("wheel", this.handleWheel, { passive: false, signal: this.signal });
    this.barsWrapper.addEventListener("mousemove", this.handleInput, { signal: this.signal });
    ["mouseleave", "touchend", "touchcancel"].forEach((e) => this.barsWrapper.addEventListener(e, this.stopPreview, { signal: this.signal }));
    this.config.set("value", (value) => stepNum(value, this.config), { signal: this.signal });
    this.config.on("label", ({ value }) => (this.container.ariaLabel = value!), { signal: this.signal, immediate: true });
    this.config.on("min", ({ value }) => (this.container.ariaValueMin = String(value!)), { signal: this.signal, immediate: true });
    this.config.on("max", ({ value }) => (this.container.ariaValueMax = String(value!)), { signal: this.signal, immediate: true });
    this.config.on("value", this.handleValueChange, { signal: this.signal, immediate: true });
  }
  protected seek(value: number): void {
    this.config.value = value;
  }

  protected handleValueChange({ target }: Event<RangeConfig, "value">): void {
    const pos = this.getValueAsPos();
    (this.updateThumbPosition(pos), this.updateValueBar(pos));
    if (!this.state.scrubbing) this.container.ariaValueNow = String(target.value!);
  }

  protected handlePointerDown(e: PointerEvent): void {
    if (this.state.scrubbing) return;
    this.state.scrubbing = true;
    this.container.setPointerCapture(e.pointerId);
    this.rect = this.container.getBoundingClientRect();
    const s = window.getComputedStyle(this.container);
    this.isVertical = s.writingMode.includes("vertical");
    this.isRTL = s.direction === "rtl";
    ((this.lastPointerP = this.getPos(e)), (this.lastThumbPosition = this.getValueAsPos()));
    this.handleInput(e);
    this.container.addEventListener("pointermove", this.handleInput, { signal: this.signal });
    this.container.addEventListener("pointerup", this.stopScrubbing, { signal: this.signal });
  }

  protected stopScrubbing(): void {
    if (!this.state.scrubbing) return;
    this.state.scrubbing = false;
    const newValue = this.state.shouldCancelScrub ? this.getPosAsValue(this.lastThumbPosition) : this.config.value;
    this.seek(newValue);
    this.allowScrubbing();
    this.state.stallCancelScrub = true;
    this.container.removeEventListener("pointermove", this.handleInput);
    this.container.removeEventListener("pointerup", this.stopScrubbing);
  }
  protected stopPreview(): void {} // Subclasses can override to add preview cleanup logic

  protected cancelScrubbing(): void {
    if (this.state.stallCancelScrub || this.state.shouldCancelScrub || this.cancelScrubTimeoutId) return;
    this.state.shouldCancelScrub = true;
    this.cancelScrubTimeoutId = setTimeout(() => this.allowScrubbing(false), this.config.scrub.cancel.timeout, this.signal);
  }
  protected allowScrubbing(reset = true): void {
    this.state.stallCancelScrub = this.state.shouldCancelScrub = false;
    clearTimeout(this.cancelScrubTimeoutId!);
    if (reset) this.cancelScrubTimeoutId = null;
  }

  protected handleInput(e: MouseEvent | PointerEvent): void {
    this.ctl.throttle(
      `${this.config.label}RangeInput`,
      () => {
        const dimension = this.isVertical ? this.rect.height : this.rect.width,
          progress = this.getPos(e),
          pos = clamp(0, !this.state.scrubbing || this.config.scrub.relative ? progress : this.lastThumbPosition + progress - this.lastPointerP, 1),
          value = this.getPosAsValue(pos);
        this.config.previewValue = value;
        if (this.state.scrubbing) {
          if (!this.config.scrub.sync) this.updateThumbPosition(pos);
          else this.seek(value);
          Math.abs(pos - this.lastThumbPosition) < this.config.scrub.cancel.delta / dimension ? this.cancelScrubbing() : this.allowScrubbing();
        }
        this.onInput(e, pos);
      },
      30,
      false
    );
  }
  protected onInput(e: MouseEvent | PointerEvent, pos: number): void {} // Subclasses override to add preview logic (timeline preview image, etc.)

  protected handleWheel(e: WheelEvent): void {
    if (this.config.wheel.disabled) return;
    e.preventDefault();
    const dimension = this.isVertical ? window.innerHeight : window.innerWidth,
      pos = clamp(0, Math.abs(-e.deltaY), dimension * this.config.wheel.axisRatio) / (dimension * this.config.wheel.axisRatio),
      value = this.config.value + (-e.deltaY >= 0 ? pos : -pos) * (this.config.max - this.config.min);
    this.seek(Math.round(value));
  }
  protected handleKeyDown = (e: KeyboardEvent): void => {
    const key = e.key?.toLowerCase();
    if (["arrowleft", "arrowdown", "arrowright", "arrowup"].includes(key)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const delta = e.shiftKey ? 2 : 1,
        direction = ["arrowleft", "arrowdown"].includes(key) ? -1 : 1;
      this.config.value += direction * delta * this.config.step;
    }
  };

  protected updateThumbPosition(pos: number): void {
    this.thumbIndicator.style.cssText = `${this.isVertical ? "inset-block-end" : "inset-inline-start"}: ${pos * 100}%`;
  }
  protected updateValueBar(pos: number): void {
    this.valueBar.style.cssText = `${this.isVertical ? "block-size" : "inline-size"}: ${pos * 100}%`;
  }

  protected getValueAsPos(value = this.config.value): number {
    return (value - this.config.min) / (this.config.max - this.config.min);
  }
  protected getPosAsValue(pos: number): number {
    return pos * (this.config.max - this.config.min) + this.config.min;
  }
  protected getPos(e: MouseEvent | PointerEvent): number {
    const p = this.isVertical ? (e.clientY - this.rect.top) / this.rect.height : (e.clientX - this.rect.left) / this.rect.width;
    return clamp(0, this.isRTL ? 1 - p : p, 1);
  }
}
