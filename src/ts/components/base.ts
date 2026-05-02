import { REvent } from "sia-reactor";
import { Controllable } from "../core/controllable";
import { Controller } from "../core/controller";
import { parseForARIAKS } from "../utils";
import { MediaFeatures } from "../types/contract";

export interface ComponentConstructor<T extends BaseComponent = BaseComponent> {
  new (ctlr: Controller, config?: any, state?: any): T;
  componentName: string;
  isControl?: boolean;
}

export interface ComponentState {
  label: string;
  cmd: string;
  hidden: boolean;
  disabled: boolean;
}

export abstract class BaseComponent<Config = any, State extends ComponentState = any, El extends HTMLElement = HTMLElement> extends Controllable<Config, State> {
  public static readonly componentName: string;
  public static readonly isControl: boolean = false;
  public get name() {
    return (this.constructor as ComponentConstructor).componentName;
  }
  public element!: El;
  protected get el() {
    return this.element as El;
  }

  constructor(ctlr: Controller, config: Config, state?: State) {
    super(ctlr, config, { disabled: false, hidden: false, ...state } as State);
  }
  protected override onSetup(): void {
    this.mount?.();
    if (this.ctlr.state.readyState) this.wire?.();
    else this.wire && this.ctlr.state.once("readyState", this.wire, { signal: this.signal }); // wire after all plugs setup
  }
  protected override onDestroy(): void {
    this.unmount();
  }

  public abstract create(): El; // Must assign to this.element before returning
  public mount?(): void {}
  public unmount(): void {
    this.element.isConnected && this.element.remove();
  }
  public wire?(): void {} // auto unwiring

  public hide(): void {
    this.el.classList.toggle("tmg-video-control-hidden", (this.state.hidden = true));
  }
  public show(): void {
    this.el.classList.toggle("tmg-video-control-hidden", (this.state.hidden = false));
  }
  public disable(): void {
    this.el.classList.toggle("tmg-video-control-disabled", (this.state.disabled = true));
  }
  public enable(): void {
    this.el.classList.toggle("tmg-video-control-disabled", (this.state.disabled = false));
  }
  protected gate(e: REvent<MediaFeatures, keyof MediaFeatures>): void {
    (e.oldValue ?? this.state.hidden) === this.state.hidden && (e.value ? this.hide() : this.show());
  }

  protected setBtnARIA(dblAction?: string): void {
    this.el.setAttribute("aria-label", this.state.label);
    this.el.setAttribute("aria-keyshortcuts", parseForARIAKS(this.state.cmd));
    if (dblAction) this.el.setAttribute("aria-description", `Double-press to ${dblAction}`);
    else if (this.el.hasAttribute("aria-description")) this.el.removeAttribute("aria-description");
  }
}
