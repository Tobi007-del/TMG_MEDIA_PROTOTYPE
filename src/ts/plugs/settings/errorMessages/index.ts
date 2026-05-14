import { BasePlug, ERROR_MESSAGES_BUILD, ErrorMessages } from "../..";
import type { DisabledPlug } from "../disabled";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../../../types/contract";
import type { ErrorCode } from "../../../types/generics";

export class ErrorMessagesPlug extends BasePlug<ErrorMessages> {
  public static readonly plugName: string = "errorMessages";
  public static readonly BUILD = ERROR_MESSAGES_BUILD;

  public override wire(): void {
    // Ctlr Media Listeners
    this.media.on("status.error", this.handleErrorStatus, { signal: this.signal, immediate: true });
  }

  protected async handleErrorStatus({ value }: REvent<CtlrMedia, "status.error">): Promise<void> {
    if (!value) return this.ctlr.plug<DisabledPlug>("disabled")?.reactivate(); // In case it was a transient error that got resolved, we can try reactivating the UI
    const mssg = this.config[(value.code as ErrorCode) ?? 5] || value.message || `An unknown error occurred with the ${this.media.type} :(`;
    if (this.ctlr.state.readyState < 3) return this.ctlr.plug<DisabledPlug>("disabled")?.deactivate(mssg);
    if (t007.dialog?.isActive(`${this.ctlr.id}-error-dialog`)) return; // Prevent spamming dialogs\
    const res = await t007.confirm(mssg, { id: `${this.ctlr.id}-error-dialog`, rootElement: this.media.container, confirmText: "Try Again", cancelText: "Dismiss" });
    if (res === true) {
      const time = this.media.state.currentTime;
      this.media.element.load(), (this.media.element.currentTime = time), (this.media.intent.paused = false);
    } else if (res !== "recovered") this.ctlr.plug<DisabledPlug>("disabled")?.deactivate(mssg);
  }
}

export type * from "./types";
export * from "./build";
