import { BasePlug, GestureWheelPin, GestureTouchPin, GestureGeneralPin, Gesture, GESTURE_BUILD } from "../..";
import { Controller } from "../../../core/controller";

export class GesturePlug extends BasePlug<Gesture> {
  public static readonly plugName: string = "gesture";
  public static readonly BUILD = GESTURE_BUILD;
  public general!: GestureGeneralPin;
  public wheel!: GestureWheelPin;
  public touch!: GestureTouchPin;

  constructor(ctlr: Controller, config: Gesture, state?: any) {
    super(ctlr, config, state);
    // Variables Assignment
    this.general = new GestureGeneralPin(this.ctlr, { click: this.config.click, dblClick: this.config.dblClick }).setup();
    this.wheel = new GestureWheelPin(this.ctlr, this.config.wheel).setup();
    this.touch = new GestureTouchPin(this.ctlr, this.config.touch).setup();
  }

  public override wire(): void {
    // Utility Injection
    const wire = () => (this.general.wire(), this.wheel.wire(), this.touch.wire());
    if (this.ctlr.state.readyState > 1) wire();
    else this.ctlr.state.once("readyState", wire, { signal: this.signal }); // waits for light state or first play
  }

  protected override onDestroy(): void {
    super.onDestroy();
    this.general?.destroy();
    this.wheel?.destroy();
    this.touch?.destroy();
  }
}

export type * from "./types";
export * from "./build";
export * from "./general";
export * from "./touch";
export * from "./wheel";
