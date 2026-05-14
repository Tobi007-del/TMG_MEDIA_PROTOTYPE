import { BasePlug, Toasts, TOASTS_BUILD } from "../..";
import type { REvent } from "sia-reactor";
import type { CtlrConfig } from "../../../types/config";

export class ToastsPlug extends BasePlug<Toasts> {
  public static readonly plugName: string = "toasts";
  public static readonly BUILD = TOASTS_BUILD;

  public override wire(): void {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.toasts.disabled", this.handleDisabled, { signal: this.signal });
    this.ctlr.config.on("settings.toasts", this.handle, { signal: this.signal });
  }

  protected handleDisabled({ value }: REvent<CtlrConfig, "settings.toasts.disabled">): void {
    value && t007?.toast.dismissAll(this.ctlr.id);
  }

  protected handle({ type, target: { path, key, value } }: REvent<CtlrConfig, "settings.toasts">): void {
    if (type !== "update" || path?.match(/disabled/) || !t007?.toast) return;
    t007.toast.doForAll("update", { [key]: value }, this.ctlr.id);
  }

  public get toast() {
    if (this.config.disabled || !t007?.toaster) return null;
    return t007.toaster({ idPrefix: this.ctlr.id, rootElement: this.media.container, ...this.config });
  }
}

export type * from "./types";
export * from "./build";
