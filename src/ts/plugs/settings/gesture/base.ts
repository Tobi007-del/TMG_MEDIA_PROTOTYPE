import { clamp } from "sia-reactor/utils";
import { GesturePlug } from ".";
import { safeNum } from "../../../utils";
import { BasePin } from "../../base";
import { VolumePlug } from "../volume";

export class GestureBasePin<Config> extends BasePin<GesturePlug, Config> {
  public static readonly plugName: string = "gesture";
  protected nextTime = 0;

  protected applyTimeline({ percent, sign, multiplier }: { percent: number; sign: string; multiplier: number }): void {
    multiplier = +multiplier.toFixed(1);
    percent = percent * multiplier;
    const curr = safeNum(this.media.state.currentTime),
      change = percent * safeNum(this.media.status.duration) * multiplier,
      next = curr + (sign === "+" ? change : -change);
    this.nextTime = clamp(0, next, this.media.status.duration);
    // JS: this.ctlr.DOM.touchTimelineNotifier.textContent = `${sign}${this.ctlr.plug<TimePlug>("time")?.toTimeText(Math.abs(this.nextTime - curr))} (${this.ctlr.plug<TimePlug>("time")?.toTimeText(this.nextTime, true)}) ${multiplier < 1 ? `x${multiplier}` : ""}`;
  }

  protected applyRange(key: "volume" | "brightness", percent: number, sign: string): void {
    const range = this.ctlr.settings[key],
      value = sign === "+" ? range.value! + percent * range.max : range.value! - percent * range.max;
    this.ctlr.plug<VolumePlug>(key)?.handleSliderInput(clamp(0, Math.round(value), range.max));
  }
}
