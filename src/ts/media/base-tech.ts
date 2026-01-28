import type { Controller } from "../core/controller";
import type { MediaTechFeatures } from "../types/contract";

export interface TechConstructor {
  new (options: any): BaseTech;
  canPlaySource(src: string): boolean;
}

export abstract class BaseTech {
  public abstract readonly name: string;
  public readonly features: MediaTechFeatures = {};

  protected ctl!: Controller;
  public element: HTMLElement | null = null;

  constructor(protected options: any = {}) {}

  public mount() {
    this.element && this.element !== this.ctl.media.element && this.ctl.media.element?.replaceWith(this.element);
  }

  public destroy() {
    this.element && this.element !== this.ctl.media.element && this.element.replaceWith(this.ctl.media.element);
    this.element = null;
  }

  public wire(ctl: Controller) {
    this.ctl = ctl;
    this.element = this.ctl.media.element; // update on tech before mount if custom el
    this.wireSrc();
    this.wireCurrentTime();
    this.wireDuration();
    this.wirePaused();
    this.wireEnded();
    this.wireFeatures();
  }

  protected abstract wireSrc(): void;
  protected abstract wireCurrentTime(): void;
  protected abstract wireDuration(): void;
  protected abstract wirePaused(): void;
  protected abstract wireEnded(): void;

  protected wireFeatures() {}
}
