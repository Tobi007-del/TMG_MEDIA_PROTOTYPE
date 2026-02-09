import { Controllable } from "../core/controllable";
import type { Controller } from "../core/controller";

export interface PlugConstructor<T extends BasePlug = BasePlug> {
  new (ctl: Controller, config: any): T;
  plugName: string;
  isCore: boolean;
}

export abstract class BasePlug<Config = any, State = any> extends Controllable<Config, State> {
  public static readonly plugName: string;
  public get name() {
    return (this.constructor as PlugConstructor).plugName;
  }
  public static readonly isCore: boolean = false;

  protected onSetup(): void {
    this.mount?.();
    if (this.ctl.state.readyState) this.wire?.();
    else this.wire && this.ctl.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }

  public mount?(): void {}
  public wire?(): void {}
}

export abstract class BaseModule<Config = any, State = any> extends Controllable<Config, State> {
  public static readonly moduleName: string;
  public get name() {
    return (this.constructor as typeof BaseModule).moduleName;
  }

  protected onSetup(): void {
    this.mount?.();
    if (this.ctl.state.readyState) this.wire?.();
    else this.wire && this.ctl.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }

  public mount?(): void {}
  public wire?(): void {}
}
