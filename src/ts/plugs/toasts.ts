import { BasePlug } from ".";
import type { REvent } from "../types/reactor";
import type { VideoBuild } from "../types/build";
import type { ToastOptions } from "../types/t007";

export interface Toasts extends ToastOptions {
  disabled: boolean;
}

export class ToastsPlug extends BasePlug<Toasts> {
  public static readonly plugName: string = "toasts";

  public wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.toasts.disabled", this.handleDisabled, { signal: this.signal });
    this.ctlr.config.on("settings.toasts", this.handleToasts, { signal: this.signal });
  }

  protected handleDisabled({ value }: REvent<VideoBuild, "settings.toasts.disabled">): void {
    value && t007?.toast?.dismissAll(this.ctlr.id);
  }

  protected handleToasts({ type, target: { path, key, value } }: REvent<VideoBuild, "settings.toasts">): void {
    if (type !== "update" || path?.match(/disabled/) || !t007?.toast) return;
    t007.toast.doForAll("update", { [key]: value }, this.ctlr.id);
  }

  public get toast() {
    if (this.config.disabled || !t007?.toaster) return null;
    return t007.toaster({ idPrefix: this.ctlr.id, rootElement: this.ctlr.videoContainer, ...this.config });
  }
}
