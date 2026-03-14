import { BasePlug } from ".";
import type { DisabledPlug } from "./disabled";
import type { Event } from "../types/reactor";
import type { CtlrMedia } from "../types/contract";
import type { ErrorCode } from "../types/generics";

export type ErrorMessages = Record<ErrorCode, string>;

export class ErrorMessagesPlug extends BasePlug<ErrorMessages> {
  public static readonly plugName: string = "errorMessages";

  public wire(): void {
    // Ctlr Media Listeners
    this.ctlr.media.on("status.error", this.handleError, { signal: this.signal, immediate: true });
  }

  protected handleError({ value }: Event<CtlrMedia, "status.error">): void {
    if (!value) return;
    const code = value.code as ErrorCode | undefined,
      mssg = this.config[code ?? 5] || value.message || "An unknown error occurred with the video :(";
    this.ctlr.getPlug<DisabledPlug>("disabled")?.deactivate(mssg);
  }
}
