import { BasePlug } from ".";
import type { DisabledPlug } from "./disabled";
import type { Event } from "../types/reactor";
import type { Media } from "../types/contract";
import type { ErrorCode } from "../types/generics";

export type ErrorMessages = Record<ErrorCode, string>;

export class ErrorMessagesPlug extends BasePlug<ErrorMessages> {
  public static readonly plugName: string = "errorMessages";

  public wire(): void {
    this.ctl.media.on("status.error", this.handleError, { signal: this.signal });
  }

  protected handleError({ target: { value } }: Event<Media, "status.error">): void {
    if (!value) return;
    const code = value.code as ErrorCode,
      message = this.config[code] || value.message || "An unknown error occurred with the video :(";
    const disabledPlug = this.ctl.getPlug<DisabledPlug>("disabled");
    disabledPlug?.deactivate(message);
  }
}
