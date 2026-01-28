import type { Controller } from "../core/controller";

export interface PlugConstructor {
  new (options: any): BasePlug;
  plugName: string;
  isCore?: boolean;
}

export abstract class BasePlug<ConfigType = any> {
  public static readonly plugName: string;
  public static readonly isCore: boolean = false;
  
  protected ctl!: Controller;
  protected config: ConfigType; // for alias

  constructor(config: ConfigType) {
    this.config = config || ({} as ConfigType);
  }
  // The Boot Sequence
  public setup(ctl: Controller) {
    this.ctl = ctl;
    this.onSetup(); // We let the subclass do its work
  }

  // The Kill Switch
  public dispose() {
    this.onDispose();
    this.ctl = null!; // Cut the link to avoid memory leaks
  }

  protected abstract onSetup(): void;
  protected onDispose(): void {}
}
