import { Controller } from "../../core/controller";
import { BasePlug } from "..";
import { WheelModule, type WheelConfig } from "./wheel";
import { TouchModule, type TouchConfig } from "./touch";
import { GeneralModule } from "./general";
export * from "./general";
export * from "./touch";
export * from "./wheel";

export type Gesture = {
  click: string;
  dblClick: string;
  wheel: WheelConfig;
  touch: TouchConfig;
};

export class GesturePlug extends BasePlug<Gesture> {
  public static readonly plugName: string = "gesture";
  public general!: GeneralModule;
  public wheel!: WheelModule;
  public touch!: TouchModule;

  constructor(ctl: Controller, config: Gesture, state?: any) {
    super(ctl, config, state);
    this.general = new GeneralModule(this.ctl, { click: this.config.click, dblClick: this.config.dblClick });
    this.wheel = new WheelModule(this.ctl, this.config.wheel);
    this.touch = new TouchModule(this.ctl, this.config.touch);
  }

  public wire() {
    const wire = () => (this.general.wire(), this.wheel.wire(), this.touch.wire());
    if (this.ctl.state.readyState > 1) wire();
    else this.ctl.state.once("readyState", wire, { signal: this.signal }); // waits for light state or first play
  }

  protected override onDestroy() {
    super.onDestroy();
    this.general?.destroy();
    this.wheel?.destroy();
    this.touch?.destroy();
  }
}
