import { BasePlug } from ".";
import type { REvent } from "sia-reactor";
import type { CtlrConfig } from "../types/config";
import type { ToastOptions } from "@t007/toast";
import { IS_MOBILE } from "../utils";

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

  protected handleDisabled({ value }: REvent<CtlrConfig, "settings.toasts.disabled">): void {
    value && t007?.toast?.dismissAll(this.ctlr.id);
  }

  protected handleToasts({ type, target: { path, key, value } }: REvent<CtlrConfig, "settings.toasts">): void {
    if (type !== "update" || path?.match(/disabled/) || !t007?.toast) return;
    t007.toast.doForAll("update", { [key]: value }, this.ctlr.id);
  }

  public get toast() {
    if (this.config.disabled || !t007?.toaster) return null;
    return t007.toaster({ idPrefix: this.ctlr.id, rootElement: this.ctlr.videoContainer, ...this.config });
  }
}

export const TOASTS_BUILD = { disabled: false, maxToasts: 7, position: "bottom-left", hideProgressBar: true, closeButton: !IS_MOBILE, animation: "slide-up", dragToCloseDir: "x||y" } satisfies Toasts;
