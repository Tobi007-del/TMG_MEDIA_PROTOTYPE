import { BasePlug } from ".";
import { type REvent } from "sia-reactor";
import { type TimeTravelConfig, TimeTravelModule, TIME_TRAVEL_MODULE_BUILD } from "sia-reactor/modules";
import { CtlrConfig } from "../types/config";

export type TimeTravel = TimeTravelConfig<any>;

export class TimeTravelPlug extends BasePlug<TimeTravel> {
  public static readonly plugName: string = "timeTravel";
  public module!: TimeTravelModule<any>;

  public mount() {
    // Variables Assignment
    this.module = new TimeTravelModule(this.config);
    // Utility Injection
    this.media.use(this.module);
  }

  public wire() {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.timeTravel", this.handle, { signal: this.signal, immediate: false, depth: 1 });
  }

  protected handle(e: REvent<CtlrConfig, "settings.timeTravel", 1>) {
    e.type === "update" ? (this.module.config[e.target.key] = e.value as any) : Object.assign(this.module.config, e.value); // plugin's config is non-volatile
  }
}

export const TIME_TRAVEL_BUILD: Partial<TimeTravel> = { ...TIME_TRAVEL_MODULE_BUILD };
