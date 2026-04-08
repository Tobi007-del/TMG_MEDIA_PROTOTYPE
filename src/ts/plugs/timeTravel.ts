import { BasePlug } from ".";
import { type REvent, type TimeTravelConfig, TimeTravelPlugin, TIME_TRAVEL_PLUGIN_BUILD } from "../sia-reactor";
import { CtlrConfig } from "../types/config";

export type TimeTravel = TimeTravelConfig<any>;

export class TimeTravelPlug extends BasePlug<TimeTravel> {
  public static readonly plugName: string = "timeTravel";
  public plugin!: TimeTravelPlugin<any>;

  public mount() {
    // Variables Assignment
    this.plugin = new TimeTravelPlugin(this.config);
    // Utility Injection
    this.media.__Reactor__.plugIn(this.plugin);
  }

  public wire() {
    // Ctlr Config Listeners
    this.ctlr.config.on("settings.timeTravel", this.handleTimeTravelChange, { signal: this.signal, immediate: false, depth: 1 });
  }

  protected handleTimeTravelChange({ type, target: { key, value } }: REvent<CtlrConfig, "settings.timeTravel">) {
    type === "update" ? ((this.plugin.config as any)[key] = value) : Object.assign(this.plugin.config, value); // plugin's config is non-volatile
  }
}

export const TIME_TRAVEL_BUILD: Partial<TimeTravel> = { ...TIME_TRAVEL_PLUGIN_BUILD };
