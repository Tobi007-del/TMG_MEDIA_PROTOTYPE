import { Controllable } from "../core/controllable";
import type { Controller } from "../core/controller";
import type { CtlrMedia, MediaFeatures } from "../types/contract";
import { type REvent, reactive, type Reactive, ListenerOptions } from "sia-reactor";
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
  protected wiredFeatures: Set<keyof MediaFeatures> = new Set(); // Tracking to avoid rewiring
  protected readonly eOpts: { EL: AddEventListenerOptions; REACTOR: ListenerOptions };

  constructor(ctlr: Controller, config: Config, features: Partial<MediaFeatures> = {}) {
    super(ctlr, config);
    this.element = config.element; // must reassign if not using original
    this.features = reactive(features);
    this.eOpts = { EL: { signal: this.signal }, REACTOR: { capture: true, signal: this.signal, immediate: this.ctlr.payload.initialized ? "strict" : false } };
  }
  protected override onSetup(): void {
    this.mount();
    this.ctlr.state.readyState ? this.wire() : this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }
  protected override onDestroy(): void {
    this.unmount();
  }

  public mount(): void {
    this.element && this.element !== this.config.element && this.config.element.replaceWith(this.element);
  }
  public unmount(): void {
    this.element && this.element !== this.config.element && this.element.replaceWith(this.config.element);
  }

  public wire(): void {
    // Variables Assignments
    (this.element as any).tmgPlayer = this.config.element.tmgPlayer; // ref is maintained if element was replaced in mount
    // Ctlr Media Listeners
    this.media.on("intent", this.handleIntent, { signal: this.signal, depth: 1 });
    this.wireSrc(), this.wireCurrentTime(), this.wireDuration(), this.wirePaused(), this.wireEnded();
    this.wireFeatures();
  }
  // --- THE MANDATORY CORE 5 (Media "Must Haves") ---
  protected abstract wireSrc(): void;
  protected abstract wireCurrentTime(): void;
  protected abstract wireDuration(): void;
  protected abstract wirePaused(): void;
  protected abstract wireEnded(): void;
  // --- THE EXTENSIONS ---
  protected wireFeatures(): void {
    this.features.on("*", this.handleFeatures, { signal: this.signal, immediate: true });
  }
  // --- MISCELLANEOUS ---
  protected handleFeatures({ type, target: t }: REvent<MediaFeatures, "*">): void {
    type === "update" ? this.wireFeature(t.key) : type === "init" && (Object.keys(t.value) as (keyof MediaFeatures)[]).forEach(this.wireFeature);
  }
  protected handleIntent(e: REvent<CtlrMedia, "intent", 1>): void {
    e.type === "update" && !this.features[e.target.key as keyof MediaFeatures] && e.value && e.stopImmediatePropagation(); // falsy values pass so that they can turn off but not on
  }
  protected wireFeature(feature: keyof MediaFeatures): void {
    !this.wiredFeatures.has(feature) && (this as any)[`wire${capitalize(feature)}`]?.();
    this.wiredFeatures.add(feature);
  }
}
