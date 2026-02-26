import { Controller } from "./controller";
import { guardAllMethods, type Reactive, nuke, reactive } from "../tools/mixins";
import { isObj } from "../utils";

// A lifecylce controlled by it's Controller
// Try to use methods for most things so they can be customized when extended and also auto guarded
export abstract class Controllable<Config = any, State = any> {
  protected readonly ac = new AbortController();
  protected readonly signal = this.ac.signal;

  protected readonly ctlr: Controller;
  protected readonly guard: Controller["guard"];
  public config: Config; // may be a reactive obj node or the obj itself
  public state!: State extends object ? Reactive<State> : State; // for reactivity needs of those who pass it up

  constructor(ctlr: Controller, config: Config, state?: State) {
    guardAllMethods(this, ctlr.guard, true);
    this.signal = AbortSignal.any([this.signal, ctlr.signal]);
    this.ctlr = ctlr;
    this.guard = ctlr.guard;
    this.config = config;
    if (state) this.state = (isObj(state) ? reactive(state) : state) as Controllable["state"];
  }

  public setup() {
    this.onSetup(); // We let the subclass do its work
  }
  protected abstract onSetup(): void;

  public destroy() {
    !this.signal.aborted && this.ac.abort(`[TMG Controllable] Instance is being destroyed`); // incase controller already aborted, kills all listeners and timers before proper destruction below
    this.onDestroy();
    ((this.state as any)?.destroy?.(), (this.config as any)?.destroy?.()); // Can I clean here?... Anatoly :)
    nuke(this);
  }
  protected onDestroy() {}
}
