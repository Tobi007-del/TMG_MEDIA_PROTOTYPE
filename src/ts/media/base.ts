import { Controllable } from "../core/controllable";
import type { Controller } from "../core/controller";
import type { CtlrMedia, MediaFeatures } from "../types/contract";
import { type REvent, reactive, type Reactive } from "../sia-reactor";
import { capitalize } from "../utils";

export type BaseTechConfig = Reactive<CtlrMedia>; // Must extend to add more

export interface TechConstructor<T extends BaseTech = BaseTech> {
  new (ctlr: Controller, config: any): T;
  techName: string;
  canPlaySource(src: string): boolean;
}

export abstract class BaseTech<Config extends BaseTechConfig = BaseTechConfig, El extends HTMLElement = HTMLElement> extends Controllable<Config> {
  public static readonly techName: string;
  public static canPlaySource(src: string): boolean {
    return false;
  }
  public get name() {
    return (this.constructor as TechConstructor).techName;
  }
  public element!: HTMLElement;
  protected get el() {
    return this.element as El;
  }
  public features: Reactive<MediaFeatures>;
  protected wiredFeatures: MediaFeatures; // Tracking to avoid rewiring

  constructor(ctlr: Controller, config: Config, features: Partial<MediaFeatures> = {}) {
    super(ctlr, config);
    this.element = config.element; // must reassign if not using original
    this.features = reactive(features);
    this.wiredFeatures = {} as MediaFeatures;
  }
  public onSetup() {
    this.mount();
    if (this.ctlr.state.readyState) this.wire();
    else this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }
  public onDestroy() {
    this.unmount();
  }

  public mount() {
    this.element && this.element !== this.config.element && this.config.element.replaceWith(this.element);
  }
  public unmount() {
    this.element && this.element !== this.config.element && this.element.replaceWith(this.config.element);
  }

  // --- THE MANDATORY CORE 5 ---
  public wire() {
    // Variables Assignments
    (this.element as any).tmgPlayer = this.config.element.tmgPlayer; // ref is maintained if element was replaced in mount
    // Ctlr Media Listeners
    this.media.on("intent", this.handleIntentChange, { signal: this.signal });
    this.wireSrc();
    this.wireCurrentTime();
    this.wireDuration();
    this.wirePaused();
    this.wireEnded();
    this.wireFeatures();
  }
  // --- The Core 5 (Media "Must Haves") ---
  protected abstract wireSrc(): void;
  protected abstract wireCurrentTime(): void;
  protected abstract wireDuration(): void;
  protected abstract wirePaused(): void;
  protected abstract wireEnded(): void;
  // --- THE EXTENSIONS ---
  protected wireFeatures() {
    this.features.on("*", this.handleFeaturesChange, { signal: this.signal, immediate: true });
  }
  // --- Miscellaneous ---
  protected handleFeaturesChange({ type, target: t }: REvent<MediaFeatures, "*">) {
    type === "update" ? this.wireFeature(t.key) : type === "init" && (Object.keys(t.value) as (keyof MediaFeatures)[]).forEach(this.wireFeature);
  }
  protected handleIntentChange(e: REvent<CtlrMedia, "intent">) {
    e.type === "update" && !this.features[e.target.key as keyof MediaFeatures] && e.value && e.stopImmediatePropagation();
  }
  protected wireFeature(feature: keyof MediaFeatures): void {
    !this.wiredFeatures[feature] && (this as any)[`wire${capitalize(feature)}`]?.();
    this.wiredFeatures[feature] ||= true;
  }
}
