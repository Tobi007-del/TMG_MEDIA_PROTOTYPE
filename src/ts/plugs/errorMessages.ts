import { BasePlug } from ".";
import type { DisabledPlug } from "./disabled";
import type { REvent } from "sia-reactor";
import type { CtlrMedia } from "../types/contract";
import type { ErrorCode } from "../types/generics";

export type ErrorMessages = Record<ErrorCode, string>;

export class ErrorMessagesPlug extends BasePlug<ErrorMessages> {
  public static readonly plugName: string = "errorMessages";

  public wire(): void {
    // Ctlr Media Listeners
    this.media.on("status.error", this.handleError, { signal: this.signal, immediate: true });
  }

  protected handleError({ value }: REvent<CtlrMedia, "status.error">): void {
    if (!value) return;
    const code = value.code as ErrorCode | undefined,
      mssg = this.config[code ?? 5] || value.message || "An unknown error occurred with the video :(";
    this.ctlr.plug<DisabledPlug>("disabled")?.deactivate(mssg);
  }
}

export const ERROR_MESSAGES_BUILD: Partial<ErrorMessages> = {
  1: "The video playback was aborted :(",
  2: "The video failed due to a network error :(",
  3: "The video could not be decoded :(",
  4: "The video source is not supported :(",
};
