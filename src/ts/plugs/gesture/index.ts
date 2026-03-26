import { Controller } from "../../core/controller";
import { BasePlug } from "..";
import type { DeepPartial } from "../../types/obj";
import { WheelModule, WHEEL_BUILD, type WheelConfig } from "./wheel";
import { TouchModule, TOUCH_BUILD, type TouchConfig } from "./touch";
import { GeneralModule, GENERAL_BUILD, type GeneralConfig } from "./general";
export * from "./general";
export * from "./touch";
export * from "./wheel";

export type Gesture = GeneralConfig & {
  wheel: WheelConfig;
  touch: TouchConfig;
};

export class GesturePlug extends BasePlug<Gesture> {
  public static readonly plugName: string = "gesture";
  public general!: GeneralModule;
  public wheel!: WheelModule;
  public touch!: TouchModule;

  constructor(ctlr: Controller, config: Gesture, state?: any) {
    super(ctlr, config, state);
    this.general = new GeneralModule(this.ctlr, { click: this.config.click, dblClick: this.config.dblClick });
    this.wheel = new WheelModule(this.ctlr, this.config.wheel);
    this.touch = new TouchModule(this.ctlr, this.config.touch);
  }

  public wire() {
    const wire = () => (this.general.wire(), this.wheel.wire(), this.touch.wire());
    if (this.ctlr.state.readyState > 1) wire();
    else this.ctlr.state.once("readyState", wire, { signal: this.signal }); // waits for light state or first play
  }

  protected override onDestroy() {
    super.onDestroy();
    this.general?.destroy();
    this.wheel?.destroy();
    this.touch?.destroy();
  }
}

export const GESTURE_BUILD: DeepPartial<Gesture> = {
  ...GENERAL_BUILD,
  touch: TOUCH_BUILD,
  wheel: WHEEL_BUILD,
};
