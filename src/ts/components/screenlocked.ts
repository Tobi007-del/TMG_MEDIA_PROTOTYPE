import { BaseComponent, ComponentState } from ".";
import { createEl } from "../utils";
import type { LockedPlug } from "../plugs";

export type ScreenLockedConfig = undefined;

export class ScreenLocked extends BaseComponent<ScreenLockedConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "screenlocked";
  protected plug?: LockedPlug;

  public create() {
    return (this.element = createEl("button", {
      type: "button",
      title: "Unlock Screen",
      ariaLabel: "Unlock Screen",
      className: "tmg-video-screen-locked-btn",
      tabIndex: -1,
      innerHTML: `${this.getIcon("lock")}${this.getIcon("unlock")}<p>Unlock controls?</p>`,
    }));
  }

  public wire(): void {
    this.plug = this.ctlr.getPlug<LockedPlug>("locked");
    if (!this.plug) return;
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    this.plug.state.on("visible", this.updateUI, { signal: this.signal, immediate: true });
  }

  protected updateUI(): void {
    if (!this.plug?.state.visible) this.el.classList.remove("tmg-video-control-unlock");
  }

  protected handleClick(e: MouseEvent): void {
    e.stopPropagation();
    this.plug?.delayOverlay();
    if (this.el.classList.contains("tmg-video-control-unlock")) this.ctlr.config.settings.locked.disabled = true;
    else this.el.classList.add("tmg-video-control-unlock");
  }
}
