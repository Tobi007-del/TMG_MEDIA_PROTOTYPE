import { IS_MOBILE } from "../../../utils";
import { Toasts } from "./types";

export const TOASTS_BUILD = {
  disabled: false,
  maxToasts: 7,
  position: "bottom-left",
  hideProgressBar: true,
  closeButton: !IS_MOBILE,
  animation: "slide-up",
  dragToCloseDir: "x||y",
} satisfies Toasts;
