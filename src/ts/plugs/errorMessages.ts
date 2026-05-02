import { BasePlug } from ".";
import type { DisabledPlug } from "./disabled";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../types/contract";
import type { ErrorCode } from "../types/generics";

export type ErrorMessages = Record<ErrorCode, string>;

export class ErrorMessagesPlug extends BasePlug<ErrorMessages> {
  public static readonly plugName: string = "errorMessages";

  public override wire(): void {
    // Ctlr Media Listeners
    this.media.on("status.error", this.handleErrorStatus, { signal: this.signal, immediate: true });
  }

  protected async handleErrorStatus({ value }: REvent<CtlrMedia, "status.error">): Promise<void> {
    if (!value) return this.ctlr.plug<DisabledPlug>("disabled")?.reactivate(); // In case it was a transient error that got resolved, we can try reactivating the UI
    const mssg = this.config[(value.code as ErrorCode) ?? 5] || value.message || "An unknown error occurred with the video :(";
    if (this.ctlr.state.readyState < 3) return this.ctlr.plug<DisabledPlug>("disabled")?.deactivate(mssg);
    if (t007.dialog?.isActive(`${this.ctlr.id}-error-dialog`)) return; // Prevent spamming dialogs\
    const res = await t007.confirm(mssg, { id: `${this.ctlr.id}-error-dialog`, rootElement: this.ctlr.videoContainer, confirmText: "Try Again", cancelText: "Dismiss" });
    if (res === true) {
      const time = this.media.state.currentTime;
      this.media.element.load(), (this.media.element.currentTime = time), (this.media.intent.paused = false);
    } else if (res !== "recovered") this.ctlr.plug<DisabledPlug>("disabled")?.deactivate(mssg);
  }
}

export const ERROR_MESSAGES_BUILD: Partial<ErrorMessages> = {
  1: "The video playback was aborted :(",
  2: "The video failed due to a network error :(",
  3: "The video could not be decoded :(",
  4: "The video source is not supported :(",
};
