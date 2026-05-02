import { BaseComponent, ComponentState } from ".";
import { IconRegistry } from "../core/registry";
import { createEl } from "../utils";
import type { LockedPlug } from "../plugs";

export type FullscreenLockConfig = undefined;

export class FullscreenLockButton extends BaseComponent<FullscreenLockConfig, ComponentState, HTMLButtonElement> {
  public static readonly componentName: string = "fullscreenlock";
  protected get plug() {
    return this.ctlr.plug<LockedPlug>("locked");
  }

  public override create() {
    return (this.element = createEl("button", { type: "button", title: "Unlock Screen", ariaLabel: "Unlock Screen", className: "tmg-video-screen-locked-btn", tabIndex: -1, innerHTML: `${IconRegistry.get("lock")}${IconRegistry.get("unlock")}<p>Unlock controls?</p>` }));
  }

  public override mount(): void {
    // DOM Injection
    this.plug?.wrapper.append(this.el);
  }

  public override wire(): void {
    // Event Listeners
    this.el.addEventListener("click", this.handleClick, { signal: this.signal });
    // Plug Listeners
    this.plug?.state.on("visible", this.syncUI, { signal: this.signal, immediate: true });
    // Post Wiring
    this.syncARIA();
  }

  protected handleClick(e: MouseEvent): void {
    e.stopPropagation();
    this.plug?.delayOverlay();
    if (this.el.classList.contains("tmg-video-control-unlock")) this.ctlr.settings.locked.disabled = true;
    else this.el.classList.add("tmg-video-control-unlock");
  }

  protected syncUI(): void {
    if (!this.plug?.state.visible) this.el.classList.remove("tmg-video-control-unlock");
  }
  protected syncARIA(): void {
    this.el.title = this.state.label = "Unlock Screen";
    this.setBtnARIA();
  }
}
