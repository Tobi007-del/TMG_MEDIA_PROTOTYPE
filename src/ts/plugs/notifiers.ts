import { BasePlug } from ".";
import type { Controller } from "../core/controller";
import type { REvent } from "sia-reactor";
import { createEl } from "../utils";

export interface Notifiers {
  disabled: boolean;
}

export interface NotifiersState {
  events: string[];
}

export class NotifiersPlug extends BasePlug<Notifiers, NotifiersState> {
  public static readonly plugName: string = "notifiers";
  public container!: HTMLDivElement;

  constructor(ctlr: Controller, config: Notifiers) {
    super(ctlr, config, {
      events: ["videoplay", "videopause", "videoprev", "videonext", "playbackrateup", "playbackratedown", "volumeup", "volumedown", "volumemuted", "brightnessup", "brightnessdown", "brightnessdark", "objectfitcontain", "objectfitcover", "objectfitfill", "captions", "capture", "theater", "fullscreen", "fwd", "bwd"],
    });
  }

  public mount(): void {
    // Variables Assignment
    this.ctlr.DOM.notifiersContainer = this.container = createEl("div", { className: "tmg-video-notifiers-container" }, { notify: "" });
    // DOM Injection
    this.ctlr.DOM.controlsContainer?.prepend(this.container);
  }

  public wire(): void {
    // Event Listeners
    Array.prototype.forEach.call(this.container.children, (node: Element) => node.addEventListener("animationend", this.handleAnimationEnd, { signal: this.signal }));
    // State Listeners
    this.state.on("events", this.handleEventsState, { signal: this.signal, immediate: true });
  }

  protected handleEventsState({ value: events = [], oldValue: prevs = [] }: REvent<NotifiersState, "events">): void {
    for (const eN of prevs) this.container.removeEventListener(eN, this.handleNotifierEvent);
    for (const eN of events) this.container.addEventListener(eN, this.handleNotifierEvent, { signal: this.signal });
  }

  protected handleAnimationEnd(): void {
    this.resetNotify("", true);
  }

  protected handleNotifierEvent({ type: eN }: Event): void {
    this.resetNotify();
    this.ctlr.RAFLoop("notifying", () => this.resetNotify(eN));
  }

  protected resetNotify(token = "", flush = false): void {
    flush && this.ctlr.cancelRAFLoop("notifying");
    this.container?.setAttribute("data-notify", token);
  }

  public notify(key: string): void {
    if (!this.config.disabled) this.ctlr.fire(key, null, this.container);
  }

  protected onDestroy(): void {
    this.resetNotify("", true);
  }
}

export const NOTIFIERS_BUILD: Partial<Notifiers> = {
  disabled: false,
};
