import { Controllable } from "../core/controllable";
import type { Controller } from "../core/controller";

export interface PlugConstructor<T extends BasePlug = BasePlug> {
  new (ctlr: Controller, config: any): T;
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
    if (this.ctlr.state.readyState) this.wire?.();
    else this.wire && this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }

  public mount?(): void {}
  public wire?(): void {}
}

export abstract class BasePin<Plug extends BasePlug = BasePlug, Config = any, State = any> extends Controllable<Config, State> {
  public static readonly pinName: string;
  public static readonly plugName: string;
  public get name() {
    return (this.constructor as typeof BasePin).pinName;
  }
  protected get plug(): Plug {
    return this.ctlr.plug<Plug>((this.constructor as typeof BasePin).plugName)!; // `!`: only plug will instantiate after all
  }

  protected onSetup(): void {
    this.mount?.();
    if (this.ctlr.state.readyState) this.wire?.();
    else this.wire && this.ctlr.state.wonce("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }

  public mount?(): void {}
  public wire?(): void {}
}
