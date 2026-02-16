import { BasePlug } from ".";
import type { Event } from "../core/reactor";
import { VideoBuild } from "../types/build";
import type { ToastOptions } from "../types/t007";

export interface Toasts extends ToastOptions {
  disabled: boolean;
  captureAutoClose: number;
}

export class ToastsPlug extends BasePlug<Toasts> {
  public static readonly plugName: string = "toasts";

  public wire(): void {
    this.ctl.config.on("settings.toasts.disabled", this.handleDisabled, { signal: this.signal });
    this.ctl.config.on("settings.toasts", this.handleToastUpdate, { signal: this.signal });
  }

  protected handleDisabled({ target: { value } }: Event<VideoBuild, "settings.toasts.disabled">): void {
    if (!value || !window.t007?.toast) return;
    window.t007.toast.dismissAll(this.ctl.id);
  }

  protected handleToastUpdate({ type, target: { path, key, value } }: Event<VideoBuild, "settings.toasts">): void {
    if (type !== "update" || path?.match(/disabled|captureAutoClose/) || !window.t007?.toast) return;
    window.t007.toast.doForAll("update", { [key]: value }, this.ctl.id);
  }

  public get toast() {
    if (this.config.disabled || !window.t007?.toaster) return null;
    return window.t007.toaster({
      idPrefix: this.ctl.id,
      rootElement: this.ctl.videoContainer,
      ...this.config,
    });
  }
}
