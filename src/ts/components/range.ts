import { BaseComponent, ComponentState } from "./";
import type { Controller } from "../core/controller";
import { type REvent, reactive, type Reactive } from "sia-reactor";
import type { AptRange } from "../types/generics";
import { createEl, clamp, setTimeout, stepNum } from "../utils";

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
  public container!: HTMLElement;
  public barsWrapper!: HTMLElement;
  public baseBar!: HTMLElement;
  public valueBar!: HTMLElement;
  public thumbIndicator!: HTMLElement;
  public isVertical = false;
  public isRTL = false;
  protected lastPtrPos = 0;
  protected lastThumbPos = 0;
  protected cancelScrubTimeoutId: number | null = null;
  protected rect!: DOMRect;

  constructor(ctlr: Controller, config?: Partial<Config>) {
    const defaults = { label: "Range", min: 0, max: 100, value: 0, previewValue: 50, step: 1, scrub: { sync: false, relative: true, cancel: { delta: 15, timeout: 2000 }, wheel: { disabled: false, axisRatio: 6 } } };
    super(ctlr, reactive({ ...defaults, ...config }) as unknown as Reactive<Config>, { scrubbing: false, shouldCancelScrub: false, stallCancelScrub: false } as State);
  }

  public override create(): HTMLElement {
    // Variables Assignments
    this.container = createEl("div", { className: "tmg-video-range-container", tabIndex: 0, role: "slider" });
    this.barsWrapper = createEl("div", { className: "tmg-video-bars-wrapper" });
    this.baseBar = createEl("div", { className: "tmg-video-bar tmg-video-base-bar" });
    this.valueBar = createEl("div", { className: "tmg-video-bar tmg-video-value-bar" });
    this.thumbIndicator = createEl("div", { className: "tmg-video-thumb-indicator" });
    // DOM Injection
    this.barsWrapper.append(this.baseBar, this.valueBar);
    this.container.append(this.barsWrapper, this.thumbIndicator);
    return (this.element = this.container);
  }

  public override wire(): void {
    // Event Listeners
    this.container.addEventListener("pointerdown", this.handlePointerDown, { signal: this.signal });
    this.container.addEventListener("keydown", this.handleKeyDown, { signal: this.signal });
    this.container.addEventListener("wheel", this.handleWheel, { passive: false, signal: this.signal });
    this.barsWrapper.addEventListener("mousemove", this.handleInput, { signal: this.signal });
    ["mouseleave", "touchend", "touchcancel"].forEach((e) => this.barsWrapper.addEventListener(e, this.stopPreview, { signal: this.signal }));
    // Config Setters
    this.config.set("value", (value) => stepNum(value, this.config), { signal: this.signal });
    // ------ Listeners
    this.config.on("label", ({ value }) => (this.container.ariaLabel = value!), { signal: this.signal, immediate: true });
    this.config.on("min", ({ value }) => (this.container.ariaValueMin = String(value!)), { signal: this.signal, immediate: true });
    this.config.on("max", ({ value }) => (this.container.ariaValueMax = String(value!)), { signal: this.signal, immediate: true });
    this.config.on("value", this.handleValue, { signal: this.signal, immediate: true });
  }
  protected seek(value: number): void {
    this.config.value = value;
  }

  protected handleValue({ value }: REvent<RangeConfig, "value">): void {
    const pos = this.getValueAsPos();
    (this.syncThumbPos(pos), this.syncBarPos(pos));
    if (!this.state.scrubbing) this.container.ariaValueNow = String(value);
  }

  protected handlePointerDown(e: PointerEvent): void {
    if (this.state.scrubbing) return;
    this.state.scrubbing = true;
    this.container.setPointerCapture(e.pointerId);
    this.rect = this.container.getBoundingClientRect();
    const s = window.getComputedStyle(this.container);
    this.isVertical = s.writingMode.includes("vertical");
    this.isRTL = s.direction === "rtl";
    ((this.lastPtrPos = this.getPos(e)), (this.lastThumbPos = this.getValueAsPos()));
    this.handleInput(e);
    this.container.addEventListener("pointermove", this.handleInput, { signal: this.signal });
    this.container.addEventListener("pointerup", this.stopScrubbing, { signal: this.signal });
  }

  protected stopScrubbing(): void {
    if (!this.state.scrubbing) return;
    this.state.scrubbing = false;
    const newValue = this.state.shouldCancelScrub ? this.getPosAsValue(this.lastThumbPos) : this.config.value;
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
    this.ctlr.throttle(
      `${this.config.label}RangeInput`,
      () => {
        const dimension = this.isVertical ? this.rect.height : this.rect.width,
          progress = this.getPos(e),
          pos = clamp(0, !this.state.scrubbing || this.config.scrub.relative ? progress : this.lastThumbPos + progress - this.lastPtrPos, 1),
          value = this.getPosAsValue(pos);
        this.config.previewValue = value;
        if (this.state.scrubbing) {
          if (!this.config.scrub.sync) this.syncThumbPos(pos);
          else this.seek(value);
          Math.abs(pos - this.lastThumbPos) < this.config.scrub.cancel.delta / dimension ? this.cancelScrubbing() : this.allowScrubbing();
        }
        this.onInput(e, pos);
      },
      30
    );
  }
  protected onInput(e: MouseEvent | PointerEvent, pos: number): void {} // Subclasses override to add preview logic (timeline preview image, etc.)

  protected handleWheel(e: WheelEvent): void {
    if (this.config.wheel.disabled) return;
    e.preventDefault();
    e.stopImmediatePropagation();
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

  protected syncThumbPos(pos: number): void {
    this.thumbIndicator.style.cssText = `${this.isVertical ? "inset-block-end" : "inset-inline-start"}: ${pos * 100}%`;
    // this.thumbIndicator.style.transform = this.isVertical ? `translateY(-${pos * 100}%)` : `translateX(${pos * 100}%)`;
  }
  protected syncBarPos(pos: number): void {
    this.valueBar.style.cssText = `${this.isVertical ? "block-size" : "inline-size"}: ${pos * 100}%`;
    // this.valueBar.style.transform = this.isVertical ? `scaleY(${pos * 100})` : `scaleX(${pos * 100}%)`;
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
